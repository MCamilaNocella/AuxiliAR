# El mapa de AuxiliAR: estructura, reglas de inclusión y cómo agregar servicios sin duplicar

**Inventario del 9/10/2026** (rama local `research/map-inventory`, derivada de `demo/presentation-2026-10-14`). Este documento acompaña a [inventario-mapa-servicios.csv](inventario-mapa-servicios.csv). **No se cambió ningún dato ni código de la aplicación**: solo se leyeron los archivos de datos. El CSV se generó con [herramientas/generar-inventario-mapa.cjs](herramientas/generar-inventario-mapa.cjs) (solo lectura; se puede volver a correr cuando cambien los datos).

## 1. Qué hay hoy en el mapa

| Dato | Valor |
|---|---|
| Archivos de lugares | 1: `client/src/data/resources/places/ar-c.json` (Ciudad Autónoma de Buenos Aires) |
| Establecimientos registrados | **7** |
| Prestaciones registradas (filas del CSV) | **34** |
| Establecimientos con alguna prestación **visible para las personas** (hoy, 9/10/2026) | **6** |
| Prestaciones **visibles** (gratuidad documentada, vigentes) | **9** (6 «Gratuita» y 3 «Gratuita con condiciones») |
| Prestaciones registradas pero **no visibles** (gratuidad no documentada) | **25**: se conservan en los datos para investigaciones futuras y nunca aparecen en resultados, tarjetas, pines, búsqueda ni conteos |
| Establecimientos con coordenadas verificadas | 7 de 7 (todas «aproximadas») |
| Líneas de ayuda (otro archivo, **no están en este inventario**) | 14 en `lines/nacional.json` (alimentan la barra de emergencias, no el mapa) |

Los 7 establecimientos:

| Id interno | Establecimiento | Tipo | Dirección (comuna) | Id externo | Coordenadas | Prestaciones | Visibles | Próxima revisión |
|---|---|---|---|---|---|---|---|---|
| `cesac-3` | Centro de Salud Nivel 1: Villa Lugano 9 (CeSAC Nº 3) | Centro de salud | Soldado de la Frontera 5144 (Comuna 8) | `caba-cesac=3` | Verificadas, aproximada | 9 | 2 | 2027-01-05 |
| `cesac-41` | Centro de Salud Nivel 1: La Boca 2 (CeSAC Nº 41) | Centro de salud | Ministro Brin 843 (Comuna 4) | `caba-cesac=41` | Verificadas, aproximada | 7 | 2 | 2027-01-05 |
| `cesac-47` | Centro de Salud Nivel 1: Retiro 3 (CeSAC Nº 47) | Centro de salud | Alpaca 620 (Comuna 1) | `caba-cesac=46` | Verificadas, aproximada | 14 | 2 | 2027-01-05 |
| `hospital-oftalmologico-santa-lucia` | Hospital Oftalmológico Santa Lucía | Hospital | San Juan 2021 (Comuna 3) | `caba-hospitales=hospital-especializado-de-oftalmologia-santa-lucia` | Verificadas, aproximada | 1 | 0 | 2027-01-05 |
| `hospital-odontologia-carrillo` | Hospital de Odontología Dr. Ramón Carrillo | Hospital | Sánchez de Bustamante 2529 (Comuna 2) | `caba-hospitales=hospital-especializado-odontologico-dr-r-carrillo-ex-nacional` | Verificadas, aproximada | 1 | 1 | 2027-01-05 |
| `hospital-odontologia-duenas` | Hospital de Odontología Dr. José Dueñas | Hospital | Muñiz 15 (Comuna 5) | `caba-hospitales=hospital-especializado-de-odontologia-j-duenas` | Verificadas, aproximada | 1 | 1 | 2027-01-05 |
| `centro-fijo-veterinario-costanera-sur` | Centro Fijo Veterinario Costanera Sur (Animales BA) | Veterinaria pública | Av. Dr. T. Achával Rodríguez 1550 (Comuna 1) | — | Verificadas, aproximada | 1 | 1 | **2026-11-08** |

