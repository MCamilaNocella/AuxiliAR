# Recursos verificados

Una única fuente de verdad para los recursos de ayuda de AuxiliAR: líneas telefónicas hoy y, más adelante, hospitales, centros y otros servicios. De acá van a leer las categorías, el buscador, los mapas, Auxi y los botones de llamada.

> **Estado (verificación del 11/10/2026):** hay datos cargados y la app los usa.
> - **Mapa (`places/`):** **58 establecimientos con 175 servicios registrados**: 53 de la Ciudad de Buenos Aires (`places/ar-c.json`) y 5 de otras provincias (`ar-b.json`, `ar-f.json`, `ar-t.json`, `ar-x.json`). **151 de esos 175 servicios están visibles** para las personas según la verificación actual: son los que tienen la gratuidad documentada para esa prestación y siguen vigentes. Los otros 24 se conservan en los datos para investigaciones futuras, pero no se muestran. Todo esto cambia con la fecha: la prestación del Centro Fijo Veterinario Costanera Sur vence el 8/11/2026, la del Hospital Garrahan el 10/11/2026 y las demás el 5/1/2027.
> - **Líneas de ayuda (`lines/`):** 14 líneas en `lines/nacional.json`, que son la fuente única de los números (barra de emergencias, chat y botones de llamada; ver más abajo).
> - **Quién lee estos datos:** el mapa de Centros de atención y los botones de llamada. Un inventario fila por fila del mapa y una explicación de sus reglas están en `docs/investigacion/inventario-mapa-servicios.csv` y `docs/investigacion/estructura-del-mapa-y-reglas-de-inclusion.md`.
>
> (Hasta octubre de 2026 esta cabecera decía que todavía no había datos cargados: era de la etapa de infraestructura y quedó desactualizada.)

## Dónde está cada cosa

```
client/src/data/resources/        ← LO ÚNICO QUE SE EDITA
  README.md                       este archivo
  resource.schema.json            estructura de cada registro
  taxonomy.json                   valores permitidos (tipos, estados, provincias, áreas, categorías…)
  resources.types.ts              tipos de TypeScript
  index.ts                        cómo lo lee la app (consultas)
  lines/*.json                    líneas telefónicas (hoy: nacional.json, con 14 líneas). Van siempre en el build
  places/<provincia>.json         establecimientos, un archivo por provincia (ar-c.json, ar-b.json…). Se cargan bajo demanda
                                  (hoy: ar-c, ar-b, ar-f, ar-t y ar-x, con 58 establecimientos y 175 servicios; 151 servicios visibles)

client/scripts/resources-sync.mjs        valida y genera la copia del servidor
client/scripts/resources-validate.mjs    las reglas de validación
client/scripts/resources-resolve.mjs     herencia de las prestaciones y categorías derivadas
client/scripts/resources-sync.test.mjs   tests (datos de prueba en scripts/__fixtures__)

server/src/main/resources/data/resources.json   COPIA GENERADA para el servidor: no se edita
server/src/main/java/.../resources/             ResourceCatalog: la lee y valida al arrancar
```

El servidor se construye por separado (su Docker solo ve `server/`), por eso no puede leer la carpeta del cliente: recibe una copia generada, igual que `content-index.json`. **Se edita siempre acá, nunca la copia.**

## Cómo agregar o cambiar un recurso

1. Editá un archivo de `lines/` (líneas) o de `places/` (establecimientos), o creá uno nuevo. Si el archivo empieza con `"$schema": "../resource.schema.json"`, el editor (VS Code) te sugiere los campos y marca los errores mientras escribís.
2. Corré `npm run resources:sync` (desde `client/`). Valida todo y actualiza la copia del servidor. Si algo está mal, dice qué y dónde, y no escribe nada.
3. Hacé commit de **los dos**: tu cambio y la copia generada. `npm run resources:check` falla si no coinciden.

## Qué es cada tipo (`kind`)

| Tipo | Es… | Ejemplos de uso |
|---|---|---|
| `emergency` | Riesgo inmediato para la vida; despacha ayuda. | Ambulancia, policía, bomberos. |
| `urgent-support` | Atención humana urgente que **no** despacha ayuda. | Líneas de crisis, violencia, intoxicaciones. |
| `orientation` | Consulta, información y asesoramiento. | Líneas de consulta de salud. |
| `service` | Un lugar o programa concreto, con dirección. | Hospital, centro de salud, veterinaria. |

