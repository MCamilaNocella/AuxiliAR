# Auditoría de contenido y enlaces externos: que la información esté dentro de AuxiliAR

Fecha: 9/10/2026. Rama local `audit/content-and-links-2026-10` (desde `feature/demo-ux-round2`, commit `7cff348`). **Solo auditoría y evidencia: no se cambió contenido sanitario, no se cargó ninguna prestación al mapa, no hay videos incorporados.** No se tocó `main`, Emergencias, chatbot, prompt, servidor, el componente de Auxi ni los stashes. Evidencia original (texto extraído de las páginas oficiales, consultadas con `curl` el 9/10/2026) en [../evidencia/](../evidencia/).

---

## 0. Resumen para decidir

**Lo más importante, en 8 líneas**
1. **Salud general promete algo que no tiene**: la tarjeta de la portada dice «calendario de vacunación», pero la sección solo tiene una frase sobre vacunas y manda a un mapa. El Ministerio publica el **Calendario Nacional 2026 por etapas de la vida en HTML, con licencia Creative Commons Atribución 4.0**: se puede explicar entero dentro de AuxiliAR. Es la mejora de mayor valor para el miércoles.
2. **Corrijo el informe anterior: no son 6 botones que llevan a un mapa vacío, son 8.** Además de los 6 (Salud mental ×2, Salud sexual ×2, Odontología ×2), hay 2 de «Urgencia oftalmológica» (Salud general, controles y quiz) que también llegan a «0 lugares».
3. **Instituto Pasteur: encontré fuente oficial que cambia lo que sabíamos.** Su página de servicios dice que brinda **«en forma gratuita»** consultorio clínico, vacunatorio, recepción de denuncias por mordedura y **disposición de cadáveres**; otra página oficial dice que recibe **perros y gatos fallecidos, sin costo, 24 h, «para su disposición final o cremación»**. Antes figuraba «no informa el costo».
4. **Preservativos femeninos / Hospital Rivadavia: no pude verificarlo.** No hay fuente oficial que lo diga. Sí hay información oficial para explicar el preservativo vaginal dentro de AuxiliAR. Necesito que me pasen de dónde sale lo del Rivadavia.
5. **ESI y Salud animal son las dos categorías que más mandan afuera** (12 y 9 enlaces de contenido fuera de «Fuentes»). Salud mental, Salud general, Primeros auxilios y el mapa ya explican adentro: sus enlaces son solo fuentes.
6. **Hay fuente oficial explícita de gratuidad de anticonceptivos en la Ciudad** («La atención y los métodos son gratuitos en el sistema público») y una lista oficial de **62 consejerías** donde se accede a métodos e IVE/ILE; **CeSAC 3, 41 y 47 están en esa lista**. Habilita a explicar métodos adentro y a proponer esa prestación para el mapa.
7. **Videos:** hay **uno** de una institución reconocida y propia del país que ya está pensado para incrustarse: el video **«¿Cómo realizar la maniobra de RCP?» del Ministerio de Salud (2:14)**, que el Ministerio incrusta en su propia página. Para atragantamiento y DEA no hay video del Ministerio; para **salud mental no encontré videos de una institución reconocida**, pero sí **ejercicios de audio de la OMS** (licencia CC BY-NC-SA). Todo video clínico necesita revisión profesional antes.
8. **Más recursos** puede armarse en 4 bloques reutilizando contenido ya aprobado (sin duplicarlo): ver §5.B.

**Para el miércoles 14/10 propongo hacer solo lo de bajo riesgo** (§6.1): calendario de vacunación por etapas, estados vacíos útiles para los 8 botones, primera versión de «Más recursos», y «Qué hacer si muere tu perro o gato» (Pasteur) en Atención veterinaria. **Nada se implementa sin su aprobación.**

---

## 1. Qué corrijo o actualizo de informes anteriores

| Tema | Antes | Ahora |
|---|---|---|
| Botones que llevan a un mapa sin resultados | 6 | **8** (se suman «Urgencia oftalmológica» en Salud general: controles y quiz). Verificado en el navegador: `filtro=mental-health`, `sexual-health`, `dentistry`, `emergency&buscar=oftalm` → «0 lugares encontrados». Los de Vacunatorio (2), Atención primaria (3) y Urgencia/guardia odontológica (2) sí tienen resultados. |
| Instituto Pasteur, costo | «La página no informa el costo» (pendiente) | La página de **servicios** lo da: «brinda a la comunidad, en forma gratuita, los siguientes servicios». Aparece **otra** discrepancia: los horarios del vacunatorio (§4.2). |
| Anticonceptivos en CABA | «Salud sexual necesita su propio respaldo legal (en revisión)» | La página oficial de **Métodos anticonceptivos** del Gobierno de la Ciudad dice textualmente «La atención y los métodos son gratuitos en el sistema público» (y la lista de **consejerías** nombra a CeSAC 3, 41 y 47). |
| Primeros auxilios: dónde está el criterio de «caminar sin ayuda» | ya informado | sin cambios: sigue **pendiente de validación clínica**. |

---

## 2. Auditoría por categoría

Leyenda de prioridad para la demo del **14/10**: **P1** = hacerlo antes (bajo riesgo, alto valor); **P2** = posible si hay revisión a tiempo; **P3** = después del miércoles.
Estado de verificación: **V** = verificada contra la página original oficial el 9/10/2026; **P** = pendiente (algo falta comprobar); **N** = no verificable / sin fuente.

