export const PATHS = {
  home: "/",
  topics: "/temas",
  topic: (slug: string) => `/temas/${slug}`,
  resources: "/recursos",
  centers: "/centros",
  myHealth: "/mi-salud",
  firstAid: "/primeros-auxilios",
  firstAidGuide: (slug: string) => `/primeros-auxilios/${slug}`,
  search: "/buscar",
  about: "/sobre-auxiliar",
  login: "/login",
  auxiModels: "/auxi-modelos",
  peerChatSketch: "/boceto-chat-personas",
} as const

/** Query param with the open section of a category screen: /temas/salud-fisica?seccion=section-1 */
export const SECTION_PARAM = "seccion"
