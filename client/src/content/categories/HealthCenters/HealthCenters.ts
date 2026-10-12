import { Hospital } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { HealthCentersScene } from "./HealthCentersScene"
import { Section1 } from "./sections/Section1"

export const HEALTH_CENTERS: Category = {
  id: "centros",
  title: "Encontrar atención",
  description: "Centros de salud y hospitales verificados, en mapa o lista",
  subtitle: "Buscá centros de salud, hospitales y guardias con información verificada",
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
        "Mapa y lista de centros de atención verificados (hospitales, centros de salud, guardias) para buscar por provincia, tipo de atención y prestación. Por ahora hay centros verificados en la Ciudad de Buenos Aires y en pocos lugares de Buenos Aires, Córdoba, La Rioja y Tucumán; todavía no cubrimos todo el país.",
      Content: Section1,
    },
  ],
  /** It opens straight on the map: no banner first */
  defaultSectionId: "section-1",
}
