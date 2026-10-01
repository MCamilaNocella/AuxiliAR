package com.auxiliar.server.chat;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonPropertyDescription;

/** What the model returns on each turn: the answer and its own decisions about it */
public record AuxiAnswer(
        @JsonPropertyDescription("Tu respuesta para la persona, en texto plano: 1 a 3 mensajes, cada uno se muestra en su propio globo, en orden")
        List<String> messages,
        @JsonPropertyDescription("true si lo que cuenta la persona es una emergencia en este momento")
        boolean emergency,
        @JsonPropertyDescription("Rutas (path) de las páginas de AuxiliAR que le recomendás, como máximo 3; vacío si ninguna sirve")
        List<String> pages,
        @JsonPropertyDescription("Números de ayuda para mostrar como botones de llamada, tal cual figuran en la lista de números de ayuda, como máximo 4, los más útiles primero; vacío si no hace falta llamar a nadie")
        List<String> phones,
        @JsonPropertyDescription("true si la conversación trata sobre una persona mayor (de unos 60 años o más: un abuelo o abuela, un jubilado o pensionado), sea quien escribe u otra persona")
        boolean olderAdult,
        @JsonPropertyDescription("Lo que se sabe hasta ahora por la conversación (incluidos los datos ya conocidos) de dónde está y la edad de quien necesita ayuda")
        ChatProfile profile) {
}
