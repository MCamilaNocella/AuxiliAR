import { BookOpen } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { ResourcesScene } from "./ResourcesScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"
import { Section3 } from "./sections/Section3"

export const RESOURCES: Category = {
  id: "recursos",
  title: "Mis recursos",
  description: "Donaciones, derechos y trámites",
  subtitle: "Preguntas frecuentes, derechos, leyes y trámites",
  icon: BookOpen,
  to: PATHS.resources,
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: ResourcesScene,
  /** Sidebar sections, in the order they are listed; each one's content lives in ./sections */
  sections: [
    { id: "section-1", title: "Donaciones", Content: Section1 },
    { id: "section-2", title: "Derechos del paciente", Content: Section2 },
    { id: "section-3", title: "Trámites, datos y estadísticas", Content: Section3 },
  ],
}