**Las 9 prestaciones visibles:** `cesac-3#atencion-primaria`, `cesac-3#vacunacion`, `cesac-41#atencion-primaria`, `cesac-41#vacunacion`, `cesac-47#atencion-primaria`, `cesac-47#pediatria`, `hospital-odontologia-carrillo#guardia-odontologica`, `hospital-odontologia-duenas#guardia-odontologica`, `centro-fijo-veterinario-costanera-sur#castracion`.

**Cuidado con la fecha:** la visibilidad depende del día. La del Centro Fijo Veterinario Costanera Sur **vence el 8/11/2026** y las demás el 5/1/2027: después de esa fecha dejan de mostrarse hasta que alguien las vuelva a verificar. Para ver el estado en otro día: `INVENTARIO_FECHA=AAAA-MM-DD node docs/investigacion/herramientas/generar-inventario-mapa.cjs`.

## 2. Cómo está armado el mapa

**Una sola base, sin copias a mano.** Todo sale de `client/src/data/resources/`:

| Archivo | Para qué |
|---|---|
| `places/<provincia>.json` | Establecimientos con sus prestaciones. Un archivo por provincia, según su `address.province` (`ar-c.json` para CABA, `ar-b.json` para Buenos Aires…). Hoy solo existe `ar-c.json`. |
| `lines/nacional.json` | Líneas telefónicas (no son parte del mapa). |
| `taxonomy.json` | Los valores permitidos: tipos de establecimiento y de prestación, estados, provincias, categorías, métodos de coordenadas. |
| `resource.schema.json`, `resources.types.ts` | La estructura de cada registro. |
| `coverage.json` | Índice **generado** (no se edita): qué hay por provincia, para saber qué archivo bajar. |
| `server/src/main/resources/data/resources.json` | **Copia generada** para el servidor. No se edita. |
| `README.md` (de esa carpeta) | La guía técnica. Aviso: su cabecera dice «todavía no hay datos cargados», que **quedó desactualizada** (hay 7 establecimientos). |

**Modelo: un establecimiento, varias prestaciones.**
- **Establecimiento** (`kind: "service"`): hospital, centro de salud, veterinaria pública… Se carga **una sola vez**, con dirección, coordenadas, jurisdicción, contactos y verificación. Lleva `facilityType`.
- **Prestación** (`services[]`): lo que se atiende ahí (vacunación, odontología, guardia, castración…). Tiene su `id` (único dentro del establecimiento) y su `type`. **Hereda** del establecimiento lo que no dice: horarios (con `hours: null` queda «no se sabe»), costo, requisitos, destinatarios, fuente y verificación. El costo **nunca se asume gratuito**: si nadie lo dijo, es `unknown`.
- **Categorías y subcategorías no se escriben**: salen del `type` de la prestación (`taxonomy.serviceTypes`). La **categoría** es la de la app (Salud general, Salud mental, Educación sexual, Animales) y la **subcategoría** es el tipo de prestación («Vacunación», «Odontología», «Guardia»…). Además existen **filtros rápidos del mapa** que agrupan tipos: Atención médica, Salud mental, Salud sexual, Vacunación, Odontología, Guardias y Salud animal.
- **Evidencia** (`evidence[]`): cada prestación puede tener varias fuentes oficiales, cada una con lo que respalda (`cost` = la gratuidad, `scope` = qué cubre, `existence` = que el lugar la ofrece, `access` = cómo pedirla, `hours` = el horario). Una norma general respalda la gratuidad, **no** que haya turnos.

**Cómo lo muestra la app:** el explorador del mapa (`PlacesExplorer`, en Centros de atención y en las secciones que lo incrustan) lee los lugares de la provincia, filtra por vigencia y por gratuidad documentada y muestra lista y mapa con los mismos resultados. Es el **único** lugar donde se decide qué se muestra (`selectPlaces`). Según la auditoría de las rondas anteriores, el prompt de Auxi usa solo las líneas y las páginas, no estos lugares.

## 3. Reglas de inclusión

El inventario distingue tres niveles. Una prestación puede estar en el primero y no en los otros.

