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
}
