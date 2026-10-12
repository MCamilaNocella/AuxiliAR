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
        // Encontrar atención (its map), Salud mental, Salud sexual y ESI and Atención veterinaria (their three sections each),
        // Primeros auxilios and Sobre AuxiliAR have a summary. Update this list when another section gets one
        assertThat(catalog.pages()).filteredOn(ContentPage::hasInfo).extracting(ContentPage::path)
                .containsExactlyInAnyOrder("/centros", "/centros?seccion=section-1",
                        "/temas/salud-mental", "/temas/salud-mental?seccion=section-1", "/temas/salud-mental?seccion=section-2",
                        "/temas/salud-mental?seccion=section-3",
                        "/temas/esi", "/temas/esi?seccion=section-1", "/temas/esi?seccion=section-2", "/temas/esi?seccion=section-3",
                        "/temas/animales", "/temas/animales?seccion=section-1", "/temas/animales?seccion=section-2", "/temas/animales?seccion=section-3",
                        "/primeros-auxilios", "/primeros-auxilios?seccion=section-1",
                        "/sobre-auxiliar", "/sobre-auxiliar?seccion=section-1");
    }

    @Test
    void findsTheCentersCategoryAndItsMap() {
        assertThat(catalog.findByPath("/centros")).map(ContentPage::title).contains("Encontrar atención");
        assertThat(catalog.findByPath("/centros?seccion=section-1")).hasValueSatisfying(page -> {
            assertThat(page.title()).isEqualTo("Encontrar atención › Mapa AuxiliAR");
            assertThat(page.hasInfo()).isTrue();
        });
    }

    @Test
    void findsPagesOnlyByAnExistingPath() {
        assertThat(catalog.findByPath("/primeros-auxilios")).map(ContentPage::firstAid).contains(true);
        assertThat(catalog.findByPath("/no-existe")).isEmpty();
    }
}
