import type { Source } from "@/components/health/SourceList"
import { FIRST_AID_GUIDE_CONTENT } from "../../firstAid"
import { CABA, CHECKED_AT as ANIMALS_CHECKED_AT, CHECKED_AT_PASTEUR, CONFIRMED_BY_SOURCE, NOT_CONFIRMED, PASTEUR_INFO, PASTEUR_SERVICIOS, RABIA, UBA_HOSPITAL, UNLP_HOSPITAL, ZOONOSIS } from "../Animals/Animals.sources"
import { CHECKED_AT as MENTAL_CHECKED_AT, LEY_26657, LEY_SIMPLE, OMS_ESTRES, ORIENTACION } from "../MentalHealth/MentalHealth.sources"
import { CALENDAR_PDF, CALENDAR_SOURCE, CHECKED_AT as CALENDAR_CHECKED_AT, VACCINATION_STAGES } from "../PhysicalHealth/sections/Section5/Section5.constants"
import { FOOD_NUTRITION } from "../PhysicalHealth/sections/Section6/Section6.constants"
import { PHYSICAL_ACTIVITY } from "../PhysicalHealth/sections/Section7/Section7.constants"
import { FAQ_REFERENCES } from "../Resources/sections/Section3/Section3.references"
import { GLOSSARY_REFERENCES } from "../Resources/sections/Section4/Section4.references"
import { CHECKED_AT as RESOURCES_CHECKED_AT, CHECKED_AT_GUIDES, CUD_PAGINA, LEY_153, LEY_27491, MAS_SERVICIOS_PAGINA, TURNOS_CESAC, VACUNAS_PAGINA } from "../Resources/Resources.sources"
import {
  CABA_CONSEJERIAS,
  CABA_COORDINACION,
  CABA_METODOS,
  CABA_TEST,
  CHECKED_AT as SEXUAL_CHECKED_AT,
  CHECKED_AT_IVE,
  CHECKED_AT_METHODS,
  ESI_CHACO,
  ESI_MATERIALES,
  ESI_PBA,
  HUESPED_DONDE,
  IVE_PAGINA,
  LEY_25673,
  LEY_26150,
  LEY_27610,
  LINEA,
  PBA_SSR,
  PORTAL,
  PREGUNTAS,
  PRESERVATIVO_VAGINAL,
  PRESERVATIVOS,
  SANTA_FE_IVE,
  TUCUMAN_ANTICONCEPCION,
} from "../SexEducation/SexEducation.sources"
import { READ_ON as COVERAGE_READ_ON } from "../SexEducation/SexEducation.coverage"
import { METHODS } from "../SexEducation/sections/Section2/Section2.constants"

/**
 * "Sobre AuxiliAR" · Fuentes y referencias. EVERY source and documentary reference of AuxiliAR is listed here, by topic, and nowhere
 * else in the pages (the pages keep only the links that take a person to a service, a procedure, a resource or a video). It
 * imports the modules where each source is defined: there is one copy of every source, and a page that adds one adds it here.
 */
export type Reference = {
  label: string
  /** Missing for a source that is named but not linked yet (its address has not been checked) */
  url?: string
  /** What it backs, or what is pending */
  detail?: string
}

export type ReferenceBlock = {
  id: string
  /** The page or section the references belong to */
  title: string
  references: Reference[]
  /** Day(s) the text was compared with these sources, YYYY-MM-DD */
  checkedAt?: string[]
  /** What the sources are, or what the page is not: said once, here */
  notes?: string[]
}

export type ReferenceGroup = {
  id: string
  title: string
  blocks: ReferenceBlock[]
}

const fromSources = (sources: Source[]): Reference[] => sources.filter((source, index) => sources.findIndex(({ url }) => url === source.url) === index).map(({ label, url }) => ({ label, url }))

/** The guides of Primeros auxilios share their sources: each one is listed once with the guides it backs, and every day of comparison */
const firstAidBlock = (): ReferenceBlock => {
  const bySource = new Map<string, { reference: Reference, guides: string[] }>()
  for (const guide of FIRST_AID_GUIDE_CONTENT) {
    for (const { label, url } of guide.sources) {
      const entry = bySource.get(url) ?? { reference: { label, url }, guides: [] }
      entry.guides.push(guide.title)
      bySource.set(url, entry)
    }
  }
  return {
    id: "first-aid-guides",
    title: "Guías de primeros auxilios",
    references: [...bySource.values()].map(({ reference, guides }) => ({ ...reference, detail: `Respalda: ${guides.join("; ")}.` })),
    checkedAt: [...new Set(FIRST_AID_GUIDE_CONTENT.map(({ checkedAt }) => checkedAt))].sort(),
    notes: ["Cada guía dice solo lo que dicen las fuentes oficiales y es una ayuda inicial: no reemplaza la atención de un equipo de salud ni la capacitación en primeros auxilios."],
  }
}

