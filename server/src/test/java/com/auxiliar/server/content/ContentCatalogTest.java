package com.auxiliar.server.content;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

import tools.jackson.databind.json.JsonMapper;

class ContentCatalogTest {

    private static ContentCatalog catalog;

    @BeforeAll
    static void loadCatalog() throws IOException {
        catalog = new ContentCatalog(JsonMapper.builder().build(), new ClassPathResource("content/content-index.json"));
    }

    @Test
    void loadsThePagesGeneratedFromTheClient() {
        assertThat(catalog.pages()).isNotEmpty().allSatisfy(page -> {
            assertThat(page.title()).isNotBlank();
            assertThat(page.path()).startsWith("/");
        });
    }

    @Test
    void knowsWhichPagesHaveContent() {
        // Centros de atención is the first category with real content (its map and "Sobre los datos"); the rest is still
        // "en construcción". Update this list when another section gets a summary
        assertThat(catalog.pages()).filteredOn(ContentPage::hasInfo).extracting(ContentPage::path)
                .containsExactlyInAnyOrder("/centros", "/centros?seccion=section-1", "/centros?seccion=section-2");
    }

    @Test
    void findsTheCentersCategoryAndItsDataSection() {
        assertThat(catalog.findByPath("/centros")).map(ContentPage::title).contains("Centros de atención");
        assertThat(catalog.findByPath("/centros?seccion=section-2")).hasValueSatisfying(page -> {
            assertThat(page.title()).isEqualTo("Centros de atención › Sobre los datos");
            assertThat(page.hasInfo()).isTrue();
            assertThat(page.summary()).contains("verifica").contains("gratuito").contains("fecha de verificación");
        });
    }

    @Test
    void findsPagesOnlyByAnExistingPath() {
        assertThat(catalog.findByPath("/primeros-auxilios")).map(ContentPage::firstAid).contains(true);
        assertThat(catalog.findByPath("/no-existe")).isEmpty();
    }
}
