package com.auxiliar.server.helplines;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

class HelpNumbersTest {

    private static HelpNumbers helpNumbers;

    @BeforeAll
    static void load() throws IOException {
        helpNumbers = new HelpNumbers(new ClassPathResource("prompts/numeros.md"));
    }

    @Test
    void readsEveryRowOfTheTable() {
        assertThat(helpNumbers.all()).extracting(HelpNumber::number)
                .contains("107", "911", "138", "0800-222-7264", "0800-333-0160")
                .doesNotContain("Número", "---");
        assertThat(helpNumbers.all()).allSatisfy(line -> assertThat(line.name()).isNotBlank());
    }

    @Test
    void findsNumbersWrittenAnyWay() {
        assertThat(helpNumbers.find("0800 333 0160")).map(HelpNumber::name).contains("Intoxicaciones");
        assertThat(helpNumbers.find("138")).map(HelpNumber::name).contains("PAMI");
    }

    @Test
    void knowsWhereEachNumberWorks() {
        assertThat(helpNumbers.find("135")).map(HelpNumber::zone).hasValueSatisfying(zone -> assertThat(zone).contains("CABA"));
        assertThat(helpNumbers.find("139")).map(HelpNumber::zone).hasValueSatisfying(zone -> assertThat(zone).contains("Rosario"));
        assertThat(helpNumbers.all()).allSatisfy(line -> assertThat(line.zone()).isNotBlank());
    }

    @Test
    void doesNotFindMadeUpNumbers() {
        assertThat(helpNumbers.find("0800-123-4567")).isEmpty();
        assertThat(helpNumbers.find("")).isEmpty();
    }

    @Test
    void documentHasTheInstructionsAndTheTable() {
        assertThat(helpNumbers.document()).contains("Cómo elegir").contains("| 144 |");
    }

    @Test
    void theTableIsGeneratedFromTheVerifiedHelpLines() {
        assertThat(helpNumbers.document()).contains("GENERADO por client/scripts/resources-sync.mjs");
        // the rows that are not verified yet say so, and the verified ones do not
        assertThat(helpNumbers.all()).filteredOn(line -> line.name().contains("(sin verificar)")).extracting(HelpNumber::number)
                .containsExactlyInAnyOrder("100", "101", "103", "106", "149", "0800-444-8694", "0800-222-7264", "0800-222-0381");
        assertThat(helpNumbers.all()).extracting(HelpNumber::number).doesNotHaveDuplicates();
    }

    @Test
    void theAmbulanceIsNotPresentedAsNationwide() {
        assertThat(helpNumbers.find("107")).hasValueSatisfying(line -> {
            assertThat(line.name()).isEqualTo("Ambulancia (SAME)");
            assertThat(line.zone()).startsWith("Depende de la jurisdicción").contains("Confirmá el número local").contains("911");
            assertThat(line.zone()).doesNotStartWith("Todo el país");
        });
        assertThat(helpNumbers.find("911")).hasValueSatisfying(line -> {
            assertThat(line.name()).isEqualTo("Emergencias");
            assertThat(line.zone()).isEqualTo("Todo el país");
        });
        assertThat(helpNumbers.document()).doesNotContain("107 o el 911, que funcionan en todo el país");
    }

    @Test
    void mentalHealthLinesSayWhereTheyWorkAndWhenTheyAnswer() {
        assertThat(helpNumbers.find("0800-999-0091")).hasValueSatisfying(line -> {
            assertThat(line.zone()).isEqualTo("Todo el país");
            assertThat(line.hours()).isEqualTo("24 h");
        });
        assertThat(helpNumbers.find("135")).hasValueSatisfying(line -> {
            assertThat(line.zone()).isEqualTo("Solo CABA y Gran Buenos Aires");
            assertThat(line.hours()).contains("8:00 a 0:00").isNotEqualTo("24 h");
        });
        assertThat(helpNumbers.find("0800 345 1435")).hasValueSatisfying(line -> {
            assertThat(line.zone()).startsWith("Todo el país");
            assertThat(line.hours()).contains("8:00 a 0:00");
        });
    }

    @Test
    void whatTheInstructionsNameIsInTheTable() {
        // auxi.md refers to these two rows by their name, and numeros.md to its numbers by id (the template is checked when it is generated)
        assertThat(helpNumbers.all()).extracting(HelpNumber::name).contains("Emergencias", "Ambulancia (SAME)");
        assertThat(helpNumbers.document()).contains("0800-999-0091").contains("0800-345-1435");
    }

    @Test
    void pamiEmergenciesAreNotSentToTheAmbulanceOutsideTheirZone() {
        assertThat(helpNumbers.find("139")).hasValueSatisfying(line -> {
            assertThat(line.zone()).contains("AMBA").contains("Rosario").contains("prestador asignado");
            assertThat(line.zone()).doesNotContain("107");
        });
    }
}
