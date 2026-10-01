package com.auxiliar.server.chat;

import java.util.List;
import java.util.Map;

import org.bsc.langgraph4j.CompiledGraph;
import org.bsc.langgraph4j.prebuilt.MessagesState;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Service;

/** Runs the conversation through Auxi's graph and returns its answer, the suggested pages and whether it's an emergency */
@Service
public class ChatService {

    private final CompiledGraph<AuxiState> auxiGraph;

    public ChatService(CompiledGraph<AuxiState> auxiGraph) {
        this.auxiGraph = auxiGraph;
    }

    public ChatResponse reply(List<ChatMessageDto> conversation, boolean emergencyButton, ChatProfile known) {
        List<Message> messages = conversation.stream().map(ChatService::toMessage).toList();

        AuxiState state = auxiGraph.invoke(Map.of(
                        MessagesState.MESSAGES_STATE, messages,
                        AuxiState.EMERGENCY_BUTTON, emergencyButton,
                        AuxiState.PROFILE, known == null ? ChatProfile.EMPTY : known))
                .orElseThrow(() -> new IllegalStateException("Auxi's graph ended without a state"));
        List<String> replies = state.replies();
        if (replies.isEmpty()) {
            throw new IllegalStateException("Auxi's graph ended without an answer");
        }
        List<ChatResponse.Link> links = state.pages().stream()
                .map(page -> new ChatResponse.Link(page.title(), page.path()))
                .toList();
        List<ChatResponse.Phone> phones = state.phones().stream()
                .map(line -> new ChatResponse.Phone(line.number(), line.name()))
                .toList();
        return new ChatResponse(replies, links, state.emergency(), phones, state.profile(), state.asksLocation());
    }

    private static Message toMessage(ChatMessageDto message) {
        return switch (message.role()) {
            case user -> new UserMessage(message.text());
            case assistant -> new AssistantMessage(message.text());
        };
    }
}
