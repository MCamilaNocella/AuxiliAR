package com.auxiliar.server.chat;

import static org.bsc.langgraph4j.GraphDefinition.END;
import static org.bsc.langgraph4j.GraphDefinition.START;
import static org.bsc.langgraph4j.action.AsyncNodeAction.node_async;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.Arrays;
import java.text.Normalizer;
import java.util.stream.Collectors;

import org.bsc.langgraph4j.CompiledGraph;
import org.bsc.langgraph4j.GraphStateException;
import org.bsc.langgraph4j.StateGraph;
import org.bsc.langgraph4j.prebuilt.MessagesState;
import org.bsc.langgraph4j.spring.ai.serializer.std.SpringAIStateSerializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.auxiliar.server.content.ContentCatalog;
import com.auxiliar.server.content.ContentPage;
import com.auxiliar.server.helplines.HelpNumber;
import com.auxiliar.server.helplines.HelpNumbers;

/**
 * Auxi's conversation graph (LangGraph4j):
 * START → auxi (answers, in one or more messages, and decides: is it an emergency? which pages and numbers to show?)
 * → links (keeps only pages with content and help numbers from the list)
 * → safety (fixed rules: PAMI for older people, asking province, locality and age in an emergency, the question when
 * offering a volunteer) → END.
 * Instructions: prompts/*.md, including Argentina's help numbers (prompts/numeros.md).
 * Every decision is the model's, guided by the Markdown prompts in resources/prompts.
 */
@Configuration
public class AuxiGraphConfig {

    private static final Logger log = LoggerFactory.getLogger(AuxiGraphConfig.class);

    static final String AUXI_NODE = "auxi";
    static final String LINKS_NODE = "links";
    static final String SAFETY_NODE = "safety";
    /** Pages suggested per answer, at most */
    static final int MAX_PAGES = 3;
    /** Call buttons per answer, at most */
    static final int MAX_PHONES = 4;

