import { HeartHandshake } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { SexEducationScene } from "./SexEducationScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"
import { Section3 } from "./sections/Section3"
import { Section4 } from "./sections/Section4"

export const SEX_EDUCATION: Category = {
  id: "esi",
  title: "Educación sexual (ESI)",
  description: "Cuidados y derechos",
  subtitle: "Educación Sexual Integral · Derechos y acceso gratuito",
  icon: HeartHandshake,
  to: PATHS.topic("esi"),
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: SexEducationScene,
  /** Sidebar sections, in the order they are listed; each one's content lives in ./sections */
  sections: [
    { id: "section-1", title: "Sección 1", Content: Section1 },
    { id: "section-2", title: "Sección 2", Content: Section2 },
    { id: "section-3", title: "Sección 3", Content: Section3 },
    { id: "section-4", title: "Sección 4", Content: Section4 },
  ],
}
