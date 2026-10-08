# Lote 1: fichas para aprobación

> **Corrección del 8/10/2026 (ver `implementacion-lote-1.md`, §5.1):** el servicio `cesac-41/vacunacion` **ya tenía cargado** su horario de vacunación antes de este lote (no lo agregué yo ni lo toqué). Donde esta ficha habla de horarios de vacunación «no cargados», vale para el CeSAC 3; el CeSAC 41 ya los mostraba.

Fecha de preparación: **8/10/2026**. **No se cambió ningún dato del mapa: ningún estado de gratuidad, ningún establecimiento, ninguna prestación.** Lo que se cambiaría está en [`client/curation/proposals/lote-1.cambios-propuestos.json`](../../../client/curation/proposals/lote-1.cambios-propuestos.json) y se aplica solo cuando el equipo apruebe estas fichas.

Criterios del equipo que se aplican (decisiones del 8/10/2026):
1. Una norma vigente respalda la gratuidad si se demuestra que aplica a **esa prestación** y a **esa institución**. La existencia de la prestación y el acceso se verifican por separado.
2. Las prestaciones con condiciones se muestran como **«Gratuita con condiciones»**, explicando quién puede acceder. Nunca como gratuitas para cualquier persona.
3. Coordenadas solo de fuentes oficiales o geocodificación comprobada contra una dirección oficial. Si hay ambigüedad, queda pendiente.
4. Las comprobaciones operativas las hace el equipo: están en [`formularios-comprobacion-operativa.md`](formularios-comprobacion-operativa.md), **en blanco**.

## 1. Tabla de cambios propuestos (para aprobar antes de tocar nada)

«Hoy» es lo que dicen los datos ahora. «Se modificaría» es lo único que cambia en esa prestación; todo lo demás queda igual.

| Ficha | Establecimiento · prestación (id en los datos) | Hoy | Evidencia de gratuidad | Evidencia de que la sede la ofrece | Campos que se modificarían | Chip que vería la persona |
|---|---|---|---|---|---|---|
| **L1-AP-3** | CeSAC 3 · «Clínica médica» (`cesac-3` / `atencion-primaria`, tipo `primary-care`) | `cost` sin dato → «Gratuidad no confirmada»; sin horario ni turno | **Ley 153 CABA**, art. 3 inc. g y art. 2 (E1) | Ficha oficial del CeSAC 3 (E3) | `cost: "free"`; `source` propia (Ley 153 + nota); `requirements` (empadronamiento); `appointment.howTo` (canales de turno del trámite), con `mode` **sigue «unknown»** | «Atención gratuita» |
| **L1-AP-41** | CeSAC 41 · «Medicina general» (`cesac-41` / `atencion-primaria`) | ídem; el establecimiento ya tiene horario general lun–vie 8 a 18 h y «turnos personalmente» (de la página del Htal. Argerich) | Ley 153 (E1) | Ficha oficial del CeSAC 41 (E4) | los mismos campos que L1-AP-3; el `howTo` agrega que los turnos «se solicitan personalmente» (E10) | «Atención gratuita» |
| **L1-AP-47** | CeSAC 47 · «Medicina general» (`cesac-47` / `atencion-primaria`) | ídem | Ley 153 (E1) | Ficha oficial del CeSAC 47 (E5) | los mismos campos que L1-AP-3 | «Atención gratuita» |
| **L1-AP-47-PED** | CeSAC 47 · «Pediatría» (`cesac-47` / `pediatria`, tipo `primary-care`) | ídem | Ley 153 (E1) | Ficha oficial del CeSAC 47 (E5) | los mismos campos; sin edades (no figuran) | «Atención gratuita» |
| **L1-VAC-3** | CeSAC 3 · «Programas de vacunación» (`cesac-3` / `vacunacion`, tipo `vaccination`) | sin costo, sin horario | **Ley 27.491**, art. 2 inc. a y art. 7; Calendario vigente: Res. 339/2026 (E7, E8, E9) | Ficha del CeSAC 3 («programas: vacunación») y página de vacunatorios de la Ciudad (E3, E6) | `cost: "free"`; `costNote` (solo vacunas del Calendario, de grupos de riesgo y de emergencia; no se sabe cuáles aplica la sede); `source` propia | **«Gratuita con condiciones»** |
| **L1-VAC-41** | CeSAC 41 · «Vacunatorio» (`cesac-41` / `vacunacion`) | tiene fuente propia (página de vacunatorios), sin costo | Ley 27.491 (E7–E9) | Ficha del CeSAC 41 («actividades: vacunatorio») y página de vacunatorios (E4, E6) | `cost: "free"`; `costNote`; `source` propia (reemplaza la nota «Lugares y horarios de vacunatorios»; esa página sigue citada dentro de la nota) | **«Gratuita con condiciones»** |

