# Propuesta del lote caba-2: para revisión (NO publicado)

Datos: Centros de Salud y Acción Comunitaria (CESAC) (descarga 2026-10-07, actualizado 2026-10-02, CC-BY-2.5-AR); Hospitales de la Ciudad de Buenos Aires (descarga 2026-10-07, actualizado 2026-10-02, CC-BY-2.5-AR). Páginas oficiales de buenosaires.gob.ar leídas el 2026-10-07 (CC-BY-2.5-AR).
Verificación: 2026-10-07, próxima revisión 2027-01-05 (90 días), por equipo-auxiliar.

**Nada de esto está publicado.** Esta propuesta supone aprobadas solo las equivalencias que el mapeo marca como claras (`proposal: approvable`); hasta que una persona las apruebe, el pipeline no publica ninguna prestación.

## Resumen

| Grupo | En la fuente | Ya publicados | Propuestos | Revisión manual |
|---|---|---|---|---|
| CeSAC | 50 | 43 | 3 | 4 |
| Hospitales Generales de Agudos | 14 | 14 | 0 | 0 |
| Otros hospitales | 22 | 13 | 0 | 9 |

- Con coordenadas (irían al mapa): 3 CeSAC y 0 hospitales propuestos.
- No se afirma gratuidad, horarios, turnos ni requisitos. Única excepción: la guardia 24 h de los Hospitales Generales de Agudos, que una página oficial afirma textualmente (con su cita).

## Prestaciones verificables propuestas

CeSAC (la lista sale de la página oficial de cada CeSAC, que completa lo que el dataset corta):

| Prestación | CeSAC |
|---|---|
| Atención primaria / clínica médica | 3 |
| Atención de salud mental | 2 |
| Odontología | 2 |
| Farmacia | 2 |
| Salud sexual y reproductiva | 2 |
| Diagnóstico por imágenes | 1 |
| Atención de especialidades | 1 |
| Vacunación | 1 |
| Atención del embarazo | 1 |
| Atención de IVE/ILE | 1 |

Hospitales Generales de Agudos:

| Prestación | Hospitales |
|---|---|

## CeSAC propuestos

| Clave | Id | CeSAC | Dirección | Teléfonos | Prestaciones | A reconocer |
|---|---|---|---|---|---|---|
| 15 | cesac-15 | CeSAC Nº 15 | Humberto 1° 470 (dataset) | 2821-3615 (Principal) | Atención primaria / clínica médica, Atención de salud mental, Odontología, Diagnóstico por imágenes | — |
| 23 | cesac-23 | CeSAC Nº 23 | Bacacay 5640 (página oficial) | 2821-3623 (Principal) | Atención primaria / clínica médica, Atención de especialidades, Atención de salud mental, Odontología, Farmacia, Salud sexual y reproductiva, Vacunación | — |
| 25 | cesac-25 | CeSAC Nº 25 | Vicuña 1432 (página oficial) | 2821-3625 (Principal) | Atención primaria / clínica médica, Atención del embarazo, Farmacia, Salud sexual y reproductiva, Atención de IVE/ILE | address-from-page-only |

## CeSAC que requieren revisión manual

| Clave | CeSAC | Dirección en el dataset | Por qué no se propone |
|---|---|---|---|
| 18 | CeSAC Nº 18 | Corvalan y Fernandez De La Cruz, F., Gral. Av., Barrio 20 | la calle está escrita al revés en el dataset y no hay página oficial que la confirme; el dataset corta la lista de especialidades y no hay página oficial que la complete |
| 30 | CeSAC Nº 30 | Alcorta, Amancio Av. y Iguazu, Barrio 21-24 | la dirección del dataset y la de la página oficial no coinciden; la calle está escrita al revés en el dataset y no hay página oficial que la confirme |
| 91 | CeSAC Nº 49 | Orma y Magaldi, Agustin | la dirección del dataset es una esquina o un texto sin calle y altura, y no hay página oficial que la aclare; ninguna prestación con equivalencia clara (la página oficial no existe o no lista nada mapeable) |
| 93 | CeSAC Nº 42 | La Plata Av. 2241 | ninguna prestación con equivalencia clara (la página oficial no existe o no lista nada mapeable) |

## Hospitales Generales de Agudos

Fuente de la guardia: «Hospitales Generales de Agudos», buenosaires.gob.ar: «los 14 hospitales cuentan con guardia las 24 hs del día los 365 días del año». No dice que sea sin turno ni gratuita: no se afirma.

| Hospital | Estado | Dirección | Teléfonos | Motivo |
|---|---|---|---|---|

La guardia de salud mental de estos hospitales (página «Guardias hospitalarias») queda como **dudosa**: la página los lista pero no aclara si el teléfono de guardia es el de salud mental. No se propone.

## Otros hospitales

22 hospitales especializados e institutos de la fuente (13 ya publicados): **ninguno se propone**. El dataset da una sola "especialidad" por hospital, sin horarios ni guardia confirmada, y no se infieren prestaciones desde el tipo de hospital.

## Cobertura geográfica (por comuna)

| Comuna | Ya publicados | Propuestos |
|---|---|---|
| Comuna 1 | 2 | 2 |
| Comuna 2 | 3 | 0 |
| Comuna 3 | 4 | 0 |
| Comuna 4 | 19 | 0 |
| Comuna 5 | 2 | 0 |
| Comuna 6 | 2 | 0 |
| Comuna 7 | 7 | 0 |
| Comuna 8 | 10 | 0 |
| Comuna 9 | 5 | 0 |
| Comuna 10 | 2 | 1 |
| Comuna 11 | 3 | 0 |
| Comuna 12 | 4 | 0 |
| Comuna 13 | 0 | 0 |
| Comuna 14 | 4 | 0 |
| Comuna 15 | 3 | 0 |

## Cómo se aplicaría

1. Revisar y aprobar las entradas del mapeo (`curation/proposals/caba-cesac.mapping-review.md`): `approved: true`, `approvedBy`, `approvedAt`.
2. Aprobar las afirmaciones de guardia (`curation/supplements/caba-hospitales.claims.json`, `approved: true`).
3. Completar `reviewer` y `decidedAt` de las decisiones de `caba-2.decisions.proposed.json` que se acepten y copiarlas a `curation/decisions/ar-c.decisions.json`.
4. `npm run curation -- publish AR-C` (simulación), después `--write` y `npm run resources:sync`.
