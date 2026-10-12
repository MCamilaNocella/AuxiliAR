import { PATHS, PLACE_FILTER_PARAM, PLACE_QUERY_PARAM, PLACE_VIEW_LIST, PLACE_VIEW_PARAM, SECTION_PARAM } from "./paths"

/** The quick filters of the places explorer that other pages link to (the explorer's own list is utils/places/filters) */
export type CentersFilter = "medical" | "mental-health" | "sexual-health" | "vaccination" | "dentistry" | "emergency" | "animal-health" | "nutrition-food" | "physical-activity"

/**
 * Address of Centros de atención (/centros, the Mapa AuxiliAR), optionally with a filter and/or a search already
 * applied. The only place that builds it: Salud general, the quiz and the explorer all use it. It imports nothing
 * from the explorer, so a page can link to the map without bringing the map.
 */
export const centersLink = ({ filter, query, list }: { filter?: CentersFilter, query?: string, list?: boolean } = {}) => {
  // Straight to the map section, past the category banner
  const params = new URLSearchParams({ [SECTION_PARAM]: "section-1" })
  if (filter) params.set(PLACE_FILTER_PARAM, filter)
  if (query) params.set(PLACE_QUERY_PARAM, query)
  // The list view (?vista=lista) is an existing view of the explorer: it opens with the filter already applied, and on a big screen too
  if (list) params.set(PLACE_VIEW_PARAM, PLACE_VIEW_LIST)
  return `${PATHS.centers}?${params}`
}
