import { PLACE_VIEW_LIST, PLACE_VIEW_MAP } from "@/router/paths"

export type PlacesView = "list" | "map"

/**
 * Which view opens: the one the URL asks for (?vista=mapa | lista), or else the map on large screens and the list on
 * phones. Without a map (an explorer that doesn't offer it) it is always the list. Both views show the same results.
 */
export const resolveView = ({ hasMap, requested, isDesktop }: { hasMap: boolean, requested: string | null, isDesktop: boolean }): PlacesView => {
  if (!hasMap) return "list"
  if (requested === PLACE_VIEW_MAP) return "map"
  if (requested === PLACE_VIEW_LIST) return "list"
  return isDesktop ? "map" : "list"
}
