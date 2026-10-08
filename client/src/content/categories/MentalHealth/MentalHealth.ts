import { Brain } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { MentalHealthScene } from "./MentalHealthScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"
import { Section3 } from "./sections/Section3"

export const MENTAL_HEALTH: Category = {
  id: "salud-mental",
  title: "Salud mental",
  description: "Orientación, acompañamiento y recursos",
  subtitle: "Dónde pedir ayuda, tus derechos y cómo cuidarte, con fuentes oficiales",
  icon: Brain,
  to: PATHS.topic("salud-mental"),
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: MentalHealthScene,
  /** Sidebar sections, in the order they are listed; each one's content lives in ./sections */
  sections: [
    {
      id: "section-1",
      title: "Dónde buscar ayuda",
      summary:
        "Dónde pedir ayuda en salud mental: acercarse a un hospital o centro de salud cercano si no hay cobertura, qué establece la ley sobre quién atiende y cómo explorar en el mapa centros de salud cercanos. AuxiliAR no otorga turnos ni realiza consultas médicas.",
      Content: Section1,
    },
    {
      id: "section-2",
      title: "Conocé tus derechos",
      summary:
        "Qué derechos reconoce la Ley Nacional de Salud Mental 26.657 al pedir atención: tratamiento, acompañamiento, historia clínica, no discriminación, atención en hospital general y medicación; y qué hacer si rechazan la atención.",
      Content: Section2,
    },
    {
      id: "section-3",
      title: "Herramientas para cuidarte",
      summary:
        "Hábitos para cuidar el bienestar y manejar el estrés según la OMS (rutina, sueño, vínculos, movimiento, alimentación, noticias) y cuándo conviene pedir ayuda profesional.",
      Content: Section3,
    },
  ],
  /** It opens straight on the first section: no banner first */
  defaultSectionId: "section-1",
}
