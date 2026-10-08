# Propuesta técnica: cobertura de Provincia de Buenos Aires y otras provincias en el mapa integral

Fecha: 8/10/2026. **No se implementó ningún cambio estructural ni se cargó ningún establecimiento.** Es una auditoría de lo que hay y una propuesta compatible con los filtros y datos actuales.

## 1. Conclusión corta
**La arquitectura ya está preparada para varias provincias.** Sumar la Provincia de Buenos Aires o cualquier otra **no exige cambiar la lógica compartida del mapa**: exige datos (un archivo por provincia), actualizar unas pruebas que hoy fijan «solo CABA», y tomar tres decisiones de diseño (más abajo). Lo más costoso es la **curación de los datos**, no el código.

## 2. Lo que ya funciona para varias provincias
| Pieza | Estado | Dónde |
|---|---|---|
| Un archivo por provincia, con el código ISO en minúsculas (`places/ar-c.json`, `ar-b.json`, `ar-s.json`, `ar-x.json`, `ar-a.json`, `ar-q.json`) | **ya existe el mecanismo**: `loadPlaces(province)` carga solo el archivo pedido (`import.meta.glob`) | `src/data/resources/index.ts` |
| Qué provincias hay, sin descargar nada | **generado**: `coverage.json` lo produce `npm run resources:sync` (nunca a mano) | `src/data/resources/coverage.json` |
| Cuántos archivos bajar | `planLoad`: si hay pocos lugares (hasta 1.500) baja todas las provincias con cobertura; si no, hay que elegir una | `src/utils/places/coverage.ts` |
| Selector de provincia y de zona | ya muestra «Con centros verificados» y «Todavía sin centros verificados», con el mensaje «todavía no tenemos centros en…» | `TerritoryFilters`, `NoCoverageHelp` |
| Nombre de la división | CABA «Comuna», **Buenos Aires «Partido»**, el resto «Departamento» | `divisionNames` en `territory.ts` |
| Validación | exige que un lugar esté en el archivo de **su** provincia (`address.province`), con fuente oficial, fechas de verificación y revisión, coordenadas dentro de Argentina | `scripts/resources-validate.mjs` |
| Servidor | una sola copia generada `resources.json` con todas las provincias; se valida al arrancar | `ResourceCatalog.java` |
| Tipos de establecimiento y de prestación | ya existen `mental-health-center`, `public-veterinary`, `rabies-vaccination`, `spaying-neutering`, `veterinary-care` | `taxonomy.json` |
| Mapa (pins) | se encuadra solo con los puntos que tienen coordenadas verificadas | `PlacesMap.tsx` |
| Pruebas con otra provincia | hay datos de prueba de `ar-b.json` en `scripts/__fixtures__` | `places-territory.test.mjs` |

## 3. Qué hay que cambiar, por provincia que se agrega
### Datos (el grueso del trabajo)
1. **Crear `places/ar-<código>.json`** con cada establecimiento: `address.province`, `address.department` (partido, departamento), `jurisdiction`, `source` (organización, URL y nota por servicio), `verification` (`verifiedAt`, `verifiedBy`, `nextReviewDue`), y por prestación `type`, `cost` (solo `free` con su nota de fuente), `costNote`, `requirements`, `appointment`, `hours`.
2. **Coordenadas:** solo con `coordinates.status: "verified"` (con `method`, `verifiedAt`, `verifiedBy`). Sin eso el lugar va solo en la lista. Para CABA se puede usar USIG; para el resto, Georef (datos abiertos). Hay que **aprobar el método** antes de cargar.
3. **Regenerar** con `npm run resources:sync` (actualiza `coverage.json` y la copia del servidor) y verificar con `resources:check` y `curation:check`.
4. **Cómo cargar:** hay dos caminos, a decidir:
   - **Manual curado** (recomendado para los primeros lotes chicos): cada establecimiento con su ficha de verificación, como en `curation/proposals/`.
   - **Pipeline de curación** (`client/curation/`): sirve si existe un dataset oficial descargable. Hoy tiene adaptadores solo para CABA (CeSAC y hospitales). Para la Provincia de Buenos Aires haría falta **un adaptador nuevo y una tabla de mapeos**, es decir, código nuevo; el buscador oficial de salud mental de PBA no ofrece (hasta donde pudimos ver) un archivo descargable.

