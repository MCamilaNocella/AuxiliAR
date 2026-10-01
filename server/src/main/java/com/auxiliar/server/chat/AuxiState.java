package com.auxiliar.server.chat;

import java.util.List;
import java.util.Map;

import org.bsc.langgraph4j.prebuilt.MessagesState;
import org.springframework.ai.chat.messages.Message;

import com.auxiliar.server.content.ContentPage;
import com.auxiliar.server.helplines.HelpNumber;

/**
 * State of Auxi's conversation graph: the messages (new ones are appended), whether the person
 * pressed "Sí, es una emergencia", and what the model decided on this turn (emergency, pages to suggest,
 * numbers to show as call buttons).
 */
public class AuxiState extends MessagesState<Message> {

    static final String EMERGENCY_BUTTON = "emergencyButton";
    static final String PROFILE = "profile";
    static final String OLDER_ADULT = "olderAdult";
    static final String ASKS_LOCATION = "asksLocation";
    static final String EMERGENCY = "emergency";
    static final String REPLIES = "replies";
    static final String SUGGESTED_PATHS = "suggestedPaths";
    static final String PAGES = "pages";
    static final String SUGGESTED_PHONES = "suggestedPhones";
    static final String PHONES = "phones";

    public AuxiState(Map<String, Object> initData) {
        super(initData);
    }

    /** The person pressed "Sí" when asked whether it's an emergency */
    public boolean emergencyButton() {
        return this.<Boolean>value(EMERGENCY_BUTTON).orElse(false);
    }

    /** What's known about the person: from the client at first, updated with what the model gathered */
    public ChatProfile profile() {
        return this.<ChatProfile>value(PROFILE).orElse(ChatProfile.EMPTY);
    }

    /** The answer asks where they are */
    public boolean asksLocation() {
        return this.<Boolean>value(ASKS_LOCATION).orElse(false);
    }

    /** The model decided the conversation is about an older person */
    public boolean olderAdult() {
        return this.<Boolean>value(OLDER_ADULT).orElse(false);
    }

    /** The model decided it's an emergency (or the person said so with the button) */
    public boolean emergency() {
        return this.<Boolean>value(EMERGENCY).orElse(false);
    }

    /** This turn's answer, as the separate chat bubbles the model wrote */
    public List<String> replies() {
        return this.<List<String>>value(REPLIES).orElse(List.of());
    }

    /** Paths the model chose, still unchecked */
    public List<String> suggestedPaths() {
        return this.<List<String>>value(SUGGESTED_PATHS).orElse(List.of());
    }

    /** Help numbers the model chose, still unchecked */
    public List<String> suggestedPhones() {
        return this.<List<String>>value(SUGGESTED_PHONES).orElse(List.of());
    }

    /** The chosen help numbers that are in prompts/numeros.md */
    public List<HelpNumber> phones() {
        return this.<List<HelpNumber>>value(PHONES).orElse(List.of());
    }

    /** The chosen pages that really exist */
    public List<ContentPage> pages() {
        return this.<List<ContentPage>>value(PAGES).orElse(List.of());
    }
}
