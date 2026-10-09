# Versión de demo para el miércoles 14 de octubre: ajustes, integración local y auditoría

Fecha: 9/10/2026. Rama de integración local: `integration/demo-2026-10-14` (desde `feature/map-demo-adjustments`, que sale de `feature/map-vet-costanera-sur`). Sin push, PR ni merge. `main` (4409451) y `stash@{0}`/`stash@{1}` no se tocaron. No se tocó Emergencias, teléfonos, chatbot ni el componente de Auxi.

## 1. Los tres ajustes del mapa (commit `a13bc4d`)

| Ajuste | Qué cambió |
|---|---|
| Rótulo de gratuidad | «Atención gratuita» pasó a **«Gratuita»** (sin condiciones adicionales documentadas) y **«Gratuita con condiciones»** (la fuente aclara condiciones). Sirve para una consulta y para una castración. En el panel, el texto de condición empieza con «Gratuita con condiciones.». Se actualizaron la explicación de la página «Sobre los datos» y el glosario de ESI (ahora «Gratuidad confirmada») para que digan lo mismo que el mapa. Los textos de las líneas de ayuda («Atención gratuita y confidencial») son datos de Emergencias y no se tocaron. |
| Búsqueda por verbo | «castrar», «castrar a mi perro», «castrarlo», «castrada», «castrar gratis» y «castrar a mi perra/gata» encuentran la castración. Es una lista corta y exacta (palabra completa) en `text.ts`: los verbos de castrar → «castración», y perra/perras/gata/gatas → perro/gato (el recorte de palabras no los unía por ser cortos). No se amplía nada más. |
| Tarjetas de CeSAC 3 y 41 | La condición de la vacunación ahora dice **«Condiciones de esta prestación:»** debajo de «Programas de vacunación / Vacunatorio». Las demás prestaciones de la tarjeta no llevan condiciones y la tarjeta no pone «con condiciones» como título general (probado). |

No se agregaron establecimientos ni se cambió ningún estado de gratuidad.

**Pruebas nuevas** (`places-vet.test.mjs`, ahora 14): búsquedas que deben encontrar la castración (10 formas, con y sin «gratis»); búsquedas que **no** deben devolver nada («castrar a mi caballo», «castrar vacuna», «castrar a mi hijo», «vacunar a mi perro», «esterilizar a mi perro», «castrarse», «vacunas para mi perra»); ningún lugar humano responde «castrar» con ningún filtro; las equivalencias son solo las listadas; ningún rótulo dice «Atención gratuita»; las condiciones de CeSAC 3 y 41 se atribuyen a la vacunación y a nada más.

Límites: «quiero castrar a mi perra» no encuentra nada (la palabra «quiero» no está en ningún lugar: la búsqueda pide que cada palabra esté; no se agregaron palabras vacías). «Esterilizar» no está en la lista. En el panel, el chip y la primera palabra del texto repiten «Gratuita con condiciones» (es redundante, no incorrecto).

## 2. Integración local

### Estado de las ramas (inspeccionado antes de integrar)
- `main` local = `4409451`. La rama de trabajo **contiene** `main` y todas las ramas de funcionalidades: categorías y mapa (`integration/categories-and-map`), emergencias y burbuja (`integration/emergency-and-bubble`), salud mental, salud sexual y ESI, salud animal, primeros auxilios, salud general, burbuja compacta y saludo de Auxi, y el chatbot. Nada de eso se volvió a fusionar: no hay merges duplicados.
- **`origin/main` tiene cambios de otra persona que `main` no tiene** (Camila Nocella, 3 al 7/10): ancho de página, alineación del layout en distintos tamaños, pie y encabezado, botón de accesibilidad, README. El remoto real estaba más adelante que mi copia local (`57d2b0e` → `46f1a86`): para verlo hice un `git fetch` de lectura, que actualizó la referencia local `origin/main` y creó `refs/remote-snapshots/main`; no escribí en el remoto.
- No incluidas en la rama: `chore/category-sections-structure` (1 commit: la estructura de secciones ya está resuelta de otro modo en la rama) y `feature/auxi-label` (1 commit, toca el componente del bot flotante: no se tocó), `demo/ux-review` (páginas de comparación de burbujas, «solo revisión»), y `backup/wip-2026-10-07` (nunca se publica).

### Lo que NO quedó integrado y necesita decisión
**Los cambios de `origin/main` (commit `503f39f`) no están en la rama de demo.** Intenté fusionarlos y hay un conflicto en `Footer.tsx`: el pie de la rama dice «Ante una emergencia, llamá al {número único de emergencias}» (código de Emergencias ya autorizado en la base), y el de `origin/main` tiene el mismo texto escrito a mano («911 o 107») con otro formato. Resolverlo implica decidir el texto de emergencia del pie, y esa decisión es de ustedes: **cancelé la fusión** (`git merge --abort`) y la rama de demo queda sin los cambios de layout de Camila. El resto de esos cambios (9 archivos) se fusiona sin conflicto, incluido un cambio de una línea de clases en `EmergencyBar.tsx` (ancho de página, no texto).

