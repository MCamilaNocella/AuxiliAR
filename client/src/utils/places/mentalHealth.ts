import type { PlaceQuery } from "./filters"
import { effectiveQuery } from "./filters"
import { normalizeText } from "./text"

/**
 * Whether what was asked is about mental health, and how:
 *  - "crisis": the words say the person may be in danger or in crisis (they want to die, to hurt themselves, "no aguanto
 *    más", "crisis"...). A person who writes this must not be left alone with a list of centers: urgent help comes first.
 *  - "habitual": looking for psychology / mental health care (the filter, or words like psicólogo, terapia, ansiedad).
 *    A calm note that urgent help exists, without alarming anyone who is only looking for a therapist.
 * Words only decide what is shown around the results. They never filter anything and nothing clinical is said.
 */
export type MentalHealthContext = "crisis" | "habitual" | null

const CRISIS = [
  "suicid",
  "matarme",
  "quitarme la vida",
  "no quiero vivir",
  "no quiero seguir viviendo",
  "quiero morir",
  "quiero morirme",
  "me quiero morir",
  "hacerme dano",
  "hacerme mal",
  "lastimarme",
  "autolesion",
  "cortarme",
  "no puedo mas",
  "no aguanto mas",
  "sobredosis",
  "crisis",
]

const HABITUAL = ["psicolog", "psiquiatr", "salud mental", "terapia", "terapeuta", "ansiedad", "depresion", "angustia", "estres", "ataque de panico", "panico"]

export const mentalHealthContextOf = (asked: PlaceQuery): MentalHealthContext => {
  const query = effectiveQuery(asked)
  const text = normalizeText(query.text)
  if (CRISIS.some((word) => text.includes(word))) return "crisis"
  if (query.category === "salud-mental" || query.filterId === "mental-health" || HABITUAL.some((word) => text.includes(word))) return "habitual"
  return null
}
