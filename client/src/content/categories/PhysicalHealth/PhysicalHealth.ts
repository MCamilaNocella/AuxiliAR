import { HeartPulse } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { PhysicalHealthScene } from "./PhysicalHealthScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"
import { Section3 } from "./sections/Section3"
import { Section4 } from "./sections/Section4"

export const PHYSICAL_HEALTH: Category = {
  id: "salud-fisica",
  title: "Salud física",
  description: "Centros, controles y primeros auxilios",
  subtitle: "Hospitales públicos, guardias gratuitas y programas del Estado",
  icon: HeartPulse,
  to: PATHS.topic("salud-fisica"),
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: PhysicalHealthScene,
  /** Sidebar sections, in the order they are listed; each one's content lives in ./sections */
  sections: [
    { id: "section-1", title: "Centros de atención", Content: Section1 },
    { id: "section-2", title: "Controles de salud", Content: Section2 },
    { id: "section-3", title: "Primeros auxilios", Content: Section3 },
    { id: "section-4", title: "Quiz", Content: Section4 },
  ],
}
