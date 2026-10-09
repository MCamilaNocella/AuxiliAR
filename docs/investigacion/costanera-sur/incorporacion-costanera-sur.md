# Incorporación local del Centro Fijo Veterinario de Costanera Sur

Fecha: 9/10/2026. Rama local `feature/map-vet-costanera-sur` (desde `feature/map-verifications-prep`). Sin push, PR ni integración. Se cargó **únicamente** este centro, con la prestación de castración. El Centro del Indoamericano **no** está cargado.

## 1. Antes y después

| | Antes | Después |
|---|---|---|
| Establecimientos en el mapa | 6 | **7** |
| Prestaciones | 33 | **34** |
| Gratuitas confirmadas, sin condiciones adicionales | 6 | 6 |
| Gratuitas confirmadas, **con condiciones** | 2 (vacunación de CeSAC 3 y 41) | **3** (esas 2 y la castración de Costanera Sur) |
| Total confirmadas | 8 | **9** |
| Gratuidad no confirmada | 25 | 25 |
| Recursos en la copia del servidor | 20 | 21 |

Los demás establecimientos y prestaciones no cambiaron (comprobado en la prueba `places-vet.test.mjs`): vacunación y salud mental del CeSAC 47, salud mental de los otros CeSAC y odontología siguen sin gratuidad confirmada.

## 2. Datos incorporados y fuente de cada afirmación

Todas las fuentes se consultaron el **9/10/2026**. La página de Animales BA no publica fecha de actualización: lo fechable es la consulta y la agenda (3 al 17 de octubre de 2026). Texto original en [`../evidencia/animales-ba-castracion-y-vacunacion.txt`](../evidencia/animales-ba-castracion-y-vacunacion.txt) y [`../evidencia/animales-ba-mapas-oficiales-y-agenda.txt`](../evidencia/animales-ba-mapas-oficiales-y-agenda.txt).

| Dato cargado | Valor | Fuente |
|---|---|---|
| Identidad | «Centro Fijo Veterinario Costanera Sur (Animales BA)», establecimiento de Animales BA, Gobierno de la Ciudad de Buenos Aires; tipo «Veterinaria pública» | Página «Atención veterinaria y castraciones gratuitas» (`buenosaires.gob.ar/gcaba_historico/atencion-veterinaria-y-castraciones-gratuitas`): «dos centros fijos de atención veterinaria y castración… el otro en Costanera Sur» |
| Dirección | Av. Dr. T. Achával Rodríguez 1550, Costanera Sur; referencia «a 100 metros frente a la fuente de Lola Mora» | La misma página, y agenda: «Centro Fijo Costanera Sur - Av. Achával Rodríguez 1550» |
| Comuna | Comuna 1 | Dataset oficial de comunas de BA Data (el punto cae dentro de la Comuna 1) |
| Ubicación | -34.617546, -58.356478, **precisión «aproximada»**, verificada | Punto del mapa oficial (mapa.buenosaires.gob.ar) que enlaza la propia página; el normalizador USIG da el mismo lugar a 5 m; la Fuente de las Nereidas queda a unos 73 m (la página dice «a 100 metros»). Detalle en [centros-veterinarios-ubicacion.md](../verificaciones/centros-veterinarios-ubicacion.md) |
| Prestación | Una sola: «Castración de perros y gatos» (tipo castración) | La página: castraciones; la agenda lista a este centro solo con «Castración» |
| Gratuidad | Gratuita, **con condiciones**; asociada solo a la castración | Frase literal de la página: «se brinda un servicio de castraciones y vacunación antirrábica para caninos y felinos totalmente gratuito, a través de los Centros Fijos Veterinarios y las Unidades Móviles» |
| Turno | Solo con turno previo, online con cuenta miBA; las agendas de la semana siguiente se habilitan los viernes a las 10 h; «no se atenderá a quienes se acerquen a los centros de atención sin turno previo» | La misma página |
| Requisitos | Acompañante mayor de 18 años con toda la mañana disponible; ayuno (12 h sin alimento y 8 h sin líquidos); perro con collar y correa, gato en transportadora o bolso ventilado; manta; avisar medicación o enfermedad | La misma página |
| Fuentes en el panel | Una sola página oficial, con tres líneas: respalda la gratuidad, confirma que la sede ofrece la castración, explica cómo pedir turno («no confirma que haya turnos disponibles») | `evidence` de la prestación |
| Verificación | verificado el 9/10/2026; **se revisa antes del 8/11/2026** (30 días) | Se acortó el plazo a propósito: la información depende de una agenda que cambia |

**Lo que NO se cargó y por qué**
- Horario: la página da días en una agenda, no horarios, y la agenda es temporal: no se convirtió en horario permanente (la prestación queda con horario «no se sabe»).
- Teléfono: la página no publica ninguno. El panel lo dice («Por ahora no tenemos un teléfono verificado de este lugar») y ya no pide llamar.
- Requisito de residencia: la página habla de «vecinos de la Ciudad» pero no lo pide como requisito; no se inventó. La condición dice «La página no aclara si hace falta vivir en la Ciudad».
- Guardia, consulta veterinaria general, vacunación antirrábica y cualquier otra prestación: la página no los informa en este centro (la vacunación antirrábica figura solo en operativos de las unidades móviles).
- El Centro del Indoamericano: su ubicación sigue pendiente (el punto es el cruce de calles, no la entrada).

