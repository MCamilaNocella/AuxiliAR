# Informe de revisión de calidad y seguridad (9/10/2026)

Rama local `review/content-round3-qa`, derivada de `feature/content-round3` (`fe47daf`). No se tocó `main`, `origin/main`, Emergencias, teléfonos, chatbot, prompt, servidor, Auxi ni stashes; `client/src/data` y `server` no tienen diferencias respecto de la rama de demo. No hay push, PR ni merge. Esta ronda **no agregó funcionalidades**.

Documentos de esta ronda: [afirmaciones-pendientes-de-validacion.md](afirmaciones-pendientes-de-validacion.md) · [videos-requisitos-para-integrar.md](videos-requisitos-para-integrar.md) · [pendientes-de-equipo.md](pendientes-de-equipo.md). Capturas actualizadas (26) en [capturas/](capturas/).

## 1. Revisión visual (13 páginas × móvil y escritorio)

Método: se recorrieron las 13 páginas en 390 y 1280 px por tramos de pantalla (97 recortes), más 320 px en 14 páginas con todos los bloques desplegados; medición automática de desborde, alturas táctiles, saltos de encabezados y errores de consola; y 66 comprobaciones de interacción (botones, teclado, enlaces internos) en móvil y escritorio.

| Página | Móvil 390 | Escritorio 1280 | Observaciones |
|---|---|---|---|
| Calendario de vacunación (8 etapas) | OK | OK | Los 8 botones abren su etapa, la URL se actualiza, el foco va al título, funciona con teclado y por enlace directo. |
| Estado vacío: salud mental | OK | OK | Se entiende; todos los enlaces llevan a páginas que existen. |
| Estado vacío: salud sexual | OK | OK | Idem. |
| Estado vacío: odontología | OK | OK | Idem. |
| Estado vacío: guardia oftalmológica | OK | OK | Idem. |
| Más recursos › Derechos | OK | OK | Largo en móvil (≈650 palabras) pero ordenado en tarjetas. |
| Más recursos › Trámites | OK | OK | Idem. |
| Más recursos › Preguntas frecuentes | OK | OK | Ver defecto 1. |
| Más recursos › Glosario | OK | OK | Lista de definiciones ordenada alfabéticamente. |
| Salud sexual y ESI › Anticoncepción | OK | OK | La más extensa (≈1.400 palabras) pero plegada; ver defecto 1. |
| Salud sexual y ESI › Dónde buscar | OK | OK | Páginas complementarias plegadas. |
| Salud animal › Si muere tu perro o gato | OK | OK | — |
| Salud animal › Servicios | OK | OK | — |

Jerarquía, espaciados y consistencia: las páginas nuevas usan los mismos recuadros, títulos y botones que las existentes. Sin desborde horizontal a 320, 390 ni 1280 px, sin saltos de nivel de encabezados y **sin errores de consola**.

**Observaciones que no se corrigieron porque no son de este alcance:**
- La burbuja de Auxi tapa texto en móvil (componente de otra integrante; ver [pendientes-de-equipo.md](pendientes-de-equipo.md)).
- En móvil, la barra de Emergencia ocupa la primera pantalla y los botones de las etapas del calendario quedan debajo del pliegue (es el diseño aprobado de la barra).
- Los enlaces de «Fuentes oficiales» miden 24 px de alto (es el componente existente, cumple el mínimo de 24 px de WCAG 2.2; los botones y resúmenes nuevos miden 44-56 px).

## 2. Defectos encontrados y correcciones menores

| # | Defecto comprobado | Corrección |
|---|---|---|
| 1 | Las preguntas desplegables (FAQ, métodos anticonceptivos, páginas complementarias) **no mostraban ninguna señal de que se abren**: parecían cajas de texto. | Nuevo componente `Disclosure` con ícono de flecha que gira al abrir; reemplaza las 3 usos. Sigue siendo `<details>` nativo (teclado y lector de pantalla). |
| 2 | El enlace «Dónde atenderme» del pie de las FAQ medía 19 px de alto (área táctil insuficiente). | Alto mínimo de 44 px. |
| 3 | Glosario: «ESI… La que articula…» sonaba incompleto. | «Educación que articula…». |
| 4 | Atribución: el calendario y los métodos reproducen contenido de argentina.gob.ar (CC BY 4.0) y buenosaires.gob.ar (CC Reconocimiento 2.5 AR) sin decir que están adaptados. | Se agregó a las notas de fuentes: «Contenido del Ministerio de Salud de la Nación (licencia Creative Commons Atribución 4.0), resumido y reorganizado por AuxiliAR» (calendario) y la nota equivalente en métodos anticonceptivos. |

