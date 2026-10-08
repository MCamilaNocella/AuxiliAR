# Bloqueo de accesibilidad móvil: Auxi tapa contenido

**Estado: registrado, sin corregir.** Por decisión del equipo (8/10/2026) no se modifica todavía la mascota, su burbuja ni su comportamiento, y tampoco se reordena el contenido como arreglo provisorio.

Medición hecha en Salud mental (las tres pestañas), con la rama `feature/mental-health-content`. Se recorrió cada página bajando de a 120 px, esperando 1,3 s en cada posición (lo que tarda en asentarse la lógica que aparta a Auxi). Capturas en `%TEMP%\audit13\`.

## 1. Qué elemento de Auxi tapa

| Elemento | Qué tapa | Cuándo |
|---|---|---|
| **Mascota** (abajo a la derecha, sobre la barra inferior) | Extremo derecho de botones y enlaces (la flecha, las últimas letras) y parte de párrafos | En celular (≤ 430 px) en algunas posiciones del desplazamiento |
| **Burbuja «¡Hola! Soy Auxi, ¿necesitás ayuda?»** | Párrafos y encabezados de lectura, no controles | En todos los anchos, mientras está visible (también en escritorio) |

La lógica actual (`useAuxiAvoidance` + `overlapMatters`) **solo protege lo pulsable** y tolera solapes menores: un control grande se considera tapado únicamente si la mascota queda sobre su centro o sobre ≥ 25 % de su área. **El texto de lectura no está protegido.** Por eso un botón ancho puede quedar con su flecha o sus últimas letras debajo de la mascota sin que Auxi se aparte.

## 2. En qué resoluciones sucede

| Ancho × alto | Controles afectados (en algún punto del recorrido) | Texto tapado por la burbuja | Texto tapado por la mascota |
|---|---|---|---|
| 320 × 640 | 13 | sí (32 elementos) | sí (39) |
| 360 × 740 | 9 | sí (31) | sí (38) |
| 390 × 844 | 8 | sí (30) | sí (35) |
| 430 × 932 | 7 | sí (21) | sí (27) |
| 768 × 1024 | 0 | sí (19) | sí (18) |
| 1280 × 800 | 0 | sí (16) | no (la mascota no tapa nada) |

Cada elemento queda tapado en **una o dos posiciones** del recorrido (de 7 a 20 posiciones por página): es transitorio y depende del punto de desplazamiento, pero una persona que se detiene justo ahí no ve o no alcanza ese elemento. Las cifras de texto cuentan elementos distintos tocados en algún momento, no tapados a la vez.

## 3. Botones, enlaces y textos afectados

Controles, por ancho (porcentaje máximo del control que queda debajo):

- **«Explorar centros de salud en el mapa»** (pestañas 1 y 2): hasta 20 % a 320 px, 16 % a 390 px; a 430 px, 1–3 %. Es el recurso principal de la página.
- **«Herramientas para cuidarte»** (pestaña de la sección 3): 25 % a 320 px.
- **«Ver números de emergencia»**: 21 % a 320 px (la mascota; el botón no se pierde pero se ve tapado).
- **«Cómo verificamos los datos y qué cobertura hay»**: hasta 16 % a 360–390 px.
- **Enlaces de «Fuentes oficiales»** (Orientación, Ley simple, Ley 26.657, OMS): entre 3 % y 23 % en celular.

Texto tapado por la burbuja, ejemplos: la introducción («Estamos para ayudarte…»), «Si hay riesgo inmediato…», «Pedí ayuda primero…», y en la sección 1 la frase «La forma de acceder a la atención puede variar según el centro…» y «Si no tenés cobertura de salud…».

**Hay que evaluar si el problema es general:** la lógica es la misma en todas las páginas, y Salud mental es solo donde se midió. No se midieron las demás.

## 4. Capturas representativas (`%TEMP%\audit13\`)

- `390-mascota-sobre-control.png`: la mascota sobre la flecha de «Explorar centros de salud en el mapa» y la burbuja sobre la frase de acceso (390 px, scroll 600).
- `390b-mascota-sobre-control.png`: lo mismo en «Conocé tus derechos».
- `320-mascota-sobre-control.png`: la mascota sobre «Herramientas para cuidarte» (320 px).
- `390-burbuja-sobre-texto.png`, `390b-burbuja-sobre-texto.png`, `320-burbuja-sobre-texto.png`: la burbuja sobre la introducción.
- `1280-burbuja-sobre-texto.png`: escritorio, burbuja sobre un párrafo.
- `medicion.json`: todos los datos de la tabla.

## 5. Alternativas técnicas (sin implementar)

La solución debe cumplir: **Auxi no tapa controles ni información esencial y se conserva el acceso al asistente.**

**A. Reservar espacio para Auxi en la página (la más simple y robusta).**
Agregar un margen derecho o inferior al contenido, de modo que la mascota y su burbuja tengan una columna propia y no se superpongan con el texto en celular; o un espacio al final de cada página para que lo último pueda subir por encima de ella.
- A favor: no depende de medir ni de esperar; sirve para texto y controles.
- En contra: quita ancho útil en pantallas de 320–360 px; cambia la composición de todas las páginas, y por eso necesita validación visual del equipo.

**B. Ampliar la lógica de apartado actual para cubrir también el texto de lectura.**
Que `useAuxiAvoidance` considere cualquier solape (no solo el 25 % ni el centro) y que proteja párrafos y encabezados marcados con `data-auxi-avoid`. Ante un solape, la burbuja se oculta y la mascota se retira al borde como hoy.
- A favor: conserva el diseño actual; reutiliza la lógica existente.
- En contra: la mascota se escondería más seguido y quedaría poco visible en páginas con mucho texto; hay que decidir cuánto tiempo y cuánta superficie se acepta tapada.

**C. Mascota plegada por defecto en celular, con la burbuja solo al tocarla.**
Mostrar solo un botón pequeño y fijo (por ejemplo, un ícono en la barra superior o junto a la barra inferior) y que la burbuja aparezca únicamente por una acción de la persona, no sola.
- A favor: elimina el solape de la burbuja; deja el asistente siempre disponible en un lugar fijo.
- En contra: cambia el diseño ya confirmado; hay que definir dónde vive el acceso y si se pierde la presencia de la mascota.

**Combinación posible:** A para reservar espacio en celular + el comportamiento actual en escritorio, donde solo la burbuja toca texto. Nada de esto se implementa hasta que el equipo decida.

## Qué falta decidir

1. Cuál alternativa (o combinación) se prefiere.
2. Si la mascota en celular debe poder tapar texto de lectura o solo se protegen los controles.
3. Medir las demás páginas con la misma lógica antes de cerrar el diseño.