1. **Está en los datos** (se conserva): cualquier establecimiento o prestación cargado en `places/`, aunque su gratuidad no esté documentada. No se borra: sirve como candidato para investigar.
2. **Es vigente:** el establecimiento y la prestación están `verified` y **todavía no llegó su `nextReviewDue`** (desde ese día dejan de mostrarse hasta que se verifiquen de nuevo). Un recurso verificado **tiene que** traer `verifiedAt`, `verifiedBy`, `nextReviewDue` posterior a `verifiedAt`, y una fuente oficial con `url`. Los estados `unverified`, `needs-review`, `outdated` y `disputed` se pueden cargar pero no se muestran.
3. **Se muestra** (`visible_en_lista` en el CSV): es vigente **y tiene la gratuidad documentada para esa prestación**. Reglas exactas (`isVerifiedFree`): la **propia prestación** declara `cost: "free"` **y** tiene una `source.note` propia que explica por qué. La gratuidad **no se hereda** del establecimiento ni se deduce de que el lugar sea público. «Gratuita con condiciones» es la misma regla con un `costNote` (por ejemplo, «Con DNI argentino», turno previo o una edad).
4. **Va en el mapa** (`visible_en_mapa`): se muestra **y** el establecimiento tiene `coordinates.status: "verified"`. Sin eso, solo aparece en la lista. Las coordenadas llevan `method` (dataset oficial, reproyectado, USIG, Georef, a mano, GPS), `verifiedAt` y `verifiedBy`, y se valida que caigan dentro de Argentina.

**Reglas editoriales que se mantienen:**
- **No inventar ni completar.** Un dato que no se sabe se omite o queda `null`. Un horario `null` es «no se sabe» (nunca 24 h por omisión).
- **Fuente oficial.** Se verifica contra la fuente oficial, no copiando de otra web. `source` lleva organismo, URL, fecha de consulta (`retrievedAt`) y, si corresponde, licencia (por ejemplo CC-BY-2.5-AR).
- **Solo establecimientos públicos**, nunca direcciones de personas. Un servicio privado, pago o sin gratuidad confirmada **no se muestra**.
- **Declarar gratuidad exige evidencia de tipo `cost`** si el servicio tiene `evidence` (lo valida el validador).
- **Teléfonos:** `dial` solo dígitos, `display` como se escribe. Un número de una línea de ayuda no puede repetirse; los lugares sí pueden compartir una central de turnos.

## 4. Cómo agregar un servicio sin duplicar establecimientos

**Antes de cargar nada**, buscá en el CSV si el establecimiento ya existe. El validador solo detecta **ids repetidos** y **`externalIds` repetidos**; **no** detecta el mismo lugar cargado con otro nombre o dirección. Por eso el CSV trae claves de comparación.

### Paso 1. ¿Ya existe el establecimiento?
Buscá por este orden (las columnas están en el CSV):
1. **`ids_externos`** (por ejemplo `caba-hospitales=…`, `caba-cesac=…`): es lo más confiable. **Ojo:** para los CeSAC, `caba-cesac` es el id de la **fila del dataset**, **no** el número del CeSAC (la fila 46 es el CeSAC 47; ver §6).
2. **`clave_duplicado_direccion`** (`calle|número|localidad|provincia`, normalizada): dos filas con la misma clave son el mismo lugar casi seguro.
3. **`clave_duplicado_nombre`** (nombre normalizado, sin tildes ni signos) y, si el establecimiento tiene alias o sedes, revisá también por `barrio` y `division_comuna_partido`.
4. Si hay duda (mismo nombre en dos sedes, o un servicio que funciona dentro de otro establecimiento), **no cargues**: anotalo como conflicto para decidir.

### Paso 2. Decidir qué es
| Caso | Qué hacer |
|---|---|
| El establecimiento **ya existe** y el servicio es **nuevo** | Agregar **una prestación** a su `services` (no un establecimiento nuevo). El `id` de la prestación es único dentro del establecimiento (`a-z`, números y guiones) y no se reutiliza ni se cambia. |
| El establecimiento **ya existe** y el servicio **ya está** (`id_fila` o `clave_duplicado_prestacion`) | **No duplicar.** Actualizar el dato existente (gratuidad, horario, evidencia) y la verificación. |
| El establecimiento **no existe** | Crear **un** registro nuevo en `places/<provincia>.json` según su `address.province`, con su `id` estable (minúsculas, números y guiones; no se cambia aunque cambie el nombre), `externalIds` si hay (único en todo el proyecto) y todas sus prestaciones adentro. |
| Provincia sin archivo | Crear `places/<código en minúsculas>.json` (por ejemplo `ar-b.json`) con `"$schema": "../resource.schema.json"`. |

