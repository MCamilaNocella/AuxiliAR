# Componente `VideoEmbed` (videos breves dentro del sitio)

**Estado:** listo para usar, **sin ningún video cargado**. No hay video sanitario en ninguna página: antes de usarlo hay que cumplir la lista de abajo. **Dónde se puede usar:** en las guías de primeros auxilios (`FirstAidGuide`), con el campo opcional `video` de la guía y su registro de aprobación (`approval`): revisión clínica (quién y cuándo), guía de referencia con la que coincide, permiso de incrustación y transcripción revisada. Si falta cualquier parte, **no se muestra** (`isVideoShown`). Se dibuja después de los pasos escritos y del bloque de llamada, con el título «Video de apoyo» y la aclaración de que complementa los pasos. Código: `client/src/content/firstAid/{types,video}.ts`. Código: `client/src/components/health/VideoEmbed/`. Prueba: `npm run round4:test`.

## Qué hace
- **Reproduce el video desde su fuente original** (el reproductor de YouTube con la dirección sin cookies, `youtube-nocookie.com`). **No descarga ni republica nada** de terceros.
- **Carga diferida:** al principio muestra una portada con un botón «Reproducir el video: …». Hasta que la persona lo toca **no se envía ningún pedido** al servicio de video. Al tocarlo aparece el reproductor, con reproducción automática solo en ese momento, y el foco pasa a él (sigue funcionando con teclado).
- **Responsivo:** proporción 16:9 que se adapta al ancho (320 px en adelante), con el mismo estilo que el resto del sitio (color `aid`).
- **Accesible:** título obligatorio (lo leen los lectores de pantalla), botón con nombre completo, `iframe` con `title`, enlace al video original que dice «se abre en una pestaña nueva».
- **Subtítulos:** le pide al reproductor subtítulos en el idioma indicado (`captionsLang`, por defecto `es`). **Solo dice «Tiene subtítulos» si alguien lo comprobó** (`hasCheckedCaptions`); si no, dice «Si el video tiene subtítulos, se activan solos. Si no, leé la transcripción».
- **Alternativas siempre visibles:** el **video original** (enlace) y, si se le da, la **transcripción** en un desplegable cerrado.
- **Datos que muestra:** institución, fecha de publicación y duración.
- **Seguridad:** el `videoId` tiene que ser un id de YouTube de 11 caracteres (si no, no hay reproductor, solo el enlace); el enlace original tiene que ser `https://`.

## Cómo se usa
```tsx
import { VideoEmbed } from "@/components/health/VideoEmbed"

<VideoEmbed
  videoId="XXXXXXXXXXX"                        // solo el id, no la dirección
  title="Qué es el video, en una frase"
  originalUrl="https://www.youtube.com/watch?v=XXXXXXXXXXX"
  publisher="Institución que lo publica"
  publishedAt="2023-08-21"
  duration="2:14"
  hasCheckedCaptions={false}
  transcript={<p>Texto del video…</p>}
/>
```

## Antes de poner un video (obligatorio)
1. **Contenido:** una persona con formación clínica lo vio y lo oyó, y dejó constancia (nombre, fecha, versión). En guías de emergencia, los pasos escritos y el botón de llamar van **antes** que el video.
2. **Vigencia:** el video coincide con la guía vigente (por ejemplo, la de RCP aprobada); se anota la fecha de revisión.
3. **Permiso:** la institución permite la incrustación (el video lo permite técnicamente y, mejor, hay autorización escrita) y se respeta su licencia.
4. **Accesibilidad:** transcripción revisada, subtítulos revisados si existen (`hasCheckedCaptions`), descripción del contenido visual si hace falta.
5. **Alternativa:** siempre el enlace al original y la transcripción.
6. **Privacidad:** se mantiene la portada con botón (no cargar el reproductor al abrir la página).

Los candidatos y lo que falta para cada uno están en `docs/investigacion/ronda-contenido-3/videos-requisitos-para-integrar.md`.

## Qué no hace (a propósito)
Reproducir video propio o de otras plataformas (solo YouTube), reproducir sin que la persona lo pida, y alojar o copiar archivos de video. Si hace falta alguno de esos casos, se decide aparte.
