import { HeartHandshake } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { SexEducationScene } from "./SexEducationScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"
import { Section3 } from "./sections/Section3"

export const SEX_EDUCATION: Category = {
  id: "esi",
  title: "Salud sexual y ESI",
  description: "Anticoncepción, derechos y acceso a atención",
  subtitle: "Dónde pedir orientación, métodos y pruebas, y tus derechos, con fuentes oficiales",
  icon: HeartHandshake,
  to: PATHS.topic("esi"),
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: SexEducationScene,
  /** Sidebar sections, in the order they are listed; each one's content lives in ./sections */
  sections: [
    {
      id: "section-1",
      title: "Dónde buscar atención",
      summary:
        "Dónde pedir orientación y atención en salud sexual y reproductiva: consultar en un centro de salud u hospital, la línea nacional de salud sexual del Ministerio de Salud, cómo explorar centros en el mapa, y la diferencia entre información gratuita, orientación y atención gratuita confirmada. AuxiliAR no otorga turnos ni realiza consultas médicas.",
      Content: Section1,
    },
    {
      id: "section-2",
      title: "Anticoncepción y prevención",
      summary:
        "Métodos anticonceptivos que nombra el Ministerio de Salud de la Nación, el preservativo como único método que también previene infecciones de transmisión sexual, y qué informa el Gobierno de la Ciudad sobre el test de VIH y sífilis y los preservativos.",
      Content: Section2,
    },
    {
      id: "section-3",
      title: "Derechos y ESI",
      summary:
        "Derechos sexuales y reproductivos según las leyes nacionales 25.673, 26.150 y 27.610, qué es la Educación Sexual Integral (ESI) y dónde leer materiales oficiales de ESI.",
      Content: Section3,
    },
  ],
  /** It opens straight on the first section: no banner first */
  defaultSectionId: "section-1",
}
