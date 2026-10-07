import { PATHS } from "@/router/paths"

/** The filters of the places map that Controles de salud and the Quiz send people to */
export type CentersFilter = "medical" | "vaccination" | "dentistry" | "emergency"

/** Query params of the Centros de atención map: the filter and the search text, already applied */
const FILTER_PARAM = "filtro"
const QUERY_PARAM = "buscar"

/**
 * Salud general → Centros de atención, optionally with a filter and/or a search already applied. Centros de atención is
 * its own category (/centros): the places and their map don't live inside Salud general. This only builds the address.
 */
export const physicalCentersLink = ({ filter, query }: { filter?: CentersFilter, query?: string } = {}) => {
  const params = new URLSearchParams()
  if (filter) params.set(FILTER_PARAM, filter)
  if (query) params.set(QUERY_PARAM, query)
  const search = params.toString()
  return search ? `${PATHS.centers}?${search}` : PATHS.centers
}
