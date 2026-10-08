# Plan de verificación y carga de prestaciones gratuitas

Fecha: 8/10/2026. **Es un plan: no se cargó ningún establecimiento ni prestación, y ninguna prestación pendiente pasó a confirmada.** Criterio: `client/curation/CRITERIO-DE-RECOMENDACION.md` (institución, prestación específica y gratuidad de esa prestación, cada una con fuente y fecha, más quién puede acceder, zona, requisitos y cómo se solicita).

## Qué encontramos hoy al leer las fuentes (8/10/2026)
Las fichas oficiales de los tres CeSAC, que son la fuente de sus prestaciones en el mapa, **confirman qué especialidades hay pero no dicen nada de gratuidad, horarios, turnos ni requisitos**:

| Ficha | Especialidades que nombra | Gratuidad, horarios, turnos, requisitos |
|---|---|---|
| CeSAC Nº 3 | «clínica médica, pediatría, medicina general o de familia»; «psicología adultos, psicología niños y adolescentes»; vacunación | no los dice (la ficha tampoco aclara si es gratuito) |
| CeSAC Nº 41 | «Medicina General, Pediatría… Salud Mental Niños y Adultos…», centro de VIH/sífilis, vacunatorio, odontología | no los dice |
| CeSAC Nº 47 | «Psiquiatría (adultos), Psicología (adultos)»; en la ficha de la sede: pediatría, odontología, vacunación | no los dice |
| Página de vacunatorios de la Ciudad | lugares y horarios | no dice si las vacunas son gratuitas, ni requisitos, ni documentación, ni qué vacunas hay en cada lugar |

**Conclusión:** institución y prestación están respaldadas por una fuente oficial; **la gratuidad no**. Por el criterio, que sea un centro estatal no alcanza: sigue **pendiente**. Para confirmarla hace falta una de dos cosas: (a) un texto oficial vigente que diga que esa prestación no tiene costo, o (b) una confirmación operativa con nombre de quien comprobó, fecha y la frase concreta, registrada en la nota de la fuente del servicio.

## Cómo se carga una prestación cuando está confirmada (cuando el equipo lo apruebe)
En el archivo del lugar (`client/src/data/resources/places/ar-c.json`): en **esa prestación** poner `cost: "free"` y su propia fuente con `note` (la frase que respalda la gratuidad); si hay condición, `costNote`. Completar `appointment`, `requirements`, `hours` y `audience` solo con lo comprobado. Después: `npm run resources:sync`, `resources:check`, `curation:check` y las pruebas; la marca «Atención gratuita» aparece sola. Una prestación sin esa nota sigue como «Gratuidad no confirmada».

## Ficha mínima por prestación (qué hay que completar)
1. Fuente oficial vigente y fecha. 2. Prestación exacta (qué incluye y qué no). 3. Frase de la fuente sobre costo. 4. Quién puede acceder (edad, domicilio, cobertura). 5. Zona. 6. Modalidad (libre, admisión, turno, derivación). 7. Requisitos y documentación. 8. Horarios. 9. Quién comprobó y cuándo; próxima revisión.

**Guion para la comprobación operativa** (llamada o visita, anotando nombre y fecha): ¿la consulta tiene costo para una persona sin cobertura? ¿Quién puede venir (edad, domicilio)? ¿Hay que sacar turno o se atiende en el día? ¿Qué hay que traer? ¿En qué días y horarios? ¿Hay lista de espera o derivación previa? No se pregunta por precios ni se promete nada.

## Prestaciones candidatas, en orden de trabajo

### 1. Atención primaria de los CeSAC de CABA (4 prestaciones)
`cesac-3 / atencion-primaria`, `cesac-41 / atencion-primaria`, `cesac-47 / atencion-primaria`, `cesac-47 / pediatria`.

| Dato | Estado |
|---|---|
| Institución y prestación | **Respaldadas** por la ficha oficial de cada CeSAC (clínica o medicina general; pediatría en el 47) |
| Gratuidad | **Falta evidencia.** Ninguna ficha la dice. Buscar un texto oficial del Gobierno de la Ciudad sobre la atención en los CeSAC (por ejemplo, la página general de centros de salud o la normativa de salud de la Ciudad); si no existe, confirmación operativa |
| Quién accede, requisitos, turno, horarios | **Falta todo.** La ficha no lo dice |
| Comprobación operativa | **Sí**, por CeSAC: horarios, turno o demanda espontánea, requisitos, si se pide domicilio |

### 2. Salud mental de los CeSAC (4 prestaciones)
`cesac-3 / salud-mental` (psicología de adultos y de niños y adolescentes), `cesac-41 / salud-mental` (niños y adultos), `cesac-47 / psiquiatria` y `cesac-47 / psicologia` (adultos).

| Dato | Estado |
|---|---|
| Institución y prestación | **Respaldadas** por las fichas. Ojo: el CeSAC 3 nombra psicología, no psiquiatría; se carga solo lo que la ficha dice |
| Gratuidad | **Falta evidencia** (misma situación que atención primaria) |
| Modalidad de acceso | **Falta**: admisión, turno o derivación; edades; si hay lista de espera. Es clave porque «explorar» no debe sugerir atención inmediata |
| Comprobación operativa | **Sí**, por CeSAC y por prestación |
| Nota | La página de Salud mental ya dice que cada servicio puede requerir admisión, turno o derivación; no promete nada |

