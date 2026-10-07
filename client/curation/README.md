# Pipeline de curación (v0)

Cómo llegan a la Base AuxiliAR (`src/data/resources/places/<provincia>.json`) los establecimientos de los datasets oficiales **sin escribirlos a mano y sin pisar lo que ya curamos**.

> **Estado: lote CABA 2 propuesto, no publicado.** Está la infraestructura, las dos fuentes de CABA (CeSAC y Hospitales), las páginas oficiales que las complementan, la reproyección y los tests. **No se publicó ningún establecimiento nuevo**: los 6 de `ar-c.json` son los mismos de siempre (con `externalIds`, y con las coordenadas oficiales reproyectadas de los 3 hospitales). El lote nuevo está **propuesto** en `proposals/` para revisión editorial; las tablas de mapeo siguen en borrador (nada aprobado).

## Idea en una línea

```
dataset oficial → (ingest) → normalizado → (candidates) → candidato → [decisión de una persona] → (publish) → places/<prov>.json
```

Un **candidato** es un registro oficial revisado por reglas, **no un lugar publicado**: vive en `curation/candidates/`, nunca en `src/`, y no entra al bundle ni al servidor. Solo una **decisión con nombre, fecha y motivo** lo convierte en lugar.

## Carpetas

```
curation/
  sources/<fuente>.source.json   manifiesto: URL, organismo, LICENCIA y ATRIBUCIÓN (obligatorias), formato, CRS, sha256 de la descarga
  mappings/<fuente>.json         tablas revisadas por humanos: tipo de establecimiento y especialidad → tipo de prestación
  crs/epsg-9498.json             definición del CRS (copiada del registro EPSG, con sus URLs)
  normalized/<fuente>.json       snapshot normalizado (y .prev.json con el anterior): la base para comparar descargas
  candidates/<prov>.candidates.json   GENERADO. Candidatos con tier, avisos y procedencia
  decisions/<prov>.decisions.json     CURACIÓN HUMANA: link / apply / accept / reject / defer
  batches/<lote>.batch.json      fecha de verificación, quién verifica y próxima revisión de un lote
  id-map.json                    clave oficial → id AuxiliAR. Un id asignado no cambia nunca
  reports/                       informes por fuente (resumen, avisos, cambios, propuestas)
  raw/                           descargas crudas. NO van en git: el sha256 está en el manifiesto
scripts/curation/                el código (adaptadores, normalización, candidatos, publish, CLI)
```

## Comandos (desde `client/`)

| Comando | Qué hace |
|---|---|
| `npm run curation -- profile <fuente> [--write]` | Mira el archivo antes de decidir cómo leerlo: columnas, nulos, claves repetidas, coherencia del CRS, vocabulario de especialidades. No escribe nada (salvo `--write`: un informe). |
| `npm run curation -- ingest <fuente> <archivo> --retrieved-at=AAAA-MM-DD [--official-updated-at=…]` | Registra una descarga: la copia a `raw/`, guarda su sha256 y rechaza páginas de error del portal. |
| `npm run curation -- normalize [<fuente>]` | Descarga cruda → snapshot normalizado (reproyecta las coordenadas si hace falta). |
| `npm run curation -- pages <fuente> --retrieved-at=AAAA-MM-DD` | Descarga las páginas oficiales que complementan un dataset y guarda su texto como evidencia (`supplements/`). Es lo único que usa la red. |
| `npm run curation -- proposal <AR-C> --batch=<lote>` | Propuesta de un lote para revisión editorial: informe, decisiones sin efecto y tabla de mapeos. No publica nada. |
| `npm run curation -- candidates <AR-C>` | Genera candidatos, `id-map.json` e informes. Nada se publica. |
| `npm run curation -- publish <AR-C> [--write]` | Aplica las **decisiones**. Sin `--write` simula. Valida con el validador real antes de escribir. Después: `npm run resources:sync`. |
| `npm run curation -- attribution [--write]` | Lista de fuentes con licencia y atribución. |
| `npm run curation:check` | Coherencia de los archivos de curación (manifiestos, mapeos, lotes, `id-map`). Pensado para CI. |
| `npm run curation:test` | Tests del pipeline. |

