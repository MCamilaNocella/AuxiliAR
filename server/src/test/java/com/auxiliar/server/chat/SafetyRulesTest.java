package com.auxiliar.server.chat;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

import com.auxiliar.server.helplines.HelpNumber;
import com.auxiliar.server.helplines.HelpNumbers;

class SafetyRulesTest {

    private static HelpNumbers helpNumbers;

    @BeforeAll
    static void load() throws IOException {
        helpNumbers = new HelpNumbers(new ClassPathResource("prompts/numeros.md"));
    }

    private static List<String> numbers(List<HelpNumber> lines) {
        return lines.stream().map(HelpNumber::number).toList();
    }

    private static List<HelpNumber> lines(String... numbers) {
        return List.of(numbers).stream().map(number -> helpNumbers.find(number).orElseThrow()).toList();
    }

    @Test
    void addsPamiAfterTheModelsNumbers() {
        assertThat(numbers(SafetyRules.withPami(lines("107", "911"), helpNumbers, 4))).containsExactly("107", "911", "138");
    }

    @Test
    void makesRoomForPamiWhenTheButtonsAreFull() {
        assertThat(numbers(SafetyRules.withPami(lines("107", "911", "100", "103"), helpNumbers, 4)))
                .containsExactly("107", "911", "100", "138");
    }

    @Test
    void doesNotRepeatPami() {
        assertThat(numbers(SafetyRules.withPami(lines("138", "107"), helpNumbers, 4))).containsExactly("138", "107");
    }

    @Test
    void asksOnlyForWhatsMissing() {
        assertThat(SafetyRules.missingDataQuestion(ChatProfile.EMPTY)).contains("provincia y localidad").contains("edad");
        assertThat(SafetyRules.missingDataQuestion(new ChatProfile("Santa Fe", null, 80, "abuelo")))
                .contains("localidad").doesNotContain("provincia").doesNotContain("edad");
        assertThat(SafetyRules.missingDataQuestion(new ChatProfile("Santa Fe", "Rosario", 80, "abuelo"))).isNull();
    }

    @Test
    void dropsBubblesAlreadySent() {
        List<org.springframework.ai.chat.messages.Message> conversation = List.of(
                new org.springframework.ai.chat.messages.UserMessage("mi abuelo tiene convulsiones"),
                new org.springframework.ai.chat.messages.AssistantMessage("Llamá ya al 107.\n\nPonelo de lado."),
                new org.springframework.ai.chat.messages.UserMessage("vivimos en Rosario"),
                new org.springframework.ai.chat.messages.AssistantMessage("this turn's answer"));
        assertThat(AuxiGraphConfig.withoutRepeats(List.of("Llamá ya al 107.", "En Rosario, PAMI tiene el 139."), conversation))
                .containsExactly("En Rosario, PAMI tiene el 139.");
        assertThat(AuxiGraphConfig.withoutRepeats(List.of("Llamá ya al 107."), conversation)).isEmpty();
    }

    @Test
    void addsPamiEmergenciesOnlyWhereItApplies() {
        ChatProfile rosario = new ChatProfile("Santa Fe", "Rosario", 84, "abuelo");
        ChatProfile caba = new ChatProfile("Ciudad Autónoma de Buenos Aires", "Palermo", null, null);
        ChatProfile cordoba = new ChatProfile("Córdoba", "Río Cuarto", null, null);
        assertThat(numbers(SafetyRules.withPamiEmergencies(lines("107"), rosario, helpNumbers, 4))).containsExactly("107", "139");
        assertThat(numbers(SafetyRules.withPamiEmergencies(lines("107"), caba, helpNumbers, 4))).containsExactly("107", "139");
        assertThat(numbers(SafetyRules.withPamiEmergencies(lines("107"), cordoba, helpNumbers, 4))).containsExactly("107");
    }

