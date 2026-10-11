import type { Source } from "@/components/health/SourceList"

/**
 * Sources of the general information of Atención veterinaria (fichas SA01 to SA14 of the resources document, 8/10/2026). Compared by hand
 * on CHECKED_AT; when the text or a source changes, compare again and change the day. The pages of each municipality, of the
 * Instituto and of the Nación are in Animals.places.ts, with the day they were read.
 * Not offered as a resource, and why: SA11 (civil organization: no open
 * appointment or gratuity for everyone), SA12 (registry of professionals: it is not a free directory) and SA13 (an announced
 * hospital, not open). The university hospitals (SA07, SA08) are shown only as services their own pages say are arancelados.
 */
export const CHECKED_AT = "2026-10-08"

/** What each municipality, the Instituto and the Nación say about a service is told inside AuxiliAR, place by place: see Animals.places.ts */

/** ── Sources of the general information ── */

/** "Rabia", glosario del Ministerio de Salud de la Nación: yearly vaccine of dogs and cats from 3 months and for life; avoid contact with wild animals; after a bite go quickly to a health center. No date */
export const RABIA: Source = {
  label: "Rabia · Ministerio de Salud de la Nación",
  url: "https://www.argentina.gob.ar/node/29491",
}

/** Senasa, zoonosis: the definition; it works on production animals; dogs and cats "se manejan a nivel municipal y/o provincial", with the local zoonosis center or the Ministerio de Salud. No date */
export const ZOONOSIS: Source = {
  label: "Zoonosis · Senasa, argentina.gob.ar",
  url: "https://www.argentina.gob.ar/senasa/programas-sanitarios/zoonosis",
}

/**
 * "¿Qué tener en cuenta cuando fallece un perro o un gato?" (Instituto Pasteur, "Información útil", 2026-10-09): the risk only exists
 * if the animal bit a person in the 10 days before; Pasteur receives dead dogs and cats every day, 24 hours, "sin costo, para su
 * disposición final o cremación", and "evalúa cada caso según criterios sanitarios"
 */
export const PASTEUR_INFO: Source = {
  label: "Información útil: qué tener en cuenta cuando fallece un perro o un gato · Instituto de Zoonosis Luis Pasteur",
  url: "https://buenosaires.gob.ar/gcaba_historico/salud/hospitales-y-establecimientos-de-salud/instituto-de-zoonosis-luis-pasteur/informacion-util",
}

/** The "Servicios" page of the Instituto: "Disposición de cadáveres… El solicitante de este servicio será mayor de edad y concurrir con DNI"; the address is on its "institucional" page */
export const PASTEUR_SERVICIOS: Source = {
  label: "Servicios · Instituto de Zoonosis Luis Pasteur",
  url: "https://buenosaires.gob.ar/gcaba_historico/institutopasteur/servicios",
}
export const CHECKED_AT_PASTEUR = "2026-10-09"

/** A free campaign is not free veterinary care. One copy: "Vacunación y castración gratuitas" and "Más recursos" both show it */
export const CAMPAIGN_NOT_CARE =
  "Que una vacunación o una castración sea gratuita no significa que la consulta, los estudios o los tratamientos también lo sean. Tampoco quiere decir que atiendan urgencias. Cada servicio dice qué incluye: leelo en su página."
