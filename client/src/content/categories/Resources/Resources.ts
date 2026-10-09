import { BookOpen } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { ResourcesScene } from "./ResourcesScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"
import { Section3 } from "./sections/Section3"
import { Section4 } from "./sections/Section4"

export const RESOURCES: Category = {
  id: "recursos",
  title: "Más recursos",
  description: "Preguntas frecuentes, derechos, leyes y trámites",
  subtitle: "Preguntas frecuentes, derechos, leyes y trámites",
  icon: BookOpen,
  to: PATHS.resources,
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: ResourcesScene,
  /**
   * Sidebar sections, in the order they are listed; each one's content lives in ./sections. Version 1: it reuses the texts of the
   * other categories as shared modules (one copy each) and leaves out what is still in legal review (Ley 27.610).
   */
  sections: [
    { id: "section-1", title: "Tus derechos en salud", Content: Section1 },
    { id: "section-2", title: "Trámites", Content: Section2 },
    { id: "section-3", title: "Preguntas frecuentes", Content: Section3 },
    { id: "section-4", title: "Glosario", Content: Section4 },
  ],
  /** It opens straight on the first section: no banner first */
  defaultSectionId: "section-1",
}