**No se proponen** en este lote: la vacunación del CeSAC 47 (discrepancia de dirección, ver §5), la salud mental de los tres CeSAC (acceso no documentado), ni ninguna otra prestación de los tres centros (odontología, ecografía, laboratorio, farmacia, salud sexual…): siguen «Gratuidad no confirmada».

**Los horarios de vacunación no se cargan** aunque están publicados: el modelo actual haría desaparecer el aviso «todavía no tenemos el horario» de toda la sede (ver [`control-tecnico-del-modelo.md`](control-tecnico-del-modelo.md)). Quedan guardados en la propuesta (`deferredHours`) y en cada ficha.

**Decisión para el equipo (ficha AP):** la gratuidad de atención primaria se respalda con una **norma general** (Ley 153), no con una frase del CeSAC. Ustedes lo aprobaron como criterio 1; esta es su primera aplicación. Si prefieren una frase específica, las fichas AP quedan pendientes hasta la comprobación operativa.

## 2. Fuentes originales (todas consultadas el 8/10/2026)

El texto extraído está en [`../evidencia/`](../evidencia/) (teléfonos y correos omitidos). Las páginas del Gobierno de la Ciudad **no publican fecha de actualización**; lo fechable es la consulta de hoy y la publicación de cada norma.

| Id | Fuente | URL | Archivo de evidencia |
|---|---|---|---|
| E1 | Ley 153, Ley Básica de Salud de la Ciudad (publicada 28/5/1999, texto consolidado), Boletín Oficial de la Ciudad | https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800 | `caba-ley-153-arts-1-3.txt` |
| E2 | Trámite «Solicitud de turnos en CESAC», Gobierno de la Ciudad | https://buenosaires.gob.ar/tramites/solicitud-de-turnos-en-centros-de-salud-y-accion-comunitaria-cesac | `caba-turnos-cesac-tramite.txt` |
| E3 | Ficha oficial CeSAC Nº 3 | https://buenosaires.gob.ar/gcaba_historico/salud/cesac-3 | `cesac-3.txt` |
| E4 | Ficha oficial CeSAC Nº 41 | https://www.buenosaires.gob.ar/salud/cesac-41 (redirige a `gcaba_historico/salud/cesac-41`) | `cesac-41.txt` |
| E5 | Ficha oficial CeSAC Nº 47 | https://buenosaires.gob.ar/gcaba_historico/salud/cesac-47 | `cesac-47.txt` |
| E6 | Lugares y horarios de vacunatorios, Gobierno de la Ciudad | https://buenosaires.gob.ar/gcaba_historico/lugares-y-horarios-de-vacunatorios | `caba-vacunatorios-cesac-3-41-47.txt` |
| E7 | Ley 27.491 (publicada 4/1/2019) | https://www.argentina.gob.ar/normativa/nacional/ley-27491-318455/texto | `nacion-ley-27491-art-2-y-7.txt` |
| E8 | Resolución 339/2026 del Ministerio de Salud (publicada 26/2/2026), modifica el Calendario | https://www.argentina.gob.ar/normativa/nacional/norma-423397/texto | `nacion-resolucion-339-2026-calendario.txt` |
| E9 | Calendario Nacional de Vacunación, Ministerio de Salud | https://www.argentina.gob.ar/salud/vacunas | `nacion-calendario-vacunacion-pagina.txt` |
| E10 | Departamento de Área Programática, Hospital Argerich (horario y turnos de CeSAC 9, 15, 41 y 46) | https://buenosaires.gob.ar/gcaba_historico/servicios-hospital-argerich/departamento-de-area-programatica | `caba-argerich-area-programatica.txt` (nuevo) |
| E11 | Atención veterinaria y castraciones gratuitas, Animales BA | https://buenosaires.gob.ar/gcaba_historico/atencion-veterinaria-y-castraciones-gratuitas | `animales-ba-castracion-y-vacunacion.txt` |
| E12 | Normalizador de direcciones USIG (geocodificación) | https://servicios.usig.buenosaires.gob.ar/normalizar/ | resultado citado en cada ficha de castración |

