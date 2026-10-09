# Ajuste visual: botón «Cerrar» del panel a 320 px

Fecha: 9/10/2026. Cambio mínimo, sin tocar la navegación ni rediseñar el panel.

## Qué pasaba
A 320 px el botón «Cerrar» quedaba pegado al borde derecho de la pantalla (su borde derecho a 321 px de 320). **El botón no estaba mal**: su espaciado interno era correcto (16 px). El problema era que **la página de fondo era más ancha que la pantalla**: en la lista de centros, la fila con el selector de vista (lista/mapa) y el botón «Filtros» no entra en 320 px y empujaba el ancho de la página a 337 px (a 369 px con un filtro activo, porque el botón crece con el contador). En un celular, el navegador amplía entonces la «pantalla» de la página, y el panel (que ocupa todo el ancho) se extendía más allá de lo visible, cortando a «Cerrar».

Mi comprobación anterior del desborde comparaba el ancho de la página con el ancho de la ventana, que en celular también se amplía: por eso no lo detectó. Ahora se compara con el ancho real de la pantalla.

## Qué se cambió (una línea)
`PlacesExplorer.tsx`: la fila con el selector de vista y el botón «Filtros» ahora puede pasar a otra línea cuando no entra (`flex-wrap`). A 360 px o más sigue en una sola fila, igual que antes; a 320 px el botón «Filtros» baja a su propia línea. El panel de detalle **no se modificó**.

## Verificación (Chrome, 320, 360, 390 y 1280 px; 0 fallas)
- Sin desborde horizontal real (ancho de la página ≤ ancho de la pantalla) en la lista, la lista con filtro de gratuidad y el mapa, en los cuatro anchos.
- «Cerrar»: a 320 px queda a **16 px del borde derecho** (antes, fuera de la pantalla); a 24 px a 1280 px.
- Área táctil: **110 × 44 px** en todos los anchos (mínimo accesible de 44 × 44).
- No tapa contenido: está en su propia barra sobre el título, y el título empieza debajo de esa barra.
- La navegación no cambió: «Cerrar» cierra el panel y el foco vuelve a la tarjeta que lo abrió. Sin errores de consola.
- Prueba de regresión nueva (`places-evidence.test.mjs`): la fila contiene `flex-wrap`. Se comprobó que la prueba falla si se quita.
- Capturas: [capturas-ajuste-visual/](capturas-ajuste-visual/) (completas en `%TEMP%\audit22\`).

## Observación
Los elementos de la mascota Auxi se salen de la pantalla a propósito (están ocultos fuera del borde): no se tocaron y no producen desborde.
