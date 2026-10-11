import { Eye, HeartPulse, ScanSearch, Smile, Syringe } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { Source } from "@/components/health/SourceList"

/**
 * Salud general · Controles de salud: every how-often a person is told by an official page, kept by control, for information only (the page has no
 * buttons: nothing here leads anywhere). Each frequency is what the official page says, in its own terms and with its own limits; what no official
 * page of the Nación says is written as such instead of filled in. Read on CONTROLS_READ_ON from the pages themselves (their text, not a summary);
 * the sources are in Sobre AuxiliAR. It is general information, never a diagnosis nor a personal indication: who needs which control, and how
 * often, is for each person's health team to say. PENDING review by a health professional before it is called validated.
 */
export const CONTROLS_READ_ON = "2026-10-11"

export type FrequencyBlock = {
  id: string
  title: string
  icon: LucideIcon
  /** What the official pages recommend, one line each */
  items: string[]
  /** Said plainly: what no official page of the Nación says, or leaves open */
  pending?: string[]
}

export const CONTROLS_NOTICE_TITLE = "Pendiente de revisión profesional"
export const CONTROLS_NOTICE_TEXT = "Este resumen se hizo con páginas oficiales y todavía no fue revisado por un equipo de salud. Es información general, no una indicación para tu caso."

export const FREQUENCY_BLOCKS: FrequencyBlock[] = [
  {
    id: "bucal",
    title: "Salud bucal",
    icon: Smile,
    items: [
      "Consulta odontológica: cada 6 meses, según la recomendación general del Ministerio de Salud de la Nación.",
      "Personas adultas (de 24 a 65 años) y mayores de 65: al menos 2 veces por año.",
      "Niños y niñas: desde los 3 años, al menos una vez por año.",
      "Embarazo: consultar apenas se confirma y luego cada 3 meses durante toda la gestación.",
      "Antes de la fecha prevista, si hay dolor al tomar o comer algo frío o caliente, sangrado de encías, aftas o úlceras que no cicatrizan a las 2 semanas, o dientes que se mueven o cambian de lugar. Ante dolor, no automedicarse.",
    ],
  },
  {
    id: "visual",
    title: "Salud visual",
    icon: Eye,
    items: [
      "Revisión de la salud ocular en distintos momentos de la vida: en recién nacidos, a los 3 años, antes de empezar la escuela primaria y a los 13 años.",
      "Después de los 40 años: una revisión por año.",
      "Diabetes: los controles con un oftalmólogo u oftalmóloga son más frecuentes que en el resto de las personas. La página no dice cada cuánto.",
      "Bebés prematuros: seguimiento oftalmológico.",
      "Ciudad de Buenos Aires (salud escolar): control visual al año de edad, o antes si hay un problema notorio, y visita al oftalmólogo una vez por año. En la escuela, se prioriza la revisión de chicos y chicas de 5 y 6 años.",
      "Si la visión se vuelve borrosa, consultar a un oftalmólogo.",
      "Un golpe en el ojo, la pérdida repentina de la vista o un dolor muy fuerte no esperan un control: necesitan atención urgente.",
    ],
  },
  {
    id: "corazon",
    title: "Corazón: presión arterial y azúcar en sangre",
    icon: HeartPulse,
    items: [
      "Presión arterial, de 18 a 40 años, sin factores de riesgo y con presión de 130/80 mmHg o menos: al menos cada 3 a 5 años.",
      "Presión arterial, a partir de los 40 años, o con factores de riesgo, o con valores de 130 a 139 de máxima y/o 80 a 89 de mínima: al menos una vez por año. Puede aumentar según el criterio médico.",
      "Para la guía nacional, conviene tomar la presión en cada contacto con el sistema de salud.",
      "Factores de riesgo que nombra la guía: la edad, el sobrepeso o la obesidad, el sedentarismo, mucha sal, el uso prolongado de corticoides o antiinflamatorios, tener familiares de primer grado con hipertensión, la enfermedad renal crónica y la diabetes.",
      "Azúcar en sangre (glucemia en ayunas): a todas las personas desde los 45 años, y antes si hay al menos un factor de riesgo. Si el resultado es normal, repetirla cada 3 años o más seguido según criterio médico.",
      "La hipertensión generalmente no da síntomas: solo se detecta midiéndola.",
      "Si ya tenés un diagnóstico o tomás medicación, no la cambies ni la dejes sin hablar con tu equipo de salud. Si de golpe te sentís muy mal, es una emergencia: no esperes.",
    ],
    pending: [
      "No encontramos una frecuencia oficial de la Nación para el colesterol ni para un electrocardiograma «de rutina» en personas sin síntomas. Los indica tu equipo de salud según tu riesgo.",
    ],
  },
  {
    id: "vacunas",
    title: "Vacunas",
    icon: Syringe,
    items: [
      "Calendario Nacional de Vacunación: cada etapa de la vida tiene sus vacunas. Cuáles y cuándo están en la sección «Calendario de vacunación» de este tema.",
      "Doble bacteriana (difteria y tétanos): después del esquema de 3 dosis, un refuerzo cada 10 años.",
      "Antigripal: se aplica en cada campaña estacional, es decir, todos los años. El Ministerio informa cada año cuándo empieza y cuándo termina.",
      "Las vacunas del Calendario no requieren una orden médica. Llevá tu carnet para que lo revisen.",
    ],
  },
  {
    id: "generales",
    title: "Chequeos generales",
    icon: ScanSearch,
    items: [
      "No hay un único «chequeo» igual para todas las personas: las recomendaciones oficiales son por control, según la edad y los factores de riesgo. Los controles que figuran en esta página son: presión arterial, azúcar en sangre, salud bucal, salud visual, vacunas y estos tres estudios de detección temprana.",
      "Cáncer de cuello de útero: Papanicolaou a partir de los 25 años, y cada 3 años luego de dos resultados negativos anuales seguidos. Donde hay test de VPH en el sistema público: a partir de los 30 años, y cada 5 años luego de un resultado negativo.",
      "Cáncer de mama: mujeres de 50 a 69 años sin síntomas ni antecedentes, una mamografía cada uno o dos años, junto con un examen de las mamas por un profesional. Si tenés menos de 50 o más de 69 años, consultá a tu equipo de salud.",
      "Cáncer colorrectal: personas de 50 a 75 años sin síntomas ni antecedentes, test de sangre oculta en materia fecal «de forma bianual» si el resultado es negativo.",
      "Estas recomendaciones son para personas sin síntomas y con riesgo promedio. Con síntomas, antecedentes personales o familiares, o situaciones particulares de salud, consultá al equipo de salud.",
    ],
    pending: [
      "No encontramos una página oficial de la Nación con un «chequeo anual» general para adultos sanos ni con una frecuencia de análisis de sangre de rutina. Qué estudios te corresponden y cada cuánto lo define tu equipo de salud.",
    ],
  },
]

