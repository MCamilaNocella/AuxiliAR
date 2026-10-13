package com.auxiliar.server.chat;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Completing the Mi Salud profile with Auxi: the model reads the person's answer to one question and decides
 * whether it brings the data (and writes it neatly), whether they'd rather skip it, or what to ask again
 * (instructions in prompts/perfil.md). The code only checks the result fits the field.
 */
@Service
public class ProfileAnswerService {

    private static final Logger log = LoggerFactory.getLogger(ProfileAnswerService.class);

    /** Longest text kept for one piece of data */
    static final int MAX_VALUE_LENGTH = 120;
    /** Said when the model's answer can't be read */
    static final String NOT_UNDERSTOOD = "Perdón, no te entendí. ¿Me lo escribís de nuevo?";

    private final ChatClient chatClient;
    private final AuxiPrompts prompts;
    private final BeanOutputConverter<ProfileAnswer> converter = new BeanOutputConverter<>(ProfileAnswer.class);
    private final Map<String, Object> body;

    public ProfileAnswerService(ChatClient.Builder chatClientBuilder, AuxiPrompts prompts,
                                @Value("${auxiliar.ai.provider}") String providerName,
                                @Value("${auxiliar.chat.reasoning}") boolean reasoning) {
        this.chatClient = chatClientBuilder.build();
        this.prompts = prompts;
        this.body = AiProvider.from(providerName).reasoningAndJsonSchema(reasoning, "profile_answer", converter.getJsonSchemaMap());
    }

    public ProfileAnswerResponse interpret(ProfileField field, List<ChatMessageDto> exchange) {
        OpenAiChatOptions.Builder options = OpenAiChatOptions.builder();
        options.extraBody(body);
        String raw = chatClient.prompt()
                .system(prompts.profile(field, converter.getFormat()))
                .messages(exchange.stream().map(ProfileAnswerService::toMessage).toList())
                .options(options)
                .call()
                .content();
        return checked(field, parse(raw));
    }

    /** Only what fits the field is saved: an age is a whole number from 1 to 130, a place needs its locality */
    static ProfileAnswerResponse checked(ProfileField field, ProfileAnswer answer) {
        String reply = text(answer.reply());
        if (reply == null) {
            reply = NOT_UNDERSTOOD;
        }
        if (answer.skipped()) {
            return new ProfileAnswerResponse(reply, null, null, null, true);
        }
        if (field == ProfileField.location) {
            String locality = text(answer.locality());
            return locality == null
                    ? new ProfileAnswerResponse(reply, null, null, null, false)
                    : new ProfileAnswerResponse(reply, null, locality, text(answer.province()), false);
        }
        String value = text(answer.value());
        if (field == ProfileField.age && value != null) {
            value = value.matches("\\d{1,3}") && Integer.parseInt(value) >= 1 && Integer.parseInt(value) <= 130 ? value : null;
        }
        return new ProfileAnswerResponse(reply, value, null, null, false);
    }

    /** Blank, "null" or too long is nothing */
    private static String text(String value) {
        if (value == null || value.isBlank() || value.strip().equalsIgnoreCase("null")) {
            return null;
        }
        String stripped = value.strip();
        return stripped.length() > MAX_VALUE_LENGTH ? stripped.substring(0, MAX_VALUE_LENGTH) : stripped;
    }

    private ProfileAnswer parse(String raw) {
        try {
            ProfileAnswer answer = converter.convert(raw == null ? "" : raw.strip());
            if (answer != null) {
                return answer;
            }
        } catch (RuntimeException exception) {
            log.warn("Auxi read a profile answer without the expected JSON: {}", raw);
        }
        return new ProfileAnswer(NOT_UNDERSTOOD, false, null, null, null);
    }

    private static Message toMessage(ChatMessageDto message) {
        return switch (message.role()) {
            case user -> new UserMessage(message.text());
            case assistant -> new AssistantMessage(message.text());
        };
    }
}
