# Videos de RCP: ficha comparativa pendiente de validación

Registro del **10/10/2026**. **Ningún video está incorporado a la aplicación ni aprobado.** Este documento compara los tres candidatos de RCP ya identificados (Ministerio de Salud y UNAHUR) con las condiciones que ya existían, y deja por escrito qué se pudo comprobar y qué no.

Documentos de base, que no se duplican:
- Componente: [`docs/componentes/video-embed.md`](../componentes/video-embed.md) (`VideoEmbed`, sin ningún uso hoy).
- Las 8 condiciones comunes de publicación: [`ronda-contenido-3/videos-requisitos-para-integrar.md`](ronda-contenido-3/videos-requisitos-para-integrar.md).
- Candidatos y datos técnicos del 9/10/2026: §4.3 de [`auditoria-contenido/informe-auditoria-contenido.md`](auditoria-contenido/informe-auditoria-contenido.md).

## Cómo se obtuvo cada dato (leer antes de usar la ficha)

| Origen | Qué aporta | Cómo se accedió |
|---|---|---|
| Respuesta **oEmbed** de YouTube, consultada el 10/10/2026 para los tres videos | Título exacto, nombre del canal, enlace del canal, miniatura, y que el video es público e incrustable | Herramienta de lectura de páginas: **el contenido pasó por un resumen automático**; los campos se citan tal como los devolvió, sin contraste con el original |
| Páginas del Ministerio leídas el 10/10/2026: RCP (`.../salud/primerosauxilios/rcp`), DEA (`.../rcp/desfibrilador`) y términos de uso (`.../terminos-y-condiciones`) | Si incrustan los videos y qué licencia declara el sitio | Lectura automática (resumen) |
| Página de reproducción de YouTube de cada video y página «Acerca de» del canal de UNAHUR | **Nada utilizable**: la herramienta solo devolvió el título y el pie de página | Lectura automática |
| Informe de auditoría del 9/10/2026 (§4.3) | Duración, fecha, subtítulos, institución, «embed = sí» | Dato de un informe anterior: **no se volvió a comprobar hoy** |

**No se pudo ver ni oír ninguno de los videos, ni leer sus subtítulos, ni ver su descripción, su fecha o su licencia directamente en YouTube.** Lo que sale del informe de auditoría se marca como tal. Donde no hay dato, dice **pendiente**.

---

## 1. Ficha comparativa

| | **A. Ministerio de Salud** | **B. UNAHUR, adultos** | **C. UNAHUR, niño o niña** |
|---|---|---|---|
| URL exacta | `https://www.youtube.com/watch?v=wbp_AdGkWPM` | `https://www.youtube.com/watch?v=XsJeJMUhKYU` | `https://www.youtube.com/watch?v=KaY1D4aB9rk` |
| Título (oEmbed, 10/10/2026) | «¿Cómo realizar la maniobra de RCP?» | «R.C.P Básico en Adultos con el uso de D.E.A» | «R.C.P Básico en niño o niña con el uso de D.E.A» |
| Canal que lo publica (oEmbed) | «Ministerio de Salud» (`youtube.com/@MinSalud_Ar`) | «Nativo / Producciones Educativas de la UNAHUR» (`youtube.com/@NativoUnaHur`) | Igual que B |
| Institución | El informe de auditoría lo llama «canal oficial» del Ministerio de Salud de la Nación. **Inferido** por el nombre del canal; no se encontró un enlace que lo confirme. Pendiente confirmarlo | El informe lo atribuye al Centro de Simulación Clínica de la UNAHUR (universidad pública). **Pendiente confirmar** la relación del canal «Nativo» con la universidad: la página «Acerca de» del canal no trae descripción ni datos institucionales | Igual que B |
| Duración | 2:14 *(auditoría, no recomprobado)* | 3:12 *(auditoría)* | 3:16 *(auditoría)* |
| Idioma | Español *(auditoría)* | Español *(auditoría)* | Español *(auditoría)* |
| Fecha de publicación | 21/8/2023 *(auditoría)* | 6/8/2024 *(auditoría)* | 8/8/2024 *(auditoría)* |
| Población destinataria | **Pendiente.** El título no la indica y ninguna página leída la dice | Adultos, **por el título**. Incluye el uso del DEA (por el título) | Niño o niña, **por el título**. Incluye el uso del DEA (por el título) |
| Subtítulos | Solo automáticos en español *(auditoría)*. Sin revisión | Manuales en es, ar, en y pt *(auditoría)*. **Sin revisar**: no se sabe si coinciden con lo que se dice | Se supone igual que B; **pendiente** (la auditoría los registró solo para B) |
| Alternativa textual | **Ninguna** (no hay transcripción en el repositorio ni se encontró una en la fuente) | **Ninguna** | **Ninguna** |
| Reproducción e inserción | oEmbed respondió sin error el 10/10/2026 y devolvió un `iframe` de YouTube: el video es público y su inserción está habilitada. La auditoría registró «embed = sí» el 9/10/2026 | Ídem | Ídem |
| Evidencia sobre derechos o permiso | Ver 2. **Ninguna autorización escrita**; licencia del video: **pendiente** | Ver 2. **Ninguna** | Ver 2. **Ninguna** |

