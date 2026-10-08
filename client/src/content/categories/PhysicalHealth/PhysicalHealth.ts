import { HeartPulse } from "lucide-react"
import { HEALTH_GENERAL_SLUG, PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { PhysicalHealthScene } from "./PhysicalHealthScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"
import { Section4 } from "./sections/Section4"

export const PHYSICAL_HEALTH: Category = {
  /** Internal id, kept as it was ("salud-fisica"): the places taxonomy, the category colors and the illustrations use it. The title and the address are "Salud general" */
  id: "salud-fisica",
  title: "Salud general",
  description: "Presión, diabetes, vacunas",
  subtitle: "Hospitales públicos, guardias gratuitas y programas del Estado",
  icon: HeartPulse,
  to: PATHS.topic(HEALTH_GENERAL_SLUG),
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: PhysicalHealthScene,
  /** Sidebar sections, in the order they are listed; each one's content lives in ./sections */
  sections: [
    { id: "section-1", title: "Dónde atenderme", Content: Section1 },
    { id: "section-2", title: "Controles de salud", Content: Section2 },
    { id: "section-4", title: "Quiz", Content: Section4 },
  ],
}
