# Lote 1: implementación local

Fecha: 8/10/2026. Rama local `feature/map-first-batch-implementation` (desde `feature/map-first-batch-fichas`). **Sin push, PR ni integración.** Se aplicaron únicamente las seis fichas aprobadas.

## 1. Gratuidad confirmada antes y después

El mapa tiene 33 prestaciones en 6 establecimientos.

| | Antes | Después |
|---|---|---|
| Gratuitas confirmadas, **sin condiciones adicionales** | 2 (guardias odontológicas de los hospitales Carrillo y Dueñas) | **6** (esas 2 + atención primaria de CeSAC 3, 41 y 47 + pediatría del CeSAC 47) |
| Gratuitas confirmadas, **con condiciones** | 0 | **2** (vacunación de CeSAC 3 y 41: solo vacunas del Calendario Nacional, de grupos de riesgo y de emergencia) |
| **Total confirmadas** | **2** | **8** |
| Gratuidad no confirmada | 31 | 25 |
| Establecimientos con alguna prestación confirmada | 2 | 5 |

Siguen sin gratuidad confirmada: la vacunación del CeSAC 47, la salud mental de los tres CeSAC (psicología de CeSAC 3, salud mental de CeSAC 41, psiquiatría y psicología de CeSAC 47), odontología, ecografía, laboratorio, farmacia, salud sexual y el resto, y la guardia oftalmológica de Santa Lucía.

## 2. Qué cambió (diff resumido)

**Datos** (`client/src/data/resources/places/ar-c.json`, 6 prestaciones; el resto del archivo no cambia, línea por línea):
- `cesac-3/atencion-primaria`, `cesac-41/atencion-primaria`, `cesac-47/atencion-primaria`, `cesac-47/pediatria`: se agregan `cost: "free"`, `requirements` (empadronamiento para pedir turno), `appointment` (`mode: "unknown"` y los canales para pedir turno) y `source` propia (Ley 153 de la Ciudad, con la ficha del CeSAC y la fecha de consulta en la nota). **Sin `costNote`, sin horarios, sin edades, sin `audience`.**
- `cesac-3/vacunacion`, `cesac-41/vacunacion`: `cost: "free"`, `costNote` (alcance normativo) y `source` propia (Ley 27.491, con Resolución 339/2026, la página del Ministerio y las páginas de la sede en la nota). **Sin horarios cargados, sin requisitos, sin `appointment`.**
- Copia del servidor regenerada con `resources:sync` (`server/src/main/resources/data/resources.json`).
- No se tocaron: vacunación de CeSAC 47, salud mental, centros veterinarios (no están en los datos), contactos, direcciones, coordenadas, verificación de ningún establecimiento.

**Código** (dos cambios chicos en la lógica compartida, descritos en §4; revertibles si no los aprueban):
- `client/src/utils/places/filters.ts`: la búsqueda con palabras de gratuidad («odontología gratuita») exige que la prestación gratuita sea de la que se habla.
- `client/src/utils/places/placeView.ts`: «cómo pedir turno» sin saber si hace falta turno ya no cuenta como información de turnos conocida.

**Pruebas:**
- Nuevas y actualizadas: `lote1-propuesta.test.mjs` (12 pruebas; ahora comprueba que los datos reales tienen *exactamente* esas 8 prestaciones gratuitas y que las excluidas siguen sin confirmar), `places-filters.test.mjs`, `places-explorer.test.mjs`.
- Las pruebas que usaban a los CeSAC como ejemplo de «sin costo informado» pasaron a usar una copia sin lo agregado por el lote; los conteos (2 → 5 lugares con gratuidad) se actualizaron.

## 3. Comprobaciones previas a marcar cada prestación como gratuita (condición 2)

Antes de aplicar, volví a leer en vivo las páginas oficiales y comprobé, para cada ficha, la norma y la ficha de la sede a la vez:

