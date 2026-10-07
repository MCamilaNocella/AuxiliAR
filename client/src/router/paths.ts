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

/** Query param with the open section of a category screen: /temas/salud-fisica?seccion=section-1 */
export const SECTION_PARAM = "seccion"

/** Query param with the open place of the places explorer: /centros?seccion=section-1&lugar=cesac-3 */
export const PLACE_PARAM = "lugar"

/** Where a link can leave the places explorer: a filter ("vaccination"…) and/or the search text, already applied */
export const PLACE_FILTER_PARAM = "filtro"
export const PLACE_QUERY_PARAM = "buscar"

/** How the places are shown when the explorer has a map: ?vista=mapa (the list is the default and has no param) */
export const PLACE_VIEW_PARAM = "vista"
export const PLACE_VIEW_MAP = "mapa"
