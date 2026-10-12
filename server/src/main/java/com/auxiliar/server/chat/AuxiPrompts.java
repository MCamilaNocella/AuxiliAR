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
import com.auxiliar.server.resources.HealthResource;
import com.auxiliar.server.resources.ResourceCatalog;

/**
 * Auxi's instructions, written in Markdown in src/main/resources/prompts so they can be edited by hand
 * (read at startup: restart the server after editing them).
 */
@Component
public class AuxiPrompts {

    private static final String PAGES_PLACEHOLDER = "{{paginas}}";
    private static final String NUMBERS_PLACEHOLDER = "{{numeros}}";
    private static final String NO_PAGES = "(Por ahora ninguna página tiene información: no recomiendes ninguna ni menciones páginas de AuxiliAR.)";

    private final String base;
    private final String emergency;
    private final String pages;
    private final String numbers;
    private final String profile;
    private final String unchecked;
    private final ResourceCatalog resources;

    public AuxiPrompts(@Value("classpath:prompts/auxi.md") Resource base,
                       @Value("classpath:prompts/emergencia.md") Resource emergency,
                       @Value("classpath:prompts/paginas.md") Resource pages,
                       @Value("classpath:prompts/perfil.md") Resource profile,
                       @Value("classpath:prompts/numeros-sin-comprobar.md") Resource unchecked,
                       ContentCatalog catalog, HelpNumbers helpNumbers, ResourceCatalog resources) throws IOException {
        this.resources = resources;
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
        this.profile = read(profile);
        this.unchecked = read(unchecked);
    }

    /** Instructions to read one answer while completing the Mi Salud profile */
    public String profile(ProfileField field, String answerFormat) {
        return String.join("\n\n", profile, "## Dato que estás pidiendo ahora\n\n" + field.name(), answerFormat).strip();
    }

    /** Everything the model gets as system instructions for one turn */
    public String system(boolean emergencyButton, ChatProfile known, String answerFormat) {
        return String.join("\n\n", base, emergencyButton ? emergency : "", knownData(known), numbers, uncheckedNumbers(), pages, answerFormat).strip();
    }

    /**
     * The numbers whose review date has arrived, said every turn (the date can pass while the server is up). They stay in the
     * list, because a number a person may need must not vanish, but the model must not present them as checked.
     */
    String uncheckedNumbers() {
        List<String> numbers = resources.uncheckedLines().stream()
                .flatMap(line -> line.contacts().stream().map(HealthResource.Contact::display))
                .distinct()
                .toList();
        if (numbers.isEmpty()) {
            return "";
        }
        return unchecked.replace(NUMBERS_PLACEHOLDER, String.join(", ", numbers));
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
