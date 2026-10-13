# Propuesta del lote caba-2: para revisión (NO publicado)

Datos: Centros de Salud y Acción Comunitaria (CESAC) (descarga 2026-10-07, actualizado 2026-10-02, CC-BY-2.5-AR); Hospitales de la Ciudad de Buenos Aires (descarga 2026-10-07, actualizado 2026-10-02, CC-BY-2.5-AR). Páginas oficiales de buenosaires.gob.ar leídas el 2026-10-07 (CC-BY-2.5-AR).
Verificación: 2026-10-07, próxima revisión 2027-01-05 (90 días), por equipo-auxiliar.

**Nada de esto está publicado.** Esta propuesta supone aprobadas solo las equivalencias que el mapeo marca como claras (`proposal: approvable`); hasta que una persona las apruebe, el pipeline no publica ninguna prestación.

## Resumen

| Grupo | En la fuente | Ya publicados | Propuestos | Revisión manual |
|---|---|---|---|---|
| CeSAC | 50 | 33 | 10 | 7 |
| Hospitales Generales de Agudos | 14 | 12 | 1 | 1 |
| Otros hospitales | 22 | 7 | 0 | 15 |

- Con coordenadas (irían al mapa): 10 CeSAC y 1 hospitales propuestos.
- No se afirma gratuidad, horarios, turnos ni requisitos. Única excepción: la guardia 24 h de los Hospitales Generales de Agudos, que una página oficial afirma textualmente (con su cita).

## Prestaciones verificables propuestas

CeSAC (la lista sale de la página oficial de cada CeSAC, que completa lo que el dataset corta):

| Prestación | CeSAC |
|---|---|
| Atención primaria / clínica médica | 10 |
| Atención de salud mental | 9 |
| Odontología | 8 |
| Salud sexual y reproductiva | 8 |
| Atención de especialidades | 7 |
| Vacunación | 6 |
| Testeo y atención de ITS | 5 |
| Farmacia | 5 |
| Atención de IVE/ILE | 4 |
| Diagnóstico por imágenes | 2 |
| Atención del embarazo | 1 |
| Laboratorio | 1 |

Hospitales Generales de Agudos:

| Prestación | Hospitales |
|---|---|
| Guardia (24 h, todos los días: lo dice la página oficial) | 1 |

## CeSAC propuestos

| Clave | Id | CeSAC | Dirección | Teléfonos | Prestaciones | A reconocer |
|---|---|---|---|---|---|---|
| 15 | cesac-15 | CeSAC Nº 15 | Humberto 1° 470 (dataset) | 2821-3615 (Principal) | Atención primaria / clínica médica, Atención de salud mental, Odontología, Diagnóstico por imágenes | — |
| 21 | cesac-21 | CeSAC Nº 21 | Ulla Ulla 2839 (página oficial) | 2821-3621 (Principal) | Diagnóstico por imágenes, Atención de especialidades, Atención primaria / clínica médica, Odontología, Atención de salud mental, Vacunación, Salud sexual y reproductiva, Testeo y atención de ITS | address-from-page-only |
| 23 | cesac-23 | CeSAC Nº 23 | Bacacay 5640 (página oficial) | 2821-3623 (Principal) | Atención primaria / clínica médica, Atención de especialidades, Atención de salud mental, Odontología, Farmacia, Salud sexual y reproductiva, Vacunación | — |
| 24 | cesac-24 | CeSAC Nº 24 | Pasaje L 2300 (página oficial) | 2821-3624 (Principal), 4637-2002 (Alternativo) | Atención primaria / clínica médica, Atención de salud mental, Odontología, Testeo y atención de ITS, Salud sexual y reproductiva | address-from-page-only |
| 25 | cesac-25 | CeSAC Nº 25 | Vicuña 1432 (página oficial) | 2821-3625 (Principal) | Atención primaria / clínica médica, Atención del embarazo, Farmacia, Salud sexual y reproductiva, Atención de IVE/ILE | address-from-page-only |
| 27 | cesac-27 | CeSAC Nº 27 | Arias 3781 (página oficial) | 2821-3627 (Principal), 4543-2998 (Alternativo) | Atención primaria / clínica médica, Atención de salud mental, Odontología, Farmacia, Atención de especialidades, Vacunación, Salud sexual y reproductiva, Testeo y atención de ITS | — |
| 29 | cesac-29 | CeSAC Nº 29 | Av Gral Paz 15378 (página oficial) | 2821-3629 (Principal), 4601-7973 (Alternativo) | Atención primaria / clínica médica, Atención de especialidades, Atención de salud mental, Vacunación, Atención de IVE/ILE, Testeo y atención de ITS, Salud sexual y reproductiva | address-from-page-only |
| 31 | cesac-31 | CeSAC Nº 31 | Ana María Janer 262 (página oficial) | 2821-3631 (Principal), 4919-3994 (Principal) | Farmacia, Atención de especialidades, Atención primaria / clínica médica, Odontología, Laboratorio, Atención de salud mental, Testeo y atención de ITS, Atención de IVE/ILE, Vacunación, Salud sexual y reproductiva | address-from-page-only |
| 37 | cesac-37 | CeSAC Nº 37 | Av. los Corrales 6999 (página oficial) | 2821-3637 (Principal), 11 6167-5010 (Alternativo) | Atención primaria / clínica médica, Atención de especialidades, Atención de salud mental, Odontología, Farmacia, Salud sexual y reproductiva, Atención de IVE/ILE, Vacunación | — |
| 45 | cesac-46 | CeSAC Nº 46 | Av. Regimiento de Patricios 1941 (página oficial) | 4302-5950 (Principal), 11 3942-2569 (Alternativo) | Odontología, Atención primaria / clínica médica, Atención de especialidades, Atención de salud mental | — |