### 2.1 Salud general («Cuidar mi salud», `/temas/salud-general`)
| Ubicación | Qué hay hoy | Qué falta o sale a otra página | Fuente oficial | Estado | Propuesta dentro de AuxiliAR | Prioridad |
|---|---|---|---|---|---|---|
| «Controles de salud» › Vacunación | Una frase («existe un Calendario Nacional… gratuitas y obligatorias») + botón «Encontrar vacunatorio» | **El calendario mismo.** La tarjeta de la portada promete «calendario de vacunación». No hay ninguna vacuna nombrada. | Ministerio de Salud: «Calendario Nacional de Vacunación 2026» y 8 páginas por etapa (embarazo, recién nacidos, hasta 1 año, hasta 2, 5 años, 11 años, 15 a 64, +65), contenidos CC BY 4.0 — [texto en evidencia](../evidencia/calendario-vacunacion-2026-por-etapas.txt) | **V** (texto); sin fecha de actualización en las páginas; el PDF del calendario es del 10/3/2026 | Subsección **«Calendario de vacunación»** con una pestaña por etapa y, en cada una, qué vacunas y en qué momento, con las palabras del Ministerio resumidas; «llevá el carnet», «no requieren orden médica», «están disponibles en centros de salud y hospitales públicos». El PDF y la página quedan como fuente secundaria. | **P1** |
| «Controles de salud» (otros 6 temas) | Orientación general sin fuente específica | — | — | — | Sin cambios | — |
| «Dónde atenderme» | Explica CeSAC/hospital/guardia + botón al mapa | — | — | — | Ya es interna | — |
| Botones «Buscar atención odontológica» ×2 y «Urgencia oftalmológica» ×2 (controles y quiz) | Llevan a «0 lugares» | Una explicación | — | — | Ver §5.A | **P1** |

### 2.2 Salud mental (`/temas/salud-mental`)
| Ubicación | Qué hay hoy | Qué falta | Fuente | Estado | Propuesta | Prioridad |
|---|---|---|---|---|---|---|
| «Dónde buscar ayuda» | Derecho a ser atendido en hospital general, quién atiende, botón a números de emergencia, botón «Explorar centros» (mapa sin resultados) | Cómo se accede; ningún lugar del mapa tiene salud mental con gratuidad documentada | Ley 26.657 y páginas oficiales ya citadas | **V** (contenido); mapa **P** (admisión/turnos de CeSAC pendientes de las fichas operativas) | Ver §5.A | **P1** |
| «Conocé tus derechos» | Resumen de la Ley 26.657 con fuentes (tres enlaces, solo fuentes) | — | Ley 26.657, Derecho Fácil | **V** | Ya interna; se reutiliza en «Más recursos» (§5.B) | — |
| «Herramientas para cuidarte» | Hábitos de la OMS (rutina, sueño, vínculos, movimiento, alimentación, noticias) | **Técnicas guiadas** (respiración, relajación, regulación emocional) | OMS «Estrés» (ya citada) y guía «En tiempos de estrés, haz lo que importa» con **ejercicios de audio** (CC BY-NC-SA 3.0 IGO) | **V** (existencia y licencia); contenido **P** (requiere revisión profesional) | Sección de ejercicios guiados basada en la guía de la OMS, en texto y con su audio (§4.3) | **P3** (revisión profesional) |

### 2.3 Salud sexual - ESI (`/temas/esi`)
| Ubicación | Qué hay hoy | Qué sale a otra página | Fuente | Estado | Propuesta | Prioridad |
|---|---|---|---|---|---|---|
| «Dónde buscar atención» | Línea nacional (enlace), derecho de acceso y 5 enlaces a buscadores y páginas de provincias (Fundación Huésped ×2, PBA, Santa Fe, Tucumán) | **Casi todo**: la lista de dónde ir está afuera; en CABA, ningún lugar con salud sexual en el mapa | GCBA «Consejerías en salud sexual»: **62 establecimientos** (CeSAC y 17 hospitales) donde se accede a métodos e IVE/ILE, con quién hace ligadura/vasectomía y contacto — [lista](../evidencia/caba-consejerias-salud-sexual-lista.txt) | **V** (lista y frase de gratuidad); sin fecha en la página | (1) Lista **interna** de las consejerías de la Ciudad (nombre, dirección, qué ofrece) con la frase oficial de gratuidad; (2) proponer la prestación «Consejería y métodos anticonceptivos» para el mapa, empezando por CeSAC 3, 41 y 47 (ya cargados). Las provincias quedan como «solo para esa provincia», fuente secundaria. | **P2** (lista) / **P3** (mapa) |
| «Anticoncepción y prevención» | Nombra métodos, preservativo, ley 25.673; 3 enlaces (test VIH GCBA, preservativos GCBA, guía Huésped) | **Qué es cada método**: la página del Ministerio no los describe, por eso se mandaba a la guía de una organización civil | GCBA «Métodos anticonceptivos» (descripción de preservativo, pastillas e inyectables, DIU, implante, anticoncepción quirúrgica, pastilla de emergencia; «gratuitos») — [texto](../evidencia/caba-metodos-anticonceptivos-gratuitos.txt); GCBA «Preservativos gratis» + mapa oficial de **135 bocas de distribución**; Ministerio: «Preguntas frecuentes sobre preservativo vaginal» | **V** | Explicar **cada método dentro de AuxiliAR** con el texto del Gobierno de la Ciudad (CC BY 2.5 AR) y sumar «Preservativo vaginal» desde la página del Ministerio; sacar la guía de Huésped como fuente principal. **Requiere revisión clínica** (no se incluyen eficacias ni dosis que la fuente no da). | **P2** |
| «Derechos y ESI» | Leyes 25.673, 26.150, 27.610 (esta **en revisión editorial y legal**); 3 enlaces a materiales de ESI (Nación, PBA, Chaco) | El contenido de los materiales | Ministerio de Educación (nota del 4/10/2022) | **P** (descargas, licencias) | Mantener como «recursos externos» (excepción: materiales para descargar); resumir adentro qué es la ESI y qué derechos reconoce | **P3** |
| Botones al mapa (×2) | «0 lugares» | — | — | — | Ver §5.A | **P1** |

