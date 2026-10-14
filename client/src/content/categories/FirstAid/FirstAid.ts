import { Activity, Bandage, BriefcaseMedical, Droplet, Flame, FlaskConical, HeartPulse, PersonStanding, Wind } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { FirstAidScene } from "./FirstAidScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"
import { Section3 } from "./sections/Section3"
import { Section4 } from "./sections/Section4"
import { Section5 } from "./sections/Section5"
import { Section6 } from "./sections/Section6"
import { Section7 } from "./sections/Section7"
import { Section8 } from "./sections/Section8"

export const FIRST_AID: Category = {
  id: "primeros-auxilios",
  title: "Primeros auxilios",
  description: "Guías paso a paso para actuar en emergencias",
  icon: Bandage,
  to: PATHS.firstAid,
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: FirstAidScene,
  /** Sidebar sections, as in the chosen model (diseñoCategorias/primeros-auxilios-1-renglones-con-resumen); their content is in FirstAid.model.ts */
  sections: [
    {
      id: "section-1",
      title: "RCP",
      icon: HeartPulse,
      lead: "Si una persona no responde y no respira, o jadea, cada minuto cuenta: pedí ayuda y empezá con la RCP.",
      summary: "Cómo hacer RCP (reanimación cardiopulmonar) en adultos, niños y bebés, cómo usar un DEA (desfibrilador) y la posición de seguridad, y qué decir cuando llamás a emergencias.",
      Content: Section1,
    },
    {
      id: "section-2",
      title: "Ahogos",
      icon: Wind,
      lead: "Cuando algo tapa la garganta, o la persona estuvo bajo el agua, el aire no llega a los pulmones. Hay que actuar rápido.",
      summary: "Qué hacer ante un atragantamiento (adultos, chicos, bebés y si estás solo) y si una persona estuvo bajo el agua (ahogamiento).",
      Content: Section2,
    },
    {
      id: "section-3",
      title: "Malestares",
      icon: Activity,
      lead: "Algunos malestares aparecen de golpe. Reconocer las señales a tiempo es lo que más ayuda.",
      summary: "Cómo reconocer y qué hacer ante un infarto, un ACV (accidente cerebrovascular), una convulsión o un desmayo.",
      Content: Section3,
    },
    {
      id: "section-4",
      title: "Heridas",
      icon: Droplet,
      lead: "Desde un corte en la cocina hasta un sangrado fuerte. También qué hacer si sangra la nariz o entra algo en un ojo.",
      summary: "Qué hacer ante un sangrado fuerte, cortes y raspones, sangrado de nariz o algo en el ojo, el oído o la nariz.",
      Content: Section4,
    },
    {
      id: "section-5",
      title: "Quemaduras",
      icon: Flame,
      lead: "Quemaduras con agua caliente o fuego, descargas eléctricas y golpes de calor.",
      summary: "Qué hacer ante quemaduras, electrocución y golpe de calor, y cómo prevenirlos.",
      Content: Section5,
    },
    {
      id: "section-6",
      title: "Golpes",
      icon: PersonStanding,
      lead: "Después de un golpe fuerte puede haber lesiones que no se ven. La regla general: no mover a la persona.",
      summary: "Qué hacer después de golpes y caídas (incluido un golpe en la cabeza), ante posibles fracturas y en accidentes de tránsito.",
      Content: Section6,
    },
    {
      id: "section-7",
      title: "Intoxicaciones",
      icon: FlaskConical,
      lead: "Cuando algo que se tragó, respiró o tocó le hace mal, cuando tiene una reacción alérgica o la picó o mordió un animal.",
      summary: "Qué hacer ante intoxicaciones (tragada, respirada, en la piel o en el ojo; Centro Nacional de Intoxicaciones 0800-333-0160), reacciones alérgicas y picaduras o mordeduras de perro, gato, alacrán o víbora.",
      Content: Section7,
    },
    {
      id: "section-8",
      title: "Botiquín",
      icon: BriefcaseMedical,
      lead: "Lo necesario para curar una herida y cuidarte mientras ayudás. Conviene tener uno en casa, en el trabajo, en el auto y cuando hacés deporte.",
      summary: "Qué tener en el botiquín de primeros auxilios, con una lista para tildar lo que ya tenés, y dónde y cómo guardarlo.",
      Content: Section8,
    },
  ],
}
