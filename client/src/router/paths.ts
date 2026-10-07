export const PATHS = {
  home: "/",
  topics: "/temas",
  topic: (slug: string) => `/temas/${slug}`,
  resources: "/recursos",
  centers: "/centros",
  myHealth: "/mi-salud",
  firstAid: "/primeros-auxilios",
  firstAidGuide: (slug: string) => `/primeros-auxilios/${slug}`,
  about: "/sobre-auxiliar",
  login: "/login",
  auxiModels: "/auxi-modelos",
  peerChatSketch: "/boceto-chat-personas",
} as const

/** Salud general (before: Salud física). The old address keeps working: it redirects, with its query, to the new one */
export const HEALTH_GENERAL_SLUG = "salud-general"
export const LEGACY_PHYSICAL_HEALTH_SLUG = "salud-fisica"

/** Query param with the open section of a category screen: /temas/salud-general?seccion=section-1 */
export const SECTION_PARAM = "seccion"

/** Query param with the open place of the Mapa AuxiliAR: /centros?lugar=cesac-3 */
export const PLACE_PARAM = "lugar"

/** Where a link can leave the places explorer: a filter ("vaccination"…) and/or the search text, already applied */
export const PLACE_FILTER_PARAM = "filtro"
export const PLACE_QUERY_PARAM = "buscar"

/** What the Mapa AuxiliAR is filtered by: where (province, and the division of it: comuna, partido…), the kind of care and the service */
export const PLACE_PROVINCE_PARAM = "provincia"
export const PLACE_ZONE_PARAM = "zona"
export const PLACE_CATEGORY_PARAM = "categoria"
export const PLACE_TYPE_PARAM = "prestacion"

/** How the places are shown: ?vista=mapa | lista. Without it: the map on large screens and the list on phones */
export const PLACE_VIEW_PARAM = "vista"
export const PLACE_VIEW_MAP = "mapa"
export const PLACE_VIEW_LIST = "lista"
