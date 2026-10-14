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
