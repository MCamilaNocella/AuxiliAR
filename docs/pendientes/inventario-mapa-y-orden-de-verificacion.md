# Inventario del mapa y orden de verificación

Fecha: 8/10/2026. Fuente: `client/src/data/resources/places/ar-c.json` (6 establecimientos de CABA, 33 prestaciones). Criterio: `client/curation/CRITERIO-DE-RECOMENDACION.md`. **No se cambia ningún dato ni se agrega ningún servicio.**

## Resumen

| | Prestaciones |
|---|---|
| Gratuidad **confirmada** (la fuente dice que esa prestación es gratuita) | **2** |
| Gratuidad **no confirmada** (pendiente) | **31** |
| Total publicado | 33 |

Las dos confirmadas son las guardias odontológicas de los Hospitales de Odontología Carrillo y Dueñas: la fuente del Gobierno de la Ciudad dice «24 horas, 365 días, gratuitas». No informa si hace falta turno.

## Inventario por establecimiento

| Establecimiento | Prestaciones | Confirmadas | Pendientes |
|---|---|---|---|
| CeSAC Nº 3 (Villa Lugano) | 9: atención primaria, vacunación, odontología, **salud mental**, anticonceptivos, IVE/ILE, VIH, ecografía, farmacia | 0 | 9 |
| CeSAC Nº 41 (La Boca) | 7: atención primaria, vacunación, odontología, **salud mental**, ecografía, laboratorio, farmacia | 0 | 7 |
| CeSAC Nº 47 (Retiro, Barrio Mugica) | 14: vacunación, atención primaria, pediatría, **psiquiatría**, **psicología**, obstetricia, salud sexual, anticonceptivos, IVE/ILE, preservativos, anticoncepción de emergencia, test de VIH y sífilis, odontología, farmacia | 0 | 14 |
| Hospital Oftalmológico Santa Lucía | 1: guardia oftalmológica | 0 | 1 |
| Hospital de Odontología Dr. Carrillo | 1: guardia odontológica | **1** | 0 |
| Hospital de Odontología Dr. Dueñas | 1: guardia odontológica | **1** | 0 |

Por tipo: atención primaria 4 (CeSAC 3, 41 y 47: «atención primaria» y «pediatría»), salud mental 4 (CeSAC 3, 41 y las dos de CeSAC 47), vacunación 3, odontología 3 en CeSAC, salud sexual, reproductiva y obstetricia 10, estudios (ecografía y laboratorio) 3, farmacia 3, guardias 3.

**Ojo con las notas de fuente.** Que una prestación tenga fuente propia no significa que la fuente diga que es gratuita:
- Vacunación de CeSAC 41 y 47: las fuentes son la página de lugares y horarios de vacunatorios y la ficha de la sede. Dicen dónde y cuándo, no el costo.
- Guardia oftalmológica de Santa Lucía: la nota dice «No informa costo».

Estas prestaciones siguen pendientes. No se las considera pagas por eso: simplemente no está comprobado.

## Orden de verificación propuesto

Principio: primero lo que más personas sin cobertura necesitan y lo que menos riesgo tiene de dar una respuesta errónea. En cada paso se comprueba la gratuidad **de esa prestación** (no del establecimiento), con una fuente vigente, y se registran requisitos, quién puede acceder y cómo se solicita.

| Prioridad | Qué | Por qué | Cantidad |
|---|---|---|---|
| **1** | **Atención primaria** de los 3 CeSAC (consulta médica clínica, pediatría) | Es la puerta de entrada y la prestación que más gente necesita; los CeSAC son efectores del Gobierno de la Ciudad con fichas propias | 4 |
| **2** | **Salud mental** de los 3 CeSAC (psicología, psiquiatría, salud mental) | Prioridad editorial del equipo; hay modalidad de admisión que hay que registrar (entrevista, turno, derivación) | 4 |
| **3** | Vacunación de los 3 CeSAC | Es un programa con calendario oficial; hay que comprobar gratuidad y requisitos del lugar | 3 |
| **4** | Salud sexual y reproductiva y obstetricia (anticonceptivos, preservativos, IVE/ILE, test de VIH y sífilis, anticoncepción de emergencia, obstetricia) | Suele ser gratuita por programa, pero depende de la fuente y no debe darse por hecho | 10 |
| **5** | Odontología, estudios (ecografía, laboratorio) y farmacia de los CeSAC | Dependen de cada servicio; los estudios pueden requerir turno o derivación | 9 |
| **6** | Guardia oftalmológica de Santa Lucía | Una sola prestación, la fuente existe pero no informa costo | 1 |

Para las prioridades 1 y 2 se necesita, por prestación, una frase de una fuente oficial vigente que diga que no tiene costo, o la confirmación de quien comprueba por teléfono o en persona (con nombre y fecha). Si no aparece, queda **pendiente**.

### Siguiente tanda (mapa nuevo): atención primaria y salud mental fuera de CABA
No hay establecimientos de otras jurisdicciones en el mapa. La investigación de SM05 (Provincia de Buenos Aires) está en `client/curation/proposals/pba-centros-comunitarios-salud-mental.investigacion.md`. No se incorpora nada hasta tener las tres condiciones comprobadas.

## Qué decide el equipo
1. Si aprueba este orden.
2. Quién comprueba cada prioridad y cómo se registra (usar la ficha de `client/curation/proposals/`).
3. Si, mientras tanto, las 31 prestaciones pendientes se dejan visibles con la marca «Gratuidad no confirmada» (como está en la rama del mapa) o se ocultan hasta comprobarlas.
