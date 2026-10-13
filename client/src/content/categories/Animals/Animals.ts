import { PawPrint } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { Category } from "@/types/category"
import { AnimalsScene } from "./AnimalsScene"
import { Section1 } from "./sections/Section1"
import { Section2 } from "./sections/Section2"
import { Section3 } from "./sections/Section3"

export const ANIMALS: Category = {
  id: "animales",
  title: "Atención veterinaria",
  description: "Prevención, chequeos, castración gratuita y más",
  icon: PawPrint,
  to: PATHS.topic("animales"),
  /** Illustration for the banner (desktop) and the wallpaper (mobile) */
  scene: AnimalsScene,
  /** Sidebar sections, in the order they are listed; each one's content lives in ./sections */
  sections: [
    {
      id: "section-1",
      title: "Vacunación y castración",
      summary:
        "Dónde castrar y vacunar contra la rabia a perros y gatos, según la página oficial de cada lugar: Ciudad de Buenos Aires (centros fijos, móviles e Instituto Pasteur), Rosario, Córdoba, Salta, Neuquén y operativos de Protenencia. Para cada uno: para quién es, costo y condiciones, dónde, cómo pedir el turno y contacto, y el cronograma de la Ciudad, separados en gratuitos y costo no confirmado. Una campaña gratuita no es atención veterinaria gratuita. AuxiliAR no otorga turnos ni atiende animales.",
      Content: Section1,
    },
    {
      id: "section-2",
      title: "Cuidado y prevención",
      summary:
        "Información general del Ministerio de Salud de la Nación y de Senasa: vacunar cada año a perros y gatos contra la rabia desde los 3 meses de edad, qué es una zoonosis y acudir a un centro de salud si un animal muerde o araña.",
      Content: Section2,
    },
    {
      id: "section-3",
      title: "Recursos importantes",
      summary:
        "Consulta veterinaria y urgencias según las páginas oficiales: el consultorio del Instituto Pasteur (sin guardia ni urgencias), el hospital y los puestos de Rosario (sin costo para quienes están adscritos al sistema municipal), el hospital de Salta y su apartado «Guardia y urgencias» (sin horario propio) y los hospitales universitarios de la UBA y la UNLP, que son arancelados. Separados en gratuitos, costo no confirmado y arancelados. No hay guardias gratuitas confirmadas. Incluye la cremación gratuita de perros y gatos del Instituto Pasteur (Ciudad de Buenos Aires), con lo que su página no dice, y un aviso sobre la vacuna antitetánica si un animal te mordió o te arañó.",
      Content: Section3,
    },
  ],
}
