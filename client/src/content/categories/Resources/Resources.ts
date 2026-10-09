import { BookOpen } from "lucide-react"
import { PATHS, SECTION_PARAM } from "@/router/paths"
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
  /** No published information yet: the screen says so and points to what exists (the sections on rights that other categories already have) */
  preparing: {
    will: "Acá van a estar las preguntas frecuentes, los derechos, las leyes y los trámites de salud.",
    meanwhile: [
      { label: "Conocé tus derechos en salud mental", to: `${PATHS.topic("salud-mental")}?${SECTION_PARAM}=section-2` },
      { label: "Derechos y ESI", to: `${PATHS.topic("esi")}?${SECTION_PARAM}=section-3` },
    ],
  },
  /** Sidebar sections, in the order they are listed; each one's content lives in ./sections */
  sections: [
    { id: "section-1", title: "Sección 1", Content: Section1 },
    { id: "section-2", title: "Sección 2", Content: Section2 },
    { id: "section-3", title: "Sección 3", Content: Section3 },
    { id: "section-4", title: "Sección 4", Content: Section4 },
  ],
}
