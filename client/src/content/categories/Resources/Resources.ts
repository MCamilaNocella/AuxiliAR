import { BookOpen } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { ResourcesScene } from "./ResourcesScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"
import { Section3 } from "./sections/Section3"
import { Section4 } from "./sections/Section4"

export const RESOURCES: Category = {
  id: "recursos",
  title: "Más recursos",
  description: "Derechos, leyes, FAQ, y trámites",
  icon: BookOpen,
  to: PATHS.resources,
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: ResourcesScene,
  /**
   * Sidebar sections, in the order they are listed; each one's content lives in ./sections. Version 1: it reuses the texts of the
   * other categories as shared modules (one copy each) and leaves out what is still in legal review (Ley 27.610).
   */
  sections: [
    {
      id: "section-1",
      title: "Tus derechos en salud",
      summary:
        "Qué derechos reconocen las leyes al atenderte, en palabras simples: la Ley 153 (Ley Básica de Salud de la Ciudad), la Ley Nacional de Salud Mental 26.657 y la Ley 27.491 de vacunación, entre otras. No es asesoramiento legal.",
      Content: Section1,
    },
    {
      id: "section-2",
      title: "Trámites",
      summary:
        "Qué necesitás para los trámites de salud más comunes: empadronarte y sacar turno en un CeSAC de la Ciudad (por el 147 o en persona), cómo tramitar el CUD (Certificado Único de Discapacidad) y los servicios de salud que pasan por tu barrio. AuxiliAR no saca turnos ni pide datos personales.",
      Content: Section2,
    },
    {
      id: "section-3",
      title: "Preguntas frecuentes",
      summary:
        "Respuestas cortas a dudas frecuentes: si hace falta orden médica para vacunarse, si hay que anotarse antes de sacar turno en un CeSAC, si te atienden en la Ciudad sin vivir ahí, si los anticonceptivos se pagan, qué significa «Gratuita» en el mapa y más.",
      Content: Section3,
    },
    {
      id: "section-4",
      title: "Glosario",
      summary:
        "Palabras de salud explicadas con lo que dicen las fuentes oficiales: CeSAC, empadronamiento, atención primaria, consentimiento informado, Calendario Nacional de Vacunación, ESI, anticoncepción de emergencia, zoonosis, prestación y otras.",
      Content: Section4,
    },
  ],
}