| Ficha | Norma (cita comprobada en vivo) | Sede (cita comprobada en vivo) | Resultado |
|---|---|---|---|
| L1-AP-3 | Ley 153: «exención de cualquier forma de pago directo» y «sin excepción» | Ficha CeSAC 3: «Clínica médica» | Coinciden |
| L1-AP-41 | ídem | Ficha CeSAC 41: «Medicina General», «Pediatría» | Coinciden |
| L1-AP-47 | ídem | Ficha CeSAC 47: «Medicina General» | Coinciden |
| L1-AP-47-PED | ídem | Ficha CeSAC 47: «Pediatría» | Coinciden |
| L1-VAC-3 | Ley 27.491: «Gratuidad de las vacunas y del acceso a los servicios de vacunación»; grupos de riesgo | Ficha CeSAC 3 («vacunación») y página de vacunatorios («CeSac 3») | Coinciden |
| L1-VAC-41 | ídem | Ficha CeSAC 41 («Vacunatorio») y página de vacunatorios («CeSac 41») | Coinciden |

**Discrepancias entre norma y ficha: ninguna.** Las discrepancias que sí hay están en §5.

## 4. Controles sobre cada condición

- **Atención primaria y pediatría (3):** no se inventó ningún horario, edad, demanda espontánea ni disponibilidad. El `appointment.mode` queda «unknown». El texto dice: «Canales para pedir turno según el trámite oficial de la Ciudad: web de turnos, Boti (WhatsApp de la Ciudad), 147 opción 1 o en el propio centro. Esto no confirma que haya turnos disponibles ni que siempre haga falta turno: no sabemos si se atiende sin turno». Lo comprobé en Chrome en los tres CeSAC.
- **Vacunación (4):** «Gratuita con condiciones» y el texto «La gratuidad alcanza a las vacunas del Calendario Nacional de Vacunación, a las recomendadas para grupos de riesgo y a las de emergencia sanitaria. No hay información sobre qué vacunas aplica este vacunatorio, sobre su disponibilidad ni sobre otras vacunas». No afirma que el CeSAC ofrezca todas las vacunas ni que haya stock.
- **Condición 9 y el aviso al público (cambio de código 2):** al probar, descubrí que el panel dejaba de decir «todavía no tenemos información de turnos» apenas la prestación tenía los canales para pedir turno (con `mode: "unknown"`). Eso podía leerse como que los turnos estaban confirmados. Ahora el aviso sigue diciendo «Todavía no tenemos horarios ni información de turnos verificados: llamá antes de ir» en los CeSAC 3 y 47, y «información verificada sobre turnos» en el 41 (que ya tenía un horario general).
- **Búsqueda con gratuidad (cambio de código 1):** al aplicar el lote, «odontología gratuita» devolvía los tres CeSAC (que ahora tienen *alguna* prestación gratuita y, aparte, una odontología sin confirmar). La búsqueda con palabras de gratuidad ahora exige que la prestación gratuita sea de la que se habla: devuelve solo los dos hospitales. El filtro de gratuidad sin texto no cambia. Cubierto por pruebas.

## 5. Discrepancias y límites detectados (para decidir, no se corrigieron)

