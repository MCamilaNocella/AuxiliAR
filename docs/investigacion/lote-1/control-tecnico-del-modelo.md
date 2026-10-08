# Control técnico: ¿el modelo separa gratuidad, condiciones y disponibilidad?

Fecha: 8/10/2026. **No se cambió código de la aplicación ni datos.** Se agregó una prueba (`client/scripts/lote1-propuesta.test.mjs`, comando `npm run lote1:test`, incluida en `test:ci`) que aplica la propuesta del lote 1 **en memoria** sobre una copia de los datos reales y comprueba lo que sigue. Resultado: **11 pruebas, todas pasan**; el conjunto aplicado pasa la misma validación que los datos reales.

## 1. Cómo separa hoy el modelo cada cosa

| Qué | Campo en la prestación (`Service`) | Cómo lo usa la app |
|---|---|---|
| **Gratuidad** | `cost` + la **fuente propia** con `source.note` | Solo cuenta como gratuita verificada si la prestación *misma* declara `cost: "free"` **y** trae su `source.note` (`isVerifiedFree`). Un `free` heredado del establecimiento no alcanza. Sin dato, es «Gratuidad no confirmada»; nunca se infiere. |
| **Condiciones de la gratuidad** | `costNote` | Si hay `costNote`, el chip pasa de «Atención gratuita» a **«Gratuita con condiciones»** y el panel muestra la condición. |
| **Condiciones de acceso** | `requirements` (qué llevar) y `audience` (para quién) | Aparecen en «Qué llevar o tener en cuenta» y «Para». No cambian el chip de gratuidad. |
| **Disponibilidad** | `hours` (horarios) y `appointment` (`mode`, `howTo`, `url`) | Nunca se infieren: `hours: null` o `mode: "unknown"` significan «no se sabe». «Podés ir sin turno» solo sale con `mode: "not-required"`. |

Pruebas del lote (todas verdes):
- Solo las prestaciones de la propuesta pasan a gratuidad verificada; el resto de cada CeSAC sigue sin confirmar (la prueba recorre todas las prestaciones de los tres centros).
- Atención primaria queda «Atención gratuita» **sin** `costNote` y con `appointment.mode` en «unknown»: ninguna promete atención sin turno.
- Vacunación queda «Gratuita con condiciones» y el texto de la condición nombra el Calendario Nacional y dice que no se sabe qué vacunas aplica la sede.
- El filtro «Gratuita» devuelve solo las prestaciones verificadas de cada CeSAC, no sus otras prestaciones.
- Los borradores veterinarios no se muestran (revisión pendiente) ni salen en el mapa (coordenadas sin verificar). Aprobados, salen **solo** en «Salud animal», como «Gratuita con condiciones» y «Con turno previo», solo con castración, y no en los filtros pensados para personas.

## 2. Que las prestaciones con condiciones no se presenten como universales
Verificado en la prueba: las dos de vacunación y las dos veterinarias muestran «Gratuita con condiciones» y nunca «Atención gratuita». La condición de la vacunación (solo ciertas vacunas) y la del turno veterinario van en el `costNote`, que es lo que el panel muestra.

## 3. Limitaciones del modelo que encontré (ninguna se corrigió: son propuestas)

**L1. El aviso «todavía no tenemos el horario verificado» es por sede, no por prestación.** `availabilityNotice` considera que el horario está «conocido» si *una sola* prestación del lugar tiene horario. Si se cargara el horario de vacunación del CeSAC 3, el aviso desaparecería también para atención primaria y salud mental, que no tienen horario: una falsa tranquilidad. La prueba lo demuestra. **Por eso la propuesta no carga los horarios de vacunación** (quedan en `deferredHours`). El CeSAC 41 ya tiene un horario *general* del establecimiento, así que su aviso ya se comporta así hoy (lo aclara su nota: «no es el de cada servicio»).
- *Propuesta (no implementada):* calcular el aviso por prestación, o mostrar el horario de cada prestación junto a ella y avisar por cada una que no lo tenga. Cambio chico en `placeView.ts`, con pruebas.

**L2. Una sola `source` por prestación.** La gratuidad de los CeSAC se apoya en una norma y la existencia de la sede en otra página. Hoy hay que elegir una URL principal y citar las demás dentro de `source.note` (así lo hace la propuesta: la URL es la norma, y la nota cita la ficha y la fecha de consulta). El panel solo muestra un enlace «Fuente».
- *Propuesta (no implementada):* un campo opcional `evidence: [{ kind: "gratuidad" | "existencia" | "acceso", url, retrievedAt, quote }]`. Es un cambio de esquema, validador y tipos; no urgente.

**L3. «Con condiciones» depende de que exista `costNote`.** No distingue una condición de *elegibilidad* (residencia, adscripción) de una de *procedimiento* (turno obligatorio). Hoy ambas caen en el mismo chip. Para el lote 1 sirve (ambas deben decirse), pero no se puede filtrar «sin requisito de residencia».
- *Propuesta (no implementada):* si el equipo quiere filtrar o resaltar la residencia, un campo estructurado `eligibility`. Ver también la propuesta de cobertura provincial.

**L4. `appointment.mode: "unknown"` con `howTo` cuenta como «turno conocido» para el aviso.** En atención primaria el `howTo` documenta los canales de turno (web, Boti, 147, presencial) sin que se sepa si hay demanda espontánea; eso apaga el aviso «información sobre turnos» y deja solo el de horario. Es aceptable (la información de los canales es cierta y está respaldada), pero conviene que el equipo lo sepa.

**L5. Fechas de las fuentes.** `source.retrievedAt` guarda el día de consulta; no hay un campo para «fecha de actualización de la fuente» porque las páginas de la Ciudad no la publican. La propuesta pone `retrievedAt: 2026-10-08` en cada fuente. La verificación del establecimiento (`verifiedAt`, `nextReviewDue`) no cambia: el equipo decide si refresca esas fechas al aprobar.

## 4. Efectos fuera del mapa (a revisar antes de publicar)
- **Auxi (chat):** el servidor lee `resources.json`. Al pasar a `free` estas prestaciones, Auxi podría decir que son gratuitas. No se tocó el chatbot. Conviene revisar qué dice Auxi sobre estas prestaciones con las condiciones (en particular, que la vacunación gratuita es solo la del Calendario) antes de publicar.
- **Copia del servidor:** al aplicar la propuesta hay que correr `npm run resources:sync` (regenera `server/.../resources.json`) y `resources:check`.
- **Pruebas que cambian al aplicar:** ninguna fija hoy cuáles prestaciones son gratuitas; sí fijan la cantidad de lugares de `ar-c.json` (6) si se cargan los dos centros veterinarios.

## 5. Qué se hace al aprobar (en una próxima etapa, no ahora)
1. Aplicar los `set` de `serviceChanges` aprobados en `ar-c.json` (solo esos campos).
2. Completar y aprobar los dos centros veterinarios (coordenadas y comuna) y recién ahí pasarlos a `verified`.
3. `npm run resources:sync`, `resources:check`, `curation:check`, `test:ci`; capturas a 320, 390 y 1280 px; revisar a Auxi.