Propuesta si lo aprueban: tomar el formato de `origin/main` y conservar el número único de la base en el pie.

### Qué se puede recorrer en la demo (comprobado en Chrome, 320/390/1280 px)
- **Inicio** con barra de emergencias (107, 911, 144, 135, 102 como enlaces `tel:`, sin cambios) y las **seis categorías**: Encontrar atención, Cuidar mi salud, Salud mental, Salud sexual y ESI, Salud animal, Primeros auxilios. Las seis abren con su título y sus secciones tienen contenido.
- **Mapa integral y filtros**: 7 lugares (CABA), vista lista y mapa, filtros de tipo, provincia, prestación y gratuidad verificada, búsqueda, panel de detalle con «Fuentes oficiales».
- **Salud mental**, **Salud sexual y ESI**, **Salud animal** (con el Centro Fijo Veterinario de Costanera Sur), **Primeros auxilios** (15 guías, todas abren), **Sobre AuxiliAR** y «Sobre los datos».
- **Emergencias**: solo el código que ya estaba (barra superior en inicio, pestaña «Emergencia» de la barra inferior desde cualquier pantalla, pie con el número único).
- **Chat de Auxi**: abre, hace la pregunta de emergencia y responde al «No». Para responder consultas necesita el servidor con un proveedor de IA (ver bloqueos).

## 3. Auditoría de demo

Se recorrieron 47 rutas (todas las que enlaza la aplicación más las rutas conocidas) en 3 anchos. Datos completos: [audit.json](audit.json) y [links.txt](links.txt).

| Aspecto | Resultado |
|---|---|
| Errores que impiden navegar | **Ninguno.** 0 errores de página, 0 desbordes horizontales, 0 peticiones fallidas (sin contar el mapa base). |
| Errores de consola | 1 solo, en una ruta inexistente (ver Rutas). |
| Rutas inexistentes | `/ruta-que-no-existe` muestra **«Unexpected Application Error! 404 Not Found»** (pantalla genérica de React Router, también en la versión de producción, sin barra ni navegación). Una categoría o guía que no existe sí muestra un mensaje propio («Categoría no encontrada», «No encontramos esta guía»). `/recursos`, `/mi-salud` y `/temas` redirigen al inicio; `/temas/salud-fisica` redirige a Salud general. |
| Rutas de prototipo expuestas | `/auxi-modelos` (21 modelos de la mascota), `/boceto-chat-personas` y `/login` (página vacía con la palabra «login», sin zona principal) existen en el router. Ningún enlace de la aplicación lleva a ellas, pero se abren si alguien escribe la dirección. |
| Enlaces rotos | De 71 enlaces externos (contenidos, fuentes de los lugares, fuentes de las guías): 59 responden 200. Con problema real: **`argentina.gob.ar/.../situaciones/fracturas`** responde 403 y su título dice «500 - Error», tanto con curl como en Chrome (guía de fracturas); **`www.fvet.uba.ar/hospital/`** (fuente de Salud animal, `Animals.sources.ts`) no resuelve (DNS o tiempo agotado). Intermitentes: varias páginas de `buenosaires.gob.ar` (CeSAC 3, CeSAC 47, hospitales) dieron 500/504 en ráfaga y 200 al reintentar: conviene revisarlas el día anterior. |
| Controles tapados por Auxi | La mascota se asoma por el borde derecho; a 320 px casi solo se ve la mano. **No tapa ningún control al final de la página ni en el panel de detalle** (probado), salvo 8 a 19 % de un enlace en 3 pantallas: «Cómo verificamos los datos» (Sobre AuxiliAR, 320), «Salud visual» (Salud general, 390) y «Hemorragia grave» (Primeros auxilios, 390). **La burbuja «¡Hola! Soy Auxi, ¿necesitás ayuda?» tapa texto del contenido en móvil** (por ejemplo, el recuadro «Una campaña gratuita no es atención veterinaria gratuita» y la lista de lugares); se cierra con su X. Ver capturas `390-categoria-salud-animal` y `390-mapa`. No se modificó el componente. |
| Accesibilidad | Hay `lang`, una sola `h1`, botones y enlaces con nombre, imágenes con `alt`, campos con etiqueta, sin `id` duplicados ni `tabindex` positivos (el único «botón sin nombre» detectado es un falso positivo: «Ver todos los números de emergencia» dentro de un desplegable cerrado). A mejorar: objetivos táctiles de menos de 24 px (entre 1 y 5 por pantalla, sobre todo en `/centros`; detalle en `audit.json`) y `/login` sin zona principal. |
| Chatbot (sin modificarlo) | **No se pudo probar con respuestas reales: no hay credenciales del proveedor de IA** (es la misma causa de la falla de Java). Sin servidor, el chat responde «Perdón, no me pude conectar en este momento. Probá de nuevo en un rato. Si es una emergencia, llamá al 911.» (captura `390-chat-sin-servidor`): degrada bien. Revisión estática del prompt (`auxi.md`, `paginas.md`) con riesgos de respuesta engañosa: ver abajo. |