## 3. Fichas de atención primaria

### Evidencia común a las cuatro fichas AP

**Gratuidad (E1).** Ley 153, art. 3 inc. g: «La gratuidad de las acciones de salud, entendida como la exención de cualquier forma de pago directo en el área estatal; rigiendo la compensación económica de los servicios prestados a personas con cobertura social o privada, por sus respectivas entidades o jurisdicciones». Art. 2: las disposiciones «alcanzan a todas las personas sin excepción, sean residentes o no residentes».
- *Por qué aplica a la prestación:* la atención primaria (clínica, medicina general, pediatría) es una «acción de salud» y el art. 3 inc. i organiza el área estatal con atención primaria y «jerarquizando el primer nivel».
- *Por qué aplica a la institución:* los CeSAC son efectores del Ministerio de Salud de la Ciudad, es decir, «área estatal» (su ficha y la jurisdicción en los datos: «Ministerio de Salud del Gobierno de la Ciudad de Buenos Aires»).
- *Límite:* es una norma general; ninguna ficha de CeSAC repite la frase.

**Acceso documentado (E2).** Hay que empadronarse **una sola vez** en el Sistema de Salud (por el 147 o presencialmente en cualquier centro), con un documento que acredite identidad (DNI, cédulas extranjeras, cédula de la policía federal, pasaporte extranjero, constancia de residencia precaria, libreta cívica o de enrolamiento, partida de nacimiento, entre otros). Turnos: web de turnos, Boti (WhatsApp de la Ciudad), 147 opción 1 o presencial. En el primer nivel (todos los CESAC) se accede por teléfono a turnos de Clínica médica o Medicina General, Pediatría y Odontología. «Costos del trámite: Gratuito» es del **trámite**: **no** se usa como prueba de gratuidad de la atención.

**Campos que quedan «no confirmado» en las cuatro:** horarios del servicio; si se atiende sin turno o solo con turno (`appointment.mode` sigue «unknown»); edades; si piden domicilio; cuántos días de espera. No se agrega `costNote` (no hay una condición de la gratuidad; si se agregara, el chip diría «con condiciones»).

### L1-AP-3 · CeSAC 3 (Villa Lugano), Clínica médica
- **Prestación en los datos:** `cesac-3` / `atencion-primaria`, tipo `primary-care`, nombre «Clínica médica».
- **Sede (E3):** «Clínica médica, pediatría, medicina general o de familia». Dirección: Soldado de la Frontera 5144. Ya en los datos con coordenadas oficiales.
- **Se agrega:** `cost: "free"`, `requirements` (empadronamiento), `appointment.howTo` (canales de turno), `source` (Ley 153 con la nota completa y la ficha E3).
- **No confirmado:** horarios; turno o demanda espontánea; si la prestación «medicina general o de familia» y «pediatría» del CeSAC 3 se atienden en el mismo consultorio (el dato tiene un único servicio llamado «Clínica médica»; la pediatría de este CeSAC no está como servicio propio y no se agrega).

### L1-AP-41 · CeSAC 41 (La Boca), Medicina general
- **Prestación en los datos:** `cesac-41` / `atencion-primaria`, nombre «Medicina general».
- **Sede (E4):** especialidades «Medicina General, Pediatría, Ginecología…». Dirección: Ministro Brin 843.
- **Documentado además (E10):** «Horario de atención: lunes a viernes 8 a 18 h. Turnos: se solicitan personalmente». Eso **ya está** como horario general del establecimiento (no cambia). Es del *establecimiento*, no de cada servicio.
- **Se agrega:** igual que L1-AP-3; el `howTo` suma «los turnos se solicitan personalmente».
- **No confirmado:** que ese horario general valga para la atención primaria; si hay demanda espontánea; pediatría no existe como servicio propio en los datos (queda fuera).

### L1-AP-47 · CeSAC 47 (Barrio Mugica, Retiro), Medicina general
- **Prestación en los datos:** `cesac-47` / `atencion-primaria`, nombre «Medicina general».
- **Sede (E5):** «Medicina General, Pediatría, Psiquiatría (adultos), Psicología (adultos), Odontología…». Dirección de la ficha: Alpaca 620.
- **Se agrega:** igual que L1-AP-3.
- **No confirmado:** horarios; turno o demanda espontánea. El CeSAC 47 no tiene horario general cargado: el panel seguirá diciendo «todavía no tenemos el horario verificado: llamá antes de ir».

