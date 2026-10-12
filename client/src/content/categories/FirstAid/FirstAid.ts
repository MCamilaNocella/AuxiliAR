import { Bandage } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { FirstAidScene } from "./FirstAidScene"
import { Section1 } from "./sections/Section1"

export const FIRST_AID: Category = {
  id: "primeros-auxilios",
  title: "Primeros auxilios",
  description: "Guías paso a paso para actuar en emergencias",
  icon: Bandage,
  to: PATHS.firstAid,
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: FirstAidScene,
  /** One section only, so the category shows no section menu: the guides are the page. Each guide opens at /primeros-auxilios/:slug */
  sections: [
    {
      id: "section-1",
      title: "Guías de primeros auxilios",
      summary: "Las guías, ordenadas por urgencia: las que se necesitan ya, las de accidentes y lesiones frecuentes y las de prepararte con anticipación. Cada guía se abre con sus pasos.",
      Content: Section1,
    },
  ],
}
