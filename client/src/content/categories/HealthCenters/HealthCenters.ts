import { Hospital } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { HealthCentersScene } from "./HealthCentersScene"
import { Section1 } from "./sections/Section1"

export const HEALTH_CENTERS: Category = {
  id: "centros",
  title: "Centros de atención",
  description: "Mapa de hospitales y centros de salud",
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
        "Mapa y lista de centros de atención verificados (hospitales, centros de salud, guardias) para buscar por provincia, tipo de atención y prestación. Por ahora hay centros verificados en la Ciudad de Buenos Aires y en pocos lugares de Buenos Aires, Córdoba, Entre Ríos, La Rioja, Misiones, Río Negro, Salta, Santa Fe, Tierra del Fuego y Tucumán; todavía no cubrimos todo el país.",
      Content: Section1,
    },
  ],
}