### L1-AP-47-PED · CeSAC 47, Pediatría
- **Prestación en los datos:** `cesac-47` / `pediatria`, tipo `primary-care`. No estaba en tu pedido textual («atención primaria»), pero es la misma prestación y está como servicio propio; la incluyo para que el equipo decida.
- **Sede (E5):** «Pediatría» entre las especialidades.
- **Se agrega:** igual que L1-AP-47 (el `howTo` nombra pediatría).
- **No confirmado:** edades atendidas; horarios; turno.

## 4. Fichas de vacunación humana

### Evidencia común a las dos fichas de vacunación

**Gratuidad (E7, E8, E9).**
- **Ley 27.491**, art. 2 inc. a: «Gratuidad de las vacunas y del acceso a los servicios de vacunación, con equidad social para todas las etapas de la vida». Art. 6: se aprueba el Calendario Nacional. Art. 7: son obligatorias las vacunas del Calendario, **las recomendadas por la autoridad sanitaria para grupos en riesgo** y las indicadas en emergencia epidemiológica.
- **Resolución 339/2026** (Ministerio de Salud, publicada el 26/2/2026): modificación vigente del Calendario Nacional.
- **Página del Ministerio (E9):** «Las vacunas están disponibles en centros de salud y hospitales públicos de todo el país y no requieren de una orden médica».
- *Por qué aplica a la institución:* el CeSAC es un centro de salud público de la Ciudad que figura en la lista oficial de vacunatorios de la Ciudad (E6).
- *Por qué aplica solo a parte de la prestación:* la ley cubre las vacunas del Calendario, de grupos de riesgo y de emergencia. **No dice** que cada vacunatorio aplique todas, ni que otras vacunas (viaje, a pedido) sean gratuitas. Por eso el `costNote` y el chip «Gratuita con condiciones».

**Horarios publicados (E6), NO cargados todavía.** No dicen nada de gratuidad, vacunas ni requisitos.

**No confirmado en las dos:** qué vacunas aplica el vacunatorio; qué hay que llevar (carnet, DNI); si es con turno o por orden de llegada; edades; si hay días con vacunas específicas.

### L1-VAC-3 · CeSAC 3, vacunación
- **Prestación en los datos:** `cesac-3` / `vacunacion`, tipo `vaccination`, nombre «Programas de vacunación».
- **Sede (E3, E6):** programa «vacunación» en la ficha; en la lista de vacunatorios: CeSac 3, Soldado de la Frontera 5144.
- **Horario publicado (diferido):** lunes a viernes de 7:00 a 12:00 y de 13:00 a 16:00.
- **Se agrega:** `cost: "free"`, `costNote`, `source` (Ley 27.491 + Res. 339/2026 + páginas de la sede).

### L1-VAC-41 · CeSAC 41, vacunación
- **Prestación en los datos:** `cesac-41` / `vacunacion`, tipo `vaccination`, nombre «Vacunatorio». Ya tiene fuente propia.
- **Sede (E4, E6):** actividad «Vacunatorio»; lista de vacunatorios: CeSac 41, Ministro Brin 843.
- **Horario publicado (diferido):** lunes, miércoles, jueves y viernes de 8:00 a 12:00 y de 13:00 a 17:00; martes de 8:00 a 12:00 y de 14:00 a 17:00.
- **Se agrega:** igual que L1-VAC-3.

## 5. Fuera del lote, con la razón

| Prestación | Razón |
|---|---|
| CeSAC 47 · vacunación | La lista de vacunatorios (E6) dice «Calle playón (ex galpón SIC)», Barrio 31; la ficha del centro (E5) dice Alpaca 620. Hay que aclarar con el centro dónde se vacuna antes de cargar. |
| Salud mental de CeSAC 3, 41 y 47 | La gratuidad tiene el mismo respaldo (Ley 153) pero el **acceso no está documentado** (admisión, turno, derivación, edades). El trámite de turnos del primer nivel no nombra salud mental. Va al lote 2. |

## 6. Fichas de castración de Animales BA (preparadas, **sin cargar**)

Borradores completos en `newPlaces` de la propuesta: con `verification.status: "needs-review"` y coordenadas `unverified`, de modo que **aunque se cargaran por error no se mostrarían**. Se activan solo con tu aprobación y las comprobaciones.

