# CABA: prestaciones pendientes de validación humana

Registro del **10/10/2026**. **No se importó nada**: el mapa sigue con los 7 establecimientos de `client/src/data/resources/places/ar-c.json`. Este documento deja por escrito, en el repositorio, lo que hasta ahora solo estaba en la conversación, para que una persona del equipo pueda validarlo.

## Aclaración que vale para todo el documento

**Una revisión documental no es una validación operativa humana, ni una autorización para publicar.** Todas las prestaciones de abajo figuran como «Verificado» en el CSV de Work con la leyenda *«Investigación documental AuxiliAR (pendiente revisión del equipo)»*: alguien leyó fuentes públicas, nadie comprobó en el lugar ni por teléfono que el servicio exista hoy, y ninguna fue aprobada. Que una prestación tenga la gratuidad documentada no asegura que haya atención, turnos ni cupos ahora. Mientras no haya una persona responsable que valide y deje constancia, **ninguna se publica, se carga ni se muestra como confirmada**.

## Fuentes de este documento y alcance

- `docs/investigacion/work-caba-2026/F_salida_compatible.csv` (Work, 562 filas; carpeta sin seguimiento en Git). Las columnas citadas son las del CSV.
- Páginas oficiales del Gobierno de la Ciudad, leídas el 10/10/2026 **mediante una herramienta de lectura automática** (resumen de la página): quien valide debe cotejarlas directamente. Ninguna de esas páginas muestra fecha de actualización y todas están bajo `gcaba_historico`.
- Textos guardados en el repositorio: `docs/investigacion/evidencia/caba-consejerias-salud-sexual-lista.txt` y `caba-metodos-anticonceptivos-gratuitos.txt` (consultados el 9/10/2026, sin fecha).
- Donde falta una fuente o un dato dice **pendiente**: no se reconstruyó.

Convenciones: **Explícito** = lo dice la fuente. **Inferido** = se deduce de otra cosa (una ley general, una frase que cubre varias guardias) y no está dicho para esa prestación. «Por asignar» = todavía no hay persona ni fecha.

Para todas las fichas: **Responsable de la revisión humana: por asignar. Fecha de revisión humana: por asignar.**

---

## 1. Cuatro prestaciones hospitalarias (fichas)

Mismos datos de control en las cuatro: acción sugerida por Work `NUEVO_ESTABLECIMIENTO`, estado `CONFIRMADO_DOCUMENTAL`, próxima revisión propuesta por Work **2026-11-09** (un mes), coordenadas **ninguna** (pendiente), teléfono del establecimiento en el CSV **vacío** (los teléfonos que aparecen abajo salen de las páginas, no del CSV).

### 1.1 Guardia pediátrica · Hospital de Niños Ricardo Gutiérrez

| Campo | Registro |
|---|---|
| id en el CSV | `hospital-gutierrez#guardia-medica` («Guardia pediátrica 24 horas») |
| Fuente oficial | `https://buenosaires.gob.ar/gcaba_historico/salud/hospitalgutierrez/departamento-de-urgencias` (página propia del Departamento de Urgencias). Consultada 10/10/2026. Fecha de la fuente: no muestra |
| Dirección | **Explícito** (CSV y lista oficial de consejerías): Gallo 1330, Comuna 2 (Recoleta) |
| Acceso | **Explícito**: «Se accede por la intersección de las calles Paraguay y Sanchez de Bustamante», planta baja, pabellón A. **La entrada de la guardia no está sobre la dirección registrada (Gallo 1330).** Teléfonos de la página: (011) 4962-9232 / (011) 4962-5532 |
| Horario | **Explícito**: «Atención de Guardia Externa las 24 hs, los 365 días del año» |
| Gratuidad | La página **no la menciona**. **Inferida** de la Ley 153 (Boletín Oficial de la Ciudad, `.../normativaba/norma/3800`), que habla de ausencia de pago directo en el área estatal; es una norma general, no una frase de esta guardia |
| Condiciones de acceso | Demanda por urgencia pediátrica (CSV). Edades: **pendiente** — la página la llama «efector pediátrico» y no da rango de edad |
| Datos faltantes | Rango de edad; criterios de admisión y derivación; ubicación del pin en la entrada y no en la dirección; coordenadas; confirmación telefónica |
| Bloqueos | Revisión humana. Entrada distinta de la dirección: el punto del mapa debe marcar la entrada |