### Lo que la comparación **no** permite afirmar
- Qué dice y muestra cada video. Nadie con formación clínica lo vio ni lo oyó.
- Si coinciden con la guía de RCP de la aplicación (ver 4).
- Si alguno sigue vigente: el A (2023) y los de UNAHUR (2024) son **anteriores** a la Mini Guía de RCP 2025 que cita la guía de AuxiliAR.
- Que un video sea correcto o seguro por la institución que lo publica o por su fecha.

---

## 2. Derechos y permiso de uso: lo que hay y lo que no

**Habilitar la inserción no equivale a tener permiso.** Que YouTube permita incrustar un video solo dice que el titular no lo bloqueó; no es una autorización ni una licencia para usarlo en AuxiliAR.

| | Evidencia encontrada | Qué falta |
|---|---|---|
| **A. Ministerio** | El sitio argentina.gob.ar declara, en sus términos y condiciones, que «El Administrador licencia todos sus contenidos bajo la licencia Creative Commons Atribución 4.0 Internacional», «excepto cuando se declare lo contrario», sin enumerar excepciones. **Eso es el sitio web; no dice nada del video, que está en el canal de YouTube.** Licencia del video en YouTube: **pendiente** (no se pudo leer). El informe de auditoría decía que «el propio Ministerio lo incrusta en su página de RCP»: **hoy la lectura automática de esa página no encontró el video ni ningún enlace a él** (ni en la de DEA). Discrepancia **sin resolver**: puede ser que la herramienta no vea un video cargado por script, o que ya no esté | Autorización escrita del Ministerio, o confirmar la licencia del video; aclarar la discrepancia sobre su propia página |
| **B y C. UNAHUR** | **Ninguna.** La página «Acerca de» del canal no declara licencia ni permisos | Autorización escrita de la UNAHUR; confirmar quién es el titular de los videos |

Atribución: aunque hubiera licencia, habría que cumplir sus condiciones (por ejemplo, citar la autoría). Pendiente.

---

## 3. Las 8 condiciones de publicación, por candidato

Condiciones tal como figuran en `videos-requisitos-para-integrar.md`. Estado: **Cumple**, **Pendiente** o **No cumple**. «Responsable» y «fecha»: **por asignar** en todas.

| # | Condición | A. Ministerio | B. UNAHUR adultos | C. UNAHUR niño/a |
|---|---|---|---|---|
| 1 | Una persona profesional lo revisó y dejó constancia (nombre, fecha, versión) | **Pendiente** | **Pendiente** | **Pendiente** |
| 2 | Hay autorización o licencia por escrito, o la licencia permite el uso | **Pendiente** (licencia CC BY 4.0 del *sitio*, no comprobada para el video) | **Pendiente** | **Pendiente** |
| 3 | Transcripción en texto revisada y subtítulos o descripción de lo visual | **Pendiente** (solo subtítulos automáticos; sin transcripción) | **Pendiente** (subtítulos manuales sin revisar; sin transcripción) | **Pendiente** |
| 4 | No carga ni envía datos a terceros hasta que la persona lo pide | **Cumple a nivel de componente**: `VideoEmbed` usa portada y botón y la dirección sin cookies. Falta comprobarlo con el video real | Ídem | Ídem |
| 5 | En guías de emergencia, los pasos escritos y el botón de llamar van primero; el video es complemento | **Pendiente**: la guía de RCP ya tiene los pasos y la llamada primero, pero se dibuja con `FirstAidGuide`, componente compartido que **no tiene lugar para un video** (aprobación de Camila) | Ídem | Ídem |
| 6 | Institución, fecha y duración visibles, con enlace a la fuente | **Pendiente**: `VideoEmbed` los muestra, pero los valores salen de la auditoría y alguien debe cotejarlos con YouTube | Ídem | Ídem |
| 7 | Se revisa la vigencia (si cambia la guía, se revisa el video) | **Pendiente**: 2023, anterior a la Mini Guía 2025 | **Pendiente**: 2024, anterior a la Mini Guía 2025 | Ídem |
| 8 | Autorización de quien mantiene las guías de Primeros auxilios (y, si toca la home o Auxi, de quien las mantiene) | **Pendiente** | **Pendiente** | **Pendiente** |

