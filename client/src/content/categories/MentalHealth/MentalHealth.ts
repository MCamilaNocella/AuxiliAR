import { Brain } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { MentalHealthScene } from "./MentalHealthScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"
import { Section3 } from "./sections/Section3"
import { Section4 } from "./sections/Section4"
import { Section5 } from "./sections/Section5"
import { Section6 } from "./sections/Section6"

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
        "Dónde pedir ayuda en salud mental: líneas de escucha y orientación (nacionales y de la Ciudad), guardias de salud mental las 24 horas de hospitales de la Ciudad, un hospital o centro de salud cercano si no hay cobertura, qué establece la ley sobre quién atiende y el mapa. AuxiliAR no otorga turnos ni realiza consultas médicas.",
      Content: Section1,
    },
    {
      id: "section-6",
      title: "Atención en la Ciudad",
      summary:
        "Dónde pedir atención programada de salud mental en la Ciudad de Buenos Aires: 33 CeSAC con psicología o psiquiatría (por comuna), el Centro de Salud Mental Nº 1 y el Hospital Nacional Laura Bonaparte. Datos de páginas oficiales; no se asegura turno ni horario.",
      Content: Section6,
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
        "Hábitos para cuidar el bienestar y manejar el estrés según la OMS (rutina, sueño, vínculos, movimiento, alimentación, noticias) cuándo conviene pedir ayuda profesional, cinco ideas de pausa basadas en la guía de la OMS, materiales gratuitos de la OMS y clases de yoga de la Ciudad (la página no informa su costo).",
      Content: Section3,
    },
    {
      id: "section-4",
      title: "Consumos y acompañamiento",
      summary:
        "Líneas de orientación por consumos, los centros y hospitales de la Red de adicciones de la Ciudad, y grupos de apoyo mutuo (Alcohólicos Anónimos, Al-Anon, Alateen). Los grupos no son atención profesional.",
      Content: Section4,
    },
    {
      id: "section-5",
      title: "Otras provincias",
      summary:
        "Líneas de escucha y lugares de atención de salud mental fuera de la Ciudad de Buenos Aires que se confirmaron en páginas oficiales (Buenos Aires, Córdoba, Entre Ríos, Jujuy, La Rioja, Neuquén, Tucumán, Corrientes, Santa Fe, Mendoza y Formosa). No es todo el país: que una provincia no figure no significa que no tenga servicios.",
      Content: Section5,
    },
  ],
  /** It opens straight on the first section: no banner first */
  defaultSectionId: "section-1",
}