### 1.2 Guardia de salud mental · Hospital Borda

| Campo | Registro |
|---|---|
| id en el CSV | `hospital-borda#guardia-salud-mental` («Guardia de salud mental 24 horas») |
| Fuente oficial | `https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias`. Consultada 10/10/2026. Fecha de la fuente: no muestra |
| Dirección | **Explícito**: Av. Ramón Carrillo 375, Comuna 4 |
| Acceso | **Explícito**: «Podés acercarte a una de las guardias de Salud Mental…»; teléfono de guardia de la página 4305-6666. Entrada y criterios de admisión: **pendiente** (el CSV pide «confirmar entrada, destinatarios y criterios de admisión») |
| Horario | **Inferido**: la frase de introducción «las 24hs, los 365 días del año» aplica a la lista de guardias de salud mental en general. **El horario no está confirmado individualmente para el Borda** |
| Gratuidad | La página no la menciona. **Inferida** de la Ley 153 (norma general) |
| Condiciones de acceso | Demanda espontánea (CSV). Edades atendidas: **pendiente** |
| Datos faltantes | Entrada; destinatarios y edades; criterios de admisión; coordenadas |
| Bloqueos | Revisión humana; confirmar el horario con el hospital |

### 1.3 Testeo de VIH y sífilis · Hospital Álvarez

| Campo | Registro |
|---|---|
| id en el CSV | `hospital-alvarez#test-vih-sifilis` («Testeo VIH y sífilis») |
| Fuente oficial | `https://buenosaires.gob.ar/gcaba_historico/test-de-vih-y-sifilis-y-centros-de-testeo-0`. Consultada 10/10/2026. La página no muestra fecha; el listado que enlaza se llama «Listado de CEPAD Enero 2026.pdf» (**inferencia**: versión de enero de 2026; no es una fecha de actualización) |
| Dirección | **Explícito**: Aranguren 2701 (barrio Flores, Comuna 7) |
| Acceso | **Explícito**: figura «Hospital Gral. de Agudos Álvarez, Servicio de Infectología», teléfono 4630-2900, test rápido de VIH «SÍ» y de sífilis «SÍ». **Llamada previa**: la página dice «consultá telefónicamente antes de ir». Si hace falta turno u orden: **pendiente** (la página no lo dice) |
| Horario | **Ausente**: la página no da días ni horarios («los centros de testeo atienden en distintos días y horarios»). Pendiente. No se debe asumir el horario de la guardia (aviso del propio CSV) |
| Gratuidad | **Explícito**: «Es sencillo, confidencial y gratuito en el sistema público». Es una frase general sobre el sistema público, no sobre este hospital en particular |
| Datos faltantes | Días y horarios; turno u orden; entrada del servicio; coordenadas |
| Bloqueos | Revisión humana; confirmación telefónica del servicio y su horario |

### 1.4 Consejería anticonceptiva · Hospital Materno Infantil Ramón Sardá

| Campo | Registro |
|---|---|
| id en el CSV | `hospital-sarda#anticonceptivos` («Consejería y métodos anticonceptivos») |
| Fuente oficial | Lista oficial de consejerías en salud sexual del Gobierno de la Ciudad (texto guardado en `docs/investigacion/evidencia/caba-consejerias-salud-sexual-lista.txt`, consultada 9/10/2026, sin fecha) y página de métodos anticonceptivos (`.../salud-sexual-y-reproductiva/metodos-anticonceptivos`, texto guardado en `caba-metodos-anticonceptivos-gratuitos.txt`) |
| Dirección | **Explícito**: «Esteban De Luca 2151 (Parque Patricios)», Comuna 4 |
| Acceso | **Explícito**: la lista dice «En los siguientes centros de salud y hospitales se puede acceder a los métodos anticonceptivos y a la interrupción del embarazo»; el Sardá figura con ligadura tubaria «Sí» y vasectomía «No». Cómo se pide y si hay turno: **pendiente** |
| Teléfono | La lista da **15-4943-4036**, pero en la columna «contacto por IVE/ILE»: **no es utilizable como teléfono general** de la consejería. Teléfono propio de la consejería: pendiente |
| Horario | **Pendiente** (no documentado) |
| Gratuidad | **Explícito**: «La atención y los métodos son gratuitos en el sistema público». Es válida para el servicio, pero **no confirma que haya stock, turnos ni cupos** |
| Datos faltantes | Teléfono propio; horario; cómo se accede; coordenadas |
| Bloqueos | Revisión humana. **El circuito de IVE/ILE del mismo hospital queda fuera**: en la app el contenido de IVE/ILE está pendiente de validación legal |

