import { centersLink } from "@/router/centersLink"
import { HEALTH_GENERAL_SLUG, PATHS, SECTION_PARAM } from "@/router/paths"
import { quickFilterHasData } from "./filters"
import type { PlaceEntry, PlaceQuery } from "./filters"
import { normalizeText } from "./text"

/** What the map says, and where it points, when a quick filter has no place with a documented gratuity */
export type EmptyGuide = {
  /** The first sentence: what the map does not have (never that the service does not exist) */
  headline: string
  /** What a person can do, in AuxiliAR's own words */
  steps: string[]
  /** Pages of AuxiliAR that continue the topic */
  links: { label: string, to: string }[]
}

const section = (slug: string, id: string) => `${PATHS.topic(slug)}?${SECTION_PARAM}=${id}`

const NOT_A_PROMISE = "Eso no significa que no existan: solo mostramos lo que una fuente oficial confirma."

/** One guide per quick filter that can come up empty. They name no center, no number and no hour */
const GUIDES = {
  "mental-health": {
    headline: `Todavía no tenemos prestaciones de salud mental con gratuidad documentada en el mapa. ${NOT_A_PROMISE}`,
    steps: [
      "Podés acercarte a un hospital o centro de salud público cercano a tu casa y pedir orientación. La ley reconoce el derecho a ser atendida o atendido en un hospital general.",
      "La forma de acceder a la atención puede variar según el centro: algunos servicios requieren admisión, turno o derivación.",
    ],
    links: [
      { label: "Conocé tus derechos en salud mental", to: section("salud-mental", "section-2") },
      { label: "Dónde buscar ayuda", to: section("salud-mental", "section-1") },
    ],
  },
  "sexual-health": {
    headline: `Todavía no tenemos prestaciones de salud sexual con gratuidad documentada en el mapa. ${NOT_A_PROMISE}`,
    steps: [
      "Podés consultar en un centro de salud u hospital público: la ley nacional 25.673 garantiza el acceso a información, orientación, métodos y prestaciones de salud sexual y reproductiva.",
      "En la Ciudad de Buenos Aires, el Gobierno de la Ciudad informa que la atención y los métodos anticonceptivos son gratuitos en el sistema público de salud.",
    ],
    links: [
      { label: "Anticoncepción y prevención", to: section("esi", "section-2") },
      { label: "Dónde buscar atención", to: section("esi", "section-1") },
    ],
  },
  dentistry: {
    headline: `Todavía no tenemos odontología de rutina con gratuidad documentada en el mapa. ${NOT_A_PROMISE}`,
    steps: [
      "Para un control de rutina, empezá por tu centro de salud: pueden orientarte sobre dónde atenderte.",
      "Si tenés un dolor muy fuerte, hinchazón o un golpe en la boca y no podés esperar un turno, mirá las guardias odontológicas.",
    ],
    links: [
      { label: "Ver guardias odontológicas", to: centersLink({ filter: "emergency", query: "odontol" }) },
      { label: "Dónde atenderme", to: section(HEALTH_GENERAL_SLUG, "section-1") },
    ],
  },
  ophthalmology: {
    headline: `Hoy no tenemos una guardia oftalmológica con gratuidad documentada en el mapa. ${NOT_A_PROMISE}`,
    steps: [
      "Si te golpeás un ojo, perdés la vista de golpe o tenés un dolor muy fuerte, necesitás atención urgente: no esperes un turno y acudí a la guardia de un hospital.",
      "Para un control de la vista de rutina, empezá por tu centro de salud.",
    ],
    links: [{ label: "Dónde atenderme", to: section(HEALTH_GENERAL_SLUG, "section-1") }],
  },
} satisfies Record<string, EmptyGuide>

/**
 * The guide for a quick filter that has nothing to show, or null. The explorer asks only when there are no results.
 * A filter that has places and merely finds none for the search keeps the generic message. Never promises a result.
 */
export const emptyGuideOf = (query: PlaceQuery, entries: readonly PlaceEntry[]): EmptyGuide | null => {
  if (query.filterId === "mental-health" || query.filterId === "sexual-health" || query.filterId === "dentistry") {
    return quickFilterHasData(query.filterId, entries) ? null : GUIDES[query.filterId]
  }
  // The eye emergencies are a search inside the emergency filter; the explorer only asks when that search found nothing
  if (query.filterId === "emergency" && normalizeText(query.text).includes("oftalm")) return GUIDES.ophthalmology
  return null
}
