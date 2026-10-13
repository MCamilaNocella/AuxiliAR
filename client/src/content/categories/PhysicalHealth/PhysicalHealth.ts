import { HeartPulse } from "lucide-react"
import { HEALTH_GENERAL_SLUG, PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { PhysicalHealthScene } from "./PhysicalHealthScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"
import { Section5 } from "./sections/Section5"
import { Section4 } from "./sections/Section4"
import { Section6 } from "./sections/Section6"
import { Section7 } from "./sections/Section7"

export const PHYSICAL_HEALTH: Category = {
  /** Internal id, kept as it was ("salud-fisica"): the places taxonomy, the category colors and the illustrations use it. The title and the address are "Salud general" */
  id: "salud-fisica",
  title: "Salud general",
  description: "Controles, cuidados y calendario de vacunación",
  icon: HeartPulse,
  to: PATHS.topic(HEALTH_GENERAL_SLUG),
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: PhysicalHealthScene,
  /** Sidebar sections, in the order they are listed; each one's content lives in ./sections */
  sections: [
    {
      id: "section-1",
      title: "Dónde atenderme",
      summary:
        "Adónde ir según lo que necesitás: el centro de salud (CeSAC) para controles, consultas habituales y prevención; el hospital para especialidades, estudios y atención de mayor complejidad; y la guardia para problemas que necesitan atención en el momento. Lleva al mapa de Centros de atención.",
      Content: Section1,
    },
    {
      id: "section-2",
      title: "Controles de salud",
      summary:
        "Cada cuánto conviene hacerse los controles de rutina, según recomendaciones generales del Ministerio de Salud de la Nación: salud bucal, salud visual, presión arterial y azúcar en sangre, vacunas y chequeos generales. Es información general.",
      Content: Section2,
    },
    {
      id: "section-5",
      title: "Calendario de vacunación",
      summary:
        "El Calendario Nacional de Vacunación 2026 por etapa de la vida: embarazo, recién nacidos, hasta 1 año, hasta 2 años, 5 años, 11 años, 15 a 64 años y 65 años o más; qué vacunas corresponden en cada una y cuándo se aplican.",
      Content: Section5,
    },
    {
      id: "section-6",
      title: "Alimentación y nutrición",
      summary:
        "Educación alimentaria, dónde pedir orientación profesional y asistencia alimentaria, con las Guías Alimentarias para la Población Argentina y la Ley 27.642 de Promoción de la Alimentación Saludable.",
      Content: Section6,
    },
    {
      id: "section-7",
      title: "Actividad física y bienestar",
      summary:
        "Cuánto moverse según la Organización Mundial de la Salud (adultos: 150 a 300 minutos por semana de actividad moderada; chicos y adolescentes: 60 minutos por día), opciones que no cuestan nada y qué tener en cuenta antes de empezar.",
      Content: Section7,
    },
    {
      id: "section-4",
      title: "Quiz",
      summary:
        "Un quiz corto para practicar adónde conviene ir en cada situación: un control de rutina, una consulta o una emergencia.",
      Content: Section4,
    },
  ],
}