### 2.4 Atención veterinaria (`/temas/animales`, tarjeta «Atención veterinaria»)
| Ubicación | Qué hay hoy | Qué falta o sale a otra página | Fuente | Estado | Propuesta | Prioridad |
|---|---|---|---|---|---|---|
| «Vacunación y castración gratuitas» | Resúmenes de 7 servicios («la página oficial informa»): CABA, Rosario, Córdoba, Salta, **Pasteur («Todavía sin confirmar»)**, Neuquén, Protenencia. Cada uno con su enlace «Página oficial». | Los enlaces son la fuente; el resumen ya está adentro. Pasteur figura sin confirmar. | Animales BA, páginas municipales | **V** (Pasteur actualizable, ver §4.2) | Actualizar Pasteur con la página de servicios; agregar «Qué hacer si muere tu perro o gato» | **P1/P2** |
| «Cuidado y prevención» | Texto + 2 fuentes | — | Ministerio de Salud, Senasa | **V** | Sin cambios; **revisión veterinaria pendiente** (ya declarada) | — |
| «Atención veterinaria gratuita» | Aclara que las facultades UBA/UNLP **son aranceladas** (2 enlaces) | Casi no ofrece nada gratuito | Pasteur (consultorio clínico, 8 o 13 h), Animales BA | **P** | Sumar el **consultorio del Instituto Pasteur** (gratuito, orientado a zoonosis, sin urgencias) y «Qué hacer ante una mordedura» (página oficial «Información útil») | **P2** |
| Mapa (Salud animal) | 1 lugar: Centro Fijo Costanera Sur (castración) | Indoamericano (ubicación pendiente); Pasteur | ver §4.2 | **P** | Proponer Pasteur como 2.º lugar (§4.2) | **P2/P3** |

### 2.5 Primeros auxilios (`/primeros-auxilios`, 15 guías)
| Ubicación | Qué hay hoy | Qué falta | Fuente | Estado | Propuesta | Prioridad |
|---|---|---|---|---|---|---|
| Las 15 guías | **Todas explican adentro** (pasos, qué no hacer, cuándo llamar). Los enlaces (1 a 4 por guía) son solo «Fuentes». | Videos; 3 temas del Manual sin guía: **desmayo, cuerpo extraño en ojo/oído/nariz, sangrado nasal**; RCP en lactantes y posición de seguridad están dentro de otras guías | Manual DINESA (Ministerio de Salud) | **V** (ya usado) | (1) Video del Ministerio en la guía de RCP (§4.3); (2) nuevas guías del Manual, con revisión clínica | **P2** (video) / **P3** (guías) |
| Guías «Posibles fracturas» y «Golpes y caídas» | Pasos del criterio «caminar sin ayuda» | — | Manual (respalda parte) | **P: validación clínica** ([informe](../../pendientes/validacion-clinica-criterio-caminar-fracturas.md)) | Esperar validación | — |

### 2.6 Centros de atención (mapa y fichas)
| Ubicación | Qué hay hoy | Qué sale afuera | Estado | Propuesta |
|---|---|---|---|---|
| Fichas de lugares | Qué se ofrece, para quién, dónde, gratuidad y condiciones, requisitos, horarios confirmados, modalidad de acceso, notas de ubicación | Solo **«Fuentes oficiales»** (secundarias) y **«Pedir turno»** (acción) | **Cumple la regla** | Mantener. Los dos tipos de enlace ya están rotulados «se abre en una pestaña nueva». |
| Mapa de CABA | 6 lugares, 9 prestaciones documentadas | Un lugar sin prestaciones documentadas queda fuera | Política vigente | Ampliar solo con aprobación (§4.2, §2.3) |
| Pie del mapa | Enlaces de atribución de Leaflet y OpenStreetMap | Obligatorios por licencia | — | Sin cambios |

### 2.7 «Más recursos» (`/recursos`)
Hoy: página «Próximamente» con dos enlaces a secciones de derechos que ya existen. **Propuesta en §5.B. Prioridad P1/P2.**

### 2.8 Sobre AuxiliAR y «Sobre los datos»
Internas; ya dicen la política de gratuidad documentada. Sin cambios.

---

## 3. Inventario de enlaces externos (45 rutas recorridas, 9/10/2026)

| Categoría | En «Fuentes oficiales» (secundarios) | Fuera de «Fuentes» (contenido que sale afuera) | Qué son |
|---|---|---|---|
| Salud general | 0 | **0** | — |
| Salud mental | 6 | **0** | Solo fuentes |
| Salud sexual - ESI | 12 | **12** | Buscadores y páginas provinciales, guía de Huésped, páginas del Gobierno de la Ciudad, materiales de ESI |
| Atención veterinaria | 13 | **9** | 7 «Página oficial» junto a un resumen interno + 2 de facultades arancelarias |
| Primeros auxilios (15 guías) | 21 | **0** | Solo fuentes |
| Centros de atención | 0 | **2** | Atribución del mapa (obligatoria) |
| Fichas de lugares | «Fuentes oficiales» | «Pedir turno» (acción) | Permitidos como excepción |
| Más recursos / Sobre | 0 | 0 | — |

