# Recursos verificados

Una única fuente de verdad para los recursos de ayuda de AuxiliAR: líneas telefónicas hoy y, más adelante, hospitales, centros y otros servicios. De acá van a leer las categorías, el buscador, los mapas, Auxi y los botones de llamada.

> **Estado: Fase 0 (infraestructura).** El formato, las validaciones y el código para leerlo ya están, pero **todavía no hay datos cargados** y **nada de la app los usa**. Los números que se ven hoy (`client/src/data/emergency.ts`, `server/.../prompts/numeros.md`, el footer, el chat y `SafetyRules.java`) siguen siendo los de siempre, sin cambios.

## Dónde está cada cosa

```
client/src/data/resources/        ← LO ÚNICO QUE SE EDITA
  README.md                       este archivo
  resource.schema.json            estructura de cada registro
  taxonomy.json                   valores permitidos (tipos, estados, provincias, áreas, categorías…)
  resources.types.ts              tipos de TypeScript
  index.ts                        cómo lo lee la app (consultas)
  lines/*.json                    los recursos, por archivo (hoy: nacional.json, vacío)

client/scripts/resources-sync.mjs        valida y genera la copia del servidor
client/scripts/resources-validate.mjs    las reglas de validación
client/scripts/resources-sync.test.mjs   tests (datos de prueba en scripts/__fixtures__)

server/src/main/resources/data/resources.json   COPIA GENERADA para el servidor: no se edita
server/src/main/java/.../resources/             ResourceCatalog: la lee y valida al arrancar
```

El servidor se construye por separado (su Docker solo ve `server/`), por eso no puede leer la carpeta del cliente: recibe una copia generada, igual que `content-index.json`. **Se edita siempre acá, nunca la copia.**

## Cómo agregar o cambiar un recurso

1. Editá un archivo de `lines/` (o creá uno nuevo, por ejemplo uno por provincia). Si el archivo empieza con `"$schema": "../resource.schema.json"`, el editor (VS Code) te sugiere los campos y marca los errores mientras escribís.
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

## Reglas editoriales

**Verificación**
- Solo se muestra a las personas, y solo puede ofrecerlo Auxi, lo que tiene `verification.status: "verified"` **y** cuya fecha `nextReviewDue` todavía no llegó. Desde ese día deja de mostrarse hasta que alguien lo vuelva a verificar. Lo mismo vale para el servidor (`ResourceCatalog.isCurrent`).
- Un recurso `verified` **tiene que** traer: `verifiedAt`, `verifiedBy`, `nextReviewDue` (posterior a `verifiedAt`) y `source` con `organization` y `url` de la **fuente oficial**. Sin eso, la validación falla.
- El plazo hasta `nextReviewDue` lo decide quien verifica, según cuánto puede cambiar el dato y cuánto riesgo tiene que esté mal. No hay un plazo fijo para todos.
- Los demás estados (`unverified`, `needs-review`, `outdated`, `disputed`) se pueden cargar pero **no se muestran**. Si un dato cambia o dudás, pasalo a `needs-review` en lugar de dejarlo como verificado.
- Verificar es comprobar contra la fuente oficial, no copiar de otra web. Anotá en `source.note` o `verification.notes` cualquier aclaración.

**Datos**
- **No inventes ni completes.** Si no sabés un dato, no lo pongas: el campo se omite o queda `null`.
- **Horarios:** `hours: null` significa "no se sabe". Nunca se completa con 24 horas por omisión. Si abre las 24 horas, `open24h: true`; si tiene franjas, `open24h: false` y `schedule` (días 0 = domingo … 6 = sábado).
- **Teléfonos:** `dial` es solo dígitos (con `+` al principio si es internacional): es lo que se marca (`tel:`) y con lo que se comparan los números. `display` es cómo se escribe en pantalla (`0800-333-0160`). Un mismo número no puede estar en dos recursos.
- **Alcance (`coverage`):** todo el país, una región o área, una provincia o un municipio. Un número que sirve solo en una zona tiene que decirlo. Si un mismo organismo tiene dos números con alcances distintos, es **un solo recurso con dos contactos**, y cada contacto lleva su propio `scope`.
- **Gratuidad (`cost`):** `free`, `paid`, `mixed` o `unknown`. No pongas `free` si no está confirmado.
- **Ids:** `id` es estable. No se reutiliza ni se cambia, aunque cambie el nombre. Formato: minúsculas, números y guiones.
- **Categorías:** por id (`salud-mental`, `centros`…). Las secciones (`sections`) se pueden indicar, pero hoy sus ids son genéricos (`section-1`…) y no se verifica que existan.
- **Dirección y coordenadas:** solo de establecimientos públicos, nunca de personas. `precision` dice si el punto es exacto o aproximado.

## Comandos (desde `client/`)

| Comando | Qué hace |
|---|---|
| `npm run resources:sync` | Valida y escribe la copia del servidor. |
| `npm run resources:check` | Valida y **falla** si la copia del servidor no está al día (no escribe nada). Pensado para el CI. |
| `npm run resources:test` | Tests del validador y del generador. |

También se valida que `taxonomy.categories` coincida con las categorías reales de la app.

## Cómo lo leen la app y el servidor

- **Cliente:** `index.ts` incorpora `lines/*.json` en el build (los números de emergencia no pueden depender de un pedido de red). Expone `getCurrentResources`, `getEmergencyBarResources`, `findResourceByDial`, `contactHref` y similares. Los hospitales y centros, cuando existan, se cargarán por demanda y no irán en el build.
- **Servidor:** `ResourceCatalog` lee `data/resources.json`, lo valida al arrancar (si está mal, el servidor **no arranca**) y ofrece `findCurrentByDial`, que es con lo que se va a comprobar que un número que Auxi quiere mostrar existe, está verificado y no venció.

## Qué viene después

Esto es solo la infraestructura. Las próximas fases, cada una en su propio cambio: cargar los números actuales como `unverified`, verificarlos con fuentes oficiales, y recién ahí hacer que `numeros.md`, `emergency.ts`, el footer, el chat y `SafetyRules.java` lean de acá.

## Datos de prueba

Los tests usan datos inventados, que nunca van en `lines/`: `client/scripts/__fixtures__/` y `server/src/test/resources/data/resources-fixture.json` (este último se regenera con `UPDATE_FIXTURE=1 npm run resources:test`).

## Si cambia el formato

1. Actualizá `resource.schema.json` y, si agregás valores permitidos, `taxonomy.json`.
2. Actualizá `resources.types.ts` (el test `resources:test` falla si sus listas dejan de coincidir con la taxonomía).
3. Actualizá `HealthResource.java`.
4. Si el cambio rompe lo existente, subí `schemaVersion` en `taxonomy.json` y `SCHEMA_VERSION` en `ResourceCatalog.java`: un servidor viejo se niega a leer un formato que no conoce.
5. `npm run resources:sync`.