Resultado: **0 de 8 cumplidas en firme** para los tres; la 4 solo se cumple en el componente.

---

## 4. Pendientes para la revisión clínica y la aprobación técnica

**Para quien revise clínicamente** (comparar el video con la guía de RCP de la aplicación, `client/src/content/firstAid/guides/emergencies.ts`, que cita la Mini Guía de RCP 2025, «RCP en adultos» y el Manual de DINESA):
- Ver y oír el video completo y dejar constancia (nombre, fecha, versión del video).
- Comparar punto por punto con los pasos de la guía. La guía dice, entre otras cosas: llamar a emergencias; compresiones en el centro del pecho de 5 a 6 cm de profundidad, entre 100 y 120 por minuto; no interrumpir; usar el DEA si hay uno cerca; y trata «Adultos y niños» con un mismo conjunto de pasos y «Bebés» aparte.
- Anotar si el video contradice, omite o agrega algo respecto de la guía, sobre todo en niños (candidato C) y en el manejo del DEA (B y C). **Ningún candidato cubre a bebés**: no se encontró un video para ese caso.
- Decidir si las diferencias entre el video y la guía vigente son aceptables o hay que ajustar la guía o descartar el video.
- Revisar que el video no muestre números de emergencia que no correspondan.

**Para la aprobación técnica**
- Un lugar en la guía de RCP donde mostrarlo: hoy `FirstAidGuide` (compartido) no lo permite; requiere la aprobación de Camila.
- Transcripción en texto revisada y descripción de lo visual.
- Comprobar los subtítulos antes de marcar `hasCheckedCaptions`.
- Probar con un lector de pantalla y a 320, 390 y 1280 px.
- Confirmar los datos que `VideoEmbed` muestra (institución, fecha, duración) contra YouTube.
- Fecha de próxima revisión del video: pendiente.

---

## 5. Recomendación

**Candidato recomendado para pasar primero a revisión profesional: A, «¿Cómo realizar la maniobra de RCP?» (Ministerio de Salud, `wbp_AdGkWPM`).** No se incorpora ni se aprueba.

Por qué, con la evidencia disponible, que **no alcanza para compararlos clínicamente**:
- Es de la misma institución que respalda la guía de AuxiliAR (Mini Guía de RCP 2025 y manual del Ministerio), y es el más corto (2:14).
- Cubre RCP de forma general y no depende de una edad concreta: la guía de AuxiliAR trata adultos y niños con los mismos pasos. Los de UNAHUR están separados por edad y suman el DEA, lo que hace más probable que difieran de la guía y exige dos revisiones.
- Es el que menos dudas de titularidad parece tener, aunque su licencia como video está sin comprobar.

Lo que juega **en contra** de A y debe resolverse antes: solo tiene subtítulos automáticos; es anterior a la Mini Guía 2025; no se pudo confirmar la discrepancia sobre si el Ministerio lo incrusta en su propia página; y no hay autorización escrita.

Los de UNAHUR (B y C) quedan como **alternativa registrada, sin recomendación**: tienen subtítulos manuales (sin revisar) y cubren niños y DEA, pero no hay evidencia de permiso ni de la relación del canal con la universidad.

Esta recomendación define solo **el orden de la revisión**. No es una evaluación clínica: ningún video se considera aprobado por la institución que lo publica ni por su fecha.

Responsable de la revisión profesional: **por asignar**. Fecha: **por asignar**.
