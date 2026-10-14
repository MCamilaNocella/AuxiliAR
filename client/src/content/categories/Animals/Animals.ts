import { HeartHandshake, PawPrint, Siren, Stethoscope, Syringe } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { AnimalsScene } from "./AnimalsScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"
import { Section3 } from "./sections/Section3"
import { Section4 } from "./sections/Section4"
import { Section5 } from "./sections/Section5"

export const ANIMALS: Category = {
  id: "animales",
  title: "Atención veterinaria",
  description: "Prevención, chequeos, castración gratuita y más",
  icon: PawPrint,
  to: PATHS.topic("animales"),
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: AnimalsScene,
  /** Sidebar sections, as in the chosen model (diseñoCategorias/animales-1-renglones-con-resumen); their content is in Animals.model.ts */
  sections: [
    {
      id: "section-1",
      title: "Bienestar y cuidados",
      icon: PawPrint,
      lead: "Lo que necesita tu perro o tu gato para estar bien: cómo pasearlo sin lastimarlo, los cuidados de todos los días y los controles de salud.",
      summary: "Cuidados de perros y gatos: cómo pasearlo sin lastimarlo (pechera, no collares de ahorque), adiestradores que trabajan desde lo positivo, los cuidados de todos los días y los controles veterinarios.",
      Content: Section1,
    },
    {
      id: "section-2",
      title: "Calendario de vacunación",
      icon: Syringe,
      lead: "Qué vacunas necesitan los perros y los gatos, y cuándo: las de cachorro y los refuerzos de cada año. El esquema exacto lo define tu veterinario.",
      summary: "El calendario de vacunas de perros y gatos: séxtuple, triple felina y antirrábica (la única obligatoria), las de cachorro y los refuerzos anuales.",
      Content: Section2,
    },
    {
      id: "section-3",
      title: "Dónde atenderlo",
      icon: Stethoscope,
      lead: "Dónde castrar, vacunar contra la rabia o hacer una consulta con tu perro o tu gato, y cómo pedir el turno en tu ciudad. AuxiliAR no otorga turnos ni atiende animales.",
      summary: "Dónde castrar gratis, vacunar contra la rabia o hacer una consulta veterinaria: un mapa por provincia y cómo pedir el turno en la Ciudad de Buenos Aires, Rosario, Córdoba, Neuquén, Salta y otras ciudades.",
      Content: Section3,
    },
    {
      id: "section-4",
      title: "Mordeduras y zoonosis",
      icon: Siren,
      lead: "Qué hacer si un animal te muerde o te araña, y cómo prevenir las enfermedades que pueden pasar de los animales a las personas, según el Ministerio de Salud de la Nación, el Instituto de Zoonosis Luis Pasteur, Senasa y el Gobierno de la Ciudad.",
      summary: "Qué hacer si un animal te muerde o te araña (rabia, antitetánica) y cómo prevenir las zoonosis: enfermedades que pasan de los animales a las personas.",
      Content: Section4,
    },
    {
      id: "section-5",
      title: "Más recursos",
      icon: HeartHandshake,
      lead: "Qué hacer si muere tu perro o tu gato y cómo denunciar el maltrato animal.",
      summary: "Qué hacer si muere tu perro o tu gato (cremación, el Instituto Pasteur) y cómo denunciar el maltrato animal.",
      Content: Section5,
    },
  ],
}