---

## 2. Estaciones Saludables: asesoría nutricional y actividad física

**18 Estaciones Saludables × 2 prestaciones = 36 prestaciones**, todas con «Gratuita (documentada para esta prestación)» y estado `CONFIRMADO_DOCUMENTAL` en el CSV. Cada Estación tiene además una tercera fila (controles básicos) que está bloqueada: ver 2.3. **El bloqueo de los controles básicos no se extiende a estas 36.**

### 2.1 Qué dice el registro (común a las 36)

| Campo | Registro |
|---|---|
| Fuente de existencia y acceso | `https://buenosaires.gob.ar/gcaba_historico/estaciones-saludables` (Gobierno de la Ciudad). Consultada 10/10/2026. **Sin fecha editorial** |
| Fuente de la gratuidad | Según el CSV: `https://buenosaires.gob.ar/gcaba_historico/noticias/estaciones-saludables-espacios-para-moverse-aprender-y-disfrutar-en` (dirección tal como figura en el CSV; **pendiente comprobar que esté completa**). Fecha de la fuente de costo: **2025-08-14** (según el CSV). Esta gratuidad **no se comprobó directamente** al preparar este documento |
| Gratuidad | **Explícito, según el CSV**: «declara gratuidad de esta prestación o programa; alcance limitado al servicio descripto». Modalidad: «Sin pago directo; alcance de acceso indicado» |
| Acceso | **Explícito, según el CSV**: «Acercarse al dispositivo y consultar prestación. La ficha no detalla turnos para cada servicio». Teléfono del programa: **11 3161-9798** (el mismo en las 18; viene de la columna del establecimiento) |
| Requisitos y destinatarios | Sin requisito económico publicado. Destinatarios: **pendiente** (el CSV dice que no se verificaron cupos ni agenda) |
| Ubicación | **Cruce de calles, sin número** (por ejemplo «Libertador y Dr. Luis Agote»). Coordenadas: **ninguna**. El CSV tiene la comuna en `division_comuna_partido`; su columna `referencia_comuna` trae una dirección web en lugar del valor y no sirve |
| Pendiente del propio CSV | «Confirmar cronograma por actividad; no atribuir el horario de apertura a cada clase» |
| Verificación | «Investigación documental AuxiliAR (pendiente revisión del equipo)», 2026-10-10 |
| Tipo propuesto (sin aplicar) | Establecimiento: `health-promotion-station`. Prestaciones: `nutrition-care` (asesoría nutricional) y `physical-activity` (actividad física) |
| Inferencias | Que la prestación se dé en cada horario de la Estación; que las 18 tengan las mismas actividades |

**Diferencias entre las dos prestaciones**

| | Asesoría nutricional (18) | Actividad física (18) |
|---|---|---|
| Nombre en el CSV | «Asesoría nutricional» | «Programa de actividad física gratuita» |
| Horario | El de la Estación, **según el CSV** (varía por Estación, ver tabla). «Horario del dispositivo; no confirma presencia profesional» | **Pendiente** en las 18: «No documentado para esta prestación» |
| Próxima revisión propuesta por Work | **2026-11-09** | **2026-10-17** (siete días después de la consulta: vence mucho antes) |

### 2.2 Las 36 prestaciones

