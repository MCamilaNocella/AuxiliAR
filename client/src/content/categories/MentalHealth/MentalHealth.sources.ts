import type { Source } from "@/components/health/SourceList"

/**
 * Official sources of Salud mental. Every statement of the three sections comes from one of these (see the comments in
 * each section). Compared by hand on CHECKED_AT; when the text or a source changes, compare again and change the day.
 */
export const CHECKED_AT = "2026-10-08"

/** Ley 26.657, texto original: articles 7 (rights), 8 (interdisciplinary team), 9 (care outside hospitalization), 12 (medication) */
export const LEY_26657: Source = {
  label: "Ley Nacional de Salud Mental 26.657 (texto original) · argentina.gob.ar",
  url: "https://www.argentina.gob.ar/normativa/nacional/ley-26657-175977/texto",
}

/** "Ley simple: Salud mental" (Ministerio de Justicia, Derecho Fácil): the rights in plain words */
export const LEY_SIMPLE: Source = {
  label: "Ley simple: Salud mental · Derecho Fácil, Ministerio de Justicia",
  url: "https://www.argentina.gob.ar/justicia/derechofacil/leysimple/salud-mental",
}

/** "Si no tenés cobertura podés acercarte a un hospital o centro de salud cercano a tu domicilio". The page has no date */
export const ORIENTACION: Source = {
  label: "Orientación en Salud Mental · Derechos Humanos, argentina.gob.ar",
  url: "https://www.argentina.gob.ar/derechoshumanos/grupos-en-situacion-de-vulnerabilidad/orientacion-en-salud-mental",
}

/** "Estrés", OMS, 30 de marzo de 2026: routine, sleep, talking to others, exercise, food, limits with the news, when to ask for help */
export const OMS_ESTRES: Source = {
  label: "Estrés · Organización Mundial de la Salud",
  url: "https://www.who.int/es/news-room/questions-and-answers/item/stress",
}

/** The day the team's research (places, lines and activities of Salud mental) read the official pages of MentalHealth.directory.ts. Documentary: nobody phoned or visited */
export const DIRECTORY_CHECKED_AT = "2026-10-12"

/** Ley 153 (Ciudad), arts. 2 and 3.g: the "exención de cualquier forma de pago directo en el área estatal" the Ciudad's services rest on. A general norm, not a phrase of each center */
export const LEY_153_MENTAL: Source = {
  label: "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires (arts. 2 y 3.g) · Boletín Oficial de la Ciudad",
  url: "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800",
}

/** "Guardias hospitalarias", Gobierno de la Ciudad: the hospitals with a 24-hour mental health guardia */
export const GUARDIAS_PAGINA = "https://buenosaires.gob.ar/gcaba_historico/salud/guardias-hospitalarias"

/** "Red de adicciones", Gobierno de la Ciudad: where problematic substance use is attended */
export const RED_ADICCIONES = "https://buenosaires.gob.ar/gcaba_historico/adicciones/red-de-adicciones"

/** OMS: "En tiempos de estrés, haz lo que importa" (2020), the free illustrated guide; and the OMS pages on stress (OMS_ESTRES) and anxiety */
export const OMS_GUIA: Source = {
  label: "En tiempos de estrés, haz lo que importa · guía ilustrada, Organización Mundial de la Salud (2020)",
  url: "https://cdn.who.int/media/docs/default-source/mental-health/sh-2020-spa-3-web.pdf",
}
export const OMS_ANSIEDAD: Source = {
  label: "Trastornos de ansiedad · Organización Mundial de la Salud",
  url: "https://www.who.int/es/news-room/fact-sheets/detail/anxiety-disorders",
}
