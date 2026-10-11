# Videos institucionales breves para categorías educativas: candidatos y qué falta (11/10/2026)

**Resultado: ningún video se incorporó.** El soporte técnico está listo (`FirstAidGuide` + `isVideoShown`, ver `docs/componentes/video-embed.md`), pero ningún candidato cumple las condiciones comunes de `ronda-contenido-3/videos-requisitos-para-integrar.md`. No se completó ninguna aprobación ni se usaron los candidatos de RCP.

## Cómo se buscó
- Se revisaron las páginas oficiales que ya son fuente de AuxiliAR (29 páginas de argentina.gob.ar y buenosaires.gob.ar): **solo la página del acceso a la IVE incrusta videos** (`_L1MGXMagKA`, `uqSBDoy5EqM`); el contenido sobre IVE/ILE está pendiente de validación legal y profesional, así que no se toma.
- Se buscó en YouTube (páginas de resultados) por tema: salud sexual, salud animal, vacunación, salud mental, trámites. Datos técnicos leídos de la página del video (título, canal, duración, fecha, si se puede incrustar, subtítulos) y de oEmbed.
- No hay videos del Gobierno de la Ciudad sobre cómo sacar turno en un CeSAC ni de ANDIS sobre el CUD que aparezcan en las búsquedas.

## Candidatos identificados (todos del canal oficial, incrustables: oEmbed 200 y `playableInEmbed`)
| Categoría | Video | Canal · fecha · duración | Qué hay y qué falta |
|---|---|---|---|
| Salud sexual y ESI › Anticoncepción | `8ydgXgefsp0` «¿Tenés dudas sobre métodos anticonceptivos?» | Ministerio de Salud · 7/12/2022 · 1:20 | Habla una trabajadora de la línea 0800 de Salud Sexual (la descripción trae el 0800 222 3444, el mismo que figura en AuxiliAR). **Falta revisión profesional del contenido, transcripción revisada y autorización escrita.** |
| Salud sexual y ESI › Anticoncepción | `j70QtITtCzQ` «¿Cómo abrir y cómo usar un preservativo?» | Ministerio de Salud · 13/2/2023 · 1:23 | Demostración de uso. **Falta revisión profesional** (es una indicación de uso), transcripción y autorización. |
| Salud sexual y ESI › Anticoncepción | `nQbUxVAvd-k` «Métodos anticonceptivos MAC: generalidades…» | Ministerio de Salud · 10/3/2026 · 1:43 | Pensado para **equipos de salud**: no es para la población general sin adaptación. |
| Salud sexual y ESI › Anticoncepción | `lLFaypMbzx8` «Métodos anticonceptivos · Serie Derechos sexuales y reproductivos» | Ministerio de Salud · 25/4/2023 · 2:27 | Ficción sobre derechos de adolescentes en la atención. Misma falta. |
| Salud animal | `oNgCHEw7u1o` «Castración» / `3WNk6L7jLbs` «Tenencia responsable de perros y gatos» | Protenencia Argentina (programa del Ministerio de Salud) · 2021 y 2024 · 1:01 y 0:50 | Sin descripción del contenido (el primero). **Falta revisión veterinaria y de vigencia** (el programa de Protenencia tiene su página con los requisitos actuales). |
| Vacunación | `BU8c7em5KSQ` «¿Quiénes se tienen que vacunar contra la gripe?» (incrustado en educ.ar, página de 2022) | Ministerio de Salud · 1:20 aprox. | **Desactualizado**: los grupos de la antigripal cambian cada año y AuxiliAR sigue el calendario 2026. No sirve. |
| Vacunación | «¿Qué es el calendario nacional de vacunación?» (educ.ar) | Educ.ar, CC BY-NC-SA | No es YouTube (reproductor propio de educ.ar): `VideoEmbed` solo reproduce YouTube. |

## Condiciones comunes: qué se pudo comprobar y qué no
1. **Revisión profesional con nombre, fecha y versión: no hay.** AuxiliAR no tiene hoy una persona con formación clínica (ni veterinaria) que haya visto y oído los videos. Es el impedimento principal y no se reemplaza con una aprobación ficticia.
2. **Licencia/permiso:** YouTube permite incrustar y los videos figuran con licencia estándar de YouTube; **no hay autorización escrita** del Ministerio. Pedirla (o confirmar que la licencia de argentina.gob.ar, CC BY 4.0, alcanza para el video).
3. **Subtítulos y transcripción:** solo hay subtítulos **automáticos** (es); no se pudieron descargar desde esta herramienta, así que **el contenido hablado no se pudo leer**: lo verificado es título, canal, fecha, duración y descripción. Falta transcripción revisada.
4. **Fachada, institución/fecha/duración y enlace al original:** ya resueltos por `VideoEmbed`.
5. **Vigencia:** los de 2022–2023 hay que compararlos con las páginas actuales del Ministerio antes de publicar.
6. **Autorización del grupo** para la integración en `main`.

## Cómo se incorpora cuando se resuelva
Basta completar `video` con su `approval` (revisión, guía de referencia, permiso, transcripción revisada) en el dato de la guía, y mostrarlo en una sección de categoría con el mismo componente. Para categorías (no guías de primeros auxilios) hace falta además un lugar en `Section2` de Salud sexual: se agrega junto con la primera aprobación real, para no dejar código sin uso.