## CeSAC que requieren revisión manual

| Clave | CeSAC | Dirección en el dataset | Por qué no se propone |
|---|---|---|---|
| 2 | CeSAC Nº 2 | Terrada 5850, Barrio Albarellos | la dirección del dataset y la de la página oficial no coinciden |
| 7 | CeSAC Nº 7 | 2 De Abril De 1982 y Montiel, Barrio Piedrabuena | la dirección del dataset es una esquina o un texto sin calle y altura, y no hay página oficial que la aclare |
| 18 | CeSAC Nº 18 | Corvalan y Fernandez De La Cruz, F., Gral. Av., Barrio 20 | la calle está escrita al revés en el dataset y no hay página oficial que la confirme; el dataset corta la lista de especialidades y no hay página oficial que la complete |
| 30 | CeSAC Nº 30 | Alcorta, Amancio Av. y Iguazu, Barrio 21-24 | la dirección del dataset y la de la página oficial no coinciden; la calle está escrita al revés en el dataset y no hay página oficial que la confirme |
| 91 | CeSAC Nº 49 | Orma y Magaldi, Agustin | la dirección del dataset es una esquina o un texto sin calle y altura, y no hay página oficial que la aclare; ninguna prestación con equivalencia clara (la página oficial no existe o no lista nada mapeable) |
| 92 | CeSAC Nº 50 | Lastra Av. 4180 | ninguna prestación con equivalencia clara (la página oficial no existe o no lista nada mapeable) |
| 93 | CeSAC Nº 42 | La Plata Av. 2241 | ninguna prestación con equivalencia clara (la página oficial no existe o no lista nada mapeable) |

## Hospitales Generales de Agudos

Fuente de la guardia: «Hospitales Generales de Agudos», buenosaires.gob.ar: «los 14 hospitales cuentan con guardia las 24 hs del día los 365 días del año». No dice que sea sin turno ni gratuita: no se afirma.

| Hospital | Estado | Dirección | Teléfonos | Motivo |
|---|---|---|---|---|
| Hospital General de Agudos J. A. Penna | propuesto | Pedro Chutro 3380 (página oficial) | 4911-5555 | — |
| Hospital General de Agudos D. Velez Sarsfield | revisión manual | Calderon de la Barca, Pedro 1550 (dataset) | 4639-8700 | la dirección del dataset y la de la página oficial no coinciden; la calle está escrita al revés en el dataset y no hay página oficial que la confirme |

La guardia de salud mental de estos hospitales (página «Guardias hospitalarias») queda como **dudosa**: la página los lista pero no aclara si el teléfono de guardia es el de salud mental. No se propone.

## Otros hospitales

22 hospitales especializados e institutos de la fuente (7 ya publicados): **ninguno se propone**. El dataset da una sola "especialidad" por hospital, sin horarios ni guardia confirmada, y no se infieren prestaciones desde el tipo de hospital.

## Cobertura geográfica (por comuna)

| Comuna | Ya publicados | Propuestos |
|---|---|---|
| Comuna 1 | 1 | 3 |
| Comuna 2 | 3 | 0 |
| Comuna 3 | 4 | 0 |
| Comuna 4 | 13 | 2 |
| Comuna 5 | 2 | 0 |
| Comuna 6 | 1 | 0 |
| Comuna 7 | 6 | 1 |
| Comuna 8 | 7 | 2 |
| Comuna 9 | 4 | 1 |
| Comuna 10 | 1 | 1 |
| Comuna 11 | 2 | 0 |
| Comuna 12 | 2 | 1 |
| Comuna 13 | 0 | 0 |
| Comuna 14 | 4 | 0 |
| Comuna 15 | 2 | 0 |

## Cómo se aplicaría

1. Revisar y aprobar las entradas del mapeo (`curation/proposals/caba-cesac.mapping-review.md`): `approved: true`, `approvedBy`, `approvedAt`.
2. Aprobar las afirmaciones de guardia (`curation/supplements/caba-hospitales.claims.json`, `approved: true`).
3. Completar `reviewer` y `decidedAt` de las decisiones de `caba-2.decisions.proposed.json` que se acepten y copiarlas a `curation/decisions/ar-c.decisions.json`.
4. `npm run curation -- publish AR-C` (simulación), después `--write` y `npm run resources:sync`.
