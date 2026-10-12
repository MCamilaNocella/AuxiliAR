import type { Source } from "@/components/health/SourceList"
import { getCurrentPlaces, getCurrentServices, isMappable } from "@/data/resources"
import type { Resource } from "@/data/resources"
import { buildPlaceView, isVerifiedFree } from "@/utils/places"
import { FIRST_AID_GUIDE_CONTENT, isVideoShown } from "../../firstAid"
import { CABA, CORDOBA, NEUQUEN, PASTEUR, PROTENENCIA, READ_ON as ANIMAL_PLACES_READ_ON, ROSARIO, SALTA, UNIVERSITY_HOSPITALS } from "../Animals/Animals.places"
import { CHECKED_AT as ANIMALS_CHECKED_AT, CHECKED_AT_PASTEUR, PASTEUR_INFO, PASTEUR_SERVICIOS, RABIA, ZOONOSIS } from "../Animals/Animals.sources"
import { CHECKED_AT as MENTAL_CHECKED_AT, LEY_26657, LEY_SIMPLE, OMS_ESTRES, ORIENTACION } from "../MentalHealth/MentalHealth.sources"
import { CALENDAR_PDF, CALENDAR_SOURCE, CHECKED_AT as CALENDAR_CHECKED_AT, CHECKED_AT_TRIPLE_VIRAL, LINEAMIENTOS_REPOSITORIO, VACCINATION_STAGES } from "../PhysicalHealth/sections/Section5/Section5.constants"
import { FOOD_NUTRITION } from "../PhysicalHealth/sections/Section6/Section6.constants"
import { PHYSICAL_ACTIVITY } from "../PhysicalHealth/sections/Section7/Section7.constants"
import { FAQ_REFERENCES } from "../Resources/sections/Section3/Section3.references"
import { GLOSSARY_REFERENCES } from "../Resources/sections/Section4/Section4.references"
import { BARRIO_REDES, BARRIO_TURNO_ODONTOLOGIA, BARRIO_TURNO_OFTALMOLOGIA, CHECKED_AT as RESOURCES_CHECKED_AT, CHECKED_AT_AGENDA, CHECKED_AT_GUIDES, CUD_PAGINA, LEY_153, LEY_27491, MAS_SERVICIOS_PAGINA, TURNOS_CESAC, VACUNAS_PAGINA } from "../Resources/Resources.sources"
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
import { CONTROLS_READ_ON, CONTROLS_SOURCES } from "../PhysicalHealth/sections/Section2/Section2.constants"

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
  /** What the day is: the text compared with its sources (default), or an establishment verified by AuxiliAR */
  checkedKind?: "text" | "place"
  /** What the sources are, or what the page is not: said once, here */
  notes?: string[]
}

export type ReferenceGroup = {
  id: string
  title: string
  blocks: ReferenceBlock[]
}

const fromSources = (sources: Source[]): Reference[] => sources.filter((source, index) => sources.findIndex(({ url }) => url === source.url) === index).map(({ label, url }) => ({ label, url }))

/** The places of every province, read from their files (the map loads them on demand; here they are needed at once, in the page that lists the sources) */
const placeFiles = import.meta.glob<{ resources: Resource[] }>("../../../data/resources/places/*.json", { eager: true, import: "default" })
const MAP_PLACES: Resource[] = Object.values(placeFiles).flatMap((file) => file.resources)

/**
 * The establishments of the map: for each one the official sources of its services (each once, with what it backs), the day AuxiliAR verified it
 * and when it is reviewed again. It is what the place panel used to list under "Fuentes oficiales"; the panel now keeps the dates and a link here.
 * Built from the same data and the same view as the panel, so nothing is copied twice.
 */
const placeBlocks = (): ReferenceBlock[] =>
  getCurrentPlaces(undefined, MAP_PLACES)
    .filter(isMappable)
    // only the places the map shows: those with at least one service of documented gratuity
    .filter((place) => getCurrentServices(place).some((service) => isVerifiedFree(place, service)))
    .map((place) => {
      const services = getCurrentServices(place).filter((service) => isVerifiedFree(place, service))
      const view = buildPlaceView({ place, services })
      const references: Reference[] = view.sources.map(({ url, organization, backs }) => ({ label: organization, url, detail: backs.join(". ") }))
      if (place.source && !references.some(({ url }) => url === place.source?.url)) references.push({ label: place.source.organization, url: place.source.url })
      const notes = [place.verification.nextReviewDue ? `Se vuelve a revisar antes del ${place.verification.nextReviewDue.split("-").reverse().join("/")}.` : null].filter((note): note is string => note !== null)
      return { id: `centro-${place.id}`, title: place.name, references, checkedAt: place.verification.verifiedAt ? [place.verification.verifiedAt] : undefined, checkedKind: "place" as const, notes }
    })
    .filter(({ references }) => references.length > 0)

