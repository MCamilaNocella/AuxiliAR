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
