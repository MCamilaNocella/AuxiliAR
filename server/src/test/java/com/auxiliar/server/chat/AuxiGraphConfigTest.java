package com.auxiliar.server.chat;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.UserMessage;

class AuxiGraphConfigTest {

    @Test
    void theStepsAreNumberedAtTheEndOfTheLastMessage() {
        List<String> replies = AuxiGraphConfig.withSteps(List.of("Llamá al 911.", "Mientras llega la ayuda:"),
                List.of("Enfriá con agua", " 2. No pongas hielo ", "", "Cubrí con un paño limpio"));
        assertThat(replies).containsExactly("Llamá al 911.",
                "Mientras llega la ayuda:\n1. Enfriá con agua\n2. No pongas hielo\n3. Cubrí con un paño limpio");
    }

    @Test
    void withoutStepsTheMessagesStayAsTheyAre() {
        assertThat(AuxiGraphConfig.withSteps(List.of("Hola"), List.of())).containsExactly("Hola");
        assertThat(AuxiGraphConfig.withSteps(List.of("Hola"), null)).containsExactly("Hola");
    }

    @Test
    void atMostFiveSteps() {
        List<String> replies = AuxiGraphConfig.withSteps(List.of("Pasos:"), List.of("a", "b", "c", "d", "e", "f"));
        assertThat(replies.getFirst()).endsWith("5. e").doesNotContain("f");
    }

    @Test
    void theVolunteerIsMentionedOnlyOnce() {
        assertThat(AuxiGraphConfig.mentioned(List.of(new UserMessage("Hola"), new AssistantMessage("¡De nada!")))).isFalse();
        assertThat(AuxiGraphConfig.mentioned(List.of(new AssistantMessage("¡De nada! " + SafetyRules.MENTION_PERSON)))).isTrue();
    }
}
