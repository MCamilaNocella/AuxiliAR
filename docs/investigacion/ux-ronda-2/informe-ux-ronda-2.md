# Ronda de UX/UI de la demo: menú, portada, Primeros auxilios y mapa con gratuidad documentada

Fecha: 9/10/2026. Rama local `feature/demo-ux-round2` (desde `release/demo-candidate-2026-10-14`). Sin push, PR ni merge; `main` y `origin/main` intactos. No se tocó Emergencias (números, textos, lógica, bloque de números inmediatos), chatbot, prompt, servidor, componente de Auxi ni stashes. No se agregaron centros, servicios ni afirmaciones de gratuidad. Capturas: [antes](capturas/antes/) y [después](capturas/despues/).

## 1. Menú
«Menú superior» se interpretó como la navegación principal (la barra con el botón rojo). Queda: **Inicio · Encontrar atención · Mi salud · Emergencia** (botón rojo, sin cambios). Primeros auxilios salió del menú; su sección y su ruta (`/primeros-auxilios`, `/primeros-auxilios/:slug`) siguen igual. **Mi salud** (`/mi-salud`, antes redirigía al inicio) muestra «En construcción» y «Este módulo todavía no está disponible», con enlaces al inicio, a Cuidar mi salud y a Encontrar atención. No hay usuarios, historias clínicas ni almacenamiento. Se verificó a 320, 390 y 1280 px (los 4 ítems entran sin desborde).

## 2. Seis categorías de la portada
Exactamente estas, en este orden, con el texto pedido, bajo «¿Qué necesitás hoy?»:

| # | Tarjeta | Subtítulo | Destino |
|---|---|---|---|
| 1 | Centros de atención | Mapa de hospitales y centros de salud | `/centros` (el mismo mapa que «Encontrar atención») |
| 2 | Salud general | Controles, cuidados y calendario de vacunación | `/temas/salud-general` |
| 3 | Salud sexual - ESI | Anticonceptivos, prevención y derechos sexuales | `/temas/esi` |
| 4 | Atención veterinaria | Prevención, chequeos, castración gratuita y más | `/temas/animales` |
| 5 | Salud mental | Herramientas de autocuidado, y orientación: cómo pedir ayuda | `/temas/salud-mental` |
| 6 | Más recursos | Derechos, leyes, FAQ, y trámites | `/recursos` |

Solo cambia el título y la línea de la tarjeta (en `Categories.constants.ts`); los títulos, rutas y contenidos internos de las categorías **no se tocaron** (por eso las pantallas siguen llamándose «Salud animal», «Cuidar mi salud», etc., y el índice de páginas de Auxi no cambia).

**Pendiente de consulta — «Más recursos»:** no tiene página con contenido (sus cuatro secciones eran «Sección 1…4» vacías y su dirección redirigía al inicio). No inventé nada: `/recursos` ahora muestra la página honesta «Próximamente» que el sistema ya tenía (qué va a tener, por qué no está publicada) y, «mientras tanto», dos enlaces a contenido existente: «Conocé tus derechos en salud mental» y «Derechos y ESI». La tarjeta dice «Próximamente». Hay que confirmar si les sirve así o qué contenido debe tener.

**Para aprobar — texto de la tarjeta 4:** «castración gratuita» está tal como se pidió; hoy respalda esa frase solo el Centro de Costanera Sur (gratuita con condiciones: turno previo, miBA, acompañante mayor de 18 años). Es la única mención de gratuidad de la portada.

## 3. Primeros auxilios destacado
Una franja a todo el ancho arriba de las categorías: título «Primeros auxilios», una línea («Guías paso a paso para saber qué hacer mientras llega la ayuda: RCP, atragantamiento, quemaduras y más») y el botón **«Ver las guías»** (48 px, blanco sobre verde azulado) hacia `/primeros-auxilios`. Es más grande y con color propio que una tarjeta, y menos que la barra roja de Emergencias. Colores nuevos `--color-aid*` definidos en los tres temas (claro, oscuro y alto contraste, donde es negro con borde blanco). No tiene números ni acciones de llamada: el bloque de emergencias no se modificó (los 5 números, igual que antes).

## 4. Mapa: solo gratuidad documentada
**Regla** (una sola, en `selectPlaces` con `confirmedOnly`, activada siempre por el explorador): solo se muestran prestaciones con gratuidad confirmada por fuente oficial (gratuitas o gratuitas con condiciones). Resultados, tarjetas, marcadores, contadores, búsqueda, filtros, opciones con sus números y panel salen de lo visible. Un centro con prestaciones confirmadas y no confirmadas muestra solo las confirmadas; uno sin ninguna no aparece. **Los 34 registros siguen en el dataset** (prueba: 34 prestaciones, 25 sin gratuidad documentada).

