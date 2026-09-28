export const PATHS = {
  home: "/",
  topics: "/temas",
  centers: "/centros",
  myHealth: "/mi-salud",
  firstAid: "/primeros-auxilios",
  firstAidGuide: (slug: string) => `/primeros-auxilios/${slug}`,
  search: "/buscar",
  about: "/sobre-auxiliar",
  login: "/login",
} as const
