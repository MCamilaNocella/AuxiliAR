# Cargas de datos del 12 y 13/10/2026: qué entró, con qué reglas y qué quedó pendiente

Para quien siga trabajando sobre el mapa. Todo es **verificación documental** (páginas oficiales; nadie llamó ni visitó los lugares). Los datos están en `client/src/data/resources/places/<provincia>.json`; el servidor y el índice de cobertura se regeneran con `npm run resources:sync` y se comprueban con `npm run resources:check`.

## Qué se cargó (cada carga tiene su test)
| Carga | Qué es | Test |
|---|---|---|
| Centros con respaldo (G01–G07) | Garrahan, El Cruce, Favaloro, Elizalde, Infantil de Córdoba, Madre y el Niño (La Rioja), Clínicas Avellaneda (Tucumán): una prestación cada uno | `places-centers`, `places-evidence` |
| Salud sexual de la Ciudad | 44 lugares nuevos y 3 existentes: consejería, acceso a métodos anticonceptivos y bocas de preservativos | `places-sexual` |
| Vacunatorios de la Ciudad | 55 lugares con el vacunatorio de la página oficial, 13 de ellos nuevos | `places-vaccination` |
| Atención veterinaria pública | 15 lugares en 8 jurisdicciones, junto al Costanera Sur | `places-veterinary` |
| Salud mental y bienestar | 17 guardias de CABA, 18 Estaciones Saludables, yoga, red de Córdoba, La Rioja, Crespo, Salta, Rosario | `places-mental` |

Además: subfiltro «Tipo de lugar» (`places-kinds`, `utils/places/kinds.ts`) y símbolo propio de Salud sexual en el mapa.
`client/scripts/places-batches.mjs` es el ayudante de los tests viejos: les muestra los datos sin estas cargas.

## Reglas que se siguieron
- **Gratuidad por servicio**, con su fuente. `costNote` dice solo lo que **limita** la gratuidad (condiciones, alcance); quién dice que es gratis está en `source` y en `evidence` (kinds `cost`, `existence`, `access`). Si nada limita, no hay `costNote` y la tarjeta dice «Gratuita».
- **Los vacunatorios** son gratuitos por la Ley 27.491, no por la página (que no habla de costo). Cada ficha lo dice.
- **Pines**: solo con un punto respaldado. Métodos de coordenadas: `official-dataset(-reprojected)`, `official-map-link` (enlace oficial a un mapa) y `geocoded-other` (OpenStreetMap, mirado a ojo en el mapa de la app; la ficha lo dice). Lo demás va **en la lista, sin pin**.
- **Enlaces con la curación**: los lugares que están en los datasets oficiales de la Ciudad llevan `externalIds` y una decisión `link` en `client/curation/decisions/ar-c.decisions.json`.
- **Tipo de servicio nuevo `wellbeing-activity`** («Bienestar y encuentro comunitario», dentro de Salud mental): yoga, tai chi, biodanza, Estaciones Saludables. No son psicoterapia ni urgencia.

## Lo que quedó afuera a propósito
- Hospital del **Niño Jesús** (Tucumán): ninguna fuente oficial dice que sea gratuito (`hospital-nino-jesus-tucuman-2026-10-12.md`).
- Vacunatorios con punto que no coincide o duplicados: CeSAC 15, 18, 23, 25, 30, 42, 43 y los dos CCI. Rivadavia y Santojanni: **la página oficial tiene cruzados sus puntos**.
- Veterinaria: urgencias, hospital de Rosario con gratuidad condicionada, operativos temporales, Salta, microchip felino.
- Salud mental: San Agustín y DTC Solar (La Rioja; falta confirmar si comparten edificio), las líneas telefónicas y la consulta virtual (no son puntos del mapa; los números de emergencia son del equipo de Emergencias), CSM Nº 1 y 3, Bonaparte, Piñero y Vélez Sarsfield, Elizalde y Gutiérrez (guardia).
- Estaciones Saludables de Parque Avellaneda (el enlace apunta al centro de un mapa), Parque Chacabuco (dos puntos a 167 m) y Parque de la Ciudad (sin coordenadas): sin pin.

## Pendientes
- **Geolocalizar** a mano o con un mapa oficial: 8 centros veterinarios (Indoamericano, La France, Villa Allende Parque, IMUSA Zaimán y Base 115, IMUSA Jardín Botánico y Alto Verde, Berazategui) y los lugares regionales de salud mental (Córdoba, La Rioja, Crespo, Salta, Rosario).
- Avisar al equipo de la página de vacunatorios de la Ciudad del cruce de puntos de Rivadavia y Santojanni y de CeSAC 23.
- El conmutador del Pasteur es 4958-9900 según su página; el dataset de la Ciudad trae 4598-9900.
- **Probar a Auxi** con estos datos: no se pudo (el servidor del chat necesita Java, una base y una clave de IA).
- Revisar a simple vista los horarios de vacunatorios (se leyeron con un script del HTML de la página).
- Las fichas vencen a los 30 días (`nextReviewDue` 12/11/2026): hay que volver a mirarlas.
