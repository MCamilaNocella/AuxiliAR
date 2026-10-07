# Recursos verificados

Una única fuente de verdad para los recursos de ayuda de AuxiliAR: líneas telefónicas hoy y, más adelante, hospitales, centros y otros servicios. De acá van a leer las categorías, el buscador, los mapas, Auxi y los botones de llamada.

> **Estado: infraestructura (fases 0 y 1).** El formato, las validaciones y el código para leerlo ya están —incluido el de **establecimientos con varias prestaciones**—, pero **todavía no hay datos cargados** y **nada de la app los usa** (ni mapa, ni categorías, ni Auxi). Los números que se ven hoy (`client/src/data/emergency.ts`, `server/.../prompts/numeros.md`, el footer, el chat y `SafetyRules.java`) siguen siendo los de siempre, sin cambios.

## Dónde está cada cosa

```
client/src/data/resources/        ← LO ÚNICO QUE SE EDITA
  README.md                       este archivo
  resource.schema.json            estructura de cada registro
  taxonomy.json                   valores permitidos (tipos, estados, provincias, áreas, categorías…)
  resources.types.ts              tipos de TypeScript
  index.ts                        cómo lo lee la app (consultas)
  lines/*.json                    líneas telefónicas (hoy: nacional.json, vacío). Van siempre en el build
  places/<provincia>.json         establecimientos, un archivo por provincia (ar-c.json, ar-b.json…). Se cargan bajo demanda
                                  (hoy no hay ninguno)

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

**Categorías.** No se escriben: salen del `type` de cada prestación, según `taxonomy.serviceTypes` (vaccination → Salud física, contraception → ESI, rabies-vaccination → Animales…). Cada tipo tiene una **lista** de categorías: hoy casi todos tienen una sola, pero uno puede pertenecer a varias (aparecería en todas) con solo agregarla en la taxonomía, sin tocar código ni datos. Con `services` no se escribe `categories` ni `sections`. Un CeSAC con vacunación, anticonceptivos y salud mental aparece en Salud física, ESI y Salud mental.

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

Esto es solo la infraestructura. Las próximas fases, cada una en su propio cambio: cargar los números actuales como `unverified`, verificarlos con fuentes oficiales, y recién ahí hacer que `numeros.md`, `emergency.ts`, el footer, el chat y `SafetyRules.java` lean de acá; y, aparte, los datos de los establecimientos (primero un piloto en CABA) y las pantallas que los usan. **Dónde viven los establecimientos** ya está definido (`places/<provincia>.json`); en esa fase de datos se cargan.

## Datos de prueba

Los tests usan datos inventados, que nunca van en `lines/`: `client/scripts/__fixtures__/` y `server/src/test/resources/data/resources-fixture.json` (este último se regenera con `UPDATE_FIXTURE=1 npm run resources:test`).

## Si cambia el formato

1. Actualizá `resource.schema.json` y, si agregás valores permitidos, `taxonomy.json`.
2. Actualizá `resources.types.ts` (el test `resources:test` falla si sus listas dejan de coincidir con la taxonomía).
3. Actualizá `HealthResource.java`.
4. Si el cambio rompe lo existente, subí `schemaVersion` (hoy está en **2**: la fase 1 hizo obligatorio `coordinates.status`) en `taxonomy.json` y `SCHEMA_VERSION` en `ResourceCatalog.java`: un servidor viejo se niega a leer un formato que no conoce.
5. `npm run resources:sync`.