"Es una emergencia" **es** el `kind`: no hay un campo aparte que pueda contradecirlo.

## Establecimientos y prestaciones

Un establecimiento (un hospital, un CeSAC, una veterinaria pública) se carga **una sola vez**, con todo lo que ofrece en `services`. Aparece en cada categoría o filtro que corresponda sin duplicarse. Es un recurso `kind: "service"` con `facilityType` (hospital, health-center, public-veterinary…) y, de ahí en adelante, lleva dirección, coordenadas, jurisdicción y prestaciones.

**Prestaciones (`services`).** Cada una tiene su `id` (estable, único dentro del establecimiento) y su `type` (vaccination, dentistry, ophthalmology, contraception, rabies-vaccination…). Dice solo lo que le es propio; **lo demás lo hereda del establecimiento**:

| Campo de la prestación | Si no lo dice |
|---|---|
| `hours` | Hereda el del establecimiento. Con `hours: null` queda **"no se sabe"**: no hereda. |
| `cost` | Hereda; si nadie lo dijo, es `unknown`. **Nunca se asume gratuito.** |
| `costNote`, `requirements`, `audience` | Heredan. |
| `appointment` (`mode`: required, recommended, not-required, unknown; `howTo`, `url`) | `unknown` |
| `contacts` | Solo los propios (los del establecimiento se muestran al lado). |
| `source`, `verification` | Heredan. Una prestación puede tener los suyos. |

**Categorías.** No se escriben: salen del `type` de cada prestación, según `taxonomy.serviceTypes` (vaccination → Salud general, contraception → ESI, rabies-vaccination → Animales…). Cada tipo tiene una **lista** de categorías: hoy casi todos tienen una sola, pero uno puede pertenecer a varias (aparecería en todas) con solo agregarla en la taxonomía, sin tocar código ni datos. Con `services` no se escribe `categories` ni `sections`. Un CeSAC con vacunación, anticonceptivos y salud mental aparece en Salud física, ESI y Salud mental.

**Cuándo se muestra.** Un establecimiento se muestra si está verificado y vigente **y** tiene al menos una prestación vigente. Una prestación está vigente si su establecimiento lo está **y** su propia verificación (o la que hereda) lo está. Si vence el establecimiento, ninguna de sus prestaciones se muestra; si vence una prestación, el resto sigue.

**Cuándo va en el mapa.** Solo con `coordinates.status: "verified"`. Una dirección sin coordenadas verificadas va únicamente en la lista, sin distancia. Las coordenadas llevan `method` (de dónde salió el punto: dataset oficial, USIG, Georef, a mano…), `verifiedAt` y `verifiedBy`. Un punto `unverified` es solo un candidato. Se valida que caiga dentro de Argentina (atrapa latitud y longitud invertidas).

**Datos del establecimiento.** `jurisdiction` es quién lo administra (nacional, provincial, municipal y el organismo); `coverage` sigue siendo dónde sirve. `address` admite número, barrio, departamento, referencia ("dentro del hospital") e ids de Georef. `externalIds` guarda los identificadores en otros registros (por ejemplo `refes`) y **no puede repetirse**: así se detecta un mismo establecimiento cargado dos veces.

**Teléfonos de un lugar.** Un establecimiento puede no tener ningún contacto. Dos o más **lugares** pueden compartir un número (una central de turnos); un número de una línea (emergencia, apoyo urgente u orientación) sigue siendo exclusivo. Cuando varios lugares comparten un número, el servidor lo da por válido si **alguno** está vigente.

**Dónde va cada establecimiento.** En `places/<código de provincia en minúsculas>.json` (`ar-c.json` para CABA, `ar-b.json` para Buenos Aires…), según su **`address.province`**, no según quién lo administra: un hospital nacional que está en CABA va en `ar-c.json` con `jurisdiction.level: "national"`. Así cada establecimiento tiene un único lugar posible. Todo lo de `places/` es `kind: "service"`. Sigue siendo **una sola Base AuxiliAR**: mismo schema, misma taxonomía, y los `id` y `externalIds` son únicos entre `lines/` y todos los archivos de `places/`. La validación falla si el archivo no se llama como una provincia de la taxonomía o si un establecimiento está en el archivo de otra provincia.

## Reglas editoriales

