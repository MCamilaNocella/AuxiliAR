package com.auxiliar.server.peer;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import com.auxiliar.server.chat.AiProvider;
import com.auxiliar.server.chat.ChatMessageDto;
import com.auxiliar.server.helplines.HelpNumber;
import com.auxiliar.server.helplines.HelpNumbers;

/**
 * The volunteer played by the same model as Auxi, while there are no real volunteers.
 * Instructions in prompts/voluntaria.md (read at startup), plus Argentina's help numbers.
 */
@Component
public class AiVolunteer implements VolunteerResponder {

    private static final Logger log = LoggerFactory.getLogger(AiVolunteer.class);

    /** Messages per answer, at most (the model is asked for 1 or 2) */
    static final int MAX_MESSAGES = 2;
    /** Call buttons per answer, at most */
    static final int MAX_PHONES = 3;
    /** Shown when it's an emergency and the model picked no number: works in the whole country */
    static final String EMERGENCIES = "911";
    /** What the model gets as the person's first message: the volunteer's greeting answers it */
    static final String JOINED = "(La persona acaba de entrar al chat y todavía no escribió nada.)";

    private final ChatClient chatClient;
    private final HelpNumbers helpNumbers;
    private final String instructions;
    private final BeanOutputConverter<VolunteerAnswer> converter = new BeanOutputConverter<>(VolunteerAnswer.class);
    private final Map<String, Object> answerBody;

    public AiVolunteer(ChatClient.Builder chatClientBuilder, HelpNumbers helpNumbers,
                       @Value("classpath:prompts/voluntaria.md") Resource instructions,
                       @Value("${auxiliar.ai.provider}") String providerName,
                       @Value("${auxiliar.chat.reasoning}") boolean reasoning) throws IOException {
        this.chatClient = chatClientBuilder.build();
        this.helpNumbers = helpNumbers;
        this.instructions = instructions.getContentAsString(StandardCharsets.UTF_8).strip();
        this.answerBody = AiProvider.from(providerName).reasoningAndJsonSchema(reasoning, "volunteer_answer", converter.getJsonSchemaMap());
    }

    @Override
    public Reply reply(Turn turn) {
        OpenAiChatOptions.Builder options = OpenAiChatOptions.builder();
        options.extraBody(answerBody);
        String raw = chatClient.prompt()
                .system(system(turn))
                .messages(messages(turn.conversation()))
                .options(options)
                .call()
                .content();
        return toReply(parse(raw));
    }

    /** Everything the model gets as system instructions */
    String system(Turn turn) {
        String base = instructions
                .replace("{{nombre}}", turn.volunteer().name())
                .replace("{{rol}}", turn.volunteer().role().toLowerCase())
                .replace("{{apodo}}", turn.nickname());
        return String.join("\n\n", base, shared(turn.sharedWithAuxi()),
                "## Números de ayuda de Argentina\n\n" + helpNumbers.document(), converter.getFormat()).strip();
    }

    /** What the person told Auxi before, if they agreed to share it */
    static String shared(List<ChatMessageDto> conversation) {
        if (conversation.isEmpty()) {
            return "## Lo que habló con Auxi\n\nLa persona eligió no compartirlo.";
        }
        String transcript = conversation.stream()
                .map(message -> (message.role() == ChatMessageDto.Role.user ? "Persona: " : "Auxi: ") + message.text())
                .collect(Collectors.joining("\n"));
        return "## Lo que habló con Auxi (la persona aceptó compartirlo con vos)\n\n" + transcript;
    }

    /** The chat as the model's history: the person's messages and its own (the app's notes are left out) */
    static List<Message> messages(List<PeerMessage> conversation) {
        // It starts with the person coming in: the greeting answers it, and models want the person to speak first
        List<Message> messages = new ArrayList<>(List.of(new UserMessage(JOINED)));
        for (PeerMessage message : conversation) {
            switch (message.author()) {
                case person -> messages.add(new UserMessage(message.text()));
                case volunteer -> messages.add(new AssistantMessage(message.text()));
                case system -> {
                }
            }
        }
        return messages;
    }

    /** The numbers that are in the list, and the 911 in an emergency without any */
    Reply toReply(VolunteerAnswer answer) {
        List<HelpNumber> phones = Objects.requireNonNullElse(answer.phones(), List.<String>of()).stream()
                .map(helpNumbers::find)
                .flatMap(Optional::stream)
                .distinct()
                .limit(MAX_PHONES)
                .toList();
        if (answer.emergency() && phones.isEmpty()) {
            phones = helpNumbers.find(EMERGENCIES).stream().toList();
        }
        // Never in an emergency: the person isn't left alone then
        return new Reply(answer.messages(), phones, answer.emergency(), answer.endChat() && !answer.emergency());
    }

    /** The model's JSON (empty messages dropped); if it answers in plain text instead, that text is the one message */
    VolunteerAnswer parse(String raw) {
        String text = raw == null ? "" : raw.strip();
        try {
            VolunteerAnswer answer = converter.convert(text);
            List<String> messages = answer == null || answer.messages() == null ? List.of() : answer.messages().stream()
                    .filter(message -> message != null && !message.isBlank())
                    .map(String::strip)
                    .limit(MAX_MESSAGES)
                    .toList();
            if (!messages.isEmpty()) {
                return new VolunteerAnswer(messages, answer.emergency(), answer.phones(), answer.endChat());
            }
        } catch (RuntimeException exception) {
            log.warn("The volunteer answered without the expected JSON, using it as plain text: {}",
                    text.length() > 300 ? text.substring(0, 300) + "…" : text);
        }
        if (text.isEmpty()) {
            throw new IllegalStateException("The volunteer's model answered nothing");
        }
        return new VolunteerAnswer(List.of(text), false, List.of(), false);
    }
}
