import type { Source } from "@/components/health/SourceList"

/**
 * Calendario Nacional de Vacunación 2026, by stage of life. Every line is taken from the page of that stage of the
 * Ministerio de Salud de la Nación (argentina.gob.ar/salud/vacunas, Creative Commons Atribución 4.0), read on
 * 2026-10-09; the text of each page is saved in docs/investigacion/evidencia/calendario-vacunacion-2026-por-etapas.txt.
 * Nothing here is added or reworded in a way that changes a dose, an age or a condition: when the Ministerio changes
 * the calendar, compare again and change CHECKED_AT.
 */
export const CHECKED_AT = "2026-10-09"

export type VaccineGroup = {
  /** "A los 2 meses": when (omitted if the whole stage is one moment) */
  when?: string
  /** "Neumococo conjugada" / "primera dosis" */
  items: { vaccine: string, dose: string }[]
}

export type VaccinationStage = {
  id: string
  /** Short name of the button */
  title: string
  /** The Ministerio's own sentence about the stage */
  intro: string
  groups: VaccineGroup[]
  /** Conditions the Ministerio states for the stage (who, where, what to bring) */
  notes?: string[]
  source: Source
}

const stage = (slug: string, label: string): Source => ({
  label: `Calendario Nacional de Vacunación · ${label} · Ministerio de Salud de la Nación`,
  url: `https://www.argentina.gob.ar/salud/vacunas/${slug}`,
})

export const CALENDAR_SOURCE: Source = {
  label: "Calendario Nacional de Vacunación · Ministerio de Salud de la Nación",
  url: "https://www.argentina.gob.ar/salud/vacunas",
}

/** The poster of the Calendario 2026 (10/3/2026): it has notes the stage pages do not (age limits, birth cohorts, health staff, schemes to complete) */
export const CALENDAR_PDF: Source = {
  label: "Calendario Nacional de Vacunación 2026 (PDF, 10/3/2026) · Ministerio de Salud de la Nación",
  url: "https://www.argentina.gob.ar/sites/default/files/2026-03-10_calendario_nacional_vacunacion_70x50_web.pdf",
}

