import { CHECKED_AT, DOBLE_BACTERIANA, MANUAL, NORMAS_VACUNACION_1997, RABIA_MORDEDURAS, VACUNACION_ADULTOS } from "../sources"
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
  {
    slug: "vacuna-antitetanica",
    title: "Vacuna antitetánica (tétanos)",
    group: "prepare",
    summary: "La vacuna doble bacteriana protege contra el tétanos y la difteria. Tenerla al día es parte de estar preparado ante cortes y lesiones.",
    stepsTitle: "Cómo tenerla al día",
    stepSets: [
      {
        steps: [
          "La vacuna doble bacteriana protege contra la difteria y el tétanos. Según el Ministerio de Salud, es de indicación universal: para todas las edades.",
          "En las personas adultas, el Calendario Nacional indica iniciar o completar el esquema de 3 dosis y, después, un refuerzo cada 10 años.",
          "Llevá tu carnet de vacunas al vacunatorio o al centro de salud para que lo revisen y te digan qué dosis te faltan.",
          "Según el Ministerio, las vacunas del Calendario Nacional están disponibles de forma gratuita en los vacunatorios, centros de salud y hospitales públicos del país.",
        ],
      },
    ],
    whenToCall: [
      "Si te lastimás con una herida, un corte o una quemadura, consultá a un médico o una médica y mostrale tu carnet: según tus dosis y cuánto pasó desde la última, puede indicarte vacunarte o un refuerzo.",
      "Si no tenés el carnet o no sabés qué dosis recibiste, decilo en la consulta: es un dato que cambia lo que te indiquen.",
      "Si te mordió o te arañó un animal: lavá la herida con abundante agua y jabón, no pongas alcohol ni otro desinfectante y andá rápido al centro de salud más cercano, para que un profesional evalúe si hace falta una profilaxis antibiótica, antitetánica y/o antirrábica.",
    ],
    note: "Qué hacer después de una herida lo define un equipo de salud. La única norma nacional que encontramos con el detalle por tipo de herida es de 1997 (Resolución 141/97) y no pudimos confirmar si sigue vigente: según ese texto, con menos de 3 dosis o esquema desconocido hace falta vacunarse; con 3 o más dosis puede hacer falta un refuerzo si la última fue hace más de 10 años (herida limpia) o más de 5 años (otras heridas), y en algunos casos se agrega una inmunoglobulina. AuxiliAR no indica dosis ni tratamientos. Pendiente de revisión clínica.",
    related: ["heridas", "botiquin"],
    sources: [DOBLE_BACTERIANA, VACUNACION_ADULTOS, RABIA_MORDEDURAS, NORMAS_VACUNACION_1997],
    checkedAt: "2026-10-12",
    clinicalReview: { status: "pending", note: "Pendiente de revisión clínica: armada con páginas oficiales del Ministerio de Salud; el detalle por tipo de herida viene de una norma de 1997 cuya vigencia no se pudo confirmar." },
  },
]
