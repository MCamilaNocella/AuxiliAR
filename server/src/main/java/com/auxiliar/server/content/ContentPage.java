package com.auxiliar.server.content;

import java.io.Serializable;

/**
 * A page (or section) of AuxiliAR that Auxi can suggest.
 * Generated from the client's content: see client/scripts/content-index.mjs.
 *
 * @param firstAid part of Primeros auxilios (guides to follow in an emergency)
 * @param hasInfo the page has real content yet (pages still under construction are never suggested)
 */
public record ContentPage(String title, String path, String summary, boolean firstAid, boolean hasInfo)
        implements Serializable {
}
