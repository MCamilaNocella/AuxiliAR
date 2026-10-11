import type { Source } from "@/components/health/SourceList"

/**
 * Calendario Nacional de Vacunación 2026, by stage of life: the eight stages of the Ministerio de Salud de la Nación.
 * What is here is what the official documents state explicitly (the pages by stage and by vaccine, the 2026 poster, the antigripal and VSR technical guidelines
 * and the Resolución 339/2026), read on 2026-10-09.
 *
 * What is NOT here on purpose: every statement the review found contradictory between official sources or backed by a single source. Where a condition cannot be said safely
 * without choosing between sources, the stage carries ONE short note (`toConfirm`) that sends to the official source or the
 * vacunatorio. Nothing here is a clinical approval: it is an informative summary.
 */
export const CHECKED_AT = "2026-10-09"

/**
 * Shown on top of every stage in the presentation version (branch demo/presentation-2026-10-14): the calendar is content in
 * development, not yet validated by health professionals. To publish it, remove this notice only after a professional review.
 */
export const DEVELOPMENT_NOTICE = {
  title: "En desarrollo · pendiente de validación profesional",
  text: "Este calendario es contenido en desarrollo: todavía no fue revisado ni validado por profesionales de la salud. No es una herramienta clínica ni una indicación médica. Para saber qué vacunas te corresponden, confirmalo con tu equipo de salud o en el vacunatorio.",
}

/** The text every stage shares: what this page is and is not */
export const GENERAL_NOTE =
  "AuxiliAR ofrece un resumen informativo del Calendario Nacional de Vacunación oficial. Los esquemas particulares (por ejemplo, si tenés enfermedades previas, estás embarazada o trabajás en el sistema de salud) deben confirmarse con tu equipo de salud o en el vacunatorio. Si el Ministerio de Salud cambia el calendario, vale su versión oficial."

export const TO_CONFIRM_INTRO = "Estos puntos no se pueden resumir de forma segura: las fuentes oficiales los expresan de forma distinta o necesitan una indicación profesional. Confirmalos antes de vacunarte."

/** One thing to confirm: which aspect it is (the topic) and what the person should confirm, and where */
export type ConfirmNote = { topic: string, what: string }

export type VaccineItem = {
  vaccine: string
  dose: string
  /** Conditions and exceptions of this vaccine, one short sentence each */
  details?: string[]
}

export type VaccineGroup = {
  /** "A los 2 meses", "Si trabajás en el sistema de salud"… */
  heading?: string
  /**
   * How the group is shown on small screens, so a long stage reads in blocks (the text is the same, all of it is in the page):
   *  - "open": inside a disclosure that starts open
   *  - "collapsible": inside a disclosure that starts closed
   *  - "split": the heading stays and each vaccine of the group gets its own disclosure
   * Without it, the group is shown as plain text.
   */
  display?: "open" | "collapsible" | "split"
  paragraphs?: string[]
  items?: VaccineItem[]
}

export type VaccinationStage = {
  id: string
  title: string
  /** One or two sentences about the stage */
  intro?: string
  groups: VaccineGroup[]
  /** Short sentences at the end of the stage */
  notes?: string[]
  /** What the official sources say in different ways, or that needs a professional: ONE list per stage, each with the topic and what to confirm */
  toConfirm?: ConfirmNote[]
  sources: Source[]
}

const page = (slug: string, label: string): Source => ({ label: `${label} · Ministerio de Salud de la Nación`, url: `https://www.argentina.gob.ar/salud/vacunas/${slug}` })

export const CALENDAR_SOURCE: Source = {
  label: "Calendario Nacional de Vacunación · Ministerio de Salud de la Nación",
  url: "https://www.argentina.gob.ar/salud/vacunas",
}