## 3. Cómo se integra con el mapa

- **Filtro Salud animal:** aparece (1 resultado). Está también en «gratuidad confirmada», en la categoría Animales y en «Todos».
- **Filtros de salud humana:** no aparece en ninguno (medicina, salud mental, salud sexual, vacunación, odontología, urgencias, categorías de salud física, mental y ESI).
- **Gratuidad asociada a la castración:** «castración gratuita» lo encuentra; «vacuna antirrábica gratuita», «guardia veterinaria gratuita», «consulta veterinaria gratuita» y similares, no. El chip es siempre «Gratuita con condiciones», nunca «Atención gratuita».
- **Estado vacío de Salud animal:** ya no aparece mientras exista una prestación veterinaria (probado con el mapa real y, para el mensaje mismo, con un mapa que no incluye prestaciones veterinarias).
- **Ubicación aproximada:** el mapa y el panel lo dicen («Ubicación aproximada en el mapa: marca la dirección, no necesariamente la entrada»); un punto con precisión «exacta» no lo dice (prueba).
- **Enlaces oficiales:** la página de Animales BA responde 200 y el enlace del mapa oficial también; en el panel se abren en pestaña nueva.

## 4. Cambios de código necesarios (cinco, todos chicos)
1. **Ubicación aproximada** (`map.ts`, `PlaceDetail`, `PlacesMapView`): el modelo ya guardaba la precisión («exact» o «approximate») pero la pantalla no la usaba. Ahora el panel y el mapa dicen cuándo el punto es aproximado.
2. **La tarjeta muestra la condición** (`PlaceCard`): una prestación gratuita con condiciones muestra su texto de condición debajo del chip. Antes la tarjeta solo decía «Gratuita con condiciones», sin decir cuáles.
3. **Aviso de horario sin teléfono** (`placeView`): decía «llamá antes de ir» aun cuando el lugar no tiene teléfono; ahora dice «consultá antes de ir» cuando no hay un teléfono para llamar.
4. **Pruebas** que fijaban «6 lugares» y «sin prestaciones veterinarias» se actualizaron; las de los lugares para personas ahora usan solo esos lugares, y el centro veterinario tiene las suyas (`places-vet.test.mjs`, 10 pruebas).
5. Datos: `ar-c.json` (un establecimiento nuevo al final), copia del servidor y `coverage.json` regenerados con `resources:sync` (`places` de CABA: 6 → 7).

## 5. Limitaciones del modelo y discrepancias encontradas

- **Efecto en otras tarjetas:** como la tarjeta ahora muestra la condición, las tarjetas de **CeSAC 3 y 41** muestran también el texto de la condición de vacunación (el alcance de la gratuidad). Es un efecto buscado de la misma regla, pero cambia su aspecto; si prefieren que solo lo muestre el centro veterinario, hay que acotarlo.
- **Ubicación aproximada en todos:** la nota de ubicación aproximada aparece en **todos** los lugares cuyo punto está marcado «aproximado», no solo en el veterinario: los de los CeSAC y hospitales también lo están (vienen del dataset oficial). Es verdad para todos, pero es una novedad en su panel.
- **«Atención gratuita.» en la castración:** el panel antepone «Atención gratuita.» al texto de condición de cualquier prestación gratuita; en una castración el título suena a atención médica. Es el texto del sistema para todas las prestaciones; cambiarlo es un ajuste de `placeView.ts`.
- **Una agenda no cabe en el modelo:** el modelo no tiene un campo para «días con turnos esta semana»; se dice en el texto («los días con turnos cambian por semana: mirá la agenda en la página oficial») y el enlace «Pedir turno» lleva a la página. La agenda de octubre vence el 17/10: **conviene revisarlo antes**.
- **Búsqueda por verbos:** «castrar» no encuentra «castración» (la búsqueda reduce palabras a su raíz, pero no une verbo y sustantivo). «Castración» y «castraciones» sí.
- **Los puntos de CeSAC 47:** no es de esta etapa; sigue pendiente.
- **Java:** `mvn test` pasa 58 de 59; la única falla es `contextLoads` (pendiente técnico separado, sin cambios). `ResourceCatalogTest` pasa con el recurso nuevo.
- **Auxi (chat):** la copia del servidor ahora incluye este centro (sin el campo `evidence`); Auxi puede mencionarlo. No se tocó el chatbot: conviene revisar qué responde sobre castración, turno y que no hay teléfono.

## 6. Pruebas
- `npm run test:ci` completo (incluye `resources:check` y `curation:check`): todo pasa. Places: 126 pruebas, de ellas 10 nuevas del centro veterinario; curación: 77 (se actualizaron los conteos de lugares publicados).
- `resources:test`: 33 de 33. `tsc`, `oxlint` y `npm run build`: sin errores.
- **Chrome a 320, 390 y 1280 px: 0 fallas, sin errores de consola, sin desborde horizontal real.** Se comprobó la tarjeta, la ubicación (nota de aproximada, punto en el mapa, tocar el punto muestra la tarjeta), los requisitos, el enlace oficial y los filtros (Salud animal, filtros de salud humana, gratuidad, búsquedas), y que el Indoamericano no está.
- Capturas en [capturas/](capturas/) (completas en `%TEMP%\audit23\`).