export const VACCINATION_STAGES: VaccinationStage[] = [
  {
    id: "embarazo",
    title: "Embarazo",
    intro:
      "La vacunación durante el embarazo protege a la persona embarazada y también al futuro recién nacido, gracias al paso de anticuerpos maternos por la placenta.",
    groups: [
      {
        items: [
          { vaccine: "Antigripal", dose: "una dosis en cualquier trimestre de la gestación." },
          { vaccine: "Triple bacteriana acelular", dose: "una dosis en cada embarazo, a partir de la semana 20 de gestación." },
          { vaccine: "Virus Sincicial Respiratorio (VSR)", dose: "una dosis en cada embarazo, entre las semanas 32 y 36,6 de gestación." },
        ],
      },
    ],
    notes: ["Después del parto (puerperio): si no se recibió la antigripal en el embarazo, se aplica una dosis dentro de los 10 días posteriores al parto."],
    source: stage("embarazadas", "Embarazo"),
  },
  {
    id: "recien-nacidos",
    title: "Recién nacidos",
    intro: "La aplicación de vacunas desde edades tempranas protege a quienes son más susceptibles a contraer enfermedades infecciosas potencialmente graves.",
    groups: [
      {
        items: [
          { vaccine: "Tuberculosis (BCG)", dose: "única dosis, antes de egresar de la maternidad." },
          { vaccine: "Hepatitis B", dose: "una dosis neonatal, dentro de las primeras 12 horas de vida." },
        ],
      },
    ],
    source: stage("recien-nacidos", "Recién nacidos"),
  },
  {
    id: "hasta-un-ano",
    title: "Hasta un año",
    intro: "La mayoría de las vacunas se aplican durante el primer año de vida. En esta etapa se inician varios esquemas de vacunación.",
    groups: [
      {
        when: "A los 2 meses",
        items: [
          { vaccine: "Neumococo conjugada", dose: "primera dosis." },
          { vaccine: "Poliomielitis", dose: "primera dosis (IPV o Salk)." },
          { vaccine: "Quíntuple (o pentavalente)", dose: "primera dosis." },
          { vaccine: "Rotavirus", dose: "primera dosis." },
        ],
      },
      { when: "A los 3 meses", items: [{ vaccine: "Meningococo", dose: "primera dosis." }] },
      {
        when: "A los 4 meses",
        items: [
          { vaccine: "Neumococo conjugada", dose: "segunda dosis." },
          { vaccine: "Poliomielitis", dose: "segunda dosis (IPV o Salk)." },
          { vaccine: "Quíntuple (o pentavalente)", dose: "segunda dosis." },
          { vaccine: "Rotavirus", dose: "segunda dosis." },
        ],
      },
      { when: "A los 5 meses", items: [{ vaccine: "Meningococo", dose: "segunda dosis." }] },
      {
        when: "A los 6 meses",
        items: [
          { vaccine: "Poliomielitis", dose: "tercera dosis (IPV o Salk)." },
          { vaccine: "Quíntuple (o pentavalente)", dose: "tercera dosis." },
        ],
      },
      {
        when: "Entre los 6 y los 24 meses",
        items: [{ vaccine: "Antigripal", dose: "dos dosis, con un intervalo mínimo de 4 semanas entre la primera y la segunda." }],
      },
      {
        when: "A los 12 meses",
        items: [
          { vaccine: "Neumococo conjugada", dose: "refuerzo de dosis." },
          { vaccine: "Hepatitis A", dose: "única dosis." },
          { vaccine: "Triple viral", dose: "primera dosis." },
        ],
      },
    ],
    notes: ["Las personas menores de 24 meses que ya hubieran recibido dos dosis de vacuna antigripal anteriormente deben recibir una dosis."],
    source: stage("vacunacion-lactantes", "Hasta un año"),
  },
  {
    id: "hasta-2-anios",
    title: "Hasta 2 años",
    intro: "Vacunas que se aplican a partir del año de edad y hasta los dos años.",
    groups: [
      {
        when: "Entre los 6 y 24 meses",
        items: [{ vaccine: "Antigripal", dose: "dos dosis, con un intervalo mínimo de 4 semanas entre la primera y la segunda." }],
      },
      {
        when: "A los 15 meses",
        items: [
          { vaccine: "Meningococo", dose: "refuerzo." },
          { vaccine: "Varicela", dose: "primera dosis." },
        ],
      },
      {
        when: "Entre los 15 y los 18 meses",
        items: [
          { vaccine: "Triple viral", dose: "segunda dosis." },
          { vaccine: "Quíntuple (o pentavalente)", dose: "refuerzo de dosis." },
        ],
      },
      { when: "A los 18 meses", items: [{ vaccine: "Fiebre amarilla", dose: "primera dosis, solo para quienes residan en zonas de riesgo." }] },
    ],
    notes: ["Las personas menores de 24 meses que ya hubieran recibido dos dosis de vacuna antigripal anteriormente deben recibir solo una dosis."],
    source: stage("vacunacion-niniosyninias", "Hasta 2 años"),
  },
  {
    id: "5-anios",
    title: "5 años",
    intro: "En el año que cumplen 5 años deben recibir estas vacunas.",
    groups: [
      {
        items: [
          { vaccine: "IPV", dose: "para prevenir la poliomielitis." },
          { vaccine: "Triple viral SRP", dose: "para prevenir el sarampión, la rubéola y las paperas." },
          { vaccine: "Triple bacteriana celular", dose: "para prevenir la difteria, el tétanos y la coqueluche." },
          { vaccine: "Varicela", dose: "para prevenir la varicela." },
        ],
      },
    ],
    notes: [
      "Las vacunas del Calendario Nacional se aplican de forma gratuita en centros de salud y hospitales públicos de todo el país a quienes nacieron en 2021, aunque aún no hayan cumplido los 5 años.",
      "Control de salud: al menos una vez por año, aunque la persona no esté enferma. Debe incluir una visita a oftalmología y odontología.",
    ],
    source: stage("ingresoescolar", "5 años"),
  },
  {
    id: "11-anios",
    title: "11 años",
    intro: "En el año que cumplen 11 años deben reforzar la protección de las vacunas de la infancia y comenzar a prevenir enfermedades propias de la edad.",
    groups: [
      {
        items: [
          { vaccine: "VPH (Virus del Papiloma Humano)", dose: "una única dosis." },
          { vaccine: "Meningococo", dose: "una única dosis." },
          { vaccine: "Triple bacteriana acelular", dose: "una única dosis." },
          { vaccine: "Fiebre amarilla", dose: "refuerzo para quienes residan en zonas de riesgo." },
        ],
      },
    ],
    notes: [
      "Las vacunas del Calendario Nacional se aplican de forma gratuita en centros de salud y hospitales públicos de todo el país a quienes nacieron en 2015, aunque aún no hayan cumplido los 11 años.",
      "Control de salud: al menos una vez por año, aunque la persona no esté enferma.",
    ],
    source: stage("vacunacion-adolescentes", "11 años"),
  },
  {
    id: "15-a-64",
    title: "15 a 64 años",
    intro: "La vacunación en esta etapa sirve para recibir refuerzos de vacunas ya aplicadas, protegerse contra otras enfermedades y completar esquemas.",
    groups: [
      {
        items: [
          { vaccine: "Doble bacteriana", dose: "iniciar o completar el esquema de 3 dosis y luego una dosis de refuerzo cada 10 años." },
          {
            vaccine: "Doble o triple viral",
            dose: "toda persona a partir de los 5 años debe acreditar 2 dosis de vacuna con componente contra sarampión y rubéola aplicadas después del año de vida. Las personas nacidas antes de 1965 se consideran inmunes por haber estado expuestas a ambos virus.",
          },
          {
            vaccine: "Antigripal",
            dose: "dosis anual para quienes presenten alguno de estos factores de riesgo: obesidad, diabetes, enfermedades respiratorias crónicas, enfermedades cardíacas crónicas, inmunodeficiencias congénitas o adquiridas, enfermedad oncohematológica, trasplante de órgano sólido o de médula ósea y/o insuficiencia renal crónica en diálisis, entre otros. Se presenta orden médica o cualquier documentación que certifique la enfermedad preexistente.",
          },
          {
            vaccine: "Fiebre Hemorrágica Argentina",
            dose: "a partir de los 15 años, para personas que residan o trabajen en la zona endémica (ciertas jurisdicciones de Buenos Aires, Córdoba, Santa Fe y La Pampa).",
          },
        ],
      },
    ],
    source: stage("vacunacion-adultos", "15 a 64 años"),
  },
  {
    id: "65-o-mas",
    title: "65 años o más",
    intro:
      "Las personas adultas de 65 años o más deben continuar con los refuerzos de vacunas ya aplicadas, completar esquemas y protegerse contra la gripe y el neumococo, principales causas de complicaciones en esta etapa de la vida.",
    groups: [
      {
        items: [
          { vaccine: "Antigripal", dose: "una dosis anual." },
          { vaccine: "Neumococo", dose: "el esquema es de una dosis de VCN20." },
          { vaccine: "Doble bacteriana", dose: "iniciar o completar el esquema de 3 dosis y luego una dosis de refuerzo cada 10 años." },
        ],
      },
    ],
    source: stage("vacunacion-adultosmayores", "65 años o más"),
  },
]
