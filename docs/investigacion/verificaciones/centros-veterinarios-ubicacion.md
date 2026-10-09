# Centros fijos veterinarios de CABA: verificación de la ubicación

Fecha: 9/10/2026. **No se agregó ningún centro al mapa.** Los borradores siguen en la propuesta (`client/curation/proposals/lote-1.cambios-propuestos.json`) con estado `needs-review` y coordenadas `unverified`; en esta etapa solo se les agregó la comuna y las notas de verificación. Fuentes y cálculos en [`../evidencia/cartografia-verificacion-puntos.txt`](../evidencia/cartografia-verificacion-puntos.txt) y [`../evidencia/animales-ba-mapas-oficiales-y-agenda.txt`](../evidencia/animales-ba-mapas-oficiales-y-agenda.txt).

## 1. Qué se usó
- **La propia página oficial de Animales BA** trae, para cada centro, un enlace al **mapa oficial de la Ciudad** (mapa.buenosaires.gob.ar) con latitud y longitud. Es la fuente más directa: el organismo que opera los centros ubica ahí su dirección.
- **USIG** (normalizador y geocodificador de direcciones de la Ciudad), como control independiente.
- **Dataset oficial de comunas** (BA Data), para la comuna de cada punto.
- **OpenStreetMap** (no oficial) solo como referencia de contexto: la Fuente de las Nereidas y el Parque Indoamericano.
- No existe una capa oficial descargable de los centros fijos (la búsqueda en BA Data no encontró conjuntos de datos veterinarios).

## 2. Resultado por centro

| | **Costanera Sur** | **Parque Indoamericano** |
|---|---|---|
| Dirección oficial | «Av. Dr. T. Achával Rodríguez 1550, a 100 metros frente a la fuente de Lola Mora» | «Parque Indoamericano (Av. Escalada y Paseo Islas Malvinas)», Villa Soldati. **Sin número** |
| Punto del mapa oficial (el que enlaza la página) | -34.617546, -58.356478 (etiqueta «Achaval Rodriguez, T., Dr. Av. 1550») | -34.664567, -58.468717 (etiqueta «Paseo Islas Malvinas y Escalada Av.») |
| USIG | una sola coincidencia, -34.617580, -58.356442 | una sola coincidencia (cruce), -34.664570, -58.468717 |
| Diferencia oficial vs USIG | 5 m | 0 m |
| Control con la referencia del texto | La Fuente de las Nereidas (la de Lola Mora) está a 73 m del punto, según OpenStreetMap: coincide con «a 100 metros» | El punto es el **cruce de calles**; el parque es grande (su punto representativo en OpenStreetMap está a 506 m): el cruce es un borde del parque |
| Comuna (dataset oficial de comunas) | **Comuna 1** | **Comuna 8** |
| **Tipo de punto** | dirección con altura (calle y número) | cruce de dos calles, sin entrada identificada |
| **Precisión estimada** | **aproximada, alrededor de 100 m o menos** | **aproximada, a nivel de cruce**: el centro está dentro del parque y la entrada no está documentada |
| **Vigencia de la información** | La página no publica fecha de actualización; la agenda de castraciones va del **3 al 17 de octubre de 2026** (vigente hoy, vence el 17/10) | ídem |
| **Conclusión** | **Suficientemente confiable para proponer `verified` con precisión «approximate»** (tres fuentes coinciden: mapa oficial del organismo, USIG y la referencia del texto) | **Se mantiene pendiente**: el punto es el cruce, no el centro; falta la entrada o una referencia de llegada |

### Cómo quedarían los datos si el equipo aprueba (no se aplica)
- **Costanera Sur:** `coordinates` = -34.617546, -58.356478, `precision: approximate`, `method: geocoded-usig` (USIG coincide a 5 m con el punto oficial; la nota cita el enlace de la página), `verifiedAt`/`verifiedBy` con la fecha y el nombre de quien lo apruebe; `address.department: "Comuna 1"`. La dirección y la referencia («a 100 metros frente a la fuente de Lola Mora») quedan como están.
- **Indoamericano:** dirección «Av. Escalada y Paseo Islas Malvinas», `address.department: "Comuna 8"`, coordenadas `unverified` (aparece solo en la lista, no en el mapa) hasta confirmar la entrada.

## 3. Lo que sigue sin confirmar (no es de ubicación)
- Horario de cada centro (la agenda da días, no horas), teléfono, domicilio requerido, si atienden algo más que castración. Las fichas de comprobación del lote 1 (sección D y E de [formularios-comprobacion-operativa.md](../lote-1/formularios-comprobacion-operativa.md)) siguen siendo las del equipo.
- La agenda de los centros fijos tiene pocos días (por ejemplo, el Indoamericano figura el 3, 8, 15 y 17 de octubre; Costanera Sur, 6, 7, 8, 10, 13 y 15): **no es un servicio todos los días**. Al cargarlos hay que decirlo así, sin horario ni días fijos.
- Para Indoamericano, una persona del equipo tiene que mirar el punto en el mapa y anotar la entrada y a cuántos metros está del cruce.

## 4. Fichas de comprobación para el equipo (en blanco)
| Pregunta | Costanera Sur | Indoamericano |
|---|---|---|
| Al abrir el punto propuesto en un mapa, ¿coincide con el centro? (sí / no / metros y dirección) | | |
| ¿Cuál es la entrada y cómo se llega (referencia)? | | |
| ¿Qué días y en qué horario se opera? | | |
| Quién comprobó, fecha | | |
