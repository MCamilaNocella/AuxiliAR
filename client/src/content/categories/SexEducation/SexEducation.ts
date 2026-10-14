import { BookOpen, HandHeart, HeartHandshake, List, MapPin, Scale, ShieldCheck } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { SexEducationScene } from "./SexEducationScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"
import { Section3 } from "./sections/Section3"
import { Section4 } from "./sections/Section4"
import { Section5 } from "./sections/Section5"
import { Section6 } from "./sections/Section6"

export const SEX_EDUCATION: Category = {
  id: "esi",
  title: "Salud sexual y ESI",
  description: "Anticonceptivos, prevención y derechos sexuales",
  icon: HeartHandshake,
  to: PATHS.topic("esi"),
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: SexEducationScene,
  /** Sidebar sections, as in the chosen model (diseñoCategorias/esi-1-renglones-con-resumen); their content is in SexEducation.model.ts */
  sections: [
    {
      id: "section-1",
      title: "¿Qué es la ESI?",
      icon: BookOpen,
      lead: "La ESI (educación sexual integral) es un derecho de todas las personas que estudian. Qué es, qué abarca y cuáles son sus ejes.",
      summary: "Qué es la educación sexual integral (Ley 26.150): sus aspectos biológicos, psicológicos, sociales, afectivos y éticos, los 5 ejes del Programa Nacional de ESI, para quién es (todas las escuelas, del nivel inicial al superior) y qué busca.",
      Content: Section1,
    },
    {
      id: "section-2",
      title: "Orientación y ayuda",
      icon: MapPin,
      lead: "Para pedir orientación, un método anticonceptivo o un test, podés ir a un centro de salud u hospital público o llamar a la línea nacional. Es confidencial.",
      summary: "Dónde pedir orientación en salud sexual: la línea nacional 0800-222-3444, un mapa con los centros de salud de la Ciudad con consejería, anticonceptivos o preservativos, lo que ofrecen otras provincias y la Fundación Huésped.",
      Content: Section2,
    },
    {
      id: "section-3",
      title: "Métodos anticonceptivos",
      icon: List,
      lead: "Qué métodos hay, cómo se usa cada uno y cómo conseguirlos, según el Ministerio de Salud de la Nación. Cuál conviene lo definís con un equipo de salud.",
      summary: "Los métodos anticonceptivos gratuitos, cómo conseguirlos, cómo funciona cada uno (pastillas, inyectables, implante, DIU, ligadura, vasectomía) y la anticoncepción hormonal de emergencia («pastilla del día después»).",
      Content: Section3,
    },
    {
      id: "section-4",
      title: "Prevención y test de ITS",
      icon: ShieldCheck,
      lead: "El preservativo es el único método que además ayuda a prevenir el VIH (virus de inmunodeficiencia humana) y otras infecciones de transmisión sexual (ITS). Los test de VIH y sífilis son gratis y confidenciales.",
      summary: "Cómo usar el preservativo peneano y el vaginal, el test de VIH y sífilis gratis y confidencial con los centros de testeo de la Ciudad, y qué hacer si el preservativo se rompió (profilaxis post exposición dentro de las 72 horas).",
      Content: Section4,
    },
    {
      id: "section-5",
      title: "Interrupción del embarazo",
      icon: HandHeart,
      lead: "La Ley 27.610 garantiza en todo el país el acceso a la interrupción voluntaria del embarazo (IVE) y a la atención posaborto, de forma gratuita y confidencial.",
      Content: Section5,
    },
    {
      id: "section-6",
      title: "Derechos y recursos",
      icon: Scale,
      lead: "Tus derechos en salud sexual y reproductiva, y el derecho a la educación sexual integral, según las leyes nacionales.",
      summary: "Tus derechos en salud sexual y reproductiva según las leyes 25.673, 26.150 y 27.610, y materiales oficiales de ESI para estudiantes, docentes y familias.",
      Content: Section6,
    },
  ],
}