| # | id en el CSV | Prestación | Ubicación (cruce, sin número) | Comuna | Horario según el CSV | Próxima revisión propuesta por Work | Responsable de la revisión humana | Fecha de revisión humana |
|---|---|---|---|---|---|---|---|---|
| 1 | `estacion-saludable-ruben-dario#asesoria-nutricional` | AN | Estación Saludable Rubén Darío: Libertador y Dr. Luis Agote | Comuna 2 | Lunes a viernes 9–13 y 16–20; sábados, domingos y feriados 9–18 | 2026-11-09 | por asignar | por asignar |
| 2 | `estacion-saludable-ruben-dario#actividad-fisica` | AF | Estación Saludable Rubén Darío: Libertador y Dr. Luis Agote | Comuna 2 | pendiente | 2026-10-17 | por asignar | por asignar |
| 3 | `estacion-saludable-houssay#asesoria-nutricional` | AN | Estación Saludable Plaza Houssay: Paraguay y Uriburu | Comuna 2 | Lunes a viernes 9–17 | 2026-11-09 | por asignar | por asignar |
| 4 | `estacion-saludable-houssay#actividad-fisica` | AF | Estación Saludable Plaza Houssay: Paraguay y Uriburu | Comuna 2 | pendiente | 2026-10-17 | por asignar | por asignar |
| 5 | `estacion-saludable-manzana-66#asesoria-nutricional` | AN | Estación Saludable Plaza Manzana 66: Moreno entre Catamarca y Av. Jujuy | Comuna 3 | Lunes a viernes 9–17 | 2026-11-09 | por asignar | por asignar |
| 6 | `estacion-saludable-manzana-66#actividad-fisica` | AF | Estación Saludable Plaza Manzana 66: Moreno entre Catamarca y Av. Jujuy | Comuna 3 | pendiente | 2026-10-17 | por asignar | por asignar |
| 7 | `estacion-saludable-martin-fierro#asesoria-nutricional` | AN | Estación Saludable Martín Fierro: Barcala entre La Rioja y Gral. Urquiza | Comuna 3 | Lunes a viernes 9–17 | 2026-11-09 | por asignar | por asignar |
| 8 | `estacion-saludable-martin-fierro#actividad-fisica` | AF | Estación Saludable Martín Fierro: Barcala entre La Rioja y Gral. Urquiza | Comuna 3 | pendiente | 2026-10-17 | por asignar | por asignar |
| 9 | `estacion-saludable-patricios#asesoria-nutricional` | AN | Estación Saludable Parque Patricios: Patagones y Monteagudo | Comuna 4 | Lunes a viernes 9–17; sábados, domingos y feriados 9–18 | 2026-11-09 | por asignar | por asignar |
| 10 | `estacion-saludable-patricios#actividad-fisica` | AF | Estación Saludable Parque Patricios: Patagones y Monteagudo | Comuna 4 | pendiente | 2026-10-17 | por asignar | por asignar |
| 11 | `estacion-saludable-almagro#asesoria-nutricional` | AN | Estación Saludable Plaza Almagro: Perón entre Bulnes y Salguero | Comuna 5 | Lunes a viernes 9–17; sábados, domingos y feriados 9–18 | 2026-11-09 | por asignar | por asignar |
| 12 | `estacion-saludable-almagro#actividad-fisica` | AF | Estación Saludable Plaza Almagro: Perón entre Bulnes y Salguero | Comuna 5 | pendiente | 2026-10-17 | por asignar | por asignar |
| 13 | `estacion-saludable-centenario#asesoria-nutricional` | AN | Estación Saludable Parque Centenario: Antonio Machado y Leopoldo Marechal | Comuna 6 | Lunes a viernes 9–17; sábados, domingos y feriados 9–18 | 2026-11-09 | por asignar | por asignar |
| 14 | `estacion-saludable-centenario#actividad-fisica` | AF | Estación Saludable Parque Centenario: Antonio Machado y Leopoldo Marechal | Comuna 6 | pendiente | 2026-10-17 | por asignar | por asignar |
| 15 | `estacion-saludable-rivadavia#asesoria-nutricional` | AN | Estación Saludable Parque Rivadavia: Rivadavia y Pasaje Florencio Balcarce | Comuna 6 | Lunes a viernes 9–17; sábados, domingos y feriados 9–18 | 2026-11-09 | por asignar | por asignar |
| 16 | `estacion-saludable-rivadavia#actividad-fisica` | AF | Estación Saludable Parque Rivadavia: Rivadavia y Pasaje Florencio Balcarce | Comuna 6 | pendiente | 2026-10-17 | por asignar | por asignar |
| 17 | `estacion-saludable-chacabuco#asesoria-nutricional` | AN | Estación Saludable Parque Chacabuco: Asamblea y Emilio Mitre | Comuna 7 | Lunes a viernes 9–17; sábados, domingos y feriados 9–18 | 2026-11-09 | por asignar | por asignar |
| 18 | `estacion-saludable-chacabuco#actividad-fisica` | AF | Estación Saludable Parque Chacabuco: Asamblea y Emilio Mitre | Comuna 7 | pendiente | 2026-10-17 | por asignar | por asignar |
| 19 | `estacion-saludable-flores#asesoria-nutricional` | AN | Estación Saludable Plaza Flores: Rivadavia y Fray Cayetano Rodríguez | Comuna 7 | Lunes a viernes 9–16 | 2026-11-09 | por asignar | por asignar |
| 20 | `estacion-saludable-flores#actividad-fisica` | AF | Estación Saludable Plaza Flores: Rivadavia y Fray Cayetano Rodríguez | Comuna 7 | pendiente | 2026-10-17 | por asignar | por asignar |
| 21 | `estacion-saludable-ciudad#asesoria-nutricional` | AN | Estación Saludable Parque de la Ciudad: 23 de Junio y Alberto Zorilla | Comuna 8 | Sábados, domingos y feriados 9–18 | 2026-11-09 | por asignar | por asignar |
| 22 | `estacion-saludable-ciudad#actividad-fisica` | AF | Estación Saludable Parque de la Ciudad: 23 de Junio y Alberto Zorilla | Comuna 8 | pendiente | 2026-10-17 | por asignar | por asignar |
| 23 | `estacion-saludable-sudamerica#asesoria-nutricional` | AN | Estación Saludable Plaza Sudamérica: Piedrabuena y Fernández de la Cruz | Comuna 8 | Lunes a viernes 9–17 | 2026-11-09 | por asignar | por asignar |
| 24 | `estacion-saludable-sudamerica#actividad-fisica` | AF | Estación Saludable Plaza Sudamérica: Piedrabuena y Fernández de la Cruz | Comuna 8 | pendiente | 2026-10-17 | por asignar | por asignar |
| 25 | `estacion-saludable-avellaneda#asesoria-nutricional` | AN | Estación Saludable Parque Avellaneda: Lacarra y Bilbao | Comuna 9 | Sábados, domingos y feriados 9–18 | 2026-11-09 | por asignar | por asignar |
| 26 | `estacion-saludable-avellaneda#actividad-fisica` | AF | Estación Saludable Parque Avellaneda: Lacarra y Bilbao | Comuna 9 | pendiente | 2026-10-17 | por asignar | por asignar |
| 27 | `estacion-saludable-aristobulo#asesoria-nutricional` | AN | Estación Saludable Aristóbulo del Valle: Cuenca entre Baigorria y Marcos Sastre | Comuna 11 | Lunes a viernes 9–17 | 2026-11-09 | por asignar | por asignar |
| 28 | `estacion-saludable-aristobulo#actividad-fisica` | AF | Estación Saludable Aristóbulo del Valle: Cuenca entre Baigorria y Marcos Sastre | Comuna 11 | pendiente | 2026-10-17 | por asignar | por asignar |
| 29 | `estacion-saludable-saavedra#asesoria-nutricional` | AN | Estación Saludable Parque Saavedra: Roque Pérez y Paroissien | Comuna 12 | Lunes a viernes 9–17; sábados, domingos y feriados 9–18 | 2026-11-09 | por asignar | por asignar |
| 30 | `estacion-saludable-saavedra#actividad-fisica` | AF | Estación Saludable Parque Saavedra: Roque Pérez y Paroissien | Comuna 12 | pendiente | 2026-10-17 | por asignar | por asignar |
| 31 | `estacion-saludable-lagos-palermo#asesoria-nutricional` | AN | Estación Saludable Lagos de Palermo: Andrés Bello casi Tornquist | Comuna 14 | Sábados, domingos y feriados 9–18 | 2026-11-09 | por asignar | por asignar |
| 32 | `estacion-saludable-lagos-palermo#actividad-fisica` | AF | Estación Saludable Lagos de Palermo: Andrés Bello casi Tornquist | Comuna 14 | pendiente | 2026-10-17 | por asignar | por asignar |
| 33 | `estacion-saludable-rosedal#asesoria-nutricional` | AN | Estación Saludable Rosedal: Iraola y Sarmiento | Comuna 14 | Sábados, domingos y feriados 9–18 | 2026-11-09 | por asignar | por asignar |
| 34 | `estacion-saludable-rosedal#actividad-fisica` | AF | Estación Saludable Rosedal: Iraola y Sarmiento | Comuna 14 | pendiente | 2026-10-17 | por asignar | por asignar |
| 35 | `estacion-saludable-los-andes#asesoria-nutricional` | AN | Estación Saludable Parque Los Andes: Dorrego y Corrientes | Comuna 15 | Lunes a viernes 9–17; sábados, domingos y feriados 9–18 | 2026-11-09 | por asignar | por asignar |
| 36 | `estacion-saludable-los-andes#actividad-fisica` | AF | Estación Saludable Parque Los Andes: Dorrego y Corrientes | Comuna 15 | pendiente | 2026-10-17 | por asignar | por asignar |

