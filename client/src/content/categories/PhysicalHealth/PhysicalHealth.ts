import { HeartPulse } from "lucide-react"
import { HEALTH_GENERAL_SLUG, PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { PhysicalHealthScene } from "./PhysicalHealthScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"
import { Section5 } from "./sections/Section5"
import { Section4 } from "./sections/Section4"
import { Section6 } from "./sections/Section6"
import { Section7 } from "./sections/Section7"

export const PHYSICAL_HEALTH: Category = {
  /** Internal id, kept as it was ("salud-fisica"): the places taxonomy, the category colors and the illustrations use it. The title and the address are "Salud general" */
  id: "salud-fisica",
  title: "Cuidar mi salud",
  description: "Controles, vacunas y prevención, con un quiz para empezar",
  subtitle: "Qué controles y vacunas te corresponden, en lenguaje simple",
  icon: HeartPulse,
  to: PATHS.topic(HEALTH_GENERAL_SLUG),
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: PhysicalHealthScene,
  /** Sidebar sections, in the order they are listed; each one's content lives in ./sections */
  sections: [
    { id: "section-1", title: "Dónde atenderme", Content: Section1 },
    { id: "section-2", title: "Controles de salud", Content: Section2 },
    { id: "section-5", title: "Calendario de vacunación", Content: Section5 },
    { id: "section-6", title: "Alimentación y nutrición", Content: Section6 },
    { id: "section-7", title: "Actividad física y bienestar", Content: Section7 },
    { id: "section-4", title: "Quiz", Content: Section4 },
  ],
  /** It opens straight on the controls (the main content), not on a banner */
  defaultSectionId: "section-2",
}
