package com.auxiliar.server.resources;

import java.util.List;

/**
 * The file data/resources.json, generated from the client's dataset by client/scripts/resources-sync.mjs.
 * It is never edited by hand.
 *
 * @param schemaVersion version of the format (taxonomy.json), so a server that doesn't know it refuses to start
 */
public record ResourceDataset(int schemaVersion, String notice, List<HealthResource> resources) {

    public ResourceDataset {
        resources = resources == null ? List.of() : List.copyOf(resources);
    }
}
