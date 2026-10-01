import { Info } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { AboutScene } from "./AboutScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"
import { Section3 } from "./sections/Section3"
import { Section4 } from "./sections/Section4"

export const ABOUT: Category = {
  id: "sobre-auxiliar",
  title: "Sobre AuxiliAR",
  description: "Quiénes somos y de dónde sale la información",
  subtitle: "Información de salud verificada, gratuita y para todas las personas",
  icon: Info,
  to: PATHS.about,
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: AboutScene,
  /** Sidebar sections, in the order they are listed; each one's content lives in ./sections */
  sections: [
    { id: "section-1", title: "Sección 1", Content: Section1 },
    { id: "section-2", title: "Sección 2", Content: Section2 },
    { id: "section-3", title: "Sección 3", Content: Section3 },
    { id: "section-4", title: "Sección 4", Content: Section4 },
  ],
}