/** The official pages the frequencies come from: they are listed in Sobre AuxiliAR, not in the page */
export const CONTROLS_SOURCES: (Source & { backs: string })[] = [
  { label: "Recomendaciones para tener una boca sana · Ministerio de Salud de la Nación", url: "https://www.argentina.gob.ar/salud/bucodental/boca-sana", backs: "Consulta odontológica cada 6 meses, aftas y signos para consultar antes" },
  { label: "Cuidados bucodentales para cada etapa de la vida · Ministerio de Salud de la Nación", url: "https://www.argentina.gob.ar/salud/bucodental/por-edades", backs: "Adultos y mayores de 65: al menos 2 veces por año; embarazo: cada 3 meses" },
  { label: "Control odontológico de 1 a 5 años · Crecer con salud, Ministerio de Salud de la Nación", url: "https://www.argentina.gob.ar/salud/crecerconsalud/unoacincoanios/cinco/controles/dientes", backs: "Niños desde los 3 años: al menos una vez por año" },
  { label: "Salud ocular · Ministerio de Salud de la Nación", url: "https://www.argentina.gob.ar/salud/glosario/salud-ocular", backs: "Momentos de revisión de la salud ocular, revisión anual después de los 40, diabetes y prematuros" },
  { label: "Salud visual · Salud escolar, Ministerio de Educación de la Ciudad de Buenos Aires", url: "https://buenosaires.gob.ar/educacion/familias/salud-escolar/salud-visual", backs: "Control visual al año de edad, visita anual al oftalmólogo, revisación a los 5 y 6 años" },
  { label: "Guía de Práctica Clínica Nacional sobre Hipertensión Arterial (actualizada 2024) · Ministerio de Salud de la Nación", url: "https://www.argentina.gob.ar/sites/default/files/salud-guia-practica-clinica-nacional-hta-2024.pdf", backs: "Frecuencia de la toma de presión arterial según edad, factores de riesgo y valores" },
  { label: "Diabetes mellitus · Ministerio de Salud de la Nación", url: "https://www.argentina.gob.ar/salud/glosario/diabetes", backs: "Glucemia en ayunas desde los 45 años o con un factor de riesgo, repetida cada 3 años si es normal" },
  { label: "Prevención y detección temprana del cáncer · Ministerio de Salud de la Nación", url: "https://www.argentina.gob.ar/salud/cancer/prevencion", backs: "Recomendaciones de tamizaje de cáncer de cuello de útero, de mama y colorrectal" },
]
