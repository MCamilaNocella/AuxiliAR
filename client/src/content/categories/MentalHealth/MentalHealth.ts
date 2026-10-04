import { Brain } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { MentalHealthScene } from "./MentalHealthScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"

export const MENTAL_HEALTH: Category = {
  id: "salud-mental",
  title: "Salud mental",
  description: "Atención, orientación y bienestar",
  subtitle: "Ayuda gratuita, confidencial y disponible las 24 horas",
  icon: Brain,
  to: PATHS.topic("salud-mental"),
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: MentalHealthScene,
  /** Sidebar sections, in the order they are listed; each one's content lives in ./sections */
  sections: [
    { id: "section-1", title: "Centros de atención", Content: Section1 },
    { id: "section-2", title: "Calma y bienestar", Content: Section2 },
  ],
}
