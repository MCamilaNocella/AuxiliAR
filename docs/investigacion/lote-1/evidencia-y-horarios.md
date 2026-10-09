# Horarios por prestación y fuentes oficiales visibles

Fecha: 9/10/2026. Rama local `feature/map-first-batch-evidence-hours` (desde `feature/map-first-batch-implementation`). Sin push ni PR. No se agregaron establecimientos ni prestaciones, y no se modificó el servidor ni el chatbot.

## 1. Horarios: general y por prestación

**Cómo se representaba.** Un establecimiento tiene `hours` («Horario general», se muestra en «Cómo atenderte» con la aclaración «no es el de cada servicio»). Una prestación puede tener `hours` propio, y `hours: null` significa «no se sabe» (no hereda). El modelo **sí puede distinguir** el horario de vacunación del horario general: el del CeSAC 41 es un `hours` de la prestación `vacunacion`, y las demás prestaciones del CeSAC 41 tienen `hours: null`. Por eso **no hizo falta tocar ni ocultar ese dato**.

**Dos ambigüedades reales que sí corregí (mínimo y compatible con los datos):**
1. **Etiqueta.** El horario de una prestación se mostraba como «Horario:», sin decir de cuál. Ahora dice **«Horario de vacunatorio»** (y en general «Horario de {prestación}»). El horario del establecimiento sigue como «Horario general».
2. **Aviso «todavía no tenemos el horario».** Se apagaba si *una sola* prestación tenía horario. Es lo que había anticipado como limitación L1: el horario de vacunación podía hacer creer que se conocía el de medicina general o salud mental. Ahora el horario se considera conocido si el establecimiento tiene horario general **o** si *todas* las prestaciones tienen el suyo.

**No se modificó ningún horario**: ni el de vacunación del CeSAC 41 (conservado tal cual, con su fuente), ni el general, ni el de otras prestaciones. El horario de vacunación del CeSAC 3 sigue sin cargar. Los horarios publicados de ambos están en [fichas-lote-1.md](fichas-lote-1.md) y en `deferredHours` de la propuesta.

| Dato | Cómo se ve ahora |
|---|---|
| Horario del establecimiento (CeSAC 41: lun–vie 8 a 18 h) | «Horario general» en «Cómo atenderte», con «no es el de cada servicio» |
| Horario de vacunación (CeSAC 41) | «Horario de vacunatorio», dentro de la prestación Vacunatorio |
| Medicina general, salud mental, odontología… del CeSAC 41 | sin horario propio: no se les atribuye ninguno |
| CeSAC 3 y 47 | sin horarios; el aviso pide llamar antes de ir |

## 2. Campo opcional `evidence`

**Qué es.** Lista opcional en cada prestación: `{ kind, organization, url, retrievedAt, note? }`. `kind` dice qué respalda esa fuente y nada más:

| kind | Respalda | Texto en el panel |
|---|---|---|
| `cost` | la gratuidad | «Respalda la gratuidad de: …» |
| `scope` | hasta dónde llega la gratuidad (qué vacunas) | «Dice hasta dónde llega la gratuidad de: …» |
| `existence` | que la sede ofrece la prestación | «Confirma que la sede ofrece: …» |
| `access` | cómo pedir turno | «Explica cómo pedir turno para: …. **No confirma que haya turnos disponibles**» |
| `hours` | el horario publicado | «Publica el horario de: …» |

**Compatibilidad.**
- Es opcional: una prestación sin `evidence` se resuelve a lista vacía, no muestra «Fuentes oficiales» y conserva su enlace de fuente como antes.
- **No reemplaza ni sobrescribe `source`**: las seis prestaciones conservan su fuente original con su nota (prueba).
- La validación la acepta, y rechaza: una fuente repetida (mismo `kind` y enlace), un enlace que no sea http(s), un `kind` desconocido, una clave de más, una fecha inexistente, y una prestación `free` con `evidence` pero sin ninguna de `kind: "cost"`.
- **El servidor no cambia.** La copia del servidor (`resources.json`) no incluye `evidence`: el servidor no la usa y así su archivo y su lectura quedan como estaban (prueba). Auxi no ve este campo.

**Cómo se ve.** En el detalle del lugar, antes del cuadro «Información verificada por AuxiliAR», una sección **«Fuentes oficiales»**: cada enlace **una sola vez** (se abre en una pestaña nueva), con una línea por lo que respalda y para qué prestaciones. Ejemplo (CeSAC 47): «Ley 153: Respalda la gratuidad de: Medicina general y Pediatría» (un solo enlace para las dos prestaciones); «ficha del CeSAC Nº 47: Confirma que la sede ofrece: Medicina general y Pediatría»; «trámite Solicitud de turnos en CESAC: Explica cómo pedir turno para: Medicina general y Pediatría. No confirma que haya turnos disponibles».
- Sin repeticiones: si la ficha del establecimiento ya está en la lista, no se vuelve a mostrar en el cuadro de verificación; las prestaciones con `evidence` no repiten el enlace «Fuente:» dentro de su bloque. Una misma página que respalda dos cosas (la página de vacunatorios: existencia y horario del CeSAC 41) es un solo enlace con dos líneas.
- Una norma general respalda **solo** la gratuidad. Las fuentes de turnos nunca figuran como prueba de disponibilidad.