### Riesgos de respuestas potencialmente engañosas de Auxi (lectura del prompt, no prueba)
1. **Regla 2 del prompt:** si AuxiliAR no tiene información, Auxi «respondé vos con lo que sabés». Ante «¿dónde castro a mi perro gratis?» o «¿es gratis la vacuna X?» puede afirmar gratuidad o lugares que el mapa no verificó. Contradice el criterio del mapa (no inferir gratuidad).
2. **Auxi no recibe los datos del mapa** (la copia del servidor se usa para las líneas de ayuda; el prompt solo lista números y páginas). Corrijo lo que dije en el informe anterior: **Auxi no puede mencionar el Centro de Costanera Sur ni sus condiciones**; solo sabe que existe el mapa y que cubre la Ciudad de Buenos Aires.
3. El prompt dice que la lista de números «no dice si cada llamada es gratuita: no lo afirmes», mientras la barra de emergencias muestra «144 Violencia gratuita» y «102 Niñez gratuita». Son datos de Emergencias (no se tocaron); conviene revisar que coincidan.
4. Si el servidor no está en la demo, el chat solo muestra el mensaje de error: hay que decidir si se muestra o se explica.

## 4. Pruebas

| | Resultado |
|---|---|
| `npm run test:ci` (estructura, salud mental, salud sexual, animal, lote 1, mapa [130], salud, curación, emergencias, líneas, `resources:check`, `curation:check`) | todo pasa |
| `tsc`, `lint`, `build` | sin errores |
| `resources:test` | pasa 27/27 en la segunda corrida; en la primera falló 1 (prueba inestable conocida, fuera de CI) |
| Chrome 320/390/1280 | 0 fallas de navegación, 0 desbordes, sin errores de consola salvo la ruta inexistente |
| **Java** (`mvn test`) | **58 de 59: falla solo `ServerApplicationTests.contextLoads`** (necesita las credenciales del proveedor de IA). Es una falla preexistente documentada aparte en [docs/pendientes/java-contextloads-sin-credenciales.md](../../pendientes/java-contextloads-sin-credenciales.md); no se modificó el servidor. |

## 5. Bloqueos críticos para el miércoles 14 y correcciones priorizadas

**Bloqueos (decisión o acción antes del 14)**
1. **Chat de Auxi:** decidir si la demo lleva servidor con proveedor de IA (hay que tener las credenciales y probar respuestas antes) o si se muestra el mensaje de «no me pude conectar». Probar al menos 10 preguntas, incluidas las de gratuidad y castración, por el riesgo 1.
2. **Integrar o no los cambios de `origin/main`** (layout y botón de accesibilidad de Camila): hace falta decidir el texto de emergencia del pie (conflicto en `Footer.tsx`). Hoy la demo no los incluye.
3. **Página de error 404 propia:** hoy una dirección mal escrita muestra la pantalla de error técnica de React Router.

**Lista priorizada (todas chicas)**
1. Fusionar el layout de `origin/main` con el pie decidido (30 min con la decisión tomada).
2. Página 404 con la barra y la navegación, y ruta `*` (no toca Emergencias).
3. Reemplazar o quitar los dos enlaces rotos (fracturas de argentina.gob.ar, fvet.uba.ar) tras abrirlos en el navegador; revisar las páginas de buenosaires.gob.ar el día anterior.
4. Sacar del router de la demo `/login`, `/auxi-modelos` y `/boceto-chat-personas`, o dejarlas sin enlaces (hoy no tienen).
5. Burbuja de saludo de Auxi en móvil: que no tape contenido (necesita tocar el componente de Auxi: requiere su autorización).
6. Objetivos táctiles menores de 24 px en `/centros` (detalle en `audit.json`).
7. Prompt de Auxi: no responder gratuidad ni lugares que el mapa no verificó (requiere tocar el servidor: requiere su autorización).
8. Revisar la agenda del Centro de Costanera Sur antes del 17/10 (vence) y a más tardar el 8/11/2026.
9. Pendiente técnico aparte: `contextLoads` de Java.

Capturas en [capturas/](capturas/): inicio, mapa y las seis categorías más «Sobre AuxiliAR» a 320, 390 y 1280 px; además el inicio completo a 1280, la búsqueda «castrar a mi perro», la tarjeta de CeSAC 3, el chat sin servidor y la pantalla 404.