**Verificación**
- Solo se muestra a las personas, y solo puede ofrecerlo Auxi, lo que tiene `verification.status: "verified"` **y** cuya fecha `nextReviewDue` todavía no llegó. Desde ese día deja de mostrarse hasta que alguien lo vuelva a verificar. Lo mismo vale para el servidor (`ResourceCatalog.isCurrent`).
- Esto vale igual para una prestación que tenga verificación propia (usa la fuente propia o, si no tiene, la del establecimiento).
- Un recurso `verified` **tiene que** traer: `verifiedAt`, `verifiedBy`, `nextReviewDue` (posterior a `verifiedAt`) y `source` con `organization` y `url` de la **fuente oficial**. Sin eso, la validación falla.
- El plazo hasta `nextReviewDue` lo decide quien verifica, según cuánto puede cambiar el dato y cuánto riesgo tiene que esté mal. No hay un plazo fijo para todos.
- Los demás estados (`unverified`, `needs-review`, `outdated`, `disputed`) se pueden cargar pero **no se muestran**. Si un dato cambia o dudás, pasalo a `needs-review` en lugar de dejarlo como verificado.
- Verificar es comprobar contra la fuente oficial, no copiar de otra web. Anotá en `source.note` o `verification.notes` cualquier aclaración.

**Datos**
- **No inventes ni completes.** Si no sabés un dato, no lo pongas: el campo se omite o queda `null`.
- **Horarios:** `hours: null` significa "no se sabe". Nunca se completa con 24 horas por omisión. Si abre las 24 horas, `open24h: true`; si tiene franjas, `open24h: false` y `schedule` (días 0 = domingo … 6 = sábado).
- **Teléfonos:** `dial` es solo dígitos (con `+` al principio si es internacional): es lo que se marca (`tel:`) y con lo que se comparan los números. `display` es cómo se escribe en pantalla (`0800-333-0160`). Un número de una línea no puede estar en dos recursos (los lugares sí pueden compartir el suyo; ver arriba).
- **Alcance (`coverage`):** todo el país, una región o área, una provincia o un municipio. Un número que sirve solo en una zona tiene que decirlo. Si un mismo organismo tiene dos números con alcances distintos, es **un solo recurso con dos contactos**, y cada contacto lleva su propio `scope`.
- **Gratuidad (`cost`):** `free`, `paid`, `mixed` o `unknown`. No pongas `free` si no está confirmado.
- **Ids:** `id` es estable. No se reutiliza ni se cambia, aunque cambie el nombre. Formato: minúsculas, números y guiones.
- **Categorías:** por id (`salud-mental`, `centros`…). Las secciones (`sections`) se pueden indicar, pero hoy sus ids son genéricos (`section-1`…) y no se verifica que existan.
- **Dirección y coordenadas:** solo de establecimientos públicos, nunca de personas. `precision` dice si el punto es exacto o aproximado.
- **Fuente (`source`):** además de `organization`, `url` y `note`, puede llevar `retrievedAt` (el día en que se consultó o descargó, AAAA-MM-DD) y `license` (la licencia con la que el organismo publica el dato, por ejemplo `CC-BY-2.5-AR`). Lo que viene de un dataset con licencia los lleva siempre.
- **Método de las coordenadas:** `official-dataset` es un punto que el dataset publica ya en latitud y longitud; `official-dataset-reprojected` es uno que el dataset publica en otro sistema (por ejemplo EPSG:9498, en metros) y se convirtió a WGS84 con un procedimiento reproducible (ver `client/curation`). Nunca se convierte a mano.

## Cargar muchos establecimientos desde datasets oficiales

No se escriben a mano: el pipeline de `client/curation/` (ver su README) ingiere el dataset, normaliza, genera **candidatos** —que no se publican— y solo escribe en `places/` lo que una persona decidió. No pisa lo ya curado y valida con este mismo validador antes de escribir.

## Comandos (desde `client/`)

| Comando | Qué hace |
|---|---|
| `npm run resources:sync` | Valida y escribe la copia del servidor. |
| `npm run resources:check` | Valida y **falla** si la copia del servidor no está al día (no escribe nada). Pensado para el CI. |
| `npm run resources:test` | Tests del validador y del generador. |

También se valida que `taxonomy.categories` coincida con las categorías reales de la app.

## Cómo lo leen la app y el servidor