«AN» = asesoría nutricional; «AF» = actividad física.

### 2.3 Registrado aparte: controles básicos (18 filas, **bloqueadas**)

Cada Estación tiene una fila «Enfermería: presión arterial, peso y talla» (`<id>#controles-basicos`, acción `NO_INCORPORAR`, estado **`PENDIENTE_ACTUALIDAD_COSTO`**).

- **Motivo del bloqueo (CSV):** la nota de costo de los controles es **histórica** y debe revalidarse; falta «confirmación actual de gratuidad de controles preventivos en estaciones fijas». Fuente de costo citada: `.../noticias/controles-gratuitos-de-glucemia`, con fecha exacta **pendiente**.
- Otros pendientes: «Confirmar presencia del profesional y cronograma de clases». Próxima revisión propuesta: 2026-10-17.
- **No se extiende a asesoría nutricional ni a actividad física**, que tienen otra fuente de costo y estado confirmado.

### 2.4 Otras filas de las Estaciones (fuera de este registro)

No forman parte de las 36 y no se evaluaron aquí: dos filas «Acercate: acompañamiento de consumos problemáticos» (Parque Patricios y Parque Chacabuco, `CONFIRMADO_DOCUMENTAL`, sin tipo de prestación asignado) y una fila de uso libre de la pista de atletismo de Parque Chacabuco (`PENDIENTE_AGRUPAMIENTO`, `NO_INCORPORAR`; la propia fila dice que es infraestructura pública y no la Estación). **Pendiente.**

