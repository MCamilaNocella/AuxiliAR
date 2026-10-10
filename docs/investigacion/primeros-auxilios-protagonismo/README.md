# Primeros auxilios: un solo acceso, con más protagonismo

**Rama local:** `feature/first-aid-prominence` (derivada de `demo/presentation-2026-10-14`). Sin push, PR ni merge.

## Qué se hizo
- **Se quitó la banda de «Primeros auxilios»** de la home (la repetía con el bloque de la barra de emergencias). Se borró el componente `FirstAidBand`; el acceso queda **solo** en el bloque de la derecha de la barra de emergencias, junto a los números.
- **Ese bloque pasó a ser un panel en el verde azulado (teal) del sitio**, con los mismos tokens `aid` que ya estaban definidos en los tres temas (claro, oscuro y alto contraste): título en blanco, las tres guías destacadas como botones claros y «Ver todas las guías» como botón blanco (antes, un enlace subrayado).

## Estrategia
- **Protagonismo sin competir con las llamadas:** los números siguen siendo los únicos elementos en rojo saturado y no cambian de tamaño ni de lugar. El panel usa un color frío y un bloque propio con borde: se lee como «segunda opción de ayuda», no como una alarma.
- **Coherencia con la estética:** el teal es el mismo de la banda anterior, que además se funde con el degradé oscuro de la home (rojo oscuro a verde azulado), y los botones usan el mismo radio y la misma tipografía que los números.
- **Accesibilidad:** botones de 44 px de alto como mínimo, borde visible en alto contraste (donde el fondo del panel y el de los botones son negros), flecha en color de texto, y foco de teclado en blanco (el contorno burdeos anterior no se veía sobre el teal).

## Qué NO cambió
Números de emergencia, textos, etiquetas, lógica y orden de la barra: **solo cambiaron clases de estilo del bloque de primeros auxilios**. Los textos «Primeros auxilios: qué hacer ya», las guías destacadas (`FEATURED_FIRST_AID`) y las rutas son los mismos. La barra aparece en todas las páginas, así que el panel también (en la home ya no hay una segunda banda).

## Verificación
`tsc`, `build` y `test:ci` sin fallas; `oxlint` sin advertencias. Prueba nueva: la home no tiene la banda, hay un único bloque «Primeros auxilios: qué hacer ya» y es el panel teal con las tres guías y el botón a `/primeros-auxilios`. Comprobación en 320, 390, 768 y 1280 px (sin desborde, sin botones menores de 44 px) y en los temas claro, oscuro y alto contraste: ver [comprobaciones.txt](comprobaciones.txt) y las capturas de esta carpeta.

## Para decidir
- La barra de emergencias es de otra integrante (Camila): su aprobación sobre este cambio de estilo sigue pendiente, como la del cambio anterior de clases de ancho.
- Si se prefiere un panel más discreto, la alternativa es un teal más claro o solo un borde teal sobre fondo claro; es un cambio de dos clases.