**Gratuidad (E11, literal):** «Animales BA Perros y Gatos… Por ello se brinda un servicio de castraciones y vacunación antirrábica para caninos y felinos totalmente gratuito, a través de los Centros Fijos Veterinarios y las Unidades Móviles». La frase nombra a los Centros Fijos y a la castración: respalda esta prestación en esta institución.

**Acceso y requisitos documentados (E11):**
- Turno **online** con cuenta miBA; las agendas de la semana siguiente se habilitan los **viernes a las 10 h**. «No se atenderá a quienes se acerquen a los centros de atención sin turno previo».
- El animal va acompañado por una persona **mayor de 18 años**, que dispone de toda la mañana. Ayuno de 12 h sin alimento y 8 h sin líquidos; perro con collar y correa; gato en transportadora o bolso ventilado; manta; avisar si toma medicación o tiene una enfermedad.
- Agenda leída el 8/10/2026: del 3 al 17 de octubre de 2026, los dos centros aparecen con «Castración» en distintos días.

**No confirmado:** si se exige domicilio en la Ciudad (la página habla de «vecinos de la Ciudad» pero no lo pide como requisito); horario de atención de cada centro (la agenda da días, no horas); teléfono; si atienden algo más que castración; qué pasa con quien llega sin turno (la página dice que no se lo atiende).

| | **L1-VET-COSTANERA** | **L1-VET-INDOAMERICANO** |
|---|---|---|
| Nombre | Centro Fijo Veterinario Costanera Sur | Centro Fijo Veterinario Parque Indoamericano |
| Dirección oficial (E11) | Av. Dr. T. Achával Rodríguez 1550, «a 100 metros frente a la fuente de Lola Mora» | «Parque Indoamericano (Av. Escalada y Paseo Islas Malvinas)», Villa Soldati. **Sin número** |
| Prestación | `spaying-neutering`, «Castración de perros y gatos» | ídem |
| Tipo de establecimiento | `public-veterinary` | `public-veterinary` |
| Gratuidad | `cost: "free"` + `costNote` (solo con turno; acompañante mayor de 18) | ídem |
| Turno | `appointment.mode: "required"`, `howTo` y enlace a la página | ídem |
| Horario | `null` (no confirmado) | `null` |
| Coordenadas propuestas | -34.617580, -58.356442 (USIG, una sola coincidencia, `geocoded-usig`, aproximada) | -34.664570, -58.468717 (USIG, cruce Escalada y Paseo Islas Malvinas, una sola coincidencia, aproximada) |
| Estado de las coordenadas | **PENDIENTE.** El punto debe coincidir con «a 100 m frente a la fuente de Lola Mora»; compararlo sobre el mapa | **PENDIENTE.** Es el cruce de calles, no el centro dentro del parque; hay que ubicar la entrada |
| Comuna (`department`) | **No cargada**: la fuente no la dice; confirmar | Comuna 8 es la de Villa Soldati, pero **no está en la fuente**: confirmar |
| Estado de verificación del lugar | `needs-review` (no se muestra) | `needs-review` (no se muestra) |

Efecto al cargarlos: aparecen en el filtro «Salud animal» con el chip «Gratuita con condiciones» y «Con turno previo», **no** en los filtros pensados para personas, y no aparecen en el mapa hasta que sus coordenadas pasen a `verified` (regla 3: si hay ambigüedad, queda pendiente).

## 7. Qué quedaría en el mapa si se aprueba todo

- Atención primaria de los 3 CeSAC (4 prestaciones) con «Atención gratuita», sin horario ni promesa de turno.
- Vacunación de CeSAC 3 y 41 con «Gratuita con condiciones» (solo vacunas del Calendario).
- Las demás prestaciones de esos centros: igual que hoy («Gratuidad no confirmada»).
- Salud animal sigue sin resultados hasta que se aprueben los dos centros veterinarios y se verifiquen sus coordenadas; mientras tanto el filtro sigue mostrando el mensaje de estado vacío.

## 8. Qué se necesita de ustedes para avanzar
1. Aprobar o corregir cada ficha (columna «Campos que se modificarían»).
2. Completar los formularios de comprobación operativa (centros y Animales BA).
3. Decidir lo marcado: pediatría del CeSAC 47 en el lote; horarios de vacunación diferidos; ubicación de los dos centros veterinarios.