    @Bean
    CompiledGraph<AuxiState> auxiGraph(ChatClient.Builder chatClientBuilder, AuxiPrompts prompts, ContentCatalog catalog,
                                       HelpNumbers helpNumbers,
                                       @Value("${auxiliar.ai.provider}") String providerName,
                                       @Value("${auxiliar.chat.reasoning}") boolean answerReasoning) throws GraphStateException {
        // Not a reason to stop the server: resources:check and the tests catch it where the table is made
        String rowsProblem = SafetyRules.rowsProblem(helpNumbers);
        if (rowsProblem != null) {
            log.warn(rowsProblem);
        }
        ChatClient chatClient = chatClientBuilder.build();
        BeanOutputConverter<AuxiAnswer> answerConverter = new BeanOutputConverter<>(AuxiAnswer.class);
        AiProvider provider = AiProvider.from(providerName);
        // Models that "think" before answering (like Nemotron) take 15 to 60 s with it on and a few seconds without.
        // response_format makes the model reply with exactly AuxiAnswer's JSON schema (it also gets the format in
        // the instructions, and plain text is used if it ignores both)
        Map<String, Object> answerBody = provider.reasoningAndJsonSchema(
                answerReasoning, "auxi_answer", answerConverter.getJsonSchemaMap());

        return new StateGraph<>(MessagesState.SCHEMA, new SpringAIStateSerializer<>(AuxiState::new))
                .addNode(AUXI_NODE, node_async(state -> {
                    String raw = chatClient.prompt()
                            .system(prompts.system(state.emergencyButton(), state.profile(), answerConverter.getFormat()))
                            .messages(state.messages())
                            .options(extraBody(answerBody))
                            .call()
                            .content();
                    AuxiAnswer answer = parse(answerConverter, raw);
                    List<String> replies = withSteps(answer.messages(), answer.steps());
                    // Once per conversation, and not when the volunteer is being offered for real (or in an emergency)
                    boolean emergency = answer.emergency() || state.emergencyButton();
                    // (the model sometimes writes the sentence itself too)
                    if (answer.mentionPerson() && !answer.offerPerson() && !emergency && !mentioned(state.messages())
                            && !replies.getLast().contains(SafetyRules.MENTION_PERSON)) {
                        replies = appendToLast(replies, SafetyRules.MENTION_PERSON);
                    }
                    return Map.of(
                            // The model's history keeps the bubbles as one message; the client gets them apart
                            MessagesState.MESSAGES_STATE, new AssistantMessage(String.join("\n\n", replies)),
                            AuxiState.REPLIES, replies,
                            AuxiState.EMERGENCY, emergency,
                            AuxiState.SUGGESTED_PATHS, Objects.requireNonNullElse(answer.pages(), List.of()),
                            AuxiState.SUGGESTED_PHONES, Objects.requireNonNullElse(answer.phones(), List.of()),
                            AuxiState.OLDER_ADULT, answer.olderAdult(),
                            // Never in an emergency: there the call comes first. Someone who's feeling bad is always offered a
                            // volunteer, once (unless they already had one, or were already offered)
                            AuxiState.OFFER_PERSON, !emergency && (answer.offerPerson()
                                    || answer.needsListening() && !SafetyRules.offeredBefore(state.messages())),
                            AuxiState.PROFILE, state.profile().updatedWith(answer.profile() == null ? null
                                    : answer.profile().onlyWhatWasSaid(userTexts(state.messages()))));
                }))
                .addNode(LINKS_NODE, node_async(state -> {
                    // Only pages that exist and have content: the model can't send anyone to a made-up or empty page
                    List<ContentPage> pages = state.suggestedPaths().stream()
                            .distinct()
                            .map(catalog::findByPath)
                            .flatMap(Optional::stream)
                            .filter(ContentPage::hasInfo)
                            .limit(MAX_PAGES)
                            .toList();
                    // Same for the numbers: only the ones in prompts/numeros.md
                    List<HelpNumber> phones = state.suggestedPhones().stream()
                            .map(helpNumbers::find)
                            .flatMap(Optional::stream)
                            .distinct()
                            .limit(MAX_PHONES)
                            .toList();
                    return Map.of(AuxiState.PAGES, pages, AuxiState.PHONES, phones);
                }))
                .addNode(SAFETY_NODE, node_async(state -> {
                    // Fixed rules, so they hold every time (the model decides what they're based on)
                    List<HelpNumber> phones = state.phones();
                    if (state.olderAdult()) {
                        phones = SafetyRules.withPami(phones, helpNumbers, MAX_PHONES);
                        if (state.emergency()) {
                            phones = SafetyRules.withPamiEmergencies(phones, state.profile(), helpNumbers, MAX_PHONES);
                        }
                    }
                    List<String> replies = new ArrayList<>(withoutRepeats(state.replies(), state.messages()));
                    boolean allRepeats = replies.isEmpty();
                    if (allRepeats) {
                        // Everything was a repeat: a short acknowledgement instead, explaining PAMI's line if it just showed up
                        replies.add(phones.stream().anyMatch(line -> line.number().equals(SafetyRules.PAMI_EMERGENCIES))
                                ? SafetyRules.pamiEmergenciesNote(helpNumbers)
                                : state.emergency() ? SafetyRules.THANKS_NOTE : SafetyRules.TELL_ME_MORE_NOTE);
                    }
                    // Only if Auxi didn't ask it itself (otherwise the question would show twice)
                    String question = state.emergency() && !SafetyRules.asksForData(replies)
                            ? SafetyRules.missingDataQuestion(state.profile())
                            : null;
                    if (question != null) {
                        replies.add(question);
                    }
                    // A repeated offer is dropped above, and isn't brought back here (nor its buttons)
                    boolean offerPerson = state.offerPerson() && !allRepeats;
                    if (offerPerson && !SafetyRules.offersPerson(replies)) {
                        // One question at the end: the offer takes the place of the model's own closing question
                        replies.set(replies.size() - 1, SafetyRules.withoutClosingQuestion(replies.getLast()));
                        replies.removeIf(String::isBlank);
                        replies.add(SafetyRules.OFFER_PERSON_QUESTION);
                    }
                    // Two bubbles only in an emergency (first the call, then the rest): otherwise, one
                    List<String> bubbles = state.emergency() ? replies : List.of(String.join("\n\n", replies));
                    // The client then suggests localities while the person types the answer
                    return Map.of(AuxiState.PHONES, phones, AuxiState.REPLIES, bubbles, AuxiState.OFFER_PERSON, offerPerson,
                            AuxiState.ASKS_LOCATION, SafetyRules.asksForLocation(bubbles));
                }))
                .addEdge(START, AUXI_NODE)
                .addEdge(AUXI_NODE, LINKS_NODE)
                .addEdge(LINKS_NODE, SAFETY_NODE)
                .addEdge(SAFETY_NODE, END)
                .compile();
    }

    /** Steps per answer, at most */
    static final int MAX_STEPS = 5;

