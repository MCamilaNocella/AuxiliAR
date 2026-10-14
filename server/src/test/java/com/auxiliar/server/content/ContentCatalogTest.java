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
        // Every category and every section with a summary (Salud sexual y ESI's IVE/ILE section has none on purpose:
        // it is pending professional review). Update this list when a section gets or loses one
        assertThat(catalog.pages()).filteredOn(ContentPage::hasInfo).extracting(ContentPage::path)
                .containsExactlyInAnyOrder("/centros", "/centros?seccion=section-1",
                        "/temas/salud-general", "/temas/salud-general?seccion=section-1", "/temas/salud-general?seccion=section-2",
                        "/temas/salud-general?seccion=section-4", "/temas/salud-general?seccion=section-5",
                        "/temas/salud-general?seccion=section-6", "/temas/salud-general?seccion=section-7",
                        "/temas/salud-mental", "/temas/salud-mental?seccion=section-1", "/temas/salud-mental?seccion=section-2",
                        "/temas/salud-mental?seccion=section-3", "/temas/salud-mental?seccion=section-4", "/temas/salud-mental?seccion=section-5",
                        "/temas/salud-mental?seccion=section-6",
                        "/temas/esi", "/temas/esi?seccion=section-1", "/temas/esi?seccion=section-2", "/temas/esi?seccion=section-3",
                        "/temas/esi?seccion=section-4", "/temas/esi?seccion=section-6",
                        "/temas/animales", "/temas/animales?seccion=section-1", "/temas/animales?seccion=section-2", "/temas/animales?seccion=section-3",
                        "/temas/animales?seccion=section-4", "/temas/animales?seccion=section-5",
                        "/recursos", "/recursos?seccion=section-1", "/recursos?seccion=section-2", "/recursos?seccion=section-3",
                        "/primeros-auxilios", "/primeros-auxilios?seccion=section-1", "/primeros-auxilios?seccion=section-2",
                        "/primeros-auxilios?seccion=section-3", "/primeros-auxilios?seccion=section-4", "/primeros-auxilios?seccion=section-5",
                        "/primeros-auxilios?seccion=section-6", "/primeros-auxilios?seccion=section-7", "/primeros-auxilios?seccion=section-8",
                        "/sobre-auxiliar", "/sobre-auxiliar?seccion=section-1");
    }

    @Test
    void findsTheCentersCategoryAndItsMap() {
        assertThat(catalog.findByPath("/centros")).map(ContentPage::title).contains("Centros de atención");
        assertThat(catalog.findByPath("/centros?seccion=section-1")).hasValueSatisfying(page -> {
            assertThat(page.title()).isEqualTo("Centros de atención › Mapa AuxiliAR");
            assertThat(page.hasInfo()).isTrue();
        });
    }

    @Test
    void findsPagesOnlyByAnExistingPath() {
        assertThat(catalog.findByPath("/primeros-auxilios")).map(ContentPage::firstAid).contains(true);
        assertThat(catalog.findByPath("/no-existe")).isEmpty();
    }
}
