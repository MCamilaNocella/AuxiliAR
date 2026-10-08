# Propuesta técnica: filtro de Salud animal en el mapa compartido

Fecha: 8/10/2026. **Estado: la opción A se implementó en `feature/map-animal-filter` (con la variante: el botón no se ofrece, y un enlace directo muestra un estado vacío claro). No se agregaron datos veterinarios.** El texto de abajo es la propuesta original. El mapa es compartido (Encontrar atención, Cuidar mi salud, Salud sexual y ESI, Salud mental), así que cualquier cambio en su lógica necesita aprobación.

## Qué ya existe
- **Datos:** el esquema ya prevé el tipo de establecimiento `public-veterinary` (Veterinaria pública), los tipos de prestación `rabies-vaccination`, `spaying-neutering`, `veterinary-care` y `zoonosis`, y la categoría `animales` (`taxonomy.json`, `resources.types.ts`). **No hay ninguna entrada veterinaria cargada.**
- **Explorador:** `PlacesExplorer` acepta un alcance (`scope`, por categoría o tipo de prestación) y una lista de filtros rápidos propia de quien lo incrusta. Los tipos veterinarios no pertenecen a ningún grupo de filtro: solo aparecen en «Todos» (lo dice el comentario de `PLACE_FILTERS`).
- **Gratuidad:** `isVerifiedFree` ya exige, por prestación, `cost: "free"` y una nota de fuente propia. Una prestación veterinaria sin eso se mostraría como «Gratuidad no confirmada».

## Hallazgo importante: la vacunación antirrábica ya cuelga del filtro de personas
El grupo **«Vacunación»** de `PLACE_FILTERS` incluye `vaccination` **y `rabies-vaccination`**. Si hoy se cargara una vacunación antirrábica de mascotas, **aparecería en «Vacunación»**, el filtro de salud de las personas. El filtro nuevo debe sacarla de ahí.

## Opción A (recomendada): filtro rápido «Salud animal» en el mapa
**Archivos que cambiarían**

| Archivo | Cambio |
|---|---|
| `client/src/utils/places/filters.ts` | Agregar `"animal-health"` a `PlaceFilterId` y a `PLACE_FILTERS`, con `types: ["rabies-vaccination", "spaying-neutering", "veterinary-care", "zoonosis"]` y etiqueta «Salud animal». **Quitar `rabies-vaccination` del grupo «Vacunación».** Actualizar el comentario «Types outside every group (animals)». |
| `client/src/router/centersLink.ts` | Sumar `"animal-health"` al tipo `CentersFilter`. |
| `client/src/content/categories/HealthCenters/sections/Section1/Section1.content.tsx` | Agregar `"animal-health"` a la lista `FILTERS` del mapa. |
| `client/scripts/places-explorer.test.mjs`, `places-filters.test.mjs`, `places-centers.test.mjs`, `structure.test.mjs` | Pruebas: el filtro existe, los tipos son conocidos, «Vacunación» ya no incluye la antirrábica, el enlace `/centros?filtro=animal-health` abre el filtro. |
| `client/src/content/categories/Animals/sections/Section3/Section3.content.tsx` | Recién cuando haya datos: enlazar al mapa con `centersLink({ filter: "animal-health" })` (hoy la sección dice que el mapa no incluye servicios veterinarios). |

No cambia: `isVerifiedFree`, `PlaceCard`, `PlaceDetail`, las fuentes ni el criterio de verificación. El servidor (`ResourceCatalog`) deriva categorías de los tipos de prestación: no hace falta cambiarlo para el filtro.

**Cómo funcionaría:** un botón más entre los filtros rápidos del mapa. `/centros?filtro=animal-health` lo deja activo. Muestra solo los lugares con alguna prestación veterinaria vigente, cada prestación con su marca de gratuidad (confirmada o «Gratuidad no confirmada»).

**Qué mostraría sin servicios verificados (hoy):**
- Lo más honesto es **no mostrar el botón mientras no haya datos** (el filtro solo se ofrece si hay al menos una prestación veterinaria), para no invitar a una búsqueda vacía.
- Si alguien llega por un enlace directo, mostraría el mensaje que ya existe para búsquedas sin resultados: «No encontramos lugares verificados con esta búsqueda. Que no aparezcan no quiere decir que no existan: solo mostramos lo que está verificado», con el botón para quitar el filtro. Se podría sumar una línea propia: «Todavía no cargamos servicios veterinarios; mirá las campañas municipales en Salud animal», con enlace a `/temas/animales`.

## Opción B: sin filtro nuevo, con el alcance por categoría
Incrustar el mismo explorador en Salud animal con `scope={{ category: "animales" }}`. **No toca la lógica compartida**, pero es otro lugar donde aparece el mapa y mezcla páginas de contenido con una herramienta de búsqueda; además `rabies-vaccination` seguiría apareciendo en «Vacunación» del mapa general. No se recomienda.

## Límites que conviene decidir antes
1. **Las campañas no son lugares fijos.** La vacunación en operativos y las castraciones por turno online no tienen una dirección permanente: se ajustan mal a una ficha. Para el mapa, solo servirían sedes con servicio permanente (por ejemplo, un instituto de zoonosis o un hospital veterinario municipal) **y con gratuidad confirmada por prestación**. Las campañas siguen como información fechada en Salud animal.
2. **Cobertura:** el mapa hoy tiene datos solo de CABA; los servicios veterinarios de Rosario, Córdoba o Salta necesitarían las provincias respectivas en el esquema territorial.
3. **Datos primero:** antes del filtro hay que tener al menos un servicio veterinario verificado, con las tres condiciones del criterio (institución, prestación específica y gratuidad de esa prestación).

## Orden sugerido
1. Aprobar la opción A y el criterio de «no mostrar el botón sin datos».
2. Verificar el primer servicio veterinario (por ejemplo, la vacunación del Instituto Pasteur, hoy «sin confirmar» porque su página no informa el costo).
3. Implementar el filtro y las pruebas en una rama aparte del mapa, sin mezclarlo con las categorías.