Los portales de Buenos Aires Data rechazan pedidos sin `User-Agent` de navegador y responden **200 con una página de error**: `ingest` la detecta.

## Tiers y avisos

Cada candidato pasa controles. Los avisos tienen nivel: **fail** (T3, bloqueado), **warn** (T2, necesita una persona) e **info** (se muestra, no cambia el tier).

| Tier | Significa |
|---|---|
| T1 | Todo en orden |
| T2 | Algo es dudoso (dirección invertida o sin número, teléfono abreviado, lista de especialidades cortada, punto repetido o fuera del área, posible duplicado…). La decisión tiene que **reconocer cada aviso** y, si la dirección es dudosa, **escribir el valor correcto** (`overrides.address`). |
| T3 | No se puede publicar así: sin clave, sin nombre, sin dirección, clave repetida, choque de id. |

## Qué se publica y qué nunca se completa

- Un lugar nuevo sale **solo de lo que la fuente oficial dice**: nombre, dirección, teléfonos, coordenadas y las prestaciones que lista.
- **Nunca** se completan horarios (`hours: null` en cada prestación), gratuidad, turnos, requisitos ni audiencia. Que un hospital sea público **no** lo hace gratuito. La etiqueta "Guardia:" de un teléfono es solo una señal informativa: no crea una prestación de guardia ni dice que sea 24 h.
- Una prestación se publica solo si **una persona aprobó** su entrada en la tabla de mapeo (`approved: true`, con `approvedBy` y `approvedAt`). El tipo de establecimiento también tiene que estar aprobado.
- **Sin al menos una prestación aprobada el lugar sigue siendo un candidato y no se publica.**
- La verificación por lote (`batches/`) cubre **solo datos objetivos respaldados por la fuente**; así lo dice la nota de cada `verification`. Cada lugar queda con `verifiedAt`, `verifiedBy` y `nextReviewDue`.
- Las coordenadas se publican solo si pasaron todos los controles (en el área esperada, no repetidas, transformación válida).

## Coordenadas: reproyección reproducible

Los hospitales de CABA vienen en **EPSG:9498** (POSGAR 2007 / CABA 2019, metros). Se convierten con `proj4` (solo devDependency) y la definición de `crs/epsg-9498.json`, tomada del registro EPSG; no hay conversiones a mano. Cada coordenada reproyectada lleva `method: "official-dataset-reprojected"` y registra el CRS de origen y la herramienta. El orden de ejes de los datasets es *este, norte*; si vinieran invertidos, el punto cae fuera del área del CRS y se rechaza.

Los tests comprueban la transformación con: el origen del CRS, una implementación independiente (series de Snyder) sobre los 36 hospitales, el ida y vuelta, y puntos de control de USIG (geocodificador de la Ciudad) dentro de la tolerancia de una dirección. USIG es **solo un control**, nunca una fuente de coordenadas publicadas.

## Proteger la curación manual

`publish` es el único código que escribe en `places/`, y garantiza:

- Un lugar ya publicado **no se pisa**. Solo lo tocan estas decisiones explícitas:
  - `link`: agrega `externalIds` (exige evidencia de que es el mismo lugar: teléfono o dirección en común);
  - `apply`: reemplaza `address` o `coordinates` (nada más: horarios, prestaciones, contactos y verificación son curación manual).
- Después de aplicar, un invariante compara antes y después: si algo cambió sin una decisión que lo explique, **se aborta todo**.
- Se valida el resultado con el mismo validador de `resources:sync` **antes** de escribir.
- Al escribir se conserva el texto exacto de los lugares que no cambian: un `link` es una línea de diff.

## Actualizar un dataset oficial

1. Bajar el archivo nuevo → `ingest` → `normalize` (el snapshot anterior queda como `.prev.json`).
2. `candidates`: el informe muestra registros **nuevos**, **que ya no están** (posible baja: nunca se borra solo) y **cambiados**, y las **propuestas** sobre lugares ya publicados (punto distinto, teléfonos sin publicar…).
3. Una persona decide. Si la fila de una decisión cambió (`rowHash`), hay que volver a revisarla.