/** The technical repository of the Ministerio: every vaccine has its own document, with its own date; the current one of each is the one to follow (no old manual as the only source) */
export const LINEAMIENTOS_REPOSITORIO: Source = {
  label: "Recomendaciones, manuales y lineamientos · Dirección de Control de Enfermedades Inmunoprevenibles, Ministerio de Salud de la Nación",
  url: "https://www.argentina.gob.ar/salud/inmunoprevenibles/recomendaciones-manuales-y-lineamientos",
}

/** The day the triple viral scheme (first dose, second dose by birth cohort) was compared again with its page and the technical guideline of January 2026 */
export const CHECKED_AT_TRIPLE_VIRAL = "2026-10-11"

/** The poster of the Calendario 2026 (10/3/2026), with notes by vaccine */
export const CALENDAR_PDF: Source = {
  label: "Calendario Nacional de Vacunación 2026 (PDF, 10/3/2026) · Ministerio de Salud de la Nación",
  url: "https://www.argentina.gob.ar/sites/default/files/2026-03-10_calendario_nacional_vacunacion_70x50_web.pdf",
}

const GRIPE_LT: Source = {
  label: "Lineamientos técnicos de vacunación antigripal 2026 · Ministerio de Salud de la Nación",
  url: "https://www.argentina.gob.ar/sites/default/files/2018/02/lineamientos_vacuna_antigripal_-_2026.pdf",
}
const GRIPE_PAGE = page("antigripal", "Vacuna antigripal")
const VSR_PAGE = page("virus-sincicial-respiratorio-vsr", "Virus Sincicial Respiratorio (VSR)")
const VSR_LT: Source = { label: "Lineamientos técnicos de VSR en personas gestantes · Ministerio de Salud de la Nación", url: "https://www.argentina.gob.ar/sites/default/files/lineamientos-vsr.pdf" }
const VIRAL_PAGE = page("doble-triple-viral", "Doble y triple viral")
const VIRAL_LT: Source = {
  label: "Lineamientos técnicos de la vacuna triple viral: adelantamiento de la segunda dosis · Ministerio de Salud de la Nación",
  url: "https://www.argentina.gob.ar/sites/default/files/2018/02/lineamientos-tv-200125.pdf",
}
const RES_339: Source = { label: "Resolución 339/2026 (calendario, triple viral) · Ministerio de Salud", url: "https://www.argentina.gob.ar/normativa/nacional/norma-423397/texto" }
const HEPB_PAGE = page("hepatitisb", "Hepatitis B")
const ROTA_PAGE = page("rotavirus", "Rotavirus")
const FA_PAGE: Source = { label: "Vacuna contra la fiebre amarilla · Ministerio de Salud de la Nación", url: "https://www.argentina.gob.ar/salud/fiebreamarilla/vacuna" }
const VPH_PAGE = page("vph", "VPH")
const NEUMO_PAGE = page("neumococo", "Neumococo")
const DTPA_PAGE = page("triplebacterianaacelular", "Triple bacteriana acelular")
const FHA_PAGE = page("fiebre-hemorragica", "Fiebre hemorrágica argentina")
const MENINGO_PAGE = page("novedadmeningococo", "Meningococo")

/** Where the stage pages of the Ministerio are: the stage itself is always a source */
const stage = (slug: string, label: string): Source => ({
  label: `Calendario Nacional de Vacunación · ${label} · Ministerio de Salud de la Nación`,
  url: `https://www.argentina.gob.ar/salud/vacunas/${slug}`,
})