| | Antes | Después |
|---|---|---|
| Lugares en el mapa y la lista | 7 | **6** (sale el Hospital Oftalmológico Santa Lucía) |
| Prestaciones visibles | 34 | **9** |
| CeSAC 3 | 9 prestaciones | Clínica médica; Vacunación (con condiciones) |
| CeSAC 41 | 7 | Medicina general; Vacunatorio (con condiciones) |
| CeSAC 47 | 14 | Medicina general; Pediatría |
| Hospitales de Odontología Carrillo y Dueñas | 1 cada uno | igual (guardia odontológica) |
| Centro Costanera Sur | 1 | igual (castración, con condiciones) |

Otros cambios del mapa: se quitó la casilla «Solo gratuidad verificada» (todo lo visible ya lo es); los filtros y categorías sin prestaciones documentadas (Salud mental, Salud sexual, Odontología de CeSAC, ESI) desaparecen o muestran 0; el mensaje de «sin resultados» dice «No encontramos prestaciones con gratuidad documentada para esta búsqueda… no quiere decir que no existan ni que no sean gratuitas»; un enlace directo a un lugar sin prestaciones documentadas (`?lugar=hospital-oftalmologico-santa-lucia`) no abre ficha. Se conservan las fuentes oficiales, requisitos, condiciones y la nota de ubicación aproximada, y la ficha sigue diciendo que la gratuidad no confirma turnos, vacunas ni horarios.

**Efecto para decidir:** varios enlaces de otras categorías abren el mapa con un filtro que ahora no tiene resultados: Salud mental (2 enlaces, filtro Salud mental), Salud sexual y ESI (2 enlaces, filtro Salud sexual) y, en Cuidar mi salud, «Buscar atención odontológica» (2 enlaces, filtro Odontología). Llegan al mapa con «0 lugares» y el mensaje anterior. No se cambiaron sus textos (son contenido aprobado): hay que decidir si se ajustan o se quitan esos botones.

## 5. Texto de verificación
Se quitó del encabezado del mapa «Centros verificados por AuxiliAR, incorporados de a poco. Cómo verificamos los datos». «Cómo verificamos los datos» queda como enlace secundario al final de la página del mapa (44 px de alto) → «Sobre los datos». Esa página se corrigió para que sea exacta con la nueva política: el mapa muestra solo prestaciones con gratuidad que una fuente oficial confirma; las demás no se muestran aunque el centro esté; no aparecer no quiere decir que sea paga; la gratuidad no asegura turnos, vacunas, insumos ni horario. No cambió el resumen que usa Auxi para esas páginas.

## 6. Pruebas
- `npm run test:ci`: todo pasa. Nuevo: `places-visible.test.mjs` (6 pruebas: dataset intacto, 6 lugares y 9 prestaciones, ninguna búsqueda/filtro/opción/conteo revela lo no documentado —17 palabras × 8 filtros—, tarjetas y fichas, la política se aplica en un solo lugar y ningún otro código lee los lugares sin ella, textos de transparencia) y la prueba de la franja en `demo:test` (6). Se actualizaron las pruebas de estructura (portada, menú, `/recursos`, `/mi-salud`), del explorador (conteos 7→6 y mensajes) y de «Sobre los datos». Mapa: 136 pruebas.
- `tsc`, `lint`, `build`: sin errores.
- `resources:test`: 33/33 en una corrida; en otra falló 1 (`resources-sync`, la inestable conocida, fuera de CI).
- **Chrome a 320, 390 y 1280 px sobre la compilación de demo:** 0 fallas y 0 errores de consola; sin desbordes. Comprobado: menú de 4 ítems; las 6 tarjetas (texto, orden y destino por clic); franja y su botón; Mi salud; Más recursos; mapa con 6 lugares y 6 marcadores; búsquedas «psicologia», «salud mental», «anticonceptivos», «vih», «farmacia», «oftalmologia» → 0; «odontologia» → 2; «castrar a mi perro» → 1; filtro Salud mental → 0; fichas de CeSAC 3 y de Costanera Sur; 404 y las tres rutas de prototipo → 404.
- Java: no se corrió (servidor sin cambios).

## 7. Pendiente de aprobación humana
1. Contenido de «Más recursos» (hoy «Próximamente»).
2. Texto de la tarjeta «Atención veterinaria» (menciona «castración gratuita»).
3. Botones de Salud mental, Salud sexual y Odontología que abren el mapa sin resultados.
4. Camila: la fusión de `origin/main` (pie y `EmergencyBar`), de la ronda anterior.
5. Validación clínica de las guías de fracturas y propuesta de Auxi «En desarrollo» (rondas anteriores).
