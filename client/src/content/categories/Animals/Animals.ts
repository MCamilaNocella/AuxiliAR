import { PawPrint } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { AnimalsScene } from "./AnimalsScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"

export const ANIMALS: Category = {
  id: "animales",
  title: "Animales",
  description: "Atención veterinaria y cuidados",
  subtitle: "Veterinarias gratuitas, vacunas y primeros auxilios",
  icon: PawPrint,
  to: PATHS.topic("animales"),
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: AnimalsScene,
  /** Sidebar sections, in the order they are listed; each one's content lives in ./sections */
  sections: [
    { id: "section-1", title: "Atención veterinaria", Content: Section1 },
    { id: "section-2", title: "Controles de salud", Content: Section2 },
  ],
}
