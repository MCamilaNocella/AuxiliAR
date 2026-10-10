import { GraduationCap, HandHeart, Stethoscope } from "lucide-react"
import { centersLink } from "@/router/centersLink"
import type { Subsection } from "../../SubsectionPage"

/**
 * Salud general · Alimentación y nutrición. Informative first version: general orientation in three separate things (food education,
 * professional guidance and food assistance), with no place, program or number of any region. Written from the general public
 * information of the sources listed below, without a link until each one is checked.
 * PENDING professional (clinical and nutritional) validation and documental validation of the sources before it is published.
 */
export const FOOD_NUTRITION: Subsection = {
  notice:
    "Este contenido resume orientaciones generales de fuentes oficiales. Todavía no fue revisado por profesionales de la salud ni se verificaron los enlaces oficiales. No es asesoramiento médico ni nutricional: para tu caso, consultá con tu equipo de salud.",
  intro: "Alimentarse bien, recibir orientación de un profesional y conseguir alimentos son tres cosas distintas. Acá las separamos para que sepas a cuál recurrir.",
  blocks: [
    {
      id: "education",
      icon: GraduationCap,
      title: "Educación alimentaria",
      lead: "Información general para elegir, cocinar y guardar mejor los alimentos todos los días.",
      points: [
        "Tomar agua segura a lo largo del día.",
        "Comer variado, con frutas y verduras de distintos tipos.",
        "Cocinar en casa cuando se puede y limitar los productos ultraprocesados, la sal y el azúcar.",
        "Leer las etiquetas: los sellos negros de advertencia avisan que un producto tiene exceso de azúcares, sodio, grasas o calorías.",
      ],
      note: "Es información general para la población: no reemplaza una indicación para tu caso.",
    },
    {
      id: "professional",
      icon: Stethoscope,
      title: "Orientación profesional",
      lead: "Para dudas sobre tu alimentación en particular, conviene hablar con alguien del equipo de salud.",
      points: [
        "Si tenés una enfermedad o tomás medicación, estás embarazada o dando de mamar.",
        "Si querés cambiar tu peso, tenés alergias o intolerancias, o dudas sobre la alimentación de un bebé o de un niño o niña.",
        "Podés consultar en tu centro de salud y preguntar si hay atención por nutrición.",
      ],
      note: "Antes de ir, confirmá si hay atención por nutrición, cómo se pide el turno y en qué horarios: todavía no lo tenemos verificado en el mapa.",
      action: { label: "Encontrar atención primaria", to: centersLink({ filter: "medical" }) },
    },
    {
      id: "assistance",
      icon: HandHeart,
      title: "Asistencia alimentaria",
      lead: "Si te cuesta conseguir alimentos, existen programas del Estado para eso. No son atención de salud: se piden en las áreas de desarrollo o atención social.",
      points: [
        "Según dónde vivas, pueden ser comedores, entrega de alimentos o ayudas para comprar comida.",
        "Los requisitos, los cupos y cómo se pide cambian en cada municipio o provincia.",
        "Podés preguntar en el área de atención o desarrollo social de tu municipio, o del gobierno de tu ciudad o provincia.",
        "Todavía no hay comedores ni programas alimentarios verificados en el mapa.",
      ],
      note: "Si una persona, sobre todo un bebé o un niño o niña pequeño, deja de comer o está muy decaída, consultá en un centro de salud o en una guardia.",
    },
  ],
  mapFilter: "nutrition-food",
  mapTopic: "alimentación y nutrición",
  sources: [
    { organization: "Ministerio de Salud de la Nación", title: "Guías Alimentarias para la Población Argentina" },
    { organization: "Boletín Oficial de la República Argentina", title: "Ley 27.642 de Promoción de la Alimentación Saludable" },
  ],
}
