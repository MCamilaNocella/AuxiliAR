# Criterio de recomendación de AuxiliAR

**Decisión del equipo (8 de octubre de 2026).** AuxiliAR conecta a personas que necesitan atención, orientación o recursos sanitarios y **no tienen dinero para pagar servicios privados**. No es un directorio general de salud. Solo recomienda como *atención gratuita* una prestación cuando la gratuidad está respaldada por una fuente confiable y vigente.

Este criterio vale para todo el proyecto: páginas, mapa, líneas de ayuda, chat de Auxi y cualquier recurso nuevo.

## Las tres condiciones

Un recurso se recomienda como **atención gratuita** solo si están comprobadas las tres, cada una con su fuente y su fecha:

1. **Institución comprobada.** Existe, es quien dice ser y la fuente es oficial o del propio responsable.
2. **Prestación específica comprobada.** Esa prestación concreta (por ejemplo, "psicología de adultos") la ofrece esa institución, en ese lugar.
3. **Gratuidad de esa prestación comprobada.** La fuente dice que *esa prestación* no tiene costo.

Además, antes de publicar se registra **quién puede acceder** (edad, domicilio, cobertura), **en qué zona funciona**, **qué requisitos hay** (admisión, turno, derivación, documentación) y **cómo se solicita**. No se prometen turnos, cupos ni disponibilidad inmediata.

## Cómo se clasifica el dato de gratuidad

- **Comprobada:** la fuente la declara para esa prestación. Se muestra como gratuita, con su condición si la tiene.
- **Pendiente:** todo lo demás. Es decir:
  - La fuente no menciona costo. **Que no lo mencione no significa que sea paga**: es *pendiente*, no *paga*.
  - La gratuidad se deduce de otra cosa. **No se infiere** porque sea un hospital público, una universidad o una organización sin fines de lucro.
  - La fuente es una nota de prensa vieja, una búsqueda o una versión histórica: hace falta una confirmación vigente.
- **No entra al directorio de atención:** servicios pagos, de bajo costo, con descuentos o aranceles reducidos. Tampoco se muestran precios ni comparaciones de costos, y se evitan enlaces a páginas comerciales o a procesos de contratación.

Un recurso pendiente puede mostrarse solo si se diferencia con claridad y no se presenta como atención gratuita ni como opción validada.

## Cuatro tipos de recurso: no se confunden

| Tipo | Qué es | Ejemplo | Cómo se describe |
|---|---|---|---|
| **Gratuita** (en el mapa; antes «Atención gratuita») | Una prestación sanitaria sin costo para quien la recibe | Una consulta en un centro de salud, si la fuente lo declara | Con alcance, requisitos y forma de pedirla |
| **Orientación gratuita** | Escucha o asesoramiento, sin ser una consulta clínica | Una línea telefónica de orientación | "Orientación": no reemplaza la atención profesional |
| **Información de acceso gratuito** | Un texto o material que se lee sin pagar | Una guía, una ley en palabras simples | "Información": una página gratuita no hace gratuitas sus consultas |
| **Respuesta a emergencias** | Llamar para que lleguen a ayudar | Los números de emergencia | La gestiona el área de Emergencias |

## Cómo se refleja hoy en el código

- **Mapa:** la etiqueta "Gratuita" (o "Gratuita con condiciones" si la fuente aclara condiciones) aparece solo si esa prestación declara `cost: "free"` y trae su fuente (`isVerifiedFree`). Un costo faltante o `unknown` nunca se muestra como gratuito. En la ficha, si ninguna prestación tiene costo conocido, dice "La fuente no informa el costo de estas prestaciones: consultalo antes de ir". Existe el filtro "Gratuidad verificada".
- **Líneas de ayuda:** la gratuidad se marca por línea, solo si está registrada.
- **Páginas de contenido:** describen lo que son (información u orientación), no prometen turnos y aclaran cuando algo es solo exploración.

## Lo que todavía no cumple (para decidir)

- En las tarjetas del listado del mapa no hay una marca cuando *ninguna* prestación tiene gratuidad confirmada: la ficha lo dice, la tarjeta no. Cambiarlo toca el mapa compartido (Encontrar atención y los enlaces de Cuidar mi salud, el quiz y Salud sexual y ESI), así que necesita aprobación del equipo.
- Hoy ninguna prestación de salud mental del mapa tiene la gratuidad comprobada.

## Registro de cada decisión

Cada recurso aprobado o descartado deja anotado: quién lo comprobó, qué fuente usó, en qué fecha, la afirmación exacta que respalda la fuente, y cuándo se vuelve a revisar. Los contactos críticos se revisan todos los meses y el resto cada tres meses (pauta propuesta en el documento de recursos del 8 de octubre de 2026).

Ficha de comprobación de ejemplo: `proposals/pba-centros-comunitarios-salud-mental.ficha.md`.