**Aplicado a las seis prestaciones del lote 1 y a ninguna otra.** Fuentes por prestación:
- Atención primaria y pediatría: Ley 153 (`cost`), ficha del CeSAC (`existence`), trámite de turnos (`access`); en el CeSAC 41, además, la página del Hospital Argerich (`access`).
- Vacunación: Ley 27.491 (`cost`), Resolución 339/2026 y página del Calendario del Ministerio (`scope`), ficha del CeSAC y página de vacunatorios (`existence`); en el CeSAC 41, la página de vacunatorios también como `hours`.
- Todas con URL, organización y fecha de consulta (8/10/2026).

## 3. Pruebas de gratuidad y búsqueda (nuevas, `places-evidence.test.mjs`, 14 pruebas)

- «Odontología gratuita» devuelve solo los 2 hospitales, no los CeSAC (su odontología no está confirmada).
- Otras especialidades con el mismo criterio: «vacunación gratuita» → CeSAC 3 y 41 (no el 47); «pediatría gratuita» → CeSAC 47; «medicina general gratuita» → 41 y 47; psicología, psiquiatría, salud mental, ecografía, farmacia, laboratorio, anticonceptivos, VIH y oftalmología gratuitas → nada.
- Prueba general: para cualquier palabra de cualquier prestación, todo resultado de «{palabra} gratuita» tiene una prestación confirmada gratuita de la que se habla.
- Centro mixto (CeSAC 47): la tarjeta marca gratuitas solo medicina general y pediatría, con cualquier filtro; las demás quedan en «Gratuidad no confirmada» sin insignia.
- Gratuidad con condiciones: el panel muestra la condición («Calendario Nacional…, no hay información sobre qué vacunas aplica…, ni su disponibilidad») y los requisitos; la gratuidad simple muestra sus requisitos y ninguna condición.
- Horarios: los de una prestación no se atribuyen a otras ni a otros CeSAC; el aviso sigue pidiendo llamar si falta el horario de otras prestaciones.
- Fuentes: ver §2 (compatibilidad, validación, un enlace una vez, norma solo gratuidad, turnos sin confirmar disponibilidad).

Se actualizaron además dos pruebas del lote 1 (`lote1-propuesta.test.mjs`) que fijaban la limitación del aviso de horarios, ya corregida, y el campo permitido `evidence`.

## 4. Control de calidad

- `npm run test:ci` completo (incluye `resources:check` y `curation:check`): **todo pasa** (places: 115 pruebas; lote1: 12; el resto sin cambios).
- `resources:test` (excluido de `test:ci` por intermitente): 33 de 33 en esta corrida.
- `tsc`, `oxlint` y `npm run build`: sin errores.
- **Chrome a 320, 390 y 1280 px, detalle de CeSAC 3, 41 y 47: 0 fallas, sin errores de consola, sin desborde.** Se comprobó: «Fuentes oficiales» con enlaces verificables que se abren en pestaña nueva y no se repiten; fuente de gratuidad separada de la de existencia; la fuente de turnos aclara que no confirma disponibilidad; la norma no aparece como prueba de turnos; en el CeSAC 41 «Horario general» y «Horario de vacunatorio» se dicen aparte y hay un solo horario por prestación; CeSAC 3 y 47 sin horarios; condiciones de vacunación visibles en CeSAC 3 y 41; CeSAC 47 sin fuentes ni texto de vacunación; los filtros siguen bien (gratuidad: 5 lugares; «odontología gratuita»: 2; «vacunación gratuita»: CeSAC 3 y 41).
- Capturas: [capturas-evidencia/](capturas-evidencia/) (completas en `%TEMP%\audit21\`).

## 5. Incompatibilidades y límites detectados

1. **Servidor sin `evidence` a propósito.** Es una decisión de compatibilidad, no un olvido: si más adelante se quiere que Auxi cite estas fuentes, hay que ampliar el servidor (fuera de esta tarea).
2. **Pendiente técnico separado (no se tocó): `ServerApplicationTests.contextLoads` de Java falla.** Necesita credenciales reales del proveedor de IA (`NVIDIA_API_KEY` u `OPENROUTER_API_KEY`); sin ellas el contexto de Spring no arranca («At least one credential source must be specified»). Falla igual antes y después de todos los cambios de esta rama y las anteriores; las otras 58 pruebas de Java pasan. Propuesta para otra tarea: que esa prueba use una configuración de prueba (clave ficticia y cliente simulado) en lugar de depender del entorno.
3. **El texto «Atención gratuita. La gratuidad alcanza a…»** (el sistema antepone «Atención gratuita» al texto de condición) se mantiene como estaba; se lee bien pero si prefieren otro orden es un cambio de `placeView.ts`.
4. **El horario general del CeSAC 41** (de la página del Hospital Argerich) sigue siendo del establecimiento, no de cada prestación; se dice así en el panel. No se confirmó con el centro.
5. **Observación visual sin tocar:** a 320 px el botón «Cerrar» del panel queda pegado al borde derecho. No genera desborde horizontal ni viene de este cambio; lo anoto por si quieren revisarlo.
