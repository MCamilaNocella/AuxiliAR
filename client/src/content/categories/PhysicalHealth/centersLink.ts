import { PATHS, SECTION_PARAM } from "@/router/paths"

/** The filters of the places explorer that Controles de salud and the Quiz send people to */
export type CentersFilter = "medical" | "vaccination" | "dentistry" | "emergency"

/** Query params of the places explorer (Centros de atención): the filter and the search text, already applied */
const FILTER_PARAM = "filtro"
const QUERY_PARAM = "buscar"

/** Salud física → Centros de atención, optionally with a filter and/or a search already applied. Only builds the address: the explorer lives in its own branch. */
export const physicalCentersLink = ({ filter, query }: { filter?: CentersFilter, query?: string } = {}) => {
  const params = new URLSearchParams({ [SECTION_PARAM]: "section-1" })
  if (filter) params.set(FILTER_PARAM, filter)
  if (query) params.set(QUERY_PARAM, query)
  return `${PATHS.topic("salud-fisica")}?${params.toString()}`
}