    /** The steps the model gave apart, numbered one per line at the end of its last message */
    static List<String> withSteps(List<String> messages, List<String> steps) {
        List<String> clean = steps == null ? List.of() : steps.stream()
                .filter(step -> step != null && !step.isBlank())
                .map(step -> step.strip().replaceFirst("^\\d+[.)]\\s*", ""))
                .limit(MAX_STEPS)
                .toList();
        if (clean.isEmpty()) {
            return messages;
        }
        List<String> numbered = new ArrayList<>();
        for (int index = 0; index < clean.size(); index++) {
            numbered.add((index + 1) + ". " + clean.get(index));
        }
        List<String> result = new ArrayList<>(messages);
        result.set(result.size() - 1, result.getLast() + "\n" + String.join("\n", numbered));
        return List.copyOf(result);
    }

    private static List<String> appendToLast(List<String> messages, String text) {
        List<String> result = new ArrayList<>(messages);
        result.set(result.size() - 1, result.getLast() + " " + text);
        return List.copyOf(result);
    }

    /** Auxi already told them about talking with a person in this conversation */
    static boolean mentioned(List<Message> conversation) {
        return conversation.stream()
                .filter(AssistantMessage.class::isInstance)
                .map(Message::getText)
                .anyMatch(text -> text != null && text.contains(SafetyRules.MENTION_PERSON));
    }

    /** Provider-specific request fields (see {@link AiProvider}) */
    private static OpenAiChatOptions.Builder extraBody(Map<String, Object> body) {
        OpenAiChatOptions.Builder options = OpenAiChatOptions.builder();
        options.extraBody(body);
        return options;
    }

    private static List<String> userTexts(List<Message> conversation) {
        return conversation.stream().filter(UserMessage.class::isInstance).map(Message::getText).toList();
    }

    /** Share of words two bubbles must have in common to count as the same one */
    static final double REPEAT_SIMILARITY = 0.7;

    /**
     * Drops bubbles Auxi already sent earlier in the conversation, word for word or nearly (models tend to copy
     * their last answer, changing a word or two, when the person only adds a detail). May leave none.
     */
    static List<String> withoutRepeats(List<String> replies, List<Message> conversation) {
        // The current answer is the last message: only what came before counts
        List<Set<String>> earlier = conversation.stream()
                .limit(Math.max(0, conversation.size() - 1))
                .filter(AssistantMessage.class::isInstance)
                .map(Message::getText)
                .filter(Objects::nonNull)
                .flatMap(text -> Arrays.stream(text.split("\n\n")))
                .map(AuxiGraphConfig::words)
                .toList();
        return replies.stream()
                .filter(reply -> earlier.stream().noneMatch(sent -> similarity(words(reply), sent) >= REPEAT_SIMILARITY))
                .toList();
    }

    private static Set<String> words(String text) {
        String plain = Normalizer.normalize(text, Normalizer.Form.NFD).replaceAll("\\p{M}", "").toLowerCase();
        return Arrays.stream(plain.split("[^a-z0-9]+")).filter(word -> !word.isBlank()).collect(Collectors.toSet());
    }

    /** Words in common over words in either (Jaccard index) */
    private static double similarity(Set<String> a, Set<String> b) {
        if (a.isEmpty() || b.isEmpty()) {
            return 0;
        }
        long common = a.stream().filter(b::contains).count();
        return (double) common / (a.size() + b.size() - common);
    }

    /** Messages per answer, at most (the model is asked for one, two only in an emergency) */
    static final int MAX_MESSAGES = 2;

    /** The model's JSON (empty messages dropped); if it answers in plain text instead, that text is the one message */
    private static AuxiAnswer parse(BeanOutputConverter<AuxiAnswer> converter, String raw) {
        String text = raw == null ? "" : raw.strip();
        try {
            AuxiAnswer answer = converter.convert(text);
            List<String> messages = answer == null || answer.messages() == null ? List.of() : answer.messages().stream()
                    .filter(message -> message != null && !message.isBlank())
                    .map(String::strip)
                    .limit(MAX_MESSAGES)
                    .toList();
            if (!messages.isEmpty()) {
                return new AuxiAnswer(messages, answer.steps(), answer.emergency(), answer.pages(), answer.phones(), answer.olderAdult(),
                        answer.offerPerson(), answer.mentionPerson(), answer.needsListening(), answer.profile());
            }
        } catch (RuntimeException exception) {
            log.warn("Auxi answered without the expected JSON, using it as plain text: {}",
                    text.length() > 300 ? text.substring(0, 300) + "…" : text);
        }
        return new AuxiAnswer(List.of(text), List.of(), false, List.of(), List.of(), false, false, false, false, null);
    }
}
