package com.auxiliar.server.helplines;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

/**
 * Argentina's help numbers, written by hand in prompts/numeros.md (instructions + a Markdown table).
 * They always go in Auxi's instructions (a tool the model could look them up with was tried: the free models
 * skipped it and made numbers up). The numbers it shows as call buttons are checked against the table, so it
 * can't show a made-up one. Read at startup: restart after editing the file.
 */
@Component
public class HelpNumbers {

    private final String document;
    private final List<HelpNumber> numbers;

    public HelpNumbers(@Value("classpath:prompts/numeros.md") Resource file) throws IOException {
        this.document = file.getContentAsString(StandardCharsets.UTF_8).strip();
        this.numbers = parseTable(document);
    }

    /** The whole file (instructions + table), for Auxi's instructions */
    public String document() {
        return document;
    }

    public List<HelpNumber> all() {
        return numbers;
    }

    /** The line with that number, comparing digits only ("0800 333 0160" = "0800-333-0160") */
    public Optional<HelpNumber> find(String number) {
        String digits = digits(number);
        return numbers.stream().filter(line -> digits(line.number()).equals(digits)).findFirst();
    }

    private static String digits(String text) {
        return text == null ? "" : text.replaceAll("\\D", "");
    }

    /** Rows of the table "| Número | Nombre | Zona | Para qué | Horario |" (header and separator skipped) */
    static List<HelpNumber> parseTable(String markdown) {
        return markdown.lines()
                .map(String::strip)
                .filter(line -> line.startsWith("|") && line.endsWith("|"))
                .map(line -> Arrays.stream(line.substring(1, line.length() - 1).split("\\|", -1)).map(String::strip).toList())
                .filter(cells -> cells.size() == 5 && !digits(cells.get(0)).isEmpty())
                .map(cells -> new HelpNumber(cells.get(0), cells.get(1), cells.get(2), cells.get(3), cells.get(4)))
                .toList();
    }
}