Estado de los enlaces: **los 48 enlaces externos de la web responden 200** (comprobación de la ronda anterior). El enlace de fracturas ya se retiró de las guías. El 9/10 no se encontraron enlaces rotos nuevos; los de buenosaires.gob.ar a veces dan 500/504 en ráfagas.

**Cómo clasificar cada enlace (propuesta):** (a) **fuente secundaria** («Fuentes oficiales», con fecha de consulta); (b) **acción** (pedir turno, hacer un trámite, llamar, abrir un mapa oficial) con rótulo «enlace externo»; (c) **contenido a traer adentro** (los 12 de ESI y los de Atención veterinaria que hoy reemplazan información).

---

## 4. Investigación nueva

### 4.1 Preservativos femeninos / vaginales y el Hospital Rivadavia — **no verificado, no publicar**
**Qué encontré (todo oficial, 9/10/2026):**
- **No hay ninguna página oficial** que diga que el Hospital Rivadavia entrega preservativos femeninos o vaginales. Busqué en las páginas del Gobierno de la Ciudad (hospital, consejerías, métodos, preservativos gratis), en el mapa oficial de «Centros de prevención» (135 puntos) y en las páginas nacionales.
- El **Rivadavia (Av. Las Heras 2670)** aparece en: (a) la lista oficial de **consejerías en salud sexual** (ligadura tubaria **sí**, vasectomía **sí**, contacto IVE/ILE 11-4809-2000); (b) el mapa oficial de **centros de prevención** como «Hospital Rivadavia (Servicio Social, Salud Mental, Infectología, Adolescencia)», clasificado CEPAD (Centros de Prevención, Asesoramiento y Diagnóstico), teléfono 4801-7268, dato con «fecha de actualización: Enero 2015» (alta 2017). Ese mapa es la fuente de las «bocas de distribución de preservativos gratis» pero **no dice qué tipo de preservativo** entrega cada punto.
- El **Ministerio de Salud** confirma que el preservativo vaginal existe, que «se entregan en centros de salud, consejerías, hospitales, organizaciones de la sociedad civil» y que **«dónde conseguirlos»: consultar al referente provincial** (no da lista). Su «mapa digital de puestos fijos» de preservativos no se pudo abrir con herramientas automáticas (403).

**Qué falta** (si el equipo quiere publicarlo): la fuente original de la afirmación sobre el Rivadavia; confirmar por teléfono o en persona con el hospital (consejería o CEPAD) **si entregan preservativos vaginales, en qué servicio, días, horarios y requisitos** (registrando nombre, fecha y frase); gratuidad por una fuente oficial.

**Qué sí se puede hacer ahora, adentro de AuxiliAR:** una explicación «¿Qué es el preservativo vaginal?» (qué es, cómo se usa, para qué sirve, que se consiga en centros de salud y consejerías, y la Línea Salud Sexual 0800-222-3444 que ya está en el dataset de líneas) con el texto del Ministerio (CC BY 4.0). **Requiere revisión clínica.** **Prioridad P2** (texto) / **P3** (lugar).

### 4.2 Instituto de Zoonosis Luis Pasteur — gratuidad y disposición de animales fallecidos
**Fuentes oficiales** (3 páginas del Gobierno de la Ciudad; ninguna trae fecha; texto completo en [evidencia](../evidencia/pasteur-servicios-cadaveres.txt)):

| Dato | Qué dice la fuente | Página |
|---|---|---|
| Gratuidad | «El Instituto… **brinda a la comunidad, en forma gratuita**, los siguientes servicios: consultorio clínico, recepción de denuncias por mordeduras, recepción de muestras de laboratorio, **disposición de cadáveres**, **vacunatorio**, educación para la salud, acciones comunitarias» | Servicios (versión actual) |
| Animales fallecidos | «**Recibe perros y gatos fallecidos de lunes a lunes, las 24 horas, sin costo, para su disposición final o cremación**, y evalúa cada caso según criterios sanitarios» | Información útil |
| Quién y cómo | «Se reciben cadáveres o partes anatómicas de animales muertos bajo sospecha de poseer rabia, otras zoonosis o diferentes causas. **El solicitante será mayor de edad y concurrirá con DNI**» · versión anterior: «Todos los días, incluidos sábados, domingos y feriados, las 24 horas. **Dirigirse al sector Internación** (a partir de las 18:00 h ingreso por puerta posterior)» | Servicios (actual y anterior) |
| Riesgo de rabia | «Solo existe riesgo si el animal mordió a una persona dentro de los 10 días previos a su fallecimiento… debe ser derivado al Instituto… Si no mordió, o más de 10 días antes, no existe riesgo sanitario» | Información útil |
| Dirección y teléfono | Av. Díaz Vélez 4821 (CABA). Conmutador 4958-9900, L a V de 10 a 17 h | Institucional, historia y servicios |
| Consultorio clínico | Orientado a zoonosis; **no hay urgencias ni especialidades veterinarias**; turnos presenciales por orden de llegada, L a V, 8:00 o 13:00; prioridad a animales derivados por exposición a rabia | Servicios (anterior) |
| Vacuna antirrábica | Servicios actual: «los 365 días, de 9 a 12 y de 14 a 17 h»; servicios anterior y página de vacunación: «todos los días de 8 a 18 h, sin turno» | **Discrepancia de horarios** |

