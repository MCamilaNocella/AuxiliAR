# CeSAC 47: ¿dónde está el vacunatorio?

Fecha: 9/10/2026. **No se modificó ninguna dirección, coordenada ni dato del CeSAC 47.** La vacunación del CeSAC 47 sigue «Gratuidad no confirmada» y fuera del lote cargado. Fuentes originales en [`../evidencia/`](../evidencia/).

## 1. La diferencia

| Fuente (original, 9/10/2026) | Dónde dice que está |
|---|---|
| Ficha oficial del CeSAC 47 | «Dirección: Alpaca 620, Barrio 31». Entre las actividades figura «Vacunación (programa ampliado de inmunizaciones)». |
| Dataset oficial de CeSAC (BA Data, bajado el 7/10/2026) | «Alpaca y Caña, Alpaca 620 - Barrio Padre Mugica»; punto -34.584256, -58.379309 |
| Página «Lugares y horarios de vacunatorios» | «CeSac 47: **Calle playón (ex galpón SIC)**, Barrio 31 (Retiro)»; horarios: lunes, miércoles y jueves de 8:30 a 12 y de 13 a 15; martes y viernes de 10 a 12:30 y de 13 a 15:30. El mapa oficial que enlaza ubica el punto en -34.583691, -58.378639 con la etiqueta «Villa 31». |

Las cuatro URL cortas de la página de vacunatorios (`/vacunatorios`, `/lugares-y-horarios-de-vacunatorios`, `/salud/lugares-y-horarios-de-vacunatorios`, `/salud/vacunas/horarios-de-vacunatorios`) redirigen a la misma página y dicen lo mismo: no hay una versión más nueva con otra dirección.

## 2. Qué más dicen las fuentes oficiales

- **Noticia del Gobierno de la Ciudad del 17/11/2021** («Un nuevo Centro de Salud en el Barrio Mugica»): terminó la ampliación del CeSAC 47. La mudanza del Galpón (centro comunitario histórico del barrio) al nuevo Bajoautopista permitió la ampliación del CeSAC: de 230 m² a 565 m², con 14 consultorios nuevos y «una sala de vacunación».
- **El Galpón hoy** (páginas del Gobierno de la Ciudad, la última del 7/5/2025): funciona en **Islas Galápagos 2295**, en el Bajo Autopista, como Punto de Atención Ciudadana. Dice que se va allí también «para ser atendido por un profesional en el CeSAC».
- **Distancia:** el punto de la ficha y el punto del vacunatorio están a **88 m** uno de otro, ambos en la Comuna 1 según el dataset oficial de comunas.
- El normalizador de direcciones de la Ciudad no conoce las calles internas del barrio («Alpaca 620», «Alpaca y Caña» e «Islas Galápagos 2295» dan «calle inexistente»): no se puede geocodificar ninguna de las direcciones, y el único punto es el del dataset.

## 3. Qué se puede concluir y qué no

**Lo más consistente con las fuentes:** el vacunatorio no es otro establecimiento, sino la sala de vacunación del **mismo CeSAC 47**, instalada en la parte ampliada, en el espacio del antiguo galpón. Razones: la página lo lista como «CeSac 47»; la noticia oficial de 2021 vincula la ampliación del CeSAC (con sala de vacunación) con la mudanza del Galpón (no dice con esas palabras que el CeSAC ocupe el edificio anterior del Galpón: es una lectura, no una cita); los dos puntos oficiales están a menos de 100 m.

**Lo que ninguna fuente dice (por eso no se cambia nada):**
1. Que el «ex galpón SIC» y «Alpaca 620» sean el mismo edificio o tengan la misma entrada. Puede ser un anexo con otro acceso a pocos metros.
2. La dirección o la entrada del vacunatorio: «Calle playón» no es una dirección, y el punto del mapa oficial está rotulado «Villa 31», sin calle.
3. Si la sala de vacunación funciona en el mismo horario que el resto del centro (la ficha no da horarios).
4. Si «El Galpón» de Islas Galápagos 2295 (donde la página de 2025 dice que atiende un profesional del CeSAC) tiene alguna relación con el vacunatorio: es una tercera ubicación posible que **no se puede descartar** con las fuentes.

**Estado: pendiente.** Hay tres hipótesis (misma sede de la ficha, anexo del ex galpón cercano, o Islas Galápagos 2295) y las fuentes oficiales solo permiten decir que la primera o la segunda son las más probables.

## 4. Comprobación operativa que lo resuelve (para el equipo)
En blanco; completar con nombre y fecha.
| Pregunta | Respuesta textual | No pude |
|---|---|---|
| ¿Dónde se vacuna exactamente? ¿Es la misma entrada que la del resto del CeSAC 47 (Alpaca 620)? | | ☐ |
| Si es otra entrada: ¿cuál es la forma de llegar y qué referencia usar («playón», «ex galpón», «Bajo Autopista», calle)? | | ☐ |
| ¿Se vacuna en El Galpón (Islas Galápagos 2295)? | | ☐ |
| ¿Qué días y horarios se vacuna? (la página dice lun, mié, jue 8:30–12 y 13–15; mar y vie 10–12:30 y 13–15:30) | | ☐ |
| ¿Qué vacunas del Calendario Nacional aplican? ¿Con turno o por orden de llegada? ¿Qué hay que llevar? | | ☐ |
| ¿Algún costo? | | ☐ |

## 5. Qué se haría según la respuesta (con aprobación del equipo)
- **Misma sede o anexo contiguo:** la dirección y el punto de la ficha (Alpaca 620) se mantienen; se agrega una referencia en la dirección («la sala de vacunación está en el sector del ex galpón»), y la prestación se carga con la misma estructura que CeSAC 3 y 41 (Ley 27.491 + Calendario, «Gratuita con condiciones»).
- **Otra ubicación a más distancia:** la prestación se carga con su propia referencia y sin punto en el mapa hasta tener uno confiable, o no se carga.
- Los horarios publicados (arriba) se cargan solo si el centro los confirma. Con el modelo corregido ya no apagan el aviso de las demás prestaciones.

## 6. Nota
Se descartó una nota periodística sobre el cierre temporal de un CeSAC en el Barrio Mugica: se refería al CeSAC 25, no al 47, y no es una fuente oficial.
