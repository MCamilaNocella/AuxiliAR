package com.auxiliar.server.chat;

import com.fasterxml.jackson.annotation.JsonPropertyDescription;

/** What the model returns for one answer while completing the profile */
public record ProfileAnswer(
        @JsonPropertyDescription("Tu mensaje para la persona, en texto plano y corto: si diste con el dato, un acuse breve; si no se entendió, la repregunta")
        String reply,
        @JsonPropertyDescription("true si la persona no sabe el dato o prefiere no darlo: se pasa al siguiente sin guardar nada")
        boolean skipped,
        @JsonPropertyDescription("El dato como va en el perfil, prolijo; null si todavía no lo dio, si el dato pedido es la ubicación, o si lo salteó")
        String value,
        @JsonPropertyDescription("Solo si el dato pedido es la ubicación: la localidad o ciudad; null si no")
        String locality,
        @JsonPropertyDescription("Solo si el dato pedido es la ubicación: la provincia (CABA para la Ciudad de Buenos Aires); null si no")
        String province) {
}
