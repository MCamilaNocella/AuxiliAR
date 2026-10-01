package com.auxiliar.server.chat;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import com.auxiliar.server.content.ContentCatalog;
import com.auxiliar.server.content.ContentPage;
import com.auxiliar.server.helplines.HelpNumbers;

/**
 * Auxi's instructions, written in Markdown in src/main/resources/prompts so they can be edited by hand
 * (read at startup: restart the server after editing them).
 */
@Component
public class AuxiPrompts {

    private static final String PAGES_PLACEHOLDER = "{{paginas}}";
    private static final String NO_PAGES = "(Por ahora ninguna página tiene información: no recomiendes ninguna ni menciones páginas de AuxiliAR.)";

    private final String base;
    private final String emergency;
    private final String pages;
    private final String numbers;

    public AuxiPrompts(@Value("classpath:prompts/auxi.md") Resource base,
                       @Value("classpath:prompts/emergencia.md") Resource emergency,
                       @Value("classpath:prompts/paginas.md") Resource pages,
                       ContentCatalog catalog, HelpNumbers helpNumbers) throws IOException {
        this.base = read(base);
        this.emergency = read(emergency);
        // Only pages with content: the ones under construction aren't even mentioned to the model
        String pageList = catalog.pages().stream()
                .filter(ContentPage::hasInfo)
                .map(page -> "- %s (%s): %s".formatted(page.title(), page.path(), page.summary()))
                .collect(Collectors.joining("\n"));
        if (pageList.isEmpty()) {
            pageList = NO_PAGES;
        }
        this.pages = read(pages).replace(PAGES_PLACEHOLDER, pageList);
        this.numbers = "## Números de ayuda de Argentina\n\n" + helpNumbers.document();
    }

    /** Everything the model gets as system instructions for one turn */
    public String system(boolean emergencyButton, ChatProfile known, String answerFormat) {
        return String.join("\n\n", base, emergencyButton ? emergency : "", knownData(known), numbers, pages, answerFormat).strip();
    }

    /** What's already known about the person, so the model uses it and doesn't ask again */
    private static String knownData(ChatProfile known) {
        List<String> data = new ArrayList<>();
        if (known.province() != null) data.add("provincia: " + known.province());
        if (known.locality() != null) data.add("localidad: " + known.locality());
        if (known.age() != null) data.add("edad: " + known.age() + (known.person() != null ? " (" + known.person() + ")" : ""));
        return data.isEmpty() ? "" : "## Datos que ya sabés de la persona\n\n" + String.join(", ", data) + ". Usalos y no los vuelvas a preguntar.";
    }

    private static String read(Resource resource) throws IOException {
        return resource.getContentAsString(StandardCharsets.UTF_8).strip();
    }
}
