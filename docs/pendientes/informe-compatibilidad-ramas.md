# Informe de compatibilidad entre ramas

Fecha: 8/10/2026. **No se combinó nada.** Todas las pruebas son simulaciones con `git merge-tree`, que calculan el resultado de una fusión sin tocar ninguna rama ni el árbol de trabajo. No se creó ninguna rama de integración: se propone abajo, a la espera de aprobación.

## Estado de partida
- Ninguna rama de trabajo está en `main`. `main` local (`4409451`) está **3 commits atrás de `origin/main`** (PR #10 «btn-accesibility-redesing», que ensancha el ancho máximo de la página y toca `EmergencyBar`, `Footer`, `Header`, `Page` y `Home`; y un README temporal). No se tocó.
- Las ramas de contenido salen de `feature/structure-and-navigation` (57 commits sobre `main`: primeros auxilios, estructura y navegación).

| Rama | Sale de | Qué contiene |
|---|---|---|
| `feature/structure-and-navigation` (S) | primeros auxilios | Base: seis accesos, navegación, páginas por categoría |
| `feature/mental-health-content` (M) | S | Salud mental (3 secciones), `SourceList`, criterio de recomendación |
| `feature/sexual-health-esi` (X) | S | Salud sexual y ESI (3 secciones), `SourceList`, `OutLink`, `PointerList` |
| `feature/animal-health` (A) | S | Salud animal (3 secciones), `SourceList`, `OutLink`, `ServiceList` |
| `feature/map-unconfirmed-gratuity` (P) | S | «Gratuidad no confirmada» en tarjetas y fichas del mapa |
| `docs/verification-research` (D) | M | Documentos de investigación y propuestas |

## Resultado de las simulaciones de fusión

| Combinación | Resultado | Archivos en conflicto |
|---|---|---|
| M + X | **conflicto** | `package.json`, `places-centers.test.mjs`, `structure.test.mjs`, `preparing.ts`, `ContentCatalogTest.java` |
| M + A | **conflicto** | `package.json`, `places-centers.test.mjs`, `structure.test.mjs`, `ContentCatalogTest.java` |
| X + A | **conflicto** | los mismos 5 que M + X |
| M + P, X + P, A + P | limpio | — |
| D + M | limpio | — |
| D + X, D + A | conflicto | los mismos (heredados de M) |
| D + P | limpio | — |
| cada rama + `origin/main` | limpio (S, M, X, A, P) | — |

### Qué dicen los conflictos
Todos son del mismo tipo: **cada categoría edita la misma línea de una lista** («qué categorías tienen contenido»). Ninguno es un conflicto de contenido ni de lógica:
1. **`package.json`**: cada rama agrega su script (`mental:test`, `sexual:test`, `animal:test`) en el mismo lugar. Se resuelve conservando los tres.
2. **`places-centers.test.mjs`**: la lista de categorías que abren directo en una sección. Resultado esperado: `["centros", "salud-fisica", "salud-mental", "esi", "animales", "primeros-auxilios", "sobre-auxiliar"]`.
3. **`structure.test.mjs`**: la lista de categorías «Próximamente». Con las tres categorías hechas queda **vacía**. Además, las pruebas de «página de una categoría sin información» usan esas categorías como ejemplo y **quedan huérfanas**: hay que rehacerlas con una categoría de prueba (fixture), o retirarlas si se decide eliminar el estado «Próximamente».
4. **`preparing.ts`**: cada rama borra una de las tres definiciones. El archivo queda vacío. El componente `CategoryPreparing` y el campo `preparing` del tipo `Category` quedan sin uso real: decidir si se conservan para futuras categorías o se retiran.
5. **`ContentCatalogTest.java`**: la lista de páginas con contenido para Auxi. Se resuelve sumando las tres rutas nuevas.

### Cambios que no dan conflicto pero hay que rehacer
- **`content-index.json`** se fusiona sin conflicto de texto, pero **se debe regenerar** con `npm run content:index` (nunca a mano) después de combinar: es el índice que usa Auxi. Hay una prueba por categoría que lo comprueba.
- **Componentes repetidos**: `SourceList` se agregó en M, X y A, y `OutLink` en X y A, **con contenido idéntico**: Git los une sin conflicto.
- **`PointerList`** (X) y **`ServiceList`** (A) son específicos de cada categoría y no se pisan.

### Interacción entre el mapa (P) y las categorías
- Sin conflicto de archivos. La frase «Consultá cada ficha para saber qué servicios gratuitos están confirmados» de Salud mental y Salud sexual y ESI coincide con lo que muestra la tarjeta de P («Gratuidad no confirmada»): las dos ramas se refuerzan.
- Salud animal **no usa el mapa**; no depende de P.
- Sin P, los botones del mapa llevan a tarjetas que no marcan lo pendiente: por eso conviene integrar P junto con M y X, no después.

## Qué hay que mirar antes de integrar
1. **Con `origin/main`**: el PR #10 cambió el ancho máximo y `EmergencyBar`. Textualmente es compatible, pero hay que volver a sacar capturas (celular y escritorio) de todas las páginas.
2. **El CI** (`.github/workflows/node.js.yml`, que no se toca) no corre `mental:test`, `sexual:test`, `animal:test` ni `structure:test`. Si el equipo quiere que corran, hay que agregarlos con su aprobación.
3. **`resources:test`** sigue siendo inestable (alrededor de la mitad de las veces); no tiene relación con estos cambios.
4. **Emergencias**: ninguna rama modifica `emergency.ts`, números ni `EmergencyBar`; el PR #10 sí toca `EmergencyBar.tsx` (una línea de ancho): revisarlo con quien trabaja Emergencias.
5. **Mascota y burbuja de Auxi**: ninguna rama las modifica. El bloqueo de accesibilidad móvil sigue registrado (`docs/pendientes/auxi-superposicion-movil.md`).

## Propuesta de integración (no ejecutada)
Rama local `integration/categories-and-map`, creada desde `feature/structure-and-navigation` (o desde `origin/main` actualizado, a elección del equipo). Orden sugerido:
1. **M** (Salud mental): deja listos `SourceList` y el criterio de recomendación.
2. **P** (mapa): limpio.
3. **X** (Salud sexual y ESI): resolver las 5 listas.
4. **A** (Salud animal): resolver las listas y las pruebas huérfanas.
5. **D** (documentos): limpio.
6. Regenerar el índice (`npm run content:index`), actualizar `ContentCatalogTest`, correr **todas** las pruebas (cliente, `tsc`, lint, build, Java) y volver a tomar capturas a 320, 390 y 1280 px.

La rama de integración también es **local**. Nada pasa a `main` hasta que ustedes lo vean, lo prueben y lo aprueben.

## Para decidir
1. Si se crea la rama de integración y desde dónde sale (S o `origin/main` actualizado).
2. Qué se hace con el estado «Próximamente» cuando ya no quede ninguna categoría sin contenido.
3. Si se agregan al CI las pruebas nuevas.
4. Quién revisa con el equipo de Emergencias el cambio de `EmergencyBar` del PR #10.
