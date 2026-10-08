import { PATHS, PLACE_FILTER_PARAM, PLACE_QUERY_PARAM } from "./paths"

/** The quick filters of the places explorer that other pages link to (the explorer's own list is utils/places/filters) */
export type CentersFilter = "medical" | "mental-health" | "sexual-health" | "vaccination" | "dentistry" | "emergency"

/**
 * Address of Centros de atención (/centros, the Mapa AuxiliAR), optionally with a filter and/or a search already
 * applied. The only place that builds it: Salud general, the quiz and the explorer all use it. It imports nothing
 * from the explorer, so a page can link to the map without bringing the map.
 */
export const centersLink = ({ filter, query }: { filter?: CentersFilter, query?: string } = {}) => {
  const params = new URLSearchParams()
  if (filter) params.set(PLACE_FILTER_PARAM, filter)
  if (query) params.set(PLACE_QUERY_PARAM, query)
  const search = params.toString()
  return search ? `${PATHS.centers}?${search}` : PATHS.centers
}
