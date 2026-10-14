package com.auxiliar.server.peer;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;

import com.auxiliar.server.chat.ChatMessageDto;

class AiVolunteerTest {

    private static PeerMessage message(long id, PeerMessage.Author author, String text) {
        return new PeerMessage(id, author, text, List.of());
    }

    @Test
    void theGreetingAnswersThePersonComingIn() {
        List<Message> messages = AiVolunteer.messages(List.of(message(1, PeerMessage.Author.system, "Sofi se unió al chat")));
        assertThat(messages).hasSize(1);
        assertThat(messages.getFirst()).isInstanceOf(UserMessage.class);
        assertThat(messages.getFirst().getText()).isEqualTo(AiVolunteer.JOINED);
    }

    @Test
    void theAppsNotesAreLeftOutOfTheHistory() {
        List<Message> messages = AiVolunteer.messages(List.of(
                message(1, PeerMessage.Author.system, "Sofi se unió al chat"),
                message(2, PeerMessage.Author.volunteer, "Hola, Luna"),
                message(3, PeerMessage.Author.person, "Hola")));
        assertThat(messages).extracting(Message::getText).containsExactly(AiVolunteer.JOINED, "Hola, Luna", "Hola");
        assertThat(messages.get(1)).isInstanceOf(AssistantMessage.class);
    }

    @Test
    void whatWasSharedFromAuxiGoesInOnlyIfThePersonAgreed() {
        assertThat(AiVolunteer.shared(List.of())).contains("eligió no compartirlo");
        String shared = AiVolunteer.shared(List.of(
                new ChatMessageDto(ChatMessageDto.Role.assistant, "¿En qué te ayudo?"),
                new ChatMessageDto(ChatMessageDto.Role.user, "Estoy angustiada")));
        assertThat(shared).contains("Auxi: ¿En qué te ayudo?").contains("Persona: Estoy angustiada");
    }
}
