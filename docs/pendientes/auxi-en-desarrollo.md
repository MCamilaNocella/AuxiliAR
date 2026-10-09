# Propuesta mínima: «Auxi — En desarrollo» y sin tapar texto en celular

**Estado: propuesta pendiente de aprobación de quien mantiene Auxi. No se implementó nada:** no se tocó el componente, la burbuja, el prompt ni el servidor, no se conectaron credenciales de IA y no se simulan respuestas. Los bocetos están hechos sobre una captura real (390 px) agregando elementos encima, sin tocar el código ([auxi-en-desarrollo/](auxi-en-desarrollo/)).

Parte de lo ya decidido por el equipo en [auxi-propuesta-plegada-movil.md](auxi-propuesta-plegada-movil.md) (Auxi plegada en un control compacto del encabezado) y de [auxi-superposicion-movil.md](auxi-superposicion-movil.md). Esta propuesta solo agrega la etiqueta «En desarrollo» y el texto del panel.

## Qué pasa hoy (`00-actual.png`)
- La burbuja «¡Hola! Soy Auxi, ¿necesitás ayuda?» aparece sola y **tapa texto** del contenido en móvil (por ejemplo el recuadro «Una campaña gratuita no es atención veterinaria gratuita»); se cierra con su ✕.
- Al abrir el chat y escribir una consulta, sin servidor responde «Perdón, no me pude conectar…»: no dice que Auxi esté en desarrollo.

## Propuesta (3 cambios mínimos, todos en el cliente)
1. **Sin burbuja flotante** (`01-plegada-en-desarrollo.png`): Auxi queda plegada en el encabezado, junto al ícono de ajustes, como un control de 44 px de alto con su cabeza y dos líneas: «**Auxi**» y «**En desarrollo**». Nada aparece solo sobre el contenido. En 320 px el texto «Ajustes» se acorta al ícono (queda su nombre accesible), como ya planteaba la propuesta plegada.
2. **Panel al tocarla** (`02-abierta-en-desarrollo.png`): título «Auxi · En desarrollo» y el texto: «Todavía no responde consultas de salud. Mientras tanto, explorá las categorías y el mapa: toda la información está verificada. Si es una emergencia, usá los números de la pestaña «Emergencia».» Botón «Ahora no» y ✕ de 44 px. La mención a Emergencia remite a la pestaña existente: **no repite ningún número**.
3. **Sin chat que simule respuestas:** mientras no haya IA, el panel no ofrece escribir. Cuando haya servidor y una decisión sobre el prompt, el botón «Hablar con Auxi» se reactiva con el chat actual sin cambios.

## Qué no cambia
Emergencias, números, textos de la barra de emergencia, la pregunta inicial de emergencia del chat actual, el servidor y el prompt.

## Para aprobar
- Quien mantiene Auxi: el control plegado, la etiqueta y el texto del panel (tono y palabras).
- Quien valide contenidos sanitarios: que el texto «toda la información está verificada» sea aceptable (hay datos con revisión pendiente: prefieren «información de fuentes oficiales»).
- Si prefieren no tocar el componente antes del miércoles: el guion oral de [informe-demo-final.md](../investigacion/demo-final/informe-demo-final.md), sección 3, cubre lo mismo sin código.