- **Cliente:** `index.ts` incorpora `lines/*.json` en el build (los números de emergencia no pueden depender de un pedido de red). Expone `getCurrentResources`, `getEmergencyBarResources`, `findResourceByDial`, `contactHref` y similares, y para establecimientos `getServices` (con la herencia resuelta), `getCurrentServices`, `getCategories`, `getCurrentPlacesByCategory`, `isMappable` y `getCurrentMappablePlaces`. Los establecimientos **no** van en el build: `loadPlaces("AR-C")` pide `places/ar-c.json` la primera vez (un pedido por provincia, nunca todo el país), lo guarda y devuelve la lista (vacía si la provincia no tiene archivo). Las consultas de lugares (`getCurrentPlaces`, `getCurrentPlacesByCategory`, `getCurrentMappablePlaces`, `getCurrentResources`…) reciben esa lista como último parámetro; sin él miran solo `lines/`.
- **Servidor:** no carga por provincia: `resources.json` es una sola copia con `lines/` y todos los `places/` juntos. `ResourceCatalog` lee `data/resources.json`, lo valida al arrancar (si está mal, el servidor **no arranca**) y ofrece `findCurrentByDial` (con lo que se va a comprobar que un número que Auxi quiere mostrar existe, está verificado y no venció), `current`, `currentByCategory`, `currentServices`, `currentMappablePlaces` y `categoriesOf`. **La copia del servidor ya trae las prestaciones resueltas** (la herencia la resuelve `resources-resolve.mjs`) y las categorías derivadas, así que el servidor no repite esa lógica.

## Qué viene después

**Ya hecho:** las líneas de ayuda se cargaron, se verificaron con fuentes oficiales y son la fuente única de los números (barra de emergencias, chat, servidor y tarjeta de ayuda urgente), y se cargó un piloto de establecimientos en la Ciudad de Buenos Aires (7 establecimientos, 34 servicios, 9 visibles). **Lo que sigue**, cada cosa en su propio cambio: sumar establecimientos y servicios a partir de investigaciones con fuente oficial (sin duplicar establecimientos: ver `docs/investigacion/estructura-del-mapa-y-reglas-de-inclusion.md`), documentar la gratuidad de las prestaciones que hoy están registradas sin ella, y sumar otras provincias de a una. Los establecimientos viven en `places/<provincia>.json`.

## Datos de prueba

Los tests usan datos inventados, que nunca van en `lines/`: `client/scripts/__fixtures__/` y `server/src/test/resources/data/resources-fixture.json` (este último se regenera con `UPDATE_FIXTURE=1 npm run resources:test`).

## Índice de cobertura (`coverage.json`)

Un archivo chico, **generado** por `npm run resources:sync` desde `places/` (nunca se edita a mano; `resources:check` falla si está desactualizado). Dice, por provincia, cuántos lugares tiene su archivo, qué categorías y prestaciones hay, en qué divisiones (comunas, partidos…) y hasta qué día algo puede estar vigente (`currentUntil`). La app lo lee para saber **dónde hay lugares sin descargar los archivos**: solo baja el de la provincia elegida, o todos si son pocos (`LOAD_ALL_UP_TO`). Cuenta todos los lugares del archivo, vigentes o no: sirve para planificar la descarga, **nunca para mostrar números a las personas**.

**Qué puede mostrar el mapa (`quickFilters`).** Para cada filtro rápido del mapa (`utils/places/filters`), el índice guarda hasta qué día el mapa puede mostrar algo: `list` (algún lugar en la lista) y `map` (algún lugar con coordenadas verificadas, o sea con pin; nunca va más allá de `list`). Se calcula con **las mismas funciones del explorador** (`selectPlaces` con gratuidad documentada, `isMappable`), no con reglas copiadas: si cambian las reglas, `resources:check` falla hasta que se regenere. Son **fechas, no cantidades**: un dato vale mientras el día de hoy sea **anterior** a la fecha (el día de `nextReviewDue` ya queda afuera, igual que en el explorador), así que el paso del tiempo no lo desactualiza. Un filtro sin nada visible no tiene entrada. Las páginas de Salud general lo leen (`quickFilterAvailability`) para decir si hay pines, solo lista o nada, sin cargar el mapa. La generación es todo o nada: si no se pueden aplicar las reglas o no se puede preparar algún archivo, no se escribe ninguno.

## Líneas de ayuda y números de emergencia (fuente única)

Todos los números de ayuda de AuxiliAR salen de **`lines/nacional.json`**. No hay otro lugar donde se escriban a mano: la barra de emergencia, el chat (cliente y servidor), la tarjeta de ayuda urgente del Mapa AuxiliAR y los textos que nombran un número **leen o se generan de ahí**. Si dos lugares dicen cosas distintas, uno está mal: se corrige el dato, no el consumidor.

