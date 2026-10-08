# Propuesta UX/UI: Auxi plegada en celular

**Estado: propuesta para aprobación del equipo. No se implementó nada.** La mascota, su burbuja y su comportamiento siguen como están. Las imágenes son bocetos hechos sobre capturas reales de Salud mental (390 × 844 px): se agregó el elemento propuesto encima, sin tocar el código. Se usa el dibujo real de Auxi para conservar su identidad.

Parte de la variante C elegida por el equipo (Auxi plegada en un control compacto que se expande al tocarla) y del informe de superposición (`auxi-superposicion-movil.md`). Imágenes en `auxi-propuesta/`.

## Objetivos
1. Que Auxi **no tape contenido ni controles** en celular.
2. Que el acceso al asistente se conserve y se encuentre siempre en el mismo lugar.
3. Que se pueda **cerrar con facilidad**.
4. Mantener la **identidad visual** de Auxi (su cabeza, su color vino, su saludo).

## Dos ubicaciones posibles para el control plegado

| | A. En el encabezado (recomendada) | B. Flotante, abajo a la derecha |
|---|---|---|
| Dónde | Junto a «Ajustes», en la barra superior que ya queda fija al desplazarse | Círculo de 48 px sobre la barra inferior, como hoy pero más chico |
| ¿Tapa contenido? | **No**: la barra superior es una franja propia; el contenido pasa por debajo, no por detrás de Auxi | **Sí, aunque menos**: sigue sobre el borde derecho del contenido |
| Tamaño | 44 × 44 px (el mínimo táctil) | 48 × 48 px |
| Boceto | `01-plegada-encabezado-scroll600.png` | `02-plegada-flotante-scroll600.png` |

**Qué muestran los bocetos.** En el desplazamiento donde hoy la mascota tapa la flecha de «Explorar centros de salud en el mapa» (scroll 600 px, 390 px de ancho):
- Con la ubicación A, el botón se ve completo (`01-…`).
- Con la ubicación B, el control chico sigue tapando la flecha (`02-…`). Por eso B solo mejora si además se reserva un margen, y quita ancho útil.

Comparación con la situación actual: `00-actual-scroll600.png`.

## Estados

### 1. Plegado (`01-plegada-encabezado-scroll600.png`)
- Un círculo de 44 px con la cabeza de Auxi, borde vino de 2 px y fondo claro. Nombre accesible: «Abrir ayuda de Auxi».
- **Sin burbuja ni texto flotante.** Nada aparece solo sobre el contenido.
- Si la barra superior no tiene lugar (320 px), se acorta la palabra «Ajustes» (queda el ícono) antes de achicar a Auxi.

### 2. Abierto (`03-abierta-encabezado.png`, `04-abierta-flotante.png`)
Al tocar el control se abre un **panel inferior** (sobre la barra de navegación, no encima):
- Auxi con su saludo: «¡Hola! Soy Auxi» y una pregunta corta.
- **Hablar con Auxi**: abre el chat actual, sin cambios.
- **Ahora no**: pliega el panel.
- **Cerrar (✕)** de 44 × 44 px arriba a la derecha.
- Se cierra también con Escape, tocando fuera del panel o deslizando hacia abajo.
- Es el único momento en que Auxi cubre contenido, y es por pedido de la persona.
- El texto propuesto («¿Necesitás ayuda para encontrar algo en AuxiliAR?») es un ejemplo para la revisión; la redacción final la define el equipo.

### 3. Interacción con botones y enlaces
- Plegado, el control vive en la barra superior: **ningún botón ni enlace de la página queda debajo**. Lo que hoy cubre la mascota (la flecha del botón del mapa, enlaces de fuentes, la pestaña «Herramientas para cuidarte») queda libre.
- Abierto, el panel deja visible la barra de navegación y el botón de emergencia; no tapa «Emergencia» ni los números.
- Las pantallas que ya apartan a Auxi (paneles modales, ayuda urgente) siguen igual: el control se oculta mientras están abiertas.

### 4. Al desplazarse (`05-scroll-0/600/1200-encabezado.png`)
- El control **está siempre en el mismo lugar** (la barra superior es fija): no salta, no se esconde ni se mueve al hacer scroll. Ya no hace falta esperar a que se detenga el desplazamiento para decidir dónde ponerse.
- No hay saludo automático mientras se lee. Opcional: un punto discreto de aviso la primera vez, que se va al tocar el control.
- Con «reducir movimiento» activado no hay animación de apertura.

## Qué se conserva y qué cambia

| Se conserva | Cambia |
|---|---|
| El dibujo de Auxi y su color vino | La burbuja deja de aparecer sola sobre el contenido |
| El chat existente tal cual | La mascota deja de flotar sobre el texto en celular |
| El apartado automático en pantallas urgentes y modales | El tamaño pasa de 72 px a 44 px |
| Escritorio: sin cambios (hoy solo la burbuja toca texto; se evalúa aparte) | El saludo pasa a un panel que se abre al tocar |

## Riesgos y dudas para el equipo
1. **Descubrimiento:** una Auxi chica y plegada es menos visible que la mascota actual. A favor: nunca tapa. Se puede reforzar con la etiqueta «Auxi» o «Ayuda» junto al ícono si el ancho lo permite.
2. **Encabezado a 320 px:** hay que comprobar el ancho con el logo y «Ajustes».
3. **Emergencias:** el botón rojo de la barra inferior no cambia. Conviene que el panel de Auxi no compita con él.
4. **Escritorio:** ¿se mantiene la mascota actual y se resuelve la burbuja por separado?
5. **Validación:** antes de implementar, probar con 2 o 3 personas en celular.

## Para decidir
1. Ubicación A (encabezado) o B (flotante), o A en celular y la mascota actual en escritorio.
2. Texto final del panel y del nombre accesible del control.
3. Si el punto de aviso la primera vez se incluye.

No se implementa nada hasta que el equipo apruebe.
