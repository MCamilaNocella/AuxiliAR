import { Hospital } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { HealthCentersScene } from "./HealthCentersScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"

export const HEALTH_CENTERS: Category = {
  id: "centros",
  title: "Centros de atención",
  description: "Hospitales cerca",
  subtitle: "Hospitales, centros de salud y guardias cerca tuyo",
  icon: Hospital,
  to: PATHS.centers,
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: HealthCentersScene,
  /** Sidebar sections, in the order they are listed; each one's content lives in ./sections */
  sections: [
    {
      id: "section-1",
      title: "Mapa AuxiliAR",
      summary:
        "Mapa y lista de centros de atención verificados (hospitales, centros de salud, guardias) para buscar por provincia, tipo de atención y prestación. Por ahora solo hay centros verificados en la Ciudad de Buenos Aires.",
      Content: Section1,
    },
    {
      id: "section-2",
      title: "Sobre los datos",
      summary:
        "Cómo verifica AuxiliAR los centros y sus prestaciones, qué significa gratuito y qué condiciones pueden tener, qué dice la fecha de verificación, por qué que algo no aparezca no significa que no exista, y cuáles son las fuentes y la cobertura.",
      Content: Section2,
    },
  ],
  /** It opens straight on the map: no banner first */
  defaultSectionId: "section-1",
}
