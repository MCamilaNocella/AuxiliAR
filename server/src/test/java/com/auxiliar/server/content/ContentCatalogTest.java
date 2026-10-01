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
        // Every section is still "en construcción": update this test when the first one gets a summary
        assertThat(catalog.pages()).noneMatch(ContentPage::hasInfo);
    }

    @Test
    void findsPagesOnlyByAnExistingPath() {
        assertThat(catalog.findByPath("/primeros-auxilios")).map(ContentPage::firstAid).contains(true);
        assertThat(catalog.findByPath("/no-existe")).isEmpty();
    }
}