1. **El horario de vacunación del CeSAC 41 ya estaba cargado.** Las fichas del lote 1 daban a entender que no había horarios de vacunación cargados; en realidad el servicio `cesac-41/vacunacion` ya tenía el horario publicado por la Ciudad (lun, mié, jue y vie de 8 a 12 y de 13 a 17; martes de 8 a 12 y de 14 a 17), cargado antes de esta etapa y respaldado por la página de vacunatorios. **No lo toqué** (no es una de las seis modificaciones aprobadas). Mi ficha y el documento de control decían lo contrario para el CeSAC 41: queda corregido en esta nota. Dos consecuencias: (a) el horario de vacunación del CeSAC 3 sigue sin cargar, como pidieron; (b) para el CeSAC 41 el panel ya muestra ese horario. Decidan si lo dejan.
2. **Evidencia visible en el panel.** El modelo guarda **una sola fuente por prestación** (`source`: organización, URL, fecha de consulta, nota). La norma de gratuidad quedó como enlace visible de la prestación, y la ficha oficial de la sede sigue visible como «Fuente oficial» del establecimiento. Las demás referencias (página de vacunatorios, trámite de turnos, Resolución 339/2026, página del Ministerio, página del Hospital Argerich) están **completas en la nota** de la fuente de cada prestación, con URL y fecha, pero **la nota no se muestra** en el panel. En el CeSAC 41 eso significa que el enlace a la página de vacunatorios, que antes se veía como fuente del vacunatorio, ya no se ve (queda en la nota). No se perdió ninguna evidencia en los datos, pero sí un enlace visible. Para conservar todos los enlaces visibles hace falta un cambio de modelo (propuesta: campo opcional `evidence: [{ tipo, url, fecha, cita }]`, que se muestre como lista de fuentes). No lo implementé.
3. **Nota informativa:** el panel muestra «Atención gratuita. La gratuidad alcanza a…» (el texto del sistema antepone «Atención gratuita» a la condición cuando hay `costNote`). Se lee bien, pero la condición queda después del título: si prefieren otro orden, es un cambio de `placeView.ts`.
4. **El «horario general» de CeSAC 41** (lun–vie 8–18 h) viene de la página del Hospital Argerich y ya estaba cargado; sin cambios.
5. **Java:** `mvn test` pasa 58 de 59. La que falla, `ServerApplicationTests.contextLoads`, necesita una clave de proveedor de IA real y falla igual antes de este cambio (está en los registros anteriores). `ResourceCatalogTest` (28 pruebas) pasa con los datos nuevos.
6. **Auxi (chat):** al estar estas prestaciones como gratuitas en la copia del servidor, Auxi puede mencionarlas. No toqué el chatbot; falta revisar qué responde (en particular que la vacunación gratuita es solo la del Calendario).

## 6. Resultados de las pruebas

- `npm run test:ci` completo: structure 11, mental 9, sexual 13, animal 11, lote1 12, places 101, health 32, curation 77, emergency 30, help 5, más `resources:check` y `curation:check`. **Todo pasa.**
- TypeScript (`tsc`) y `oxlint`: sin errores. `npm run build`: compila.
- Chrome (puppeteer, 320, 390 y 1280 px): **0 fallas, sin errores de consola, sin desborde horizontal.** Se comprobó en los tres anchos:
  - las seis prestaciones muestran la clasificación correcta;
  - las pendientes (vacunación del CeSAC 47, salud mental, odontología y el resto) siguen en «Gratuidad no confirmada»;
  - el filtro de gratuidad confirmada muestra 5 lugares (los 3 CeSAC y los 2 hospitales), y en el CeSAC 47 destaca solo medicina general y pediatría;
  - «odontología gratuita» muestra solo los 2 hospitales;
  - las condiciones de vacunación son visibles y no hay horarios de vacunación en el CeSAC 3 ni texto de vacunación en el 47;
  - ningún panel dice «Podés ir sin turno» ni promete turnos; en los CeSAC 3 y 47 el aviso dice que falta el horario.
- Java: ver §5, punto 5.

## 7. Capturas

En `capturas/` (carpeta de esta nota; el juego completo, con los tres anchos, está en `%TEMP%\audit20\`):
- `390-lista.png`: tarjetas de los seis lugares con la clasificación de cada prestación.
- `390-filtro-gratuito.png` y `1280-filtro-gratuito.png`: filtro de gratuidad confirmada.
- `390-panel-cesac-3.png`, `1280-panel-cesac-3.png`: panel de CeSAC 3 con el aviso de horarios y turnos.
- `320-panel-cesac-47.png`: panel de CeSAC 47 a 320 px.
- `320-vacunacion-cesac-3.png`, `390-vacunacion-cesac-41.png`: condiciones de vacunación.