---

## 3. Plazas Activas: no son pines permanentes

- **Qué son, según la investigación (CSV):** actividad organizada de gimnasia en plazas (17 puntos en el CSV). Es un **programa itinerante**, no un establecimiento con sede. Gratuidad «con condiciones» (no «documentada»): **mayores de 18 años, aceptación de términos e inscripción previa**. Horarios por plaza (por ejemplo «lunes, miércoles y viernes»). La ubicación es una esquina.
- **Estado en el CSV:** 7 filas `NUEVO_ESTABLECIMIENTO` y 10 `NO_INCORPORAR` (varias por «confirmar el punto y si corresponde agrupar la actividad con la Estación Saludable del mismo parque»).
- **Tipo de establecimiento: pendiente.** La propuesta `public-space-activity` **no fue aprobada** y no existe en la taxonomía; no se asignó otro.
- **Cómo tratarlas:** como programa o actividad con ficha informativa, **no como pines permanentes del mapa**. No se carga ningún dato ni se les inventa un tipo.
- Responsable y fecha de revisión humana: **por asignar**.

---

## 4. Resumen de lo registrado y lo pendiente

| | Cantidad |
|---|---|
| Fichas hospitalarias | 4 |
| Estaciones Saludables | 18 |
| Prestaciones de Estaciones (AN + AF) | 36 |
| Controles básicos bloqueados, aparte | 18 |
| Plazas Activas (programa, tipo pendiente) | 17 puntos |
| Con responsable y fecha de revisión humana asignados | **0** |
| Con coordenadas | **0** |
| Cargadas en el mapa | **0** |

Pendientes generales: asignar responsable y fecha; confirmar horarios y accesos con cada establecimiento; cotejar las páginas oficiales directamente; coordenadas verificadas (en las Estaciones, a partir de un cruce de calles); definir el tratamiento de Plazas Activas; y decidir el vencimiento de la verificación (Work propone 2026-11-09, y 2026-10-17 para actividad física).
