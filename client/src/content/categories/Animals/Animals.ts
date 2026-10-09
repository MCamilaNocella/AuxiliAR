import { PawPrint } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { AnimalsScene } from "./AnimalsScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"
import { Section3 } from "./sections/Section3"
import { Section4 } from "./sections/Section4"

export const ANIMALS: Category = {
  id: "animales",
  title: "Salud animal",
  description: "Cuidados preventivos y orientación veterinaria",
  subtitle: "Campañas gratuitas, cuidados y cómo buscar atención, con fuentes oficiales",
  icon: PawPrint,
  to: PATHS.topic("animales"),
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: AnimalsScene,
  /** Sidebar sections, in the order they are listed; each one's content lives in ./sections */
  sections: [
    {
      id: "section-1",
      title: "Vacunación y castración gratuitas",
      summary:
        "Campañas y servicios municipales de vacunación antirrábica y castración de perros y gatos que la página oficial de cada municipio informa como gratuitos (Ciudad de Buenos Aires, Rosario, Córdoba, Salta), y los que todavía no están confirmados. Una campaña gratuita no es atención veterinaria gratuita. AuxiliAR no otorga turnos ni atiende animales.",
      Content: Section1,
    },
    {
      id: "section-2",
      title: "Cuidado y prevención",
      summary:
        "Información general del Ministerio de Salud de la Nación y de Senasa: vacunar cada año a perros y gatos contra la rabia desde los 3 meses de edad, qué es una zoonosis y acudir a un centro de salud si un animal muerde o araña.",
      Content: Section2,
    },
    {
      id: "section-3",
      title: "Atención veterinaria gratuita",
      summary:
        "Cómo buscar atención veterinaria gratuita para perros y gatos: consultar a la municipalidad o al centro de zoonosis, qué preguntar y por qué un hospital universitario no es gratuito por ser público. No hay guardias gratuitas confirmadas.",
      Content: Section3,
    },
    {
      id: "section-4",
      title: "Si muere tu perro o gato",
      Content: Section4,
    },
  ],
  /** It opens straight on the first section: no banner first */
  defaultSectionId: "section-1",
}
