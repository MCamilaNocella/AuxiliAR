import { Info } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { AboutScene } from "./AboutScene"
import { Section1 } from "./sections/Section1"

export const ABOUT: Category = {
  id: "sobre-auxiliar",
  title: "Sobre AuxiliAR",
  description: "Quiénes somos y de dónde sale la información",
  subtitle: "Información de salud verificada, gratuita y para todas las personas",
  icon: Info,
  to: PATHS.about,
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: AboutScene,
  /** One section only (institutional page, reached from the footer): no section menu. Its content lives in ./sections */
  sections: [
    {
      id: "section-1",
      title: "Sobre AuxiliAR",
      summary:
        "Qué es AuxiliAR, de dónde sale la información, que no reemplaza la atención profesional, cómo verifica los centros y sus prestaciones, qué significa gratuito, qué dice la fecha de verificación, por qué que algo no aparezca no significa que no exista, cuál es la cobertura y cuáles son las fuentes de cada tema.",
      Content: Section1,
    },
  ],
}