## Páginas oficiales que completan el dataset

Los datasets no alcanzan: el de CeSAC **corta la lista de especialidades a 254 bytes** y no trae programas; el de hospitales no trae prestaciones. Por eso cada fuente puede declarar `supplements` en su manifiesto, y `npm run curation -- pages <fuente> --retrieved-at=AAAA-MM-DD` descarga las páginas oficiales de buenosaires.gob.ar (CC-BY-2.5-AR) a `supplements/<fuente>.pages.json`. Se guardan **las líneas de texto de cada página** como evidencia (no el HTML); todo lo demás corre offline sobre eso. Es lo único del pipeline que usa la red.

- **Ficha del lugar** (cada CeSAC, cada hospital): confirma o contradice la dirección y los teléfonos, y su lista de especialidades y programas es la **fuente preferida de prestaciones** (está completa). Los horarios que una ficha escriba ("Horario de vacunatorio…") se guardan como texto en el candidato, **no se convierten en horarios**.
- **Página de un grupo**: la de los 14 Hospitales Generales de Agudos dice textualmente que tienen guardia las 24 hs los 365 días. Eso es una **afirmación (claim)** en `supplements/<fuente>.claims.json`: cada una cita la página y `curation:check` verifica que la cita esté en la página guardada. Una afirmación dudosa (`proposal: doubtful`) nunca se publica; ninguna se publica sin `approved: true` con `approvedBy`.
- Lo que la página **no** dice no se afirma: la guardia 24 h no implica "sin turno" ni "gratuita".

## Cómo se resuelven los conflictos (qué es automático y qué no)

| Caso | Qué hace el pipeline |
|---|---|
| La ficha da la misma dirección en forma clara (misma altura, calle parecida) | La usa. Es el único cambio automático de dirección. |
| El dataset trae una esquina sin altura y la ficha una altura | La ficha **precisa**, no confirma: aviso `address-from-page-only` que una persona reconoce. |
| Dataset y ficha dan otra altura u otra calle | `address-conflict`: **revisión manual**. |
| Dos páginas oficiales dan direcciones distintas (la lista de hospitales vs. la del hospital) | `address-list-differs`: **revisión manual**. |
| La ficha da teléfonos | Se publican **los de la ficha** (con etiqueta). Los del dataset que la ficha no tiene se informan, no se publican. |
| El teléfono principal no coincide entre las dos fuentes | `phone-differs` / `phone-conflict`: **revisión manual**. |
| Un número incompleto ("5079", "al 05") | Se informa, nunca se completa; los números completos sí se publican. |
| El dataset corta las especialidades y no hay ficha | `specialties-truncated`: **revisión manual**, nunca una lista parcial presentada como completa. |

## Propuesta de lote

`npm run curation -- proposal AR-C --batch=caba-2` escribe en `proposals/`:

- `<lote>.proposal.md`: qué se publicaría, qué requiere revisión manual y por qué, y la cobertura por comuna.
- `<lote>.decisions.proposed.json`: las decisiones `accept` que lo publicarían, con `reviewer` y `decidedAt` **vacíos a propósito** (`publish` las rechaza así). Se aplican solo si una persona las revisa, completa esos campos y las copia a `decisions/`.
- `<fuente>.mapping-review.md`: la tabla completa de términos para la revisión editorial.

La propuesta **supone aprobadas solo las equivalencias claras** (`proposal: approvable`); lo dudoso (`doubtful`) queda afuera. No cambia nada publicado.

## Qué falta para publicar el lote

1. Revisión editorial de los mapeos (`proposals/caba-cesac.mapping-review.md`): poner `approved: true` con `approvedBy`/`approvedAt` en lo que se acepte.
2. Aprobar las afirmaciones de guardia (`supplements/caba-hospitales.claims.json`).
3. Resolver o descartar los casos de revisión manual.
4. Completar `reviewer`/`decidedAt` de las decisiones propuestas que se acepten y copiarlas a `decisions/ar-c.decisions.json`; `publish` (simulación), `publish --write`, `resources:sync`.

Para otra provincia: un adaptador (`scripts/curation/adapters/`), un manifiesto y una tabla de mapeo.
