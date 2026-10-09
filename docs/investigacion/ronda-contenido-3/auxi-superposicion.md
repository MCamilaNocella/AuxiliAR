# Dónde Auxi tapa contenido en móvil (para quien mantiene Auxi)

Fecha: 9/10/2026. **No se modificó Auxi** (`components/help/HelpBot`, `HelpBubble`, `useAuxiAvoidance`, `utils/auxiAvoidance.ts`): este documento solo mide y propone. Medición con Chrome, `npm run dev`, scroll cada 160 px; datos en [auxi-superposicion/medicion.json](auxi-superposicion/medicion.json).

## 1. Qué se comprobó

**Qué es lo que tapa.** Auxi son dos piezas fijas en la esquina inferior derecha, encima de la barra inferior:
- **La burbuja** «¡Hola! Soy Auxi, ¿necesitás ayuda?»: a 390 px ocupa la caja de (176, 632) a (338, 695), unos 162 × 63 px, siempre en el mismo lugar de la pantalla.
- **La cabeza de Auxi** (botón de 72 px) debajo de la burbuja, también fija; tapa el borde derecho de la última línea visible.

**Por qué ocurre.** `utils/auxiAvoidance.ts` hace que Auxi se corra solo cuando tapa algo que se **puede tocar** (`INTERACTIVE_SELECTOR`: enlaces, botones, campos, `summary`, pestañas). **El texto no está protegido**: párrafos, listas, títulos y definiciones quedan debajo de la burbuja mientras no haya un control en esa zona.

**Cuánto.** Con la burbuja visible a 390 × 844 px, cantidad de posiciones de scroll (de las medidas) en las que la burbuja tapa al menos un bloque de texto:

| Página (390 px) | Posiciones con texto tapado | Ejemplo de lo que tapa | Captura |
|---|---|---|---|
| Calendario de vacunación (Hasta un año) | 16 de 24 | «Rotavirus: primera dosis.», «A los 3 meses», «Meningococo: primera dosis.» | [calendario-390.png](auxi-superposicion/calendario-390.png) |
| Más recursos › Trámites | 14 de 22 | «Por la web, en el portal de turnos…», «Por Boti, el WhatsApp de la Ciudad.», «Por teléfono, al 147…» | [tramites-390.png](auxi-superposicion/tramites-390.png) |
| Más recursos › Tus derechos | 22 de 29 | «Alcanza a todas las personas sin excepción…», «La gratuidad de las acciones de salud…» | [derechos-390.png](auxi-superposicion/derechos-390.png) |
| Salud animal › Si muere tu perro o gato | 10 de 17 | las fuentes del final («Información útil…», «Servicios…», «Texto comparado con estas fuentes…») | [pasteur-390.png](auxi-superposicion/pasteur-390.png) |
| Salud sexual y ESI › Anticoncepción | 41 de 47 | los bloques plegados de métodos y el texto del preservativo vaginal | [anticoncepcion-390.png](auxi-superposicion/anticoncepcion-390.png) |
| Mapa › estado vacío de salud mental | 4 de 14 | contador «0 lugares encontrados» y borde del recuadro | [vacio-mental-390.png](auxi-superposicion/vacio-mental-390.png) |

En cada captura el recuadro rojo marca la burbuja. **Cuidado al leer los números:** a 360 y 320 px la burbuja casi siempre quedó oculta por la lógica de evitar controles (menos superposición), salvo en Más recursos › Derechos a 360 px (25 de 32) y en el estado vacío del mapa a 360 px (15 de 16). No se probó en un teléfono real.

**Cierre con ✕.** Cerrar la burbuja con su ✕ **funciona y se mantiene al navegar dentro de la app** (el estado está en `HelpBot`). **Se pierde al recargar la página**: vuelve a abrirse. La cabeza de Auxi sigue tapando el borde derecho aunque se cierre la burbuja.

## 2. Propuesta mínima (para que la revise quien mantiene Auxi)

Orden de menor a mayor cambio:

1. **Para la demo, sin cambiar código:** cerrar la burbuja con ✕ al empezar y no recargar (ver la [checklist](checklist-presentacion-14-10.md)).
2. **Proteger también el texto, solo para la burbuja** (cambio chico en `utils/auxiAvoidance.ts`): una segunda lista de selectores (`main p, main li, main h1, main h2, main h3, main h4, main dd`) que haga que la burbuja se oculte (como ya hace con los controles, `bubbleBlocked`) mientras cubra texto. Con esto la burbuja casi no se vería en páginas largas; queda su cabeza.
3. **Que la burbuja no insista:** guardar el cierre en `sessionStorage` (no vuelve al recargar) y/o ocultarla sola a los pocos segundos.
4. **La propuesta ya presentada** («Auxi — En desarrollo» plegada junto al ícono de ajustes, sin burbuja flotante): [auxi-en-desarrollo.md](../../pendientes/auxi-en-desarrollo.md). Es la que resuelve el problema de raíz y comunica que Auxi todavía no responde.

Mi recomendación: 1 para el miércoles, y 4 (o 2 + 3 si prefieren conservar la burbuja) después, decidido por quien mantiene el componente.

## 3. Lo que no cubre este documento
- No se midió la cabeza de Auxi por separado (solo la burbuja).
- No se midió en escritorio. En las capturas de escritorio la burbuja queda en el margen derecho, pero puede rozar el borde de las tarjetas.
- Nada se modificó en el componente.
