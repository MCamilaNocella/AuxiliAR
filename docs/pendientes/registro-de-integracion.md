# Registro de la integración local `integration/categories-and-map`

Fecha: 8/10/2026. **Rama local. No se publicó nada, no se hizo push ni PR y no se modificó `main` ni `origin/main`.** Nada pasa a `main` hasta que el equipo lo vea, lo pruebe y lo apruebe.

## El PR #10 (ya en `origin/main`)
Autoría: Camila Nocella, 3 a 5 de octubre de 2026. Tres commits:
- `09ef35a` «widen page max width»
- `d6c2f81` merge del PR #10 (`feature/btn-accesibility-redesing`)
- `57d2b0e` «Add temporal README»

**Qué incorpora:** solo ancho máximo de la página (de `max-w-310` a `max-w-360`, y `max-w-380` en el encabezado) en `EmergencyBar`, `Footer`, `Header`, `Page` y `Home`, y un `README.md` temporal. **No toca contenido, números de teléfono, lógica ni datos.**

**Riesgo para Emergencias:** bajo. En `EmergencyBar.tsx` cambia una sola clase de ancho del contenedor. Los números, los textos y el comportamiento no cambian. Lo que sí hay que mirar es el efecto visual: con pantallas anchas la barra de emergencias se estira más, y conviene revisar con quien trabaja Emergencias que el resultado se vea bien.

**Dato útil:** `feature/structure-and-navigation` **ya contenía** estos commits (sus commits de Camila), por eso la fusión con `origin/main` no tuvo conflictos. Después de integrar, no queda ningún `max-w-310` en `client/src`.

## Rama y orden de integración
La rama sale de `origin/main` (`57d2b0e`, la referencia local; no se hizo `fetch`). Fusiones, todas con `--no-ff`, en este orden:

| # | Rama | Resultado |
|---|---|---|
| 1 | `feature/structure-and-navigation` | sin conflictos. Trae también Primeros auxilios, la fuente única de Emergencias y la burbuja compacta de Auxi, que ya estaban integradas en esa rama |
| 2 | `feature/mental-health-content` | sin conflictos |
| 3 | `feature/map-unconfirmed-gratuity` | sin conflictos |
| 4 | `feature/sexual-health-esi` | 5 archivos con conflicto (resueltos) |
| 5 | `feature/animal-health` | 5 archivos con conflicto (resueltos) |
| 6 | Primeros auxilios | **ya incluida** en el paso 1 (`feature/first-aid-section` es ancestro de la rama de estructura) |
| 7 | `docs/verification-research` | sin conflictos |
| 8 | CI | commit propio, sin fusión |

## Conflictos resueltos
Todos eran de listas de categorías con contenido; ninguno de Emergencias, chatbot, mascota, datos sanitarios, teléfonos ni lógica clínica:
1. **`client/package.json`:** los tres scripts de prueba nuevos (`mental:test`, `sexual:test`, `animal:test`), más `test:ci`.
2. **`places-centers.test.mjs`:** lista de categorías que abren directo en una sección. Resultado: `centros, salud-fisica, salud-mental, esi, animales, primeros-auxilios, sobre-auxiliar`.
3. **`structure.test.mjs`:** ninguna categoría queda «Próximamente»; se prueban las páginas de las tres categorías nuevas; la prueba de la página «en preparación» pasa a usar un ejemplo de prueba, porque el componente queda para la próxima categoría.
4. **`preparing.ts`:** las tres definiciones desaparecieron. Se comprobó antes que **ningún archivo lo importaba**; se eliminó el archivo. Se conservan el componente `CategoryPreparing` y el campo `preparing` del tipo `Category` (los usa `Category.tsx` y hay pruebas).
5. **`ContentCatalogTest.java`:** suma de las rutas de Salud mental, Salud sexual y ESI y Salud animal.

Se regeneró el índice de Auxi con `npm run content:index` (24 páginas); no se editó a mano. No se tocó ningún archivo del chatbot.

## «Próximamente»
Se quitó únicamente donde ya hay contenido real: **las tres categorías** (Salud mental, Salud sexual y ESI, Salud animal) ya no tienen el estado en preparación. No quedó ninguna categoría con esa etiqueta.

## CI
Se agregó el paso `npm run test:ci` entre el lint y la compilación en `.github/workflows/node.js.yml`. Corre las pruebas de estructura, Salud mental, Salud sexual y ESI, Salud animal, mapa, salud física y primeros auxilios, curación, emergencias y chat de ayuda, y los controles `resources:check` y `curation:check`. **El despliegue y la configuración de producción no cambiaron.** Quedan fuera: `resources:test` (inestable) y las pruebas de Java (el CI no construye el servidor).

## Qué quedó fuera de esta integración
Ramas locales con commits que **no** entraron (no estaban en el pedido y no se tocaron): `backup/wip-2026-10-07` (protegida), `chore/category-sections-structure`, `demo/ux-review` (4 commits) y `feature/auxi-label`. Tampoco se tocaron los stashes.
- No se agregó ningún servicio, centro ni teléfono, ni se cambió el estado de ningún recurso. Ningún recurso pendiente pasó a confirmado por integrar.
- No se implementó el filtro de Salud animal: ver `propuesta-filtro-salud-animal-en-el-mapa.md`.

## Revisiones pendientes (siguen señaladas)
1. **Ley 27.610:** revisión editorial y legal antes de publicar (la sección «Derechos y ESI»).
2. **Salud animal:** revisión veterinaria y clínica del texto antes de publicar.
3. **Campañas municipales:** cotejar gratuidad y vigencia de cada una con su página oficial.
4. **Primeros auxilios:** revisión clínica de las guías.
5. **Auxi en celular y escritorio:** la mascota y la burbuja siguen tapando contenido (`auxi-superposicion-movil.md`); la propuesta de la mascota plegada espera aprobación (`auxi-propuesta-plegada-movil.md`).
6. **Salud mental:** SM05 y los centros comunitarios de PBA, sin confirmar.
7. **Mapa:** de 33 prestaciones, 2 tienen gratuidad confirmada (ver el inventario).
