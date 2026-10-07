import { CHECKED_AT, MANUAL } from "../sources"
import type { FirstAidGuideContent } from "../types"

/** "Prepararte también ayuda" */
export const PREPARE_GUIDES: FirstAidGuideContent[] = [
  {
    slug: "botiquin",
    title: "Botiquín de primeros auxilios",
    group: "prepare",
    summary: "Tener a mano lo necesario para ayudar y protegerte cuando hay una lesión. Conviene tener uno en la casa, en el trabajo, en los vehículos y cuando hacés deporte.",
    stepsTitle: "Cómo tenerlo listo",
    stepSets: [
      {
        steps: [
          "Ubicá el botiquín en un lugar al que se pueda llegar fácil.",
          "Revisá cada tanto que los elementos estén en buen estado.",
          "Podés sumar los medicamentos que usás habitualmente y que te recetó tu médico o médica.",
        ],
      },
    ],
    checklists: [
      {
        title: "Botiquín básico",
        items: [
          { name: "Guantes descartables de látex", use: "para no contaminar las heridas y para tu seguridad" },
          { name: "Gasas y vendas limpias", use: "para limpiar heridas y frenar hemorragias" },
          { name: "Antiséptico (iodopovidona, agua oxigenada o alcohol)", use: "para prevenir infecciones" },
          { name: "Tijera", use: "para cortar gasas, vendas o la ropa de la víctima" },
          { name: "Cinta adhesiva", use: "para fijar gasas o vendajes" },
          { name: "Jabón neutro (blanco)", use: "para higienizar heridas" },
        ],
      },
      {
        title: "Para completarlo",
        items: [
          { name: "Apósitos estériles", use: "para limpiar y cubrir heridas abiertas" },
          { name: "Vendas de 7 y 10 cm de ancho" },
          { name: "Apósitos protectores autoadhesivos" },
          { name: "Agua oxigenada de 10 volúmenes", use: "para desinfectar heridas y lavar por arrastre" },
          { name: "Tijera y alfileres de gancho" },
          { name: "Férulas (inflables, de cartón o de madera)", use: "para inmovilizar" },
          { name: "Colirio sin antibiótico", use: "para los ojos" },
          { name: "Alcohol en gel y líquido", use: "para lavarte las manos y limpiar" },
        ],
      },
    ],
    related: ["heridas", "hemorragia-grave", "fracturas"],
    sources: [MANUAL],
    checkedAt: CHECKED_AT,
  },
]
