package com.auxiliar.server.chat;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonPropertyDescription;

/** What the model returns on each turn: the answer and its own decisions about it */
public record AuxiAnswer(
        @JsonPropertyDescription("Tu respuesta para la persona, en texto plano: casi siempre 1 mensaje (2 solo en una emergencia), cada uno se muestra en su propio globo, en orden")
        List<String> messages,
        @JsonPropertyDescription("Si tu respuesta tiene pasos o varias cosas para hacer, ponelos acá, uno por elemento, cada uno corto (como máximo 8 palabras), como máximo 5 y sin numerar: la web los numera y los muestra al final de tu último mensaje. No los repitas en messages. Vacío si no hay pasos o si mandás a una página de AuxiliAR que ya los tiene")
        List<String> steps,
        @JsonPropertyDescription("true si lo que cuenta la persona es una emergencia en este momento")
        boolean emergency,
        @JsonPropertyDescription("Rutas (path) de las páginas de AuxiliAR que le recomendás, como máximo 3; vacío si ninguna sirve")
        List<String> pages,
        @JsonPropertyDescription("Números de ayuda para mostrar como botones de llamada, tal cual figuran en la lista de números de ayuda, como máximo 4, los más útiles primero; vacío si no hace falta llamar a nadie")
        List<String> phones,
        @JsonPropertyDescription("true si la conversación trata sobre una persona mayor (de unos 60 años o más: un abuelo o abuela, un jubilado o pensionado), sea quien escribe u otra persona")
        boolean olderAdult,
        @JsonPropertyDescription("true si en este mensaje le ofrecés hablar con una persona voluntaria: porque lo pidió, o porque da alguna señal de que le haría bien que alguien la escuche (está mal anímicamente, triste, angustiada, ansiosa, sola, con miedo, desbordada, o no tiene con quién hablar), aunque también le recomiendes una página")
        boolean offerPerson,
        @JsonPropertyDescription("true si en este mensaje querés contarle, al pasar, que si prefiere puede charlar con una persona voluntaria: la web agrega esa frase al final. Solo cuando ya la ayudaste y agradece, se despide o la charla parece cerrarse, si todavía no se lo dijiste; nunca en una emergencia ni en tu primera respuesta")
        boolean mentionPerson,
        @JsonPropertyDescription("true si en su último mensaje la persona da alguna señal de estar mal anímicamente: triste, bajoneada, angustiada, ansiosa, sola, con miedo, desbordada, sin ganas, o sin nadie con quién hablar")
        boolean needsListening,
        @JsonPropertyDescription("Lo que se sabe hasta ahora por la conversación (incluidos los datos ya conocidos) de dónde está y la edad de quien necesita ayuda")
        ChatProfile profile) {
}