No se rediseñó nada aprobado.

## 3. Información dentro de AuxiliAR y estado de los enlaces externos

Se recorrieron **todas** las páginas de Salud general (5 secciones y las 8 etapas), Salud sexual y ESI (3), Salud animal (4) y Más recursos (4): **86 enlaces externos, 55 únicos. Los 55 respondieron 200** el 9/10/2026.

- **63 son «Fuentes oficiales»** al pie de cada sección (fuente secundaria).
- **23 están en el cuerpo de las páginas.** Ninguno es necesario para entender el contenido; se clasifican así:

| Tipo | Enlaces | Justificación |
|---|---|---|
| **Acción o consulta necesaria** (se identifican como externos y abren pestaña nueva) | «Ir al trámite oficial para sacar el turno» (Más recursos); «Lista oficial de centros de testeo de la Ciudad», «Lista oficial de consejerías de la Ciudad» y «Línea nacional de salud sexual: horarios y contacto» (ESI, ya explicados adentro; la lista y el horario cambian); las 7 «Página oficial» de cada servicio municipal veterinario (Salud animal: cada entrada ya explica qué ofrece, quién y cómo). | Pedir turno, contactar o confirmar datos que cambian. |
| **Fuente de una afirmación** | UBA y UNLP (de que sus servicios son arancelados): el texto ya lo dice adentro. | Fuente secundaria. |
| **Complemento plegado y rotulado «se abren fuera de AuxiliAR»** | Huésped (buscador, servicios y guía) y las páginas de PBA, Santa Fe y Tucumán (ESI › Dónde buscar); materiales de ESI (ESI › Derechos y PBA/Chaco). | No hace falta visitarlos para entender nada; son lecturas extra. |

**Único punto a decidir:** «Línea nacional de salud sexual» obliga a salir para ver el **número**, porque no se copia (las líneas de ayuda son del equipo de Emergencias y se leen del dataset). Es una acción justificada; si el equipo quiere mostrar el número adentro, debería leerse del dataset de líneas, no escribirse.

Las cuatro categorías explican **adentro** lo esencial: calendario por etapas, métodos y preservativo vaginal, cómo pedir turno, derechos, glosario, qué hacer si muere un perro o gato, y cada servicio veterinario con quién, cómo y qué límites.

## 4. Calendario de vacunación contra las fuentes

- **Cobertura:** las 8 páginas oficiales por etapa están guardadas en `docs/investigacion/evidencia/calendario-vacunacion-2026-por-etapas.txt`. Nueva prueba automática (`round3:test`): cada línea «vacuna: dosis» y cada encabezado «A los N meses» del texto oficial debe estar en la etapa correspondiente (49 comprobaciones, **todas coinciden**); además, comprobaciones de las cifras clave (semanas de embarazo, 12 horas, 20/32/36,6, 12/15 meses, refuerzo cada 10 años, VCN20, años de nacimiento).
- **Lectura manual:** se cotejaron las 8 etapas línea por línea, incluidas las que la prueba no cubre (las de 5 años, con frases sin «:»). **No se encontraron omisiones ni errores de transcripción.** Diferencias deliberadas (no clínicas): «2da dosis» → «segunda dosis»; «sólo una dosis» → «solo una dosis»; la introducción de 5 años («Es importante que vacunes a tu hijo…») se resumió.
- **Extensión de texto ajeno:** el texto es un resumen reorganizado (introducciones acortadas, avisos dirigidos a madres/padres resumidos en «Recordá»). Las listas de vacunas y dosis son datos factuales y se mantienen tal cual para no alterar el esquema. Atribución con licencia agregada (ver defecto 4).
- **Vigencia:** las páginas no traen fecha de actualización; el calendario enlaza el PDF «Calendario de vacunación 2026» (10/3/2026). **Comparar con el PDF antes del miércoles.** Las frases «nacieron en 2021 / 2015» dependen del año.
- **Cambios clínicos introducidos:** ninguno. Lo que conviene validar está en el punto 5 del documento de afirmaciones.

