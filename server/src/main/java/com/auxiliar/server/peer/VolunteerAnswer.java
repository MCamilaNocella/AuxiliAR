package com.auxiliar.server.peer;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonPropertyDescription;

/** What the model returns when it plays the volunteer */
public record VolunteerAnswer(
        @JsonPropertyDescription("Tu respuesta para la persona, en texto plano: 1 o 2 mensajes, cada uno se muestra en su propio globo, en orden")
        List<String> messages,
        @JsonPropertyDescription("true si lo que cuenta la persona es una emergencia en este momento")
        boolean emergency,
        @JsonPropertyDescription("Números de ayuda para mostrar como botones de llamada, tal cual figuran en la lista de números de ayuda, como máximo 3, el más importante primero; vacío si no hace falta llamar a nadie")
        List<String> phones,
        @JsonPropertyDescription("true solo si en un mensaje anterior ya le preguntaste si había algo más en lo que pudieras ayudarla y ahora te confirmó que no: con este mensaje te despedís y el chat se cierra")
        boolean endChat) {
}