### Pruebas que hoy fijan «solo CABA» (se actualizan, no se rompen)
- `places-centers.test.mjs` (línea ~115): lista de las claves de `COVERAGE`.
- `places-territory.test.mjs` (líneas ~43-44 y ~163-165): `PROVINCES_WITH_PLACE_FILES` igual a `["AR-C"]`, y `COVERAGE["AR-C"].places === 6`.
- Cualquier prueba que use la cobertura real para decir «Buenos Aires (sin centros verificados)» (las actuales pasan cobertura de prueba, no la real).

### Código: cambios menores y opcionales
| Cambio | Cuándo | Riesgo |
|---|---|---|
| `divisionNames`: nombre propio para una provincia que no use «Departamento» (por ejemplo, Córdoba capital está en el departamento Capital) | al incorporar cada provincia | bajo |
| Condición de residencia («DNI con domicilio en el municipio»): hoy se escribe como texto en `requirements`; no hay un campo estructurado | solo si se quiere filtrar por ella | medio: es un cambio de esquema |
| `LOAD_ALL_UP_TO` y la regla «sin provincia elegida»: hoy decide por **cantidad de lugares**, no por distancia. Con CABA + Salta + Neuquén, sin provincia elegida el mapa se encuadra en todo el país | si la cobertura se vuelve dispersa | bajo: se puede pedir elegir provincia cuando haya más de una |
| El mapa no usa la ubicación de la persona, por lo que «cercanos» no se puede ofrecer | decisión aparte | — |

## 4. Efectos fuera del mapa (hay que revisarlos, no se cambian aquí)
- **Auxi (chat):** el servidor lee todos los lugares vigentes de `resources.json`. Al cargar una provincia nueva, el catálogo del chat crece y Auxi podría recomendar esos establecimientos. No se toca el chatbot, pero **la carga de datos cambia lo que puede ofrecer**: hay que revisarlo antes de publicar.
- **Índice de contenido de Auxi:** no cambia (es de las páginas, no de los lugares).
- **Categorías:** una prestación de salud mental aparece sola en Salud mental y en el mapa; una veterinaria, en el filtro «Salud animal» (ya listo). No hay que tocar categorías.

## 5. Decisiones de diseño que necesitan al equipo
1. **¿Alcanza una norma general como respaldo de gratuidad?** Es el caso de los CeSAC (Ley 153) y de la vacunación (Ley 27.491). Si sí, se pueden cargar sin esperar una frase por servicio. Si no, hace falta una comprobación operativa por prestación.
2. **¿Un servicio gratuito solo para algunas personas entra al mapa?** Es el caso del hospital de Rosario (sin costo para adscriptos al sistema municipal; el resto paga). Con `cost: "free"` y `costNote` se muestra «Gratuita con condiciones», pero otras personas pagarían.
3. **Servicios con requisito de residencia** (Córdoba, Rosario, Salta, Neuquén): hoy la tarjeta lo diría en «Qué llevar o tener en cuenta». Conviene mostrarlo bien visible para no generar una expectativa falsa en quien vive fuera.

## 6. Orden técnico sugerido
1. **CABA, sin cambios de estructura:** cargar lo candidato a aprobación (CeSAC y centros fijos veterinarios) en `ar-c.json`. Pruebas: se actualizan los conteos de `ar-c.json` (6 lugares).
2. **Provincia de Buenos Aires:** crear `ar-b.json` con el primer lote de centros comunitarios de salud mental **ya comprobados**; actualizar las pruebas de cobertura; revisar el efecto sobre Auxi.
3. **Santa Fe (Rosario), Córdoba, Salta y Neuquén:** una provincia por vez, cada una con su archivo, su revisión y sus capturas.
4. En cada paso: `resources:sync`, `resources:check`, `curation:check`, pruebas de mapa y categorías, capturas a 320, 390 y 1280 px.
