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
    { id: "section-1", title: "Mapa AuxiliAR", Content: Section1 },
    { id: "section-2", title: "Sobre los datos", Content: Section2 },
  ],
  /** It opens straight on the map: no banner first */
  defaultSectionId: "section-1",
}
