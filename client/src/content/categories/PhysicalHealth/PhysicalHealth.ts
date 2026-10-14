import { Activity, Apple, CircleHelp, HeartPulse, ListChecks, MapPin, Syringe } from "lucide-react"
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
  /** Sidebar sections, as in the chosen model (diseñoCategorias/salud-general-6-renglones-con-resumen), keeping the ids of before so old links still work; their content is in PhysicalHealth.model.ts */
  sections: [
    {
      id: "section-1",
      title: "Dónde atenderme",
      icon: MapPin,
      lead: "Cada lugar está pensado para algo distinto. Elegir bien te ahorra tiempo y te asegura la atención que necesitás.",
      summary:
        "Adónde ir según lo que necesitás: el centro de salud (CeSAC) para controles, consultas habituales y prevención; el hospital para especialidades, estudios y atención de mayor complejidad; y la guardia para problemas que necesitan atención en el momento. Lleva al mapa de Centros de atención.",
      Content: Section1,
    },
    {
      id: "section-2",
      title: "Controles de salud",
      icon: ListChecks,
      lead: "Cada cuánto conviene hacerte cada control, según recomendaciones oficiales para personas sin síntomas. Lo que te corresponde a vos lo define tu equipo de salud, según tu edad y tu historia.",
      summary:
        "Cada cuánto conviene hacerse los controles de rutina, según recomendaciones generales del Ministerio de Salud de la Nación: salud bucal, salud visual, presión arterial y azúcar en sangre, vacunas y chequeos generales. Es información general.",
      Content: Section2,
    },
    {
      id: "section-5",
      title: "Calendario de vacunación",
      icon: Syringe,
      lead: "El Calendario Nacional de Vacunación 2026 tiene vacunas para cada etapa de la vida. Son gratuitas en centros de salud y hospitales públicos y no necesitan orden médica.",
      summary:
        "El Calendario Nacional de Vacunación 2026 por etapa de la vida: embarazo, recién nacidos, hasta 1 año, hasta 2 años, 5 años, 11 años, 15 a 64 años y 65 años o más; qué vacunas corresponden en cada una y cuándo se aplican.",
      Content: Section5,
    },
    {
      id: "section-6",
      title: "Alimentación y nutrición",
      icon: Apple,
      lead: "Comer bien, recibir orientación de un profesional y conseguir alimentos son tres cosas distintas. Acá están separadas para que sepas a dónde recurrir.",
      summary:
        "Educación alimentaria, dónde pedir orientación profesional y asistencia alimentaria, con las Guías Alimentarias para la Población Argentina y la Ley 27.642 de Promoción de la Alimentación Saludable.",
      Content: Section6,
    },
    {
      id: "section-7",
      title: "Actividad física y bienestar",
      icon: Activity,
      lead: "Moverte hace bien al cuerpo y al ánimo. No hace falta un gimnasio: cualquier movimiento suma, y algo es mejor que nada.",
      summary:
        "Cuánto moverse según la Organización Mundial de la Salud (adultos: 150 a 300 minutos por semana de actividad moderada; chicos y adolescentes: 60 minutos por día), opciones que no cuestan nada y qué tener en cuenta antes de empezar.",
      Content: Section7,
    },
    {
      id: "section-4",
      title: "Quiz",
      icon: CircleHelp,
      lead: "8 situaciones de todos los días para aprender dónde ir y cómo cuidarte. En cada una te explicamos por qué.",
      summary:
        "Un quiz corto para practicar adónde conviene ir en cada situación: un control de rutina, una consulta o una emergencia.",
      Content: Section4,
    },
  ],
}