- **Qué lleva cada línea:** nombre, tipo (`emergency`, `urgent-support`, `orientation`), contactos (cada uno puede tener su `scope` y su `hours`), alcance, horario, fuente oficial (`source.url`, `source.retrievedAt` y `source.note` con lo que dice la fuente, entre comillas) y verificación.
- **Qué NO se afirma sin fuente:** un horario (`hours: null` = no se sabe, nunca se completa con 24 h), la gratuidad, ni el alcance. Una línea sin verificación suficiente **no se agrega**.
- **Dónde hay varias jurisdicciones** (el 107, el 135) se registra lo verificado por jurisdicción en los contactos (`scope`) y el `coverage.note` dice que no es una lista completa. Nunca se escribe "todo el país" para algo que las fuentes oficiales no dicen así.
- **Barra de emergencia:** las líneas con `display.emergencyBarOrder`, en ese orden, y su primer contacto. La barra y el chat **no desaparecen si vence una revisión**: para estas líneas, una verificación vencida se avisa (`resources:check`) pero no oculta el número.
- **Cuando vence una revisión:** el número sigue en la barra, en el chat y en la tarjeta de ayuda urgente (un número que alguien puede necesitar no desaparece), pero **no se presenta como comprobado**: los botones dicen "sin nueva comprobación", la barra avisa que, si no responde, se llame al 911, y a Auxi (servidor) se le dice cada turno cuáles pasaron su fecha. `resources:check` avisa 30 días antes. Para volver a comprobarlo: abrir la fuente, actualizar `verifiedAt`, `nextReviewDue` y `source.retrievedAt`.
- **Cómo dicen los botones su alcance:** la parte del `shortName` después de " · " es el alcance ("Ambulancias · según localidad", "Asistencia en crisis · CABA y GBA"); un contacto con su propio `label` (el 0800-345-1435: "Asistencia en crisis · todo el país") se nombra por ese label. El horario sale del `hours.note` solo si no es de 24 h.
- **`SafetyRules.java` y el CI:** lo que esa clase supone de la tabla (los números de PAMI 138 y 139 y que el 139 es del AMBA y Rosario) se comprueba en `resources:check`, que lo corre el CI, y no al arrancar el servidor: un servidor que no arranca no le responde a nadie. Si falta, el servidor solo lo registra en el log.
- **Servidor:** `resources.json` lleva estas líneas, y `prompts/numeros.md` (la tabla que lee Auxi y con la que se validan los botones de llamada) se **genera** con `npm run resources:sync` a partir de ellas y de `numeros.template.md`. `resources:check` falla si no coinciden. Las instrucciones del template nombran las líneas por id (`{{n:id}}`, `{{h:id}}`) y no llevan números escritos a mano. Las filas que el template todavía lleva a mano (100, 101, 103, 106, 149, 0800-444-8694, 0800-222-7264 y 0800-222-0381) están marcadas "(sin verificar)" para el chat: cuando se verifiquen, se pasan a `lines/` y se borran del template (si una se repite en las dos partes, la generación falla). `SafetyRules.java` comprueba al arrancar que la tabla trae el 138 y el 139 de PAMI y que el 139 es del AMBA y Rosario.
- **Contradicciones entre fuentes oficiales** (se registran en `verification.notes` de la línea, con las URL de cada una, y se decide cómo mostrarlas): el 107 (la página nacional lo limita a CABA y localidades de Buenos Aires; páginas oficiales de Córdoba y Jujuy lo muestran funcionando allí), el 102 (16 jurisdicciones en una nota de 2020; todas en una de 2022) y la tabla del chat sobre el 139 de PAMI (decía que en el resto del país era el 107 o el 911; PAMI dice que cada afiliado tiene el número de su prestador).
- **Cómo agregar una línea:** abrir la página oficial, anotar la URL, la fecha en que se consultó y la frase que dice el número, el alcance y el horario; cargar solo lo que esa frase dice; `npm run resources:sync`; `npm run emergency:test`.

## Revisión periódica de los números

Los números de `lines/` se verifican por fecha (`verification.nextReviewDue`, hoy 6 de enero de 2027 para todos). Un número **vencido no desaparece** (la barra, el chat y la tarjeta de ayuda urgente lo siguen mostrando) pero **no se presenta como comprobado**: lo dicen los avisos, y por eso hay que renovarlos antes de la fecha.