/** The guides of Primeros auxilios share their sources: each one is listed once with the guides it backs, and every day of comparison */
const firstAidBlock = (): ReferenceBlock => {
  const bySource = new Map<string, { reference: Reference, guides: string[] }>()
  for (const guide of FIRST_AID_GUIDE_CONTENT) {
    for (const { label, url } of guide.sources) {
      const entry = bySource.get(url) ?? { reference: { label, url }, guides: [] }
      entry.guides.push(guide.title)
      bySource.set(url, entry)
    }
    // an approved video of the guide is a reference too: who publishes it and where the original is
    if (isVideoShown(guide.video)) {
      const entry = bySource.get(guide.video.originalUrl) ?? { reference: { label: `${guide.video.publisher} · ${guide.video.title} (video)`, url: guide.video.originalUrl }, guides: [] }
      entry.guides.push(guide.title)
      bySource.set(guide.video.originalUrl, entry)
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
        id: "controles",
        title: "Controles de salud: cada cuánto",
        references: CONTROLS_SOURCES.map(({ label, url, backs }) => ({ label, url, detail: backs })),
        checkedAt: [CONTROLS_READ_ON],
        notes: ["Las frecuencias son las que dice cada página oficial, en sus propios términos: AuxiliAR no agregó ninguna. Es información general, no una indicación para cada persona.", "Pendiente de revisión profesional."],
      },
      {
        id: "calendario",
        title: "Calendario de vacunación",
        references: fromSources([CALENDAR_SOURCE, CALENDAR_PDF, LINEAMIENTOS_REPOSITORIO]),
        checkedAt: [CALENDAR_CHECKED_AT, CHECKED_AT_TRIPLE_VIRAL],
        notes: [
          "Contenido del Ministerio de Salud de la Nación (licencia Creative Commons Atribución 4.0), resumido y reorganizado por AuxiliAR. Es un resumen informativo: no reemplaza la consulta con un equipo de salud.",
          "El esquema de la triple viral (primera dosis a los 12 meses; segunda dosis entre los 15 y 18 meses para nacidos desde el 1/7/2024, y en el año en que cumplen 5 años para nacidos entre el 1/1/2021 y el 30/6/2024) se volvió a comparar el 11 de octubre de 2026 con la página oficial y con los lineamientos técnicos de enero de 2026. El resto de las vacunas, el 9 de octubre.",
          "Las páginas no muestran fecha de actualización. El nombre del PDF del calendario (2026-03-10) es una referencia de versión, no una fecha de publicación confirmada. En el repositorio de lineamientos cada documento tiene su propia fecha: hay que seguir el vigente de cada vacuna. La carpeta 2018/02 de la dirección de algunos lineamientos no corresponde a la fecha de su contenido.",
          "Los enlaces estaban accesibles el 11 de octubre de 2026. No se hizo una auditoría de accesibilidad del PDF oficial: cada página por edad de AuxiliAR es la alternativa en texto. Próxima revisión documental sugerida: 11 de noviembre de 2026, o antes si la Nación cambia el calendario (es una propuesta de mantenimiento, no una fecha oficial).",
          "Pendiente de validación profesional: la fuente está verificada, la revisión clínica del contenido de AuxiliAR no se realizó.",
        ],
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
    title: "Atención veterinaria",
    blocks: [
      {
        id: "animales-campanas",
        title: "Vacunación y castración",
        references: [CABA, PASTEUR, ROSARIO, CORDOBA, SALTA, NEUQUEN, PROTENENCIA].map(({ by, url }) => ({ label: by, url })).concat([
          { label: "Municipalidad de Rosario · Solicitar esterilización de perros y gatos", url: "https://www.rosario.gob.ar/inicio/solicitar-esterilizacion-de-perros-y-gatos" },
          { label: "Instituto de Zoonosis Luis Pasteur · Vacunación antirrábica", url: "https://buenosaires.gob.ar/gcaba_historico/salud/hospitales-y-establecimientos-de-salud/instituto-de-zoonosis-luis-pasteur/vacunacion" },
          { label: ZOONOSIS.label, url: ZOONOSIS.url },
        ]),
        checkedAt: [ANIMAL_PLACES_READ_ON],
        notes: [
          "Cada página es de un organismo oficial: AuxiliAR no responde por cambios posteriores. Los datos de cada lugar se tomaron del texto de su página, descargado el 11 de octubre de 2026 (sin resumen automático), y no se verificaron en persona.",
          "Las páginas no muestran fecha de actualización, salvo la de Neuquén (modificada el 27/5/2026).",
        ],
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
        title: "Recursos importantes: consulta y urgencias",
        references: [{ label: ZOONOSIS.label, url: ZOONOSIS.url }, { label: RABIA.label, url: RABIA.url }, ...UNIVERSITY_HOSPITALS.map(({ by, url }) => ({ label: by, url })), { label: "Municipalidad de Rosario · Solicitar atención veterinaria para perros y gatos", url: "https://www.rosario.gob.ar/inicio/solicitar-atencion-veterinaria-para-perros-y-gatos" }],
        checkedAt: [ANIMAL_PLACES_READ_ON],
        notes: ["Es orientación general: AuxiliAR no atiende animales ni recomienda un veterinario en particular."],
      },
      {
        id: "animales-pasteur",
        title: "Recursos importantes: cremación gratuita",
        references: fromSources([PASTEUR_INFO, PASTEUR_SERVICIOS]),
        checkedAt: [CHECKED_AT_PASTEUR],
        notes: ["Las páginas no traen fecha de publicación: confirmá con el Instituto antes de ir."],
      },
    ],
  },
  {
    id: "centros-mapa",
    title: "Centros de atención (mapa)",
    blocks: placeBlocks(),
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
        references: fromSources([MAS_SERVICIOS_PAGINA, BARRIO_TURNO_ODONTOLOGIA, BARRIO_TURNO_OFTALMOLOGIA, BARRIO_REDES]),
        checkedAt: [CHECKED_AT_GUIDES, CHECKED_AT_AGENDA],
        notes: ["La página no muestra fecha de actualización.", "El cronograma de operativos (septiembre y octubre de 2026) se leyó el 11 de octubre de 2026 y se muestra solo desde la fecha de hoy.", "Pendiente de revisión legal y administrativa."],
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