**Cuidado con lo que NO dice (y no hay que afirmar):**
- **Cremación individual vs. disposición final institucional.** La fuente oficial dice «**disposición final o cremación**», decidida «según criterios sanitarios»: **no promete cremación individual ni devolución de cenizas**. Notas periodísticas (diciembre de 2025) afirman que la cremación se terceriza y que las cenizas no se retiran, pero **no son fuentes oficiales**: hay que preguntarlo al Instituto antes de decirlo. AuxiliAR no debe usar la palabra «cremación gratuita» sin ese matiz.
- **Especies:** la fuente da «perros y gatos» (Información útil); la de servicios dice «animales» sin precisar: decir «perros y gatos» y que consulten por otras especies.
- **Peso, tamaño, bolsa o traslado:** la fuente no lo dice. No inventar requisitos.
- **Horarios del vacunatorio:** no cargar hasta aclarar la discrepancia.
- **Quién lo pide:** la versión actual exige mayor de edad con DNI; la anterior no lo mencionaba. Decir «mayor de edad con DNI, según la página actual».

**Propuesta de incorporación:**
1. **Sección «Qué hacer si muere tu perro o gato»** en Atención veterinaria (adentro): qué ofrece el Instituto, a quién, dónde, 24 h, gratis, cómo llegar al sector Internación, la regla de los 10 días con mordeduras, lo que la fuente no aclara («consultá si podés retirar cenizas»), dirección y conmutador. Fuente «Información útil» y «Servicios» como secundarias. **Prioridad P1/P2** (texto corto; **requiere aprobación sanitaria del texto de rabia**).
2. **Actualizar la ficha «Pasteur» de la sección 1** (de «Todavía sin confirmar» a «la página oficial informa gratuito», con el matiz de horarios). **P2.**
3. **Mapa:** proponer **un lugar nuevo** (Instituto de Zoonosis Luis Pasteur, Av. Díaz Vélez 4821, con ubicación verificable por el normalizador oficial) con, como mínimo, estas prestaciones documentadas: *disposición de animales fallecidos* (perros y gatos, 24 h, sin costo), *consultorio clínico* (turno presencial L-V 8 o 13 h, sin urgencias) y *vacuna antirrábica* (**sin horario** hasta aclarar). Hay que **agregar un tipo de servicio nuevo** (hoy no existe «disposición de animales fallecidos») en la taxonomía y el esquema: es un cambio técnico chico, **requiere su aprobación**. **P3.** Cuando exista, entra bajo la política vigente (gratuidad documentada).

### 4.3 Videos para reproducir dentro de AuxiliAR
**Cómo se haría (técnico):** reproductor incrustado (`<iframe>` de `youtube-nocookie.com`, que no usa cookies hasta reproducir), sin autoplay, con título accesible, carga diferida y **transcripción o pasos en texto debajo** (las guías ya los tienen). La incrustación por el reproductor oficial está permitida por las condiciones de YouTube cuando el titular no la bloquea; en todos los de abajo `playableInEmbed = true`. **Para un video de una institución, recomiendo pedir confirmación escrita antes de publicarlo.** No se descargó ni se copió ningún video.

**Revisión que no pude hacer:** no puedo ver ni oír los videos ni leer sus subtítulos (YouTube no entregó los subtítulos a esta herramienta). Los datos de abajo son técnicos y de la ficha del video; **el contenido clínico debe mirarlo una persona profesional** y compararlo con las guías aprobadas (por ejemplo, con la «Mini Guía de RCP 2025» que cita la guía).