export const VACCINATION_STAGES: VaccinationStage[] = [
  {
    id: "embarazo",
    title: "Embarazo",
    intro: "Las vacunas durante el embarazo protegen a la persona embarazada y también al bebé, gracias al paso de anticuerpos por la placenta.",
    groups: [
      {
        heading: "Vacunas de cada embarazo",
        items: [
          { vaccine: "Antigripal", dose: "una dosis, en cualquier trimestre del embarazo." },
          { vaccine: "Triple bacteriana acelular (dTpa)", dose: "una dosis, a partir de la semana 20 de embarazo, sin importar las dosis recibidas antes." },
          {
            vaccine: "Virus Sincicial Respiratorio (VSR)",
            dose: "una dosis, entre la semana 32 y la semana 36,6 del embarazo.",
            details: [
              "Es una estrategia estacional: se aplica durante la temporada de circulación del virus.",
              "El Ministerio de Salud informa cada año cuándo empieza y cuándo termina la temporada de vacunación. Consultá en tu centro de salud o vacunatorio si ya comenzó.",
            ],
          },
        ],
      },
      {
        heading: "Vacunas que no se aplican durante el embarazo",
        paragraphs: ["La triple viral y la varicela son vacunas de virus vivos atenuados y están contraindicadas durante el embarazo."],
      },
      {
        heading: "Después del parto",
        paragraphs: ["Si no recibiste la vacuna antigripal durante el embarazo, el Ministerio indica que puede aplicarse después del parto, con un máximo de 10 días."],
      },
    ],
    toConfirm: [
      { topic: "Antigripal después del parto", what: "Confirmá si la dosis debe aplicarse antes de que te den el alta de la maternidad: las fuentes oficiales lo expresan de formas distintas." },
      { topic: "Otras vacunas durante el embarazo o después del parto", what: "El afiche oficial menciona otras vacunas para este período (por ejemplo, hepatitis B o triple viral). Preguntá en el vacunatorio si te corresponden." },
    ],
    sources: [stage("embarazadas", "Embarazo"), GRIPE_LT, DTPA_PAGE, VSR_PAGE, VSR_LT, VIRAL_PAGE, page("varicela", "Varicela")],
  },
  {
    id: "recien-nacidos",
    title: "Recién nacidos",
    intro: "La aplicación de vacunas desde edades tempranas protege a quienes son más susceptibles a contraer enfermedades infecciosas potencialmente graves.",
    groups: [
      {
        items: [
          { vaccine: "Tuberculosis (BCG)", dose: "única dosis, antes de salir de la maternidad. Previene las formas graves de tuberculosis." },
          {
            vaccine: "Hepatitis B",
            dose: "una dosis neonatal, dentro de las primeras 12 horas de vida.",
            details: ["Si por cualquier motivo no la recibió en ese lapso, debe recibirla tan pronto como sea posible."],
          },
        ],
      },
    ],
    sources: [stage("recien-nacidos", "Recién nacidos"), HEPB_PAGE],
  },
  {
    id: "hasta-un-ano",
    title: "Hasta un año",
    intro: "La mayoría de las vacunas se aplican durante el primer año de vida. En esta etapa se inician varios esquemas de vacunación.",
    groups: [
      {
        heading: "A los 2 meses",
        items: [
          { vaccine: "Neumococo conjugada", dose: "primera dosis." },
          { vaccine: "Poliomielitis (IPV o Salk)", dose: "primera dosis." },
          { vaccine: "Quíntuple (o pentavalente)", dose: "primera dosis. También protege contra la hepatitis B." },
          { vaccine: "Rotavirus", dose: "primera dosis.", details: ["Límite de edad para esta dosis: 14 semanas y 6 días de vida."] },
        ],
      },
      { heading: "A los 3 meses", items: [{ vaccine: "Meningococo (vacuna tetravalente ACYW)", dose: "primera dosis." }] },
      {
        heading: "A los 4 meses",
        items: [
          { vaccine: "Neumococo conjugada", dose: "segunda dosis." },
          { vaccine: "Poliomielitis (IPV o Salk)", dose: "segunda dosis." },
          { vaccine: "Quíntuple (o pentavalente)", dose: "segunda dosis." },
          { vaccine: "Rotavirus", dose: "segunda dosis.", details: ["Límite de edad para la última dosis: 24 semanas de vida."] },
        ],
      },
      { heading: "A los 5 meses", items: [{ vaccine: "Meningococo (vacuna tetravalente ACYW)", dose: "segunda dosis." }] },
      {
        heading: "A los 6 meses",
        items: [
          { vaccine: "Poliomielitis (IPV o Salk)", dose: "tercera dosis." },
          { vaccine: "Quíntuple (o pentavalente)", dose: "tercera dosis." },
        ],
      },
      {
        heading: "Entre los 6 y los 24 meses",
        items: [
          {
            vaccine: "Antigripal",
            dose: "se aplica en cada campaña estacional.",
            details: [
              "Si todavía no recibió dos dosis de antigripal en campañas anteriores: dos dosis, con un mes de intervalo entre una y otra (como mínimo, 4 semanas).",
              "Si ya recibió al menos dos dosis en campañas anteriores: una sola dosis.",
            ],
          },
        ],
      },
      {
        heading: "A los 12 meses",
        items: [
          { vaccine: "Neumococo conjugada", dose: "refuerzo." },
          { vaccine: "Hepatitis A", dose: "única dosis." },
          { vaccine: "Triple viral", dose: "primera dosis." },
        ],
      },
    ],
    notes: ["Control de salud: al menos una vez por año, aunque no esté enfermo o enferma. Incluye una visita a oftalmología y a odontología."],
    toConfirm: [{ topic: "Neumococo", what: "Confirmá en el vacunatorio qué vacuna corresponde según el momento: la de 20 serotipos (VCN20) está reemplazando a la de 13 (VCN13)." }],
    sources: [stage("vacunacion-lactantes", "Hasta un año"), ROTA_PAGE, GRIPE_LT, MENINGO_PAGE, NEUMO_PAGE, HEPB_PAGE],
  },
  {
    id: "hasta-2-anios",
    title: "Hasta 2 años",
    intro: "Vacunas que se aplican a partir del año de edad y hasta los dos años.",
    groups: [
      {
        heading: "A los 15 meses",
        items: [
          { vaccine: "Meningococo (vacuna tetravalente ACYW)", dose: "refuerzo." },
          { vaccine: "Varicela", dose: "primera dosis." },
        ],
      },
      {
        heading: "Entre los 15 y los 18 meses",
        items: [
          { vaccine: "Triple viral", dose: "segunda dosis." },
          { vaccine: "Quíntuple (o pentavalente)", dose: "refuerzo." },
        ],
      },
      {
        heading: "A los 18 meses",
        items: [
          {
            vaccine: "Fiebre amarilla",
            dose: "primera dosis, solo para quienes viven en zonas de riesgo.",
            details: [
              "Zonas de riesgo según la página oficial de fiebre amarilla: Formosa, Misiones y Corrientes; Jujuy (departamentos de Ledesma, Santa Bárbara, San Pedro y Valle Grande); Salta (departamentos de General José de San Martín, Orán, Rivadavia y Anta); y Chaco (departamento de Bermejo).",
              "La vacuna tiene contraindicaciones y precauciones (por ejemplo, alergia a componentes de la vacuna, edad menor de 6 meses o problemas del sistema inmune). Consultá antes con tu equipo de salud.",
            ],
          },
        ],
      },
      {
        heading: "Entre los 6 y 24 meses",
        items: [{ vaccine: "Antigripal", dose: "sigue la indicación de la etapa anterior: se aplica en cada campaña estacional, con dos dosis si no recibió antes dos, o una si ya las recibió." }],
      },
      {
        heading: "Triple viral: cómo funciona en 2026",
        paragraphs: [
          "Desde el 1.° de enero de 2026, la segunda dosis de triple viral se aplica entre los 15 y los 18 meses a quienes nacieron desde el 1.° de julio de 2024.",
          "Quienes nacieron antes completan la segunda dosis a los 5 años (ver la etapa «5 años»). Si el esquema está incompleto, se completa.",
          "Las dosis «cero» o adicionales que se aplicaron por un brote, un bloqueo o la campaña de seguimiento 2022 no cuentan como parte del esquema regular.",
        ],
      },
    ],
    notes: [
      "Las vacunas de virus vivos atenuados (varicela, triple viral y fiebre amarilla) pueden aplicarse el mismo día. Si no se aplican el mismo día, debe haber al menos 28 días entre una y otra.",
    ],
    toConfirm: [
      {
        topic: "Fiebre amarilla: edad de la primera dosis",
        what: "El calendario programa la primera dosis a los 18 meses, y la página de fiebre amarilla dice «entre los 12 y los 18 meses» para menores de 2 años, con un refuerzo a los 11 años. Confirmá la edad en el vacunatorio.",
      },
      { topic: "Fiebre amarilla: zonas de riesgo", what: "Las zonas pueden cambiar. La lista vigente está en la página oficial de fiebre amarilla." },
    ],
    sources: [stage("vacunacion-niniosyninias", "Hasta 2 años"), RES_339, VIRAL_LT, VIRAL_PAGE, FA_PAGE, MENINGO_PAGE, GRIPE_LT],
  },
  {
    id: "5-anios",
    title: "5 años",
    intro: "En 2026, las vacunas del Calendario se aplican de forma gratuita en centros de salud y hospitales públicos a quienes nacieron en 2021, aunque aún no hayan cumplido los 5 años.",
    groups: [
      {
        items: [
          { vaccine: "Poliomielitis (IPV)", dose: "refuerzo." },
          { vaccine: "Triple bacteriana celular (DTP)", dose: "una dosis de refuerzo." },
          { vaccine: "Varicela", dose: "segunda dosis." },
          {
            vaccine: "Triple viral",
            dose: "segunda dosis, según la fecha de nacimiento:",
            details: [
              "Nacidos entre el 1.° de enero de 2021 y el 30 de junio de 2024: segunda dosis en el año en que cumplen 5 años. En 2026 les corresponde a los nacidos en 2021; los nacidos en 2022, 2023 y hasta el 30 de junio de 2024 la recibirán en el año en que cumplan 5 años.",
              "Nacidos desde el 1.° de julio de 2024: segunda dosis entre los 15 y los 18 meses (ver «Hasta 2 años»).",
              "Si el esquema está incompleto, se completa.",
            ],
          },
        ],
      },
    ],
    notes: ["Control de salud: al menos una vez por año, aunque no esté enfermo o enferma. Incluye una visita a oftalmología y a odontología."],
    sources: [stage("ingresoescolar", "5 años"), RES_339, VIRAL_LT, VIRAL_PAGE, page("polio", "Poliomielitis"), page("triplebacterianacelular", "Triple bacteriana celular"), page("varicela", "Varicela")],
  },
  {
    id: "11-anios",
    title: "11 años",
    intro: "En 2026, las vacunas del Calendario se aplican de forma gratuita en centros de salud y hospitales públicos a quienes nacieron en 2015, aunque aún no hayan cumplido los 11 años.",
    groups: [
      {
        items: [
          { vaccine: "Meningococo (vacuna tetravalente ACYW)", dose: "una única dosis." },
          { vaccine: "Triple bacteriana acelular (dTpa)", dose: "una única dosis." },
          { vaccine: "VPH (Virus del Papiloma Humano)", dose: "una única dosis, para varones y mujeres." },
          { vaccine: "Fiebre amarilla (refuerzo)", dose: "para quienes viven en zonas de riesgo y recibieron la primera dosis antes de los 2 años." },
          {
            vaccine: "Hepatitis B",
            dose: "si no tiene el esquema, se inicia a partir de los 11 años con 3 dosis.",
            details: ["La segunda dosis se aplica un mes después de la primera y la tercera, a los 6 meses de la primera."],
          },
        ],
      },
    ],
    notes: ["Control de salud: al menos una vez por año, aunque no esté enfermo o enferma."],
    toConfirm: [{ topic: "VPH si no lo recibiste a los 11 años", what: "Puede estar disponible hasta ciertas edades y con otros esquemas. Consultá la página oficial de VPH o el vacunatorio." }],
    sources: [stage("vacunacion-adolescentes", "11 años"), MENINGO_PAGE, DTPA_PAGE, VPH_PAGE, HEPB_PAGE, FA_PAGE],
  },
  {
    id: "15-a-64",
    title: "15 a 64 años",
    intro: "La vacunación en esta etapa sirve para recibir refuerzos de vacunas ya aplicadas, protegerse contra otras enfermedades y completar esquemas.",
    groups: [
      {
        heading: "Vacunas para todas las personas de esta edad",
        display: "open",
        items: [
          { vaccine: "Doble bacteriana (difteria y tétanos)", dose: "iniciar o completar el esquema de 3 dosis; después, un refuerzo cada 10 años." },
          {
            vaccine: "Doble o triple viral (sarampión y rubéola)",
            dose: "toda persona a partir de los 5 años debe acreditar 2 dosis de vacuna con componente contra sarampión y rubéola aplicadas después del año de vida, o contar con serología IgG positiva para ambos virus.",
            details: [
              "Las personas nacidas antes de 1965 no necesitan vacunarse.",
              "No se aplica en el embarazo ni en personas con inmunocompromiso, entre otras contraindicaciones.",
            ],
          },
          {
            vaccine: "Hepatitis B",
            dose: "es obligatoria y no requiere orden médica a cualquier edad. Quien no tiene el esquema lo inicia o completa con 3 dosis.",
            details: ["La segunda dosis se aplica un mes después de la primera y la tercera, a los 6 meses de la primera."],
          },
        ],
      },
      {
        heading: "Según tu situación",
        display: "split",
        items: [
          {
            vaccine: "Antigripal",
            dose: "se aplica en cada campaña estacional. Los lineamientos técnicos 2026 indican una dosis para las personas de 9 a 64 años.",
            details: [
              "Grupos incluidos en esta etapa: personal de salud; embarazadas, en cada embarazo; puérperas; personas con factores de riesgo; y personal estratégico (Fuerzas Armadas y Fuerzas de Seguridad).",
              "Factores de riesgo, en resumen: enfermedades respiratorias crónicas y asma moderada o grave; enfermedades cardíacas; inmunodeficiencias; enfermedad oncohematológica y trasplante; diabetes; insuficiencia renal crónica en diálisis; síndromes genéticos y enfermedades neuromusculares con compromiso respiratorio; convivientes de personas con enfermedad oncohematológica o de recién nacidos prematuros, entre otros.",
              "Las personas con factores de riesgo pueden presentar orden médica o documentación que acredite la condición.",
            ],
          },
          {
            vaccine: "Fiebre hemorrágica argentina",
            dose: "a partir de los 15 años, dosis única, para quienes viven o trabajan en la zona endémica (ciertas jurisdicciones de Buenos Aires, Córdoba, Santa Fe y La Pampa).",
          },
          {
            vaccine: "Fiebre amarilla",
            dose: "de 2 a 59 años, para quienes viven en zonas de riesgo y no recibieron dosis anteriores: dosis única.",
            details: ["Consultá antes las contraindicaciones con tu equipo de salud. Las zonas de riesgo están en la etapa «Hasta 2 años»."],
          },
        ],
      },
      {
        heading: "Si trabajás en el sistema de salud",
        display: "collapsible",
        paragraphs: ["Este apartado es para todas las personas que trabajan en el sistema de salud: mesa de entradas, limpieza, seguridad, laboratorio, planta médica y de enfermería, entre otras."],
        items: [
          { vaccine: "Antigripal", dose: "el personal de salud es uno de los grupos de la campaña. Se aplica en cada campaña estacional; los lineamientos técnicos 2026 indican una dosis." },
          {
            vaccine: "Triple bacteriana acelular (dTpa)",
            dose: "una dosis única, en reemplazo de uno de los refuerzos de doble bacteriana.",
            details: ["Quienes cuidan a menores de 12 meses reciben un refuerzo cada 5 años."],
          },
          { vaccine: "Doble o triple viral", dose: "hay que acreditar dos dosis aplicadas después del año de vida, o tener serología IgG positiva para sarampión y rubéola." },
          { vaccine: "Fiebre amarilla", dose: "es fundamental estar protegido si trabajás en zonas de riesgo." },
        ],
      },
    ],
    toConfirm: [
      {
        topic: "Antigripal con factores de riesgo",
        what: "Confirmá la lista completa y sus criterios exactos (por ejemplo, para obesidad o medicamentos inmunosupresores), si hace falta orden médica o solo se puede presentar documentación, y los tramos de edad, en los lineamientos oficiales de antigripal 2026 (están en «Fuentes oficiales») o en el vacunatorio.",
      },
      { topic: "Fiebre hemorrágica argentina", what: "El afiche oficial agrega condiciones (riesgo ocupacional y no haber recibido antes la vacuna). Confirmalas en el vacunatorio." },
      { topic: "Personal de salud", what: "Hay otras indicaciones y obligaciones (por ejemplo, hepatitis B, varicela y normas de la Ley 27.491). Consultalas en la fuente oficial o en el vacunatorio." },
      { topic: "Neumococo y VPH", what: "Hay indicaciones para personas de 5 a 64 años con ciertas condiciones (neumococo) y hasta los 26 años (VPH). Consultalas en la página oficial o en el vacunatorio." },
    ],
    sources: [stage("vacunacion-adultos", "15 a 64 años"), GRIPE_LT, GRIPE_PAGE, VIRAL_PAGE, HEPB_PAGE, DTPA_PAGE, FHA_PAGE, FA_PAGE, NEUMO_PAGE, VPH_PAGE],
  },
  {
    id: "65-o-mas",
    title: "65 años o más",
    intro:
      "Las personas adultas de 65 años o más deben continuar con los refuerzos de vacunas ya aplicadas, completar esquemas y protegerse contra la gripe y el neumococo, principales causas de complicaciones en esta etapa de la vida.",
    groups: [
      {
        items: [
          { vaccine: "Antigripal", dose: "se aplica en cada campaña estacional. Los lineamientos técnicos 2026 indican una dosis. No hace falta orden médica." },
          { vaccine: "Neumococo", dose: "el esquema es de una dosis de VCN20. No hace falta orden médica." },
          { vaccine: "Doble bacteriana (difteria y tétanos)", dose: "iniciar o completar el esquema de 3 dosis; después, un refuerzo cada 10 años." },
          { vaccine: "Doble o triple viral", dose: "las personas nacidas antes de 1965 no necesitan vacunarse." },
        ],
      },
      {
        heading: "Hepatitis B",
        paragraphs: ["La hepatitis B es obligatoria y no requiere orden médica a cualquier edad. Si no sabés si tenés el esquema, consultá en el vacunatorio."],
      },
    ],
    toConfirm: [
      { topic: "Neumococo si ya te vacunaste", what: "Si ya recibiste alguna vacuna contra el neumococo, el equipo de salud evalúa si corresponde continuar el esquema. Consultalo en el vacunatorio." },
      { topic: "Fiebre amarilla", what: "Si vivís en una zona de riesgo o vas a viajar a una zona con transmisión, consultá antes con tu equipo de salud." },
    ],
    sources: [stage("vacunacion-adultosmayores", "65 años o más"), GRIPE_LT, NEUMO_PAGE, HEPB_PAGE, VIRAL_PAGE, FA_PAGE],
  },
]

/**
 * The order the pages of the calendar are read in, from the youngest to the oldest (the person turns the page, there is no filter by age):
 * recién nacidos → hasta un año → hasta 2 años → 5 años → 11 años → 15 a 64 años → embarazo → 65 años o más. VACCINATION_STAGES keeps its own order
 * (the sources and the direct links of ?etapa= do not depend on it).
 */
export const STAGE_PAGE_ORDER = ["recien-nacidos", "hasta-un-ano", "hasta-2-anios", "5-anios", "11-anios", "15-a-64", "embarazo", "65-o-mas"]
