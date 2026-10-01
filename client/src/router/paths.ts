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
} as const