export const REFERENCE_GROUPS: ReferenceGroup[] = [
  {
    id: "salud-general",
    title: "Salud general",
    blocks: [
      {
        id: "calendario",
        title: "Calendario de vacunación",
        references: fromSources([CALENDAR_SOURCE, CALENDAR_PDF]),
        checkedAt: [CALENDAR_CHECKED_AT],
        notes: ["Contenido del Ministerio de Salud de la Nación (licencia Creative Commons Atribución 4.0), resumido y reorganizado por AuxiliAR. Es un resumen informativo: no reemplaza la consulta con un equipo de salud."],
      },
      ...VACCINATION_STAGES.map(({ id, title, sources }) => ({
        id: `calendario-${id}`,
        title: `Calendario de vacunación · ${title}`,
        references: fromSources(sources.filter(({ url }) => url !== CALENDAR_SOURCE.url && url !== CALENDAR_PDF.url)),
        checkedAt: [CALENDAR_CHECKED_AT],
      })),
      {
        id: "alimentacion",
        title: "Alimentación y nutrición",
        references: FOOD_NUTRITION.sources.map(({ organization, title }) => ({ label: `${organization}: ${title}`, detail: "Fuente a validar: todavía sin enlace, hasta comprobar que es el oficial y está vigente." })),
        notes: ["Pendiente de validación profesional y documental."],
      },
      {
        id: "actividad-fisica",
        title: "Actividad física y bienestar",
        references: PHYSICAL_ACTIVITY.sources.map(({ organization, title }) => ({ label: `${organization}: ${title}`, detail: "Fuente a validar: todavía sin enlace, hasta comprobar que es el oficial y está vigente." })),
        notes: ["Pendiente de validación profesional y documental."],
      },
    ],
  },
  {
    id: "salud-mental",
    title: "Salud mental",
    blocks: [
      { id: "mental-donde", title: "Dónde buscar ayuda", references: fromSources([ORIENTACION, LEY_SIMPLE, LEY_26657]), checkedAt: [MENTAL_CHECKED_AT] },
      {
        id: "mental-derechos",
        title: "Conocé tus derechos",
        references: fromSources([LEY_26657, LEY_SIMPLE]),
        checkedAt: [MENTAL_CHECKED_AT],
        notes: ["Es una explicación simple de la ley: no reemplaza el asesoramiento de un equipo de salud ni el de un abogado."],
      },
      {
        id: "mental-autocuidado",
        title: "Herramientas de autocuidado",
        references: fromSources([OMS_ESTRES]),
        checkedAt: [MENTAL_CHECKED_AT],
        notes: ["Es una guía general de bienestar: no es un tratamiento ni un diagnóstico."],
      },
    ],
  },
  {
    id: "salud-sexual",
    title: "Salud sexual y ESI",
    blocks: [
      {
        id: "sexual-donde",
        title: "Dónde buscar atención",
        references: fromSources([PREGUNTAS, LINEA]),
        checkedAt: [SEXUAL_CHECKED_AT],
        notes: ["Las páginas de «Más recursos» son de otras organizaciones: AuxiliAR no responde por su contenido."],
      },
      {
        id: "sexual-cobertura",
        title: "Otras provincias, organización civil y materiales de ESI",
        references: [PBA_SSR, SANTA_FE_IVE, TUCUMAN_ANTICONCEPCION, HUESPED_DONDE, ESI_PBA, ESI_CHACO].map(({ label, by, url }) => ({ label, url, detail: by })),
        checkedAt: [COVERAGE_READ_ON],
        notes: [
          "Las fichas de «Dónde buscar atención» y de «Derechos y ESI» se resumieron con estas páginas, leídas con una herramienta de lectura automática: nadie del equipo las comparó todavía con la página. AuxiliAR no verificó estos servicios.",
          "Los resúmenes sobre interrupción del embarazo están pendientes de validación legal y profesional.",
        ],
      },
      {
        id: "sexual-anticoncepcion",
        title: "Anticoncepción y prevención",
        references: fromSources([PRESERVATIVO_VAGINAL, PRESERVATIVOS, ...METHODS.map(({ source }) => source), PREGUNTAS, CABA_METODOS, CABA_CONSEJERIAS, CABA_TEST, CABA_COORDINACION]),
        checkedAt: [CHECKED_AT_METHODS],
        notes: ["Textos del Ministerio de Salud de la Nación (licencia Creative Commons Atribución 4.0) y del Gobierno de la Ciudad (Reconocimiento 2.5 Argentina), resumidos por AuxiliAR. Es información general: no es un diagnóstico ni indicaciones de tratamiento."],
      },
      {
        id: "sexual-derechos",
        title: "Derechos y educación sexual integral",
        references: fromSources([LEY_25673, LEY_26150, LEY_27610, PORTAL, ESI_MATERIALES]),
        checkedAt: [SEXUAL_CHECKED_AT],
        notes: ["Es información general: no es asesoramiento legal ni médico."],
      },
      {
        id: "sexual-ive",
        title: "Interrupción voluntaria y legal del embarazo (IVE/ILE)",
        references: fromSources([LEY_27610, IVE_PAGINA, CABA_CONSEJERIAS, LINEA]),
        checkedAt: [CHECKED_AT_IVE],
        notes: ["Contenido de argentina.gob.ar (licencia Creative Commons Atribución 4.0), resumido por AuxiliAR.", "Pendiente de validación legal y profesional: no es asesoramiento legal ni médico."],
      },
    ],
  },
  {
    id: "salud-animal",
    title: "Salud animal",
    blocks: [
      {
        id: "animales-campanas",
        title: "Vacunación y castración gratuitas",
        references: [{ label: CABA.by, url: CABA.url }, ...[...CONFIRMED_BY_SOURCE.slice(1), ...NOT_CONFIRMED].map(({ by, url }) => ({ label: by, url })), { label: ZOONOSIS.label, url: ZOONOSIS.url }],
        checkedAt: [ANIMALS_CHECKED_AT],
        notes: ["Cada página es de un organismo oficial: AuxiliAR no responde por cambios posteriores."],
      },
      {
        id: "animales-rabia",
        title: "Rabia y cuidados preventivos",
        references: fromSources([RABIA, ZOONOSIS]),
        checkedAt: [ANIMALS_CHECKED_AT],
        notes: ["Es información general: no es una indicación veterinaria ni médica."],
      },
      {
        id: "animales-atencion",
        title: "Cómo buscar atención veterinaria gratuita",
        references: fromSources([ZOONOSIS, UBA_HOSPITAL, UNLP_HOSPITAL]),
        checkedAt: [ANIMALS_CHECKED_AT],
        notes: ["Es orientación general: AuxiliAR no atiende animales ni recomienda un veterinario en particular."],
      },
      {
        id: "animales-pasteur",
        title: "Si muere tu perro o gato",
        references: fromSources([PASTEUR_INFO, PASTEUR_SERVICIOS]),
        checkedAt: [CHECKED_AT_PASTEUR],
        notes: ["Las páginas no traen fecha de publicación: confirmá con el Instituto antes de ir."],
      },
    ],
  },
  {
    id: "primeros-auxilios",
    title: "Primeros auxilios",
    blocks: [firstAidBlock()],
  },
  {
    id: "mas-recursos",
    title: "Más recursos",
    blocks: [
      { id: "recursos-ley-153", title: "Tus derechos en salud · Ciudad de Buenos Aires", references: fromSources([LEY_153]), checkedAt: [RESOURCES_CHECKED_AT], notes: ["Es una ley de la Ciudad de Buenos Aires."] },
      { id: "recursos-salud-mental", title: "Tus derechos en salud · Salud mental", references: fromSources([LEY_26657, LEY_SIMPLE]), checkedAt: [MENTAL_CHECKED_AT] },
      { id: "recursos-salud-sexual", title: "Tus derechos en salud · Salud sexual", references: fromSources([LEY_25673, LEY_26150]), checkedAt: [SEXUAL_CHECKED_AT] },
      { id: "recursos-vacunas", title: "Tus derechos en salud · Vacunación", references: fromSources([LEY_27491]), checkedAt: [RESOURCES_CHECKED_AT] },
      { id: "tramite-cesac", title: "Trámites · Cómo pedir turno en un CeSAC", references: fromSources([TURNOS_CESAC]), checkedAt: [RESOURCES_CHECKED_AT] },
      { id: "tramite-vacunas", title: "Trámites · Vacunarte", references: fromSources([VACUNAS_PAGINA]), checkedAt: [RESOURCES_CHECKED_AT] },
      {
        id: "tramite-cud",
        title: "Trámites · Cómo tramitar el CUD",
        references: fromSources([CUD_PAGINA]),
        checkedAt: [CHECKED_AT_GUIDES],
        notes: ["Pendiente de revisión legal y administrativa."],
      },
      {
        id: "tramite-barrio",
        title: "Trámites · Servicios y trámites en tu barrio",
        references: fromSources([MAS_SERVICIOS_PAGINA]),
        checkedAt: [CHECKED_AT_GUIDES],
        notes: ["La página no muestra fecha de actualización.", "Pendiente de revisión legal y administrativa."],
      },
      {
        id: "faq",
        title: "Preguntas frecuentes",
        references: FAQ_REFERENCES.map(({ question, source }) => ({ label: source, detail: `Respalda: ${question}` })),
      },
      {
        id: "glosario",
        title: "Glosario",
        references: GLOSSARY_REFERENCES.map(({ term, source }) => ({ label: source, detail: `Respalda: ${term}` })),
      },
    ],
  },
]