### Paso 3. Cargar solo lo que la fuente dice
- Establecimiento: `name`, `facilityType`, `jurisdiction`, `address`, `coordinates` (verificadas, con `method`), `verification`, `source`.
- Prestación: `type` (de `taxonomy.serviceTypes`), `cost` **solo si la fuente de esa prestación lo dice**, con `costNote` y `source.note` (la frase que respalda la gratuidad, entre comillas), `appointment`, `requirements`, `hours` si están documentados y `evidence` por cada cosa que se respalda.
- Nada de datos inventados: lo que no se sabe se omite.

### Paso 4. Validar y regenerar (desde `client/`)
```
npm run resources:sync     # valida y actualiza la copia del servidor y el índice de cobertura
npm run resources:check    # falla si la copia no está al día
npm run places:test        # pruebas del mapa
npm run test:ci            # todas las pruebas
node ../docs/investigacion/herramientas/generar-inventario-mapa.cjs   # actualiza el CSV (desde la raíz del repo: node docs/…)
```
Se hace commit de **los datos, la copia del servidor, `coverage.json` y el CSV** juntos.

### Paso 5. Altas masivas
Para cargar muchos establecimientos desde un dataset oficial no se escribe a mano: se usa el pipeline `client/curation/` (ingesta, normalización, **candidatos que no se publican**, y solo escribe en `places/` lo que una persona decidió).

### Ejemplo: agregar una prestación a un establecimiento existente
```json
{
  "id": "consejeria-metodos-anticonceptivos",
  "type": "contraception",
  "name": "Consejería y métodos anticonceptivos",
  "cost": "free",
  "appointment": { "mode": "unknown" },
  "source": {
    "organization": "Gobierno de la Ciudad de Buenos Aires: Métodos anticonceptivos",
    "url": "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos",
    "retrievedAt": "2026-10-09",
    "note": "«La atención y los métodos son gratuitos en el sistema público»."
  },
  "evidence": [
    { "kind": "cost", "organization": "…", "url": "…", "retrievedAt": "2026-10-09" },
    { "kind": "existence", "organization": "…", "url": "…", "retrievedAt": "2026-10-09" }
  ]
}
```
(Solo ilustra la forma. Esta prestación para los CeSAC 3, 41 y 47 y el alta de Pasteur son **propuestas pendientes de aprobación**; ver `docs/investigacion/ronda-contenido-3/propuestas-preparadas-no-publicadas.md`. **No están en los datos.**)

## 5. Cómo comparar futuras investigaciones con el CSV

Para cada hallazgo nuevo, buscar primero por `ids_externos`, después por `clave_duplicado_direccion` y por `clave_duplicado_nombre`, y clasificarlo:

| Resultado | Condición | Acción sugerida |
|---|---|---|
| **Ya existe y está visible** | Mismo establecimiento y misma prestación, `visible_en_mapa = sí` | Comparar los datos; solo corregir si la fuente oficial lo contradice. |
| **Existe pero no se muestra** | Mismo establecimiento y prestación, gratuidad no documentada | **Candidata a documentar**: buscar la fuente de gratuidad **de esa prestación** (el CSV tiene 25). |
| **Prestación nueva en un establecimiento existente** | El establecimiento está, la prestación no | Agregar una prestación (§4, paso 2). |
| **Establecimiento nuevo** | Ninguna clave coincide | Alta nueva con todas sus prestaciones. |
| **Conflicto** | Misma dirección y nombre distinto, o mismo nombre y dirección distinta | No cargar; registrar la duda con las fuentes. |

El CSV está pensado para comparar por máquina: separador coma, comillas dobles según RFC 4180, codificación UTF-8, **valores múltiples separados por « | »** y evidencias separadas por « || ».

