package com.auxiliar.server.content;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

/** AuxiliAR's pages. Auxi (the model) reads the list and picks which ones to suggest */
@Component
public class ContentCatalog {

    private final List<ContentPage> pages;

    public ContentCatalog(JsonMapper jsonMapper,
                          @Value("classpath:content/content-index.json") Resource index) throws IOException {
        try (InputStream input = index.getInputStream()) {
            this.pages = List.copyOf(jsonMapper.readValue(input, new TypeReference<List<ContentPage>>() {}));
        }
    }

    public List<ContentPage> pages() {
        return pages;
    }

    /** The page at that path, if it exists (the model's choices are checked against this) */
    public Optional<ContentPage> findByPath(String path) {
        return pages.stream().filter(page -> page.path().equals(path)).findFirst();
    }
}
