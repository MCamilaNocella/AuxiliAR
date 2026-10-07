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
