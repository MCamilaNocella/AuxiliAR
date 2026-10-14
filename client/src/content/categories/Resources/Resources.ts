import { BookOpen, CircleHelp, FileCheck, Scale } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { ResourcesScene } from "./ResourcesScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"
import { Section3 } from "./sections/Section3"

export const RESOURCES: Category = {
  id: "recursos",
  title: "Más recursos",
  description: "Derechos, trámites y dudas",
  icon: BookOpen,
  to: PATHS.resources,
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: ResourcesScene,
  /** Sidebar sections, as in the chosen model (diseñoCategorias/recursos-1-renglones-con-resumen); each one's content lives in ./sections */
  sections: [
    {
      id: "section-1",
      title: "Derechos",
      icon: Scale,
      lead: "Lo que dicen las leyes cuando te atendés, en palabras simples. No es asesoramiento legal.",
      summary:
        "Qué derechos te reconocen las leyes al atenderte, en simple: los del paciente en todo el país (Ley 26.529), que te atiendan aunque seas de otro país (Ley 25.871) o no vivas en la Ciudad (Ley 153), los de salud mental (Ley 26.657), vacunas y salud sexual, y dónde reclamar si tu obra social o prepaga no cumple (Superintendencia de Servicios de Salud). No es asesoramiento legal.",
      Content: Section1,
    },
    {
      id: "section-2",
      title: "Trámites",
      icon: FileCheck,
      lead: "Qué necesitás para los trámites de salud más comunes. AuxiliAR no saca turnos ni te pide datos.",
      summary:
        "Qué necesitás para los trámites de salud más comunes: empadronarte y sacar turno en un CeSAC de la Ciudad (por el 147 o en persona), pedir tu historia clínica, tramitar el CUD (Certificado Único de Discapacidad) y las próximas fechas de «Más servicios en tu barrio». AuxiliAR no saca turnos ni pide datos.",
      Content: Section2,
    },
    {
      id: "section-3",
      title: "Dudas",
      icon: CircleHelp,
      lead: "Respuestas cortas a dudas comunes, y las palabras que vas a ver en AuxiliAR.",
      summary:
        "Respuestas cortas a dudas frecuentes: si te pueden negar la atención, si te atienden sin DNI o sin vivir en la Ciudad, si hace falta orden médica para vacunarse, si los anticonceptivos se pagan, dónde reclamar a la obra social o prepaga y qué significa «Gratuita» en el mapa. Y un glosario con buscador: CeSAC, empadronamiento, CUD, consentimiento informado, historia clínica y más.",
      Content: Section3,
    },
  ],
}
