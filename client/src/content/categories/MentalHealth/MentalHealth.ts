import { Brain, Cloud, MapPin, PersonStanding, Scale, Sprout, Wind } from "lucide-react"
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
  description: "Herramientas de autocuidado, y orientación: cómo pedir ayuda",
  icon: Brain,
  to: PATHS.topic("salud-mental"),
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: MentalHealthScene,
  /** Sidebar sections, as in the chosen model (diseñoCategorias/salud-mental-6-renglones-compacto-y-lo-nuevo); their content is in MentalHealth.model.ts */
  sections: [
    {
      id: "section-1",
      title: "Dónde buscar ayuda",
      icon: MapPin,
      lead: "Si necesitás hablar con alguien ahora, llamá: es gratis. Si preferís ir a un lugar, buscá una guardia en el mapa.",
      summary:
        "Dónde pedir ayuda en salud mental: el 911 si hay peligro, la línea nacional de urgencias de salud mental 0800-999-0091 (24 h, gratis y confidencial), Salud Mental Responde de la Ciudad, la línea bonaerense, el 135 y el 0800-345-1435 de prevención del suicidio y el 141 por consumos; líneas de otras provincias; un mapa de guardias de salud mental 24 h y lugares con atención programada; y apoyo ante el consumo problemático (Línea 108 opción 3, la Red de adicciones de la Ciudad y grupos de apoyo mutuo). AuxiliAR no otorga turnos ni realiza consultas médicas.",
      Content: Section1,
    },
    {
      id: "section-2",
      title: "Respirá y conectá",
      icon: Wind,
      lead: "Cuando la ansiedad o el estrés suben, la respiración y los sentidos te ayudan a volver. Elegí un ejercicio y seguilo a tu ritmo.",
      summary:
        "Ejercicios guiados para la ansiedad y el estrés: respiración 4-7-8 (inhalar en 4, mantener en 7, soltar en 8) y respiración lenta (5 y 5, al menos 5 minutos), y «poner los pies en la tierra» paso a paso (notar, bajar el ritmo, mirar 5 cosas, escuchar 3, oler y tocar, volver), de la guía de la OMS.",
      Content: Section2,
    },
    {
      id: "section-3",
      title: "Relajación muscular",
      icon: PersonStanding,
      lead: "Tensás un grupo de músculos, lo soltás y notás la diferencia. Así, de a uno, hasta aflojar todo el cuerpo. Lleva unos 5 minutos.",
      summary:
        "Relajación muscular progresiva guiada con temporizador: tensar 5 segundos y soltar 15, en 12 partes del cuerpo de la cara a las piernas; lleva unos 5 minutos.",
      Content: Section3,
    },
    {
      id: "section-4",
      title: "Ejercicios de calma",
      icon: Cloud,
      lead: "Ejercicios cortos de la guía de la OMS para momentos de estrés. Se pueden hacer en cualquier lugar, en pocos minutos.",
      summary:
        "Cuatro ejercicios cortos de la guía de la OMS para momentos de estrés: notá y nombrá lo que te engancha, una taza con toda tu atención, hacer lugar como el cielo y hablarte con amabilidad.",
      Content: Section4,
    },
    {
      id: "section-5",
      title: "Hábitos antiestrés",
      icon: Sprout,
      lead: "Cosas simples que ayudan a bajar el estrés y a sentirte mejor, día a día.",
      summary:
        "Hábitos para bajar el estrés según la OMS (conectar con otras personas, moverse, ocupar la cabeza y las manos, dar a los demás, prestar atención al presente), rutinas que cuidan el bienestar (horarios, sueño, hablar, moverse, comer, límites a las noticias), clases de yoga y Estaciones Saludables de la Ciudad y de otras provincias, y cuándo pedir ayuda.",
      Content: Section5,
    },
    {
      id: "section-6",
      title: "Tus derechos",
      icon: Scale,
      lead: "La Ley Nacional de Salud Mental (26.657) reconoce estos derechos a las personas con padecimiento mental.",
      summary:
        "Qué derechos reconoce la Ley Nacional de Salud Mental 26.657: el mejor tratamiento, estar acompañado, acceder a la historia clínica, no ser discriminado, ser atendido en un hospital general y que la medicación nunca se use como castigo; y que rechazar la atención por un padecimiento mental es discriminación.",
      Content: Section6,
    },
  ],
}