### 3. Vacunación humana (3 prestaciones)
`cesac-3 / vacunacion`, `cesac-41 / vacunacion` (la fuente es la página de lugares y horarios de vacunatorios, que da horarios), `cesac-47 / vacunacion` (la ficha de la sede nombra la sala de vacunación).

| Dato | Estado |
|---|---|
| Institución y prestación | **Respaldadas** (existe vacunatorio o sala de vacunación en cada sede) |
| Gratuidad | **Probable vía documental, sin cerrar.** Hay que localizar y citar el **texto oficial de la Ley 27.491** (control de enfermedades prevenibles por vacunación) y la página del Ministerio de Salud sobre el Calendario Nacional, que según las búsquedas establecen que las vacunas del Calendario Nacional son obligatorias y gratuitas. Hoy **no está citado**: el enlace que probé no era el texto de la ley. Aun así, la gratuidad alcanzaría **solo a las vacunas del Calendario** (y las que el Ministerio indique para grupos de riesgo), no a «cualquier vacuna» |
| Falta | Qué vacunas aplica cada sede (la página no lo dice), requisitos y documentación, edades y grupos, turno o sin turno |
| Comprobación operativa | **Sí**, para vacunas disponibles y requisitos por sede; la gratuidad se puede respaldar con el texto oficial. Modelar la prestación como «vacunas del Calendario Nacional» y no como vacunación general |

### 4. Centros comunitarios de salud mental de la Provincia de Buenos Aires (SM05)
Detalle en `client/curation/proposals/pba-centros-comunitarios-salud-mental.investigacion.md`.

| Dato | Estado |
|---|---|
| Existencia | **Respaldada** para Quilmes («Federico Kaski», 26/9/2025), Berisso (14/8/2025) y Melchor Romero (24/9/2025, gestión del municipio de La Plata); Florencio Varela **sin leer** |
| Gratuidad | **Solo declaración general** («gratuitos y de acceso libre», nota del 10/10/2024). Ninguna nota de un centro concreto la repite |
| Falta | Lista oficial de los centros que funcionan hoy con dirección (el buscador oficial por distrito no se pudo leer de forma automática), prestación por centro, acceso, requisitos, horarios |
| Comprobación operativa | **Sí**: abrir el buscador oficial y llamar a cada centro. Primer lote sugerido: Quilmes, Berisso y Florencio Varela (cercanos a CABA) |
| Además | Hay que **dar de alta la provincia** (archivo de datos y cobertura) y decidir las zonas: es un cambio de datos, no de lógica |

### 5. Campañas veterinarias municipales gratuitas
Detalle en `client/curation/proposals/salud-animal.fichas-sa01-sa14.md`. **Las campañas siguen como información fechada en Salud animal: no son pines.** Solo irían al mapa las **sedes de servicio permanente**.

| Candidato | Evidencia que falta | Comprobación operativa |
|---|---|---|
| Instituto Pasteur (CABA), vacuna antirrábica | **Costo**: la página no lo informa. Es el primer candidato porque es una sede fija con dirección y horarios publicados | **Sí**: confirmar costo por teléfono |
| Animales BA (CABA) | Cronograma vigente (la página muestra octubre de 2024); si hay sedes fijas permanentes o solo operativos | **Sí** |
| Córdoba (3 centros municipales en barrios) | Direcciones, vigencia y **canal de turno vigente** (hay dos notas con canales distintos) | **Sí** |
| Salta (hospital municipal y 5 CIC) | Horarios (una sede los contradice), reglas por raza, vigencia | **Sí** |
| Rosario (hospital municipal y puestos) | Requisitos y cómo pedir esterilización; direcciones | **Sí** |
| Neuquén (quirófanos fijos y móviles) | **Costo** (la página no lo deja claro) | **Sí** |
| Protenencia (Nación) | Vigencia y localidades | No aplica al mapa (operativos itinerantes) |
| Todos | Requieren **cargar cada provincia** (Santa Fe, Córdoba, Salta, Neuquén) y que el filtro de Salud animal quede con al menos un servicio verificado | — |

## Orden y responsables sugeridos
1. **Semana 1:** localizar y citar el texto oficial de la Ley 27.491 (vacunación) y buscar un texto oficial de la Ciudad sobre gratuidad en los CeSAC. Preparar el guion de llamada.
2. **Semana 1 a 2:** llamadas a los tres CeSAC, por prestación, para 1, 2 y 3 (una sola llamada por CeSAC cubre todo). Una integrante del equipo, con registro de nombre y fecha.
3. **Semana 2:** abrir el buscador oficial de salud mental de PBA y llamar al primer lote.
4. **Semana 3:** confirmar el costo del Instituto Pasteur; recién entonces el primer servicio veterinario del mapa.
5. En cada paso: si no hay respaldo, **la prestación sigue pendiente** y no se muestra como gratuita. Nada se carga sin aprobación del equipo.

## Qué NO se hace
- No se infiere gratuidad por ser un centro estatal, una universidad o una organización sin fines de lucro.
- No se carga una campaña itinerante como si fuera una sede.
- No se copian teléfonos al mapa sin verificación y sin la aprobación del área de Emergencias, cuando corresponda.
- No se prometen turnos, cupos ni disponibilidad.