    @Test
    void keepsTheAgeOnlyIfSomeoneWroteIt() {
        ChatProfile guessed = new ChatProfile(null, null, 70, "abuelo");
        assertThat(guessed.onlyWhatWasSaid(List.of("mi abuelo tiene convulsiones")).age()).isNull();
        assertThat(guessed.onlyWhatWasSaid(List.of("tiene 70 años")).age()).isEqualTo(70);
        assertThat(guessed.onlyWhatWasSaid(List.of("vive en el 1700")).age()).isNull();
    }

    @Test
    void keepsThePlaceOnlyIfSomeoneWroteIt() {
        ChatProfile guessed = new ChatProfile("Buenos Aires", "Buenos Aires", null, null);
        assertThat(guessed.onlyWhatWasSaid(List.of("mi abuelo tiene convulsiones"))).isEqualTo(ChatProfile.EMPTY);
        ChatProfile said = new ChatProfile("Santa Fe", "Rosario", null, null);
        assertThat(said.onlyWhatWasSaid(List.of("vivimos en Rosario, Santa Fé"))).isEqualTo(said);
        ChatProfile caba = new ChatProfile("Ciudad Autónoma de Buenos Aires", "Palermo", null, null);
        assertThat(caba.onlyWhatWasSaid(List.of("estoy en Palermo, CABA"))).isEqualTo(caba);
    }

    @Test
    void dropsNearlyIdenticalBubblesToo() {
        List<org.springframework.ai.chat.messages.Message> conversation = List.of(
                new org.springframework.ai.chat.messages.AssistantMessage("Mientras llega la ayuda: lo ponés de lado, no le pongas nada en la boca; no lo sujetes fuerte; anotá cuánto dura la convulsión."),
                new org.springframework.ai.chat.messages.UserMessage("balvanera"),
                new org.springframework.ai.chat.messages.AssistantMessage("this turn"));
        assertThat(AuxiGraphConfig.withoutRepeats(List.of(
                "Mientras llega la ayuda: lo ponés de lado, no le pongas nada en la boca; no lo sujetas fuerte; anotá cuánto dura la convulsión.",
                "En CABA, si tiene PAMI, también está el 139."), conversation))
                .containsExactly("En CABA, si tiene PAMI, también está el 139.");
    }

    @Test
    void doesNotAskTwiceWhenAuxiAlreadyAsked() {
        assertThat(SafetyRules.asksForData(List.of("Llamá al 107.", "¿En qué provincia y localidad están?"))).isTrue();
        assertThat(SafetyRules.asksForData(List.of("¿Qué edad tiene?"))).isTrue();
        assertThat(SafetyRules.asksForData(List.of("Llamá al 107. Ponelo de lado."))).isFalse();
        assertThat(SafetyRules.asksForLocation(List.of("Para ayudarte mejor, contame: ¿en qué provincia y localidad están?"))).isTrue();
        assertThat(SafetyRules.asksForLocation(List.of("¿Qué edad tiene la persona?"))).isFalse();
    }

    @Test
    void acceptsTheProvinceOfALocalityThePersonWrote() {
        ChatProfile inferred = new ChatProfile("Ciudad Autónoma de Buenos Aires", "Balvanera", null, null);
        assertThat(inferred.onlyWhatWasSaid(List.of("balvanera"))).isEqualTo(inferred);
    }

    @Test
    void readsTheModelsWaysOfSayingUnknown() {
        ChatProfile unknown = new ChatProfile("null", " ", 0, "desconocido");
        assertThat(unknown).isEqualTo(ChatProfile.EMPTY);
        assertThat(SafetyRules.missingDataQuestion(unknown)).contains("provincia y localidad").contains("edad");
    }

    @Test
    void newDataDoesNotEraseWhatWasKnown() {
        ChatProfile known = new ChatProfile("Córdoba", "Río Cuarto", null, null);
        ChatProfile updated = known.updatedWith(new ChatProfile(null, null, 82, "abuela"));
        assertThat(updated).isEqualTo(new ChatProfile("Córdoba", "Río Cuarto", 82, "abuela"));
    }
}