## 6. Observaciones y cautelas del inventario
1. **`caba-cesac` no es el número del CeSAC.** El id del dataset oficial no coincide con el número: la fila 46 es el CeSAC 47 y la 47 es el CeSAC 48 (dato en `docs/investigacion/evidencia/caba-dataset-cesac-filas-3-41-47.txt`). Identificar siempre por nombre y dirección.
2. **CeSAC 47 aparece con dos direcciones en fuentes oficiales:** el dataset (Alpaca 620, Barrio Padre Mugica), que usa el mapa, y la lista de consejerías (calle «playón, ex galpón SIC», Barrio 31). Conviene resolverlo antes de agregarle servicios.
3. **Todas las coordenadas son «aproximadas».** Método (columna `coordenadas_metodo`): dataset oficial (los 3 CeSAC), dataset oficial reproyectado a WGS84 (los 3 hospitales) y geocodificado con USIG (Costanera Sur).
4. **Horarios documentados:** solo hay 4 prestaciones con horario (vacunación del CeSAC 41 y las tres guardias). Los horarios de la vacunación de los CeSAC 3 y 47 y los de Pasteur **no están** porque las fuentes se contradicen o no los publican.
5. **Vencimientos:** Costanera Sur vence el 8/11/2026. Si se quiere mantener visible, hay que verificarlo de nuevo antes.
6. **Prestaciones no visibles ≠ servicios pagos.** Significa que **no tenemos** la gratuidad confirmada por una fuente oficial para esa prestación.
7. Los datos del mapa no incluyen los números de las líneas de ayuda (`lines/`), que son responsabilidad del equipo de Emergencias.

## 7. Diccionario de columnas del CSV (75)

| Grupo | Columnas | Qué son |
|---|---|---|
| Identificadores | `fecha_inventario`, `id_fila` (`establecimiento#prestación`, única), `id_establecimiento`, `id_prestacion`, `ids_externos`, `archivo_origen` | Para ubicar y no duplicar. Los ids internos son estables: no se reutilizan. |
| Establecimiento | `establecimiento`, `nombre_corto`, `tipo_establecimiento_id`, `tipo_establecimiento`, `jurisdiccion_nivel`, `jurisdiccion_organismo` | Qué es y quién lo administra. |
| Prestación y categorías | `prestacion_tipo_id`, `prestacion`, `prestacion_descripcion`, `categoria_id`, `categoria`, `subcategoria`, `filtro_rapido_mapa` | Qué se atiende; categoría de la app; tipo de prestación como subcategoría; filtro rápido del mapa. |
| Dirección | `calle`, `numero`, `barrio`, `localidad`, `division_comuna_partido`, `provincia_codigo`, `provincia`, `codigo_postal`, `referencia_direccion` | Tal como figura en los datos. |
| Coordenadas | `latitud`, `longitud`, `coordenadas_precision`, `coordenadas_estado`, `coordenadas_metodo`, `coordenadas_verificadas_el`, `coordenadas_verificadas_por`, `coordenadas_nota` | Solo las coordenadas verificadas ponen el lugar en el mapa. |
| Gratuidad y acceso | `costo`, `costo_texto`, `gratuidad_estado`, `nota_costo`, `requisitos`, `destinatarios`, `turno_modo`, `turno_como`, `turno_url` | `gratuidad_estado` resume si está documentada para esa prestación. |
| Horarios y guardias | `horarios`, `horarios_nota`, `abierto_24h`, `es_guardia`, `horarios_documentados` | `es_guardia` = tipo «Guardia» o «Guardia de salud mental». «No documentado» = no se sabe. |
| Contactos | `telefonos_establecimiento`, `telefonos_prestacion` | Como están en los datos. |
| Fuentes | `fuente_organismo`, `fuente_url`, `fuente_consultada_el`, `fuente_licencia`, `fuente_nota`, `evidencias_cantidad`, `evidencias` | Fuente oficial y evidencia por prestación (tipo, organismo, URL, fecha de consulta y nota). |
| Verificación | `verificacion_establecimiento`, `…_el`, `…_por`, `…_proxima_revision`, `verificacion_prestacion`, `…_el`, `…_por`, `…_proxima_revision`, `verificacion_notas` | Estado, quién y cuándo verificó, y hasta cuándo vale. La prestación hereda la del establecimiento si no tiene propia. |
| Visibilidad | `vigente_hoy`, `visible_en_lista`, `visible_en_mapa`, `motivo_no_visible` | Resultado de aplicar las reglas del §3 a la `fecha_inventario`. |
| Anti-duplicados | `clave_duplicado_direccion`, `clave_duplicado_nombre`, `clave_duplicado_prestacion` | Claves normalizadas (sin tildes ni signos) para comparar. |