## 5. Seguridad sanitaria y legal

Lista completa y exacta (página, texto, fuente, motivo, prioridad A/B/C): [afirmaciones-pendientes-de-validacion.md](afirmaciones-pendientes-de-validacion.md). Resumen de las prioridad **A** (mostrar solo con revisión):

1. Anticoncepción de emergencia: ventanas de tiempo y eficacia (la reformulación «cuanto más tiempo pasa, menos efectiva es» es propia).
2. PEP al VIH: «dentro de las 72 horas».
3. Preservativo vaginal: «ayuda a reducir el riesgo… No elimina el riesgo por completo» (propio; se omitieron los porcentajes oficiales).
4. DIU: qué no es requisito (papanicolaou, ecografía, consentimiento de la pareja).
5. Resumen de las leyes 26.130 y 27.655 (anticoncepción quirúrgica).
6. Calendario: factores de riesgo de la antigripal («entre otros»), esquema de embarazo, y comparación con el PDF 2026.
7. Rabia: «no existe riesgo sanitario» y «solo existe riesgo si mordió dentro de los 10 días».
8. Derechos: alcance de la Ley 153 (residentes y no residentes) y gratuidad; obligatoriedad de vacunas (Ley 27.491, se omitió «conforme a los lineamientos…»).
9. Estado vacío de oftalmología (texto propio de urgencia).
10. Guía de fracturas (sin cambios; pendiente desde antes).

Nada de esto se modificó.

## 6. Mapa

- `client/src/data` **sin cambios**; no se agregaron Pasteur ni la consejería de los CeSAC (prueba automática: ningún dato del mapa menciona la disposición de cadáveres).
- Regla de gratuidad documentada intacta: el mapa muestra los mismos 6 lugares / 9 prestaciones.
- **Los ocho estados vacíos** se comprobaron en móvil y escritorio: dicen «Todavía no tenemos… con gratuidad documentada. Eso no significa que no existan»; no nombran ningún lugar ni teléfono; sus enlaces llevan a páginas internas existentes; «Ver todas las prestaciones disponibles» borra los filtros y muestra resultados. Los 8 botones de origen dicen «Ver el mapa» (no prometen resultados).

## 7. Videos

Conservados sin publicar. Lista concreta de lo que falta (clínica, licencia, accesibilidad, reproducción): [videos-requisitos-para-integrar.md](videos-requisitos-para-integrar.md).

## 8. Bloqueantes reales para el miércoles 14/10

Ninguno impide mostrar la demo en esta rama. Lo que sí hay que decidir:

1. **Revisión profesional de las afirmaciones «A»** del punto 5, o decidir que esas secciones **no se muestren** en la demo (la más sensible: Salud sexual y ESI › Anticoncepción, con anticoncepción de emergencia y PEP). Es la decisión principal.
2. **Comparar el calendario con el PDF 2026** (15 minutos).
3. **Aprobación de Camila** sobre Footer/EmergencyBar antes de integrar a una rama compartida (no bloquea la demo local).
4. **Auxi:** no sugiere las páginas nuevas y su burbuja tapa texto en móvil; si en la demo se usa Auxi, conviene decidir antes si se muestra o se pliega («Auxi — En desarrollo»).
5. **Java:** `contextLoads` falla sin credenciales de IA, solo si se muestra el servidor.

## 9. Pruebas y estado final

- `tsc -b`: sin errores. `oxlint`: sin errores (1 advertencia preexistente en `demo-routes.test.mjs`). `npm run build`: correcto.
- `npm run test:ci`: **sin fallas** (incluye `round3:test`: 10 pruebas, entre ellas la nueva de fidelidad del calendario contra la evidencia).
- Revisión en navegador (Chrome, 320/390/1280 px): 97 recortes, 66 comprobaciones de interacción (64 correctas; las 2 restantes, una por tamaño de pantalla, fueron un artefacto del script: hacer clic por código en la etapa ya abierta no mueve el foco), 0 errores de consola.
- Estado de la rama: ver el commit de esta ronda; árbol limpio al cierre; `main` en `4409451`; 2 stashes intactos.