1. **Ver qué toca:** `npm run lines:due` (todas las líneas, la más próxima primero, con la página a abrir de cada una) o `npm run lines:due -- --days 60`. `npm run resources:check` también avisa 30 días antes.
2. **Para cada línea:** abrir `source.url` y comparar, con lo que dice la página hoy, el número, el alcance (`coverage`, `scope`), el horario (`hours`, y que siga sin afirmarse lo que la fuente no dice), la gratuidad (`cost`, solo si la página lo dice) y, si cambia, `shortName` y `whenToUse`.
3. **Si coincide:** actualizar `verification.verifiedAt` (hoy), `verification.nextReviewDue` (90 días después) y `source.retrievedAt` (hoy). **Si cambió algo:** corregir el dato, citar en `source.note` la frase nueva y anotarlo en `verification.notes`. **Si dos páginas oficiales se contradicen:** no elegir en silencio; registrarlo en `verification.notes` con las URL (como el 107 o el 102) y decidir cómo mostrarlo.
4. **Si no se puede comprobar** (la página no está, cambió de sitio, no dice lo que decía): **no renovar la fecha**. Dejar que venza (se avisa) o pasar la línea a `needs-review`, que la saca de la barra y del chat: eso es una decisión editorial, no un descuido.
5. `npm run resources:sync`, `npm run emergency:test`, `npm run resources:check` y el commit de **los dos** (el dato y las copias generadas: `resources.json` y `numeros.md`).
6. **Líneas nuevas:** solo con una página oficial que diga el número; ver "Cómo agregar una línea".

## Las ocho filas "(sin verificar)" de la tabla del chat

Siguen a mano en `numeros.template.md` y no están en `lines/` porque todavía no hay una fuente oficial leída que diga su alcance y su horario. Quién las usa: **solo** la tabla del chat (`numeros.md` → `HelpNumbers` → las instrucciones de Auxi y la validación de sus botones). No están en la barra, en la tarjeta de ayuda urgente ni en ningún texto del cliente (un test lo comprueba). Cuando el chat las da, el botón dice "sin verificar", sin alcance, horario ni gratuidad, y a Auxi se le indica que pida confirmar.

| Fila | Qué se encontró (consulta del 8-10-2026) | Qué falta para pasarla a `lines/` |
|---|---|---|
| 100 Bomberos, 103 Defensa Civil, 106 Emergencia náutica | Las lista la página oficial `argentina.gob.ar/tema/emergencias` con su descripción, sin alcance ni horario | Una página que diga dónde funciona cada una y cuándo atiende (el 100 y el 103 dependen de cada jurisdicción) |
| 101 Policía (donde no funciona el 911) | No aparece en esa página | Cualquier fuente oficial |
| 149 Víctimas de siniestros viales | Nota oficial del 5-1-2022: atiende las 24 horas, los 365 días | Alcance explícito y si la llamada es gratuita |
| 0800-444-8694 Intoxicaciones en chicos | Resultado de búsqueda sobre la página del Gobierno de la Ciudad (Hospital de Niños Gutiérrez): línea gratuita, guardia de toxicología | Leer la página y su horario telefónico |
| 0800-222-7264 PAMI | No figura en la página de contacto de PAMI; aparece en un PDF de PAMI | Leer el PDF y guardar su URL |
| 0800-222-0381 PAMI traslados | Sin fuente encontrada | Cualquier fuente oficial de PAMI |

Borrarlas sin analizarlo dejaría a Auxi sin bomberos, defensa civil, policía fuera del 911 y emergencia náutica, que son números que alguien puede necesitar: se mantienen, marcadas, hasta verificarlas.

## Si cambia el formato

1. Actualizá `resource.schema.json` y, si agregás valores permitidos, `taxonomy.json`.
2. Actualizá `resources.types.ts` (el test `resources:test` falla si sus listas dejan de coincidir con la taxonomía).
3. Actualizá `HealthResource.java`.
4. Si el cambio rompe lo existente, subí `schemaVersion` (hoy está en **2**: la fase 1 hizo obligatorio `coordinates.status`) en `taxonomy.json` y `SCHEMA_VERSION` en `ResourceCatalog.java`: un servidor viejo se niega a leer un formato que no conoce.
5. `npm run resources:sync`.
