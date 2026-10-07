import { PATHS, PLACE_FILTER_PARAM, PLACE_QUERY_PARAM, SECTION_PARAM } from "@/router/paths"
import type { PlaceFilterId } from "./filters"

/** Salud física → Centros de atención, optionally with a filter and/or a search already applied */
export const physicalCentersLink = ({ filter, query }: { filter?: PlaceFilterId, query?: string } = {}) => {
  const params = new URLSearchParams({ [SECTION_PARAM]: "section-1" })
  if (filter) params.set(PLACE_FILTER_PARAM, filter)
  if (query) params.set(PLACE_QUERY_PARAM, query)
  return `${PATHS.topic("salud-fisica")}?${params.toString()}`
}