**RCP**
| Video | Institución | Duración | Idioma | Fecha | Subtítulos | Embed | Observaciones |
|---|---|---|---|---|---|---|---|
| [¿Cómo realizar la maniobra de RCP?](https://www.youtube.com/watch?v=wbp_AdGkWPM) (`wbp_AdGkWPM`) | **Ministerio de Salud de la Nación** (canal oficial) | 2:14 | Español | 21/8/2023 | Solo automáticos (es) | Sí; **el Ministerio lo incrusta en su propia página de RCP** | **Mejor candidato.** Anterior a la Mini Guía 2025: revisar vigencia. Pedir subtítulos revisados o dar transcripción. |
| [R.C.P Básico en Adultos con el uso de D.E.A](https://www.youtube.com/watch?v=XsJeJMUhKYU) (`XsJeJMUhKYU`) | UNAHUR (universidad pública), Centro de Simulación Clínica | 3:12 | Español | 6/8/2024 | es, ar, en, pt | Sí | Cubre RCP + DEA. Y [en niño/a](https://www.youtube.com/watch?v=KaY1D4aB9rk) (3:16, 8/8/2024). Segundo candidato. |
| RCP y uso de DEA (`ZuriXFgyqSQ`) | Sanatorio Finochietto (privado) | 1:59 | Español | 7/10/2019 | Solo automáticos | Sí | Institución privada; 2019. |

**DEA**
| Video | Institución | Duración | Observaciones |
|---|---|---|---|
| [RCP y uso del DEA. Recomendaciones para equipos de APS](https://www.youtube.com/watch?v=kcQ8PhPKgT0) (`kcQ8PhPKgT0`) | Ministerio de Salud (Dir. Nac. de Emergencias Sanitarias), 26/4/2023 | **36:30** | Es una charla para equipos de salud, no un video breve. No apto para la guía. |
| [Capacitación… DEA](https://www.youtube.com/watch?v=-5R93jr8ssc) (`-5R93jr8ssc`) | Ministerio Público de la Defensa | 20:12 (18/8/2026) | Institución no sanitaria; largo. |
| UNAHUR (arriba) | | 3:12 | El más adecuado para la guía de RCP. |

**Atragantamiento (Heimlich)**
| Video | Institución | Duración | Observaciones |
|---|---|---|---|
| [Atragantamientos… (Maniobra de Heimlich)](https://www.youtube.com/watch?v=HDsBQJhIRZc) (`HDsBQJhIRZc`) | Cruz Roja (Bizkaia, **España**) | 1:53, 28/3/2018 | Institución reconocida pero **de otro país** (castellano de España, otros números de emergencia: **no debe mostrar números**). Subtítulos automáticos. |
| [Primeros auxilios · Maniobra de Heimlich](https://www.youtube.com/watch?v=8qrnX9LUyTM) (`8qrnX9LUyTM`) | Fundación Valle del Lili (**Colombia**) | 1:22, 9/10/2025 | Sin subtítulos. |
| [¿Qué es la Maniobra de Heimlich?](https://www.youtube.com/watch?v=U0FKN0MF9WQ) | Televisión Pública (programa de cocina) | 17:40 | Largo, no institucional sanitario. |
| **educ.ar / Canal Encuentro «Curso de primeros auxilios»** («Obstrucción de la vía respiratoria por cuerpos extraños») | Ministerio de Educación + Canal Encuentro | — | Licencia **CC BY-NC-SA**; archivo de video alojado en `cdn.educ.ar` (se puede reproducir con `<video>`, citando autoría). **Publicado en 2013**: la vigencia de las recomendaciones debe revisarla una persona profesional (no usar para RCP). |
→ **No hay video de atragantamiento del Ministerio de Salud de la Nación.** Opciones: pedir permiso a Cruz Roja Argentina o al Ministerio; usar el de educ.ar con revisión; o producir uno propio con profesionales.

**Salud mental (respiración, relajación muscular, regulación emocional)**
- **No encontré videos de una institución reconocida** (Ministerio, hospital, OPS/OMS, universidad) en español: los resultados fueron de canales personales, de coaching o de fisioterapia (por ejemplo: `WkzMBxohi1M` MUUK; `Kkvkvb0Z6Os` coach; `LLV6s-khqxM` dietistas). **No recomiendo ninguno.**
- **Alternativa oficial:** la OMS publica «**En tiempos de estrés, haz lo que importa**» (guía ilustrada) con **ejercicios de audio** (anclarse, respiración lenta, etc.); existe además una **versión adaptada para América Latina de la OPS**. Licencia **CC BY-NC-SA 3.0 IGO** (uso no comercial, con atribución y misma licencia): la OMS invita a usarlos. Necesita lectura legal (la condición «no comercial») y **revisión profesional** del texto en español. Es audio, no video; la página actual de la OMS «Estrés» ya está citada en «Herramientas para cuidarte».
- Aclaración que debería figurar: «estas técnicas no reemplazan la atención profesional».
- **Opción propia:** grabar con profesionales de la psicología del equipo.

### 4.4 Otros documentos de investigación: lo que sigue sin integrarse
Revisé `docs/investigacion/` y `client/curation/proposals/`. **No hay recursos duplicados ni prestaciones inventadas.** Lo que existe y no está en la web (todo ya documentado, pendiente de aprobación):
| Recurso | Dónde está documentado | Estado |
|---|---|---|
| Odontología de CeSAC 3, 41 y 47 | recursos-incorporables, #2 | Ley 153 + ficha + el trámite de turnos oficial nombra odontología; **falta ficha por prestación y horarios** |
| Salud mental de los tres CeSAC (4 prestaciones) | fichas operativas | Existe gratuidad por norma; **falta admisión/turnos** (comprobación por teléfono del equipo) |
| Vacunación del CeSAC 47 | cesac-47-vacunatorio | **Dirección discrepante** |
| Centro Fijo Indoamericano (castración) | centros-veterinarios-ubicacion | Ubicación (entrada) sin confirmar |
| Esterilización/atención en Rosario, Córdoba, Salta | salud-animal-sedes-permanentes | **Fuera de CABA**: hay que dar de alta cada provincia |
| Centros comunitarios de salud mental de PBA | pba-centros-comunitarios | Sin cotejo con originales |
| Salud sexual estudiantil UNLP | fichas SS14 | Gratuidad y condiciones por confirmar; no es para la población general |
| **Calendario Nacional por etapas** | nacion-calendario-vacunacion-pagina | **Investigado, nunca integrado como contenido** (§2.1) |
| **Consejerías de CABA (62)** y métodos anticonceptivos | (nuevo) | §2.3 |

---

## 5. Los tres pendientes

### A. Ocho botones que llevan a un mapa vacío
| # | Dónde | Botón | Hoy | Propuesta (dentro de AuxiliAR) |
|---|---|---|---|---|
| 1-2 | Salud mental › Dónde buscar ayuda y › Conocé tus derechos | «Explorar centros de salud en el mapa» | «0 lugares» | Reemplazar por **un estado vacío claro**: «Todavía no tenemos prestaciones de salud mental con gratuidad documentada en el mapa. Eso no significa que no existan.» + tres bloques internos: **(1)** tu derecho (ya está: atención en hospital general); **(2)** qué hacer: «acercate a un centro de salud u hospital cerca de tu casa y pedí orientación; puede requerir admisión, turno o derivación» (texto que ya aprobaron); **(3)** ayuda ahora: botón «Ver números de emergencia» y las líneas de salud mental que **ya están en el dataset verificado** (0800-999-0091, 135), mostradas **desde ese dataset, sin escribirlas a mano**. |
| 3-4 | Salud sexual - ESI › Dónde buscar atención y › Anticoncepción | «Explorar…» (filtro Salud sexual) | «0 lugares» | Estado vacío: «Todavía no tenemos prestaciones de salud sexual con gratuidad documentada en el mapa.» + **lista interna de consejerías de la Ciudad** (§2.3) cuando se apruebe, o mientras tanto: la frase oficial «la atención y los métodos son gratuitos en el sistema público» y la **Línea Salud Sexual 0800-222-3444** (desde el dataset). |
| 5-6 | Salud general › Controles (Salud bucal) y › Quiz | «Buscar atención odontológica» | «0 lugares» | Apuntar a «**Ver guardias odontológicas**» (sí tiene 2 resultados: Hospitales Carrillo y Dueñas) y decir adentro: «para un control de rutina empezá por tu centro de salud; hoy no tenemos odontología de rutina con gratuidad documentada». |
| 7-8 | Salud general › Controles (Salud visual) y › Quiz | «Urgencia oftalmológica» | «0 lugares» | Estado vacío: «Hoy no tenemos una guardia oftalmológica con gratuidad documentada en el mapa» + el texto ya aprobado («si te golpeás un ojo, perdés la vista de golpe o tenés un dolor muy fuerte…: buscá una guardia») + «Ver números de emergencia». **No** nombrar el Hospital Santa Lucía mientras su gratuidad no esté documentada. |

**Solución técnica común (sugerida, pequeña):** un **estado vacío contextual** en el explorador: cuando un filtro rápido no tiene resultados, muestra su texto propio (en lugar del genérico), con 2 acciones secundarias («Ver todas las prestaciones disponibles», «Ver números de emergencia»). No promete centros ni servicios. Los botones que hoy dicen «Explorar centros…» pasan a decir «Ver el mapa» para no prometer resultados. **Prioridad P1.**
*Nota:* mostrar líneas de ayuda fuera de la barra de Emergencias es una decisión de diseño que **toca el tema Emergencias**: requiere su aprobación (se leerían desde el dataset, sin modificar nada de él).

### B. «Más recursos»: de «Próximamente» a una sección útil
Estructura propuesta, **reutilizando contenido ya aprobado como módulos de una sola copia** (se escriben una vez y se muestran en «Más recursos» y en su categoría; no se duplican):

| Bloque | Contenido | De dónde sale (ya existe) | Falta |
|---|---|---|---|
| **1. Tus derechos en salud** | Tarjetas por tema: **atención en el sistema público** (Ley 153 CABA: atención gratuita en el área estatal; evidencia en repo); **salud mental** (Ley 26.657: lo que reconoce); **salud sexual y reproductiva** (Ley 25.673: acceso a información, métodos y prestaciones); **vacunas** (Ley 27.491: gratuitas y obligatorias, Calendario); **ESI** (Ley 26.150); **IVE/ILE** (Ley 27.610: **solo cuando termine la revisión editorial y legal**) | Salud mental «Conocé tus derechos»; ESI «Derechos y ESI»; evidencias `caba-ley-153`, `nacion-ley-27491` | Redactar los resúmenes de Ley 153 y 27.491 (hoy solo en evidencia y en notas de fichas) |
| **2. Cómo hacer trámites** | **Cómo pedir turno en un CeSAC** (web de turnos, Boti, 147 opción 1 o en el centro; empadronarse una vez con documento); **vacunarte sin orden médica** y **carnet de vacunas**; **qué hacer si te rechazan la atención** | Texto de las fichas del mapa (ya verificado: `caba-turnos-cesac-tramite`); Calendario (§2.1); Salud mental «Si te rechazan la atención» | Carnet digital en Mi Argentina (la página oficial lo menciona); pedir historia clínica (derecho de la Ley 26.657: hay que confirmar el trámite) |
| **3. Preguntas frecuentes** | 8 a 10 preguntas con respuesta propia y fuente: «¿Necesito orden médica para vacunarme?» (no, Ministerio), «¿Tengo que pagar los métodos anticonceptivos?» (en el sistema público de la Ciudad, no; fuente GCBA), «¿Qué es el preservativo vaginal?», «¿Una campaña gratuita es atención veterinaria gratuita?», «¿Qué significa Gratuita con condiciones?» | Preguntas frecuentes del Ministerio (salud sexual, vacunación, preservativo vaginal), «Sobre los datos», Salud animal | Revisión clínica/legal de cada respuesta |
| **4. Glosario** | Términos que ya definimos (gratuidad confirmada, orientación, ESI…) | Glosario de ESI (sección 1) | — |

Cada módulo muestra adentro la información y, al final, «Fuente oficial» (secundaria). **Prioridad:** bloques 1 y 2 (con lo ya aprobado) **P1/P2**; resto **P3**.

### C. Atención veterinaria: más servicios gratuitos con respaldo oficial
| Servicio | Respaldo | Estado | Propuesta |
|---|---|---|---|
| **Pasteur: disposición de perros y gatos fallecidos** | §4.2 | **V** | Sección interna + mapa (nuevo tipo de servicio) |
| **Pasteur: consultorio clínico (zoonosis)** | §4.2 | **V** (acceso: turno presencial 8 o 13 h, sin urgencias) | Sección «Atención veterinaria gratuita» + mapa |
| **Pasteur: vacuna antirrábica** | §4.2; hoy figura «sin confirmar» | **V** gratuidad; **P** horarios | Actualizar ficha; mapa sin horario |
| **Pasteur: denuncia de mordeduras** (y qué hacer ante una mordedura / murciélago) | «Información útil» y «Servicios» | **V** (texto sanitario: **revisión clínica**) | Sección «Qué hacer ante una mordedura» |
| **Centro Fijo Indoamericano** (castración) | Animales BA | **P** (entrada) | Cuando se confirme la ubicación |
| **Unidades móviles de CABA** (8, castración y antirrábica con turno) | Animales BA | Información **fechada** | Ya figura como campaña; no pin |
| Rosario, Córdoba, Salta | fichas del equipo | **P** (alta de provincia) | Después, una provincia por vez |
| UBA / UNLP | Páginas oficiales | **Arancelados** | Quedan como aviso (ya están) |

---

## 6. Plan

### 6.1 Antes del miércoles 14/10 (bajo riesgo; solo con lo ya verificado y su aprobación)
1. **Calendario de vacunación por etapas** en Salud general (§2.1) — usa texto oficial CC BY 4.0, sin números de teléfono ni indicaciones nuevas. *Esfuerzo: ~1 día.*
2. **Estados vacíos útiles** para los 8 botones (§5.A) y rótulo «Ver el mapa». *~½ día.* (La parte de líneas de ayuda requiere su aprobación.)
3. **«Más recursos» v1** con los bloques 1 y 2 reutilizando lo existente (§5.B) y sin Ley 27.610. *~1 día.*
4. **«Qué hacer si muere tu perro o gato»** (Pasteur) y actualizar la ficha de Pasteur (§4.2), con la aprobación sanitaria del texto. *~½ día.*
5. **Video del Ministerio de RCP** en la guía de RCP (§4.3) **solo si** una persona profesional lo revisa y el Ministerio confirma. *~2 h técnicas.*

### 6.2 Requieren investigación adicional
- Fuente original y confirmación telefónica de **preservativos vaginales en el Rivadavia** (§4.1).
- Aclarar con Pasteur: **horarios del vacunatorio**, **cenizas/cremación individual**, otras especies, y si el mapa «Centros de prevención» sigue vigente.
- **Ubicación** verificable del Pasteur para el mapa (normalizador oficial).
- **Descripción de cada método** y «preservativo vaginal»: lectura contra las páginas originales.
- **Videos** de atragantamiento y de salud mental de una institución reconocida (o producción propia).
- Trámite de **historia clínica** y de **carnet digital**.
- Odontología, salud mental y vacunación de CeSAC 47 (llamadas del equipo ya listadas).

### 6.3 Necesitan validación clínica, legal o autorización de uso
| Material | Qué hace falta |
|---|---|
| Cualquier **video** de RCP, DEA, atragantamiento o salud mental | **Revisión profesional** y comparación con las guías aprobadas; **autorización escrita** de la institución (recomendada); transcripción accesible |
| Texto de **rabia y mordeduras** (Pasteur «Información útil») | Revisión clínica y veterinaria |
| **Métodos anticonceptivos**, preservativo vaginal | Revisión clínica |
| **Ley 27.610 (IVE/ILE)** y reglas por edad en adolescentes | Revisión editorial y legal (ya declarada) |
| **Ejercicios de la OMS** (licencia CC BY-NC-SA 3.0 IGO) | Lectura legal («no comercial», «compartir igual») + revisión profesional de la traducción |
| Videos de **educ.ar** (CC BY-NC-SA, 2013) | Revisión de **vigencia clínica** + atribución |
| Criterio «caminar sin ayuda» en fracturas | Validación clínica pendiente (informe aparte) |
| Nuevo tipo de servicio y lugar «Pasteur» en el mapa | Aprobación del equipo (cambio de datos y de taxonomía) |

---

## 7. Qué necesito que aprueben

1. **¿Avanzamos con el calendario de vacunación por etapas en Salud general?** (propongo sí, P1)
2. **Estados vacíos para los 8 botones**: ¿les parecen bien los textos de §5.A? ¿Se pueden mostrar líneas de ayuda **desde el dataset** en esos estados vacíos?
3. **«Más recursos» v1**: estructura de §5.B. ¿Incluimos «Cómo pedir turno en un CeSAC» (ya verificado)? ¿Dejamos IVE/ILE afuera hasta la revisión legal?
4. **Pasteur**: ¿publicamos «Qué hacer si muere tu perro o gato» con el matiz «disposición final o cremación»? ¿Actualizamos su ficha? ¿Lo proponemos para el mapa (con tipo de servicio nuevo)?
5. **Rivadavia / preservativos femeninos**: ¿de dónde sale la información? ¿Alguien puede llamar al hospital?
6. **Videos**: ¿Quién puede revisar clínicamente el video de RCP del Ministerio? ¿Pedimos autorización al Ministerio? Para salud mental, ¿prefieren los audios de la OMS o producción propia?
7. **ESI**: ¿reemplazamos la guía de Huésped como fuente principal de métodos por el texto del Gobierno de la Ciudad (explicado adentro)? ¿Proponemos «Consejería y métodos anticonceptivos» para CeSAC 3, 41 y 47 en el mapa?

**Detalle:** todo lo anterior son propuestas. No se modificó ningún archivo del sitio ni del servidor en esta etapa.
