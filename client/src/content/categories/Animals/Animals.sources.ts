import type { Source } from "@/components/health/SourceList"

/**
 * Sources of Salud animal (fichas SA01 to SA14 of the resources document, 8/10/2026). Compared by hand on CHECKED_AT; when
 * the text or a source changes, compare again and change the day. Two groups, kept apart:
 *  - SERVICES: what each municipality's own page says about a free service (said as "la página oficial informa", never as
 *    something AuxiliAR verified in person; no phone, address or schedule is copied);
 *  - the sources of the general information (Ministerio de Salud, Senasa).
 * Not published, and why (see curation/proposals/salud-animal.fichas-sa01-sa14.md): SA07 and SA08 (university hospitals, their
 * own pages say the services are arancelados), SA11 (civil organization: no open appointment or gratuity for everyone), SA12
 * (registry of professionals: it is not a free directory) and SA13 (an announced hospital, not open).
 */
export const CHECKED_AT = "2026-10-08"

export type MunicipalService = {
  id: string
  /** The place the page is about: the only place it applies to */
  place: string
  /** Who publishes it */
  by: string
  /** What the page says it offers */
  offers: string
  /** Who can use it and the requirements the page states */
  who: string
  /** How the page says it is asked for */
  how: string
  /** A limit or a doubt the page leaves open, said plainly */
  limit?: string
  url: string
}

/** ── Services whose own official page says they are free (SA01, SA03, SA04, SA05) ── */

/** SA01 "Animales BA": "castraciones y vacunación antirrábica para caninos y felinos totalmente gratuito"; the page shows the agenda of the days of the month (read on 8/10/2026: 1 to 17 of October) and says nothing about guardia or urgencias */
export const CABA: MunicipalService = {
  id: "caba",
  place: "Ciudad de Buenos Aires",
  by: "Gobierno de la Ciudad · Animales BA",
  offers: "Castración y vacunación antirrábica de perros y gatos, que la página describe como totalmente gratuitas.",
  who: "Para castrar, el animal debe ir acompañado por una persona mayor de 18 años. La página detalla cómo preparar al animal: leela antes del turno.",
  how: "Castración: turno online con cuenta miBA. Vacunación: en operativos, sin turno previo, según el cronograma que publica la página.",
  limit: "La página no informa servicio de guardia ni de urgencias.",
  url: "https://buenosaires.gob.ar/gcaba_historico/atencion-veterinaria-y-castraciones-gratuitas",
}

/** SA03: "servicio gratuito de esterilización del Imusa", "colocamos de forma gratuita la vacuna contra la rabia". It does not say whether other vaccines or studies are free */
export const ROSARIO: MunicipalService = {
  id: "rosario",
  place: "Rosario (Santa Fe)",
  by: "Municipalidad de Rosario · Salud animal",
  offers: "Esterilización y vacuna antirrábica de perros y gatos, que la página describe como gratuitas. Hay un hospital municipal y puestos en distintos barrios.",
  who: "Para esterilizar: DNI y el animal, llevado por una persona mayor. La atención en el hospital municipal es sin costo para personas adscritas al sistema de salud pública municipal.",
  how: "La esterilización se pide en persona en los puestos fijos o por WhatsApp. La vacuna antirrábica se aplica sin turno previo.",
  limit: "Las personas que no están adscritas al sistema de salud pública municipal pagan la atención del hospital. La página no dice si otras vacunas son gratuitas.",
  url: "https://www.rosario.gob.ar/inicio/salud-animal",
}

/** SA04: "castraciones gratuitas y masivas"; for vecinos de la ciudad de Córdoba. Other notes of 2025 publish another channel */
export const CORDOBA: MunicipalService = {
  id: "cordoba",
  place: "Ciudad de Córdoba",
  by: "Municipalidad de Córdoba · Control de reproducción de animales de compañía",
  offers: "Castración de perros y gatos, que la página describe como gratuita y masiva.",
  who: "Vecinos de la ciudad de Córdoba.",
  how: "Se pide turno por WhatsApp, por el canal que publica la página.",
  limit: "La página reconoce que hay mucha demanda y pocos turnos. Otras notas del municipio publican otro canal: confirmá cuál es el vigente.",
  url: "https://cordoba.gob.ar/programa/control-de-reproduccion-de-animales-de-compania/",
}

/** SA05: "atención veterinaria gratuita, vacunación antirrábica y castraciones"; conditions and limits as the page states them; one site lists contradictory hours */
export const SALTA: MunicipalService = {
  id: "salta",
  place: "Ciudad de Salta",
  by: "Municipalidad de Salta · Bienestar animal",
  offers: "Atención veterinaria, vacunación antirrábica y castraciones que la página informa como gratuitas, en el hospital municipal de salud animal y en otros centros.",
  who: "Mayores de 18 años con DNI con domicilio en la ciudad de Salta. Para los controles posteriores piden un certificado de carencia de recursos.",
  how: "Cada centro tiene sus horarios: consultalos en la página.",
  limit: "No hacen internaciones ni estudios complementarios. La página se contradice sobre las razas braquicéfalas (en un lugar dice que no se operan y en otro, que se operan con turno previo). Tiene un apartado «Guardia y urgencias» sin horario propio: no lo tomes como una guardia confirmada.",
  url: "https://municipalidadsalta.gob.ar/bienestar-animal-7/",
}

export const CONFIRMED_BY_SOURCE: MunicipalService[] = [CABA, ROSARIO, CORDOBA, SALTA]

/** ── Services listed but not confirmed as free (SA02, SA06, SA14) ── */

/** SA02: annual rabies vaccine from 3 months, without appointment, in order of arrival. The page does not say the cost */
export const PASTEUR: MunicipalService = {
  id: "pasteur",
  place: "Ciudad de Buenos Aires",
  by: "Instituto de Zoonosis Luis Pasteur · Gobierno de la Ciudad",
  offers: "Vacunación antirrábica anual de perros y gatos desde los 3 meses de edad.",
  who: "Según la página, se atiende sin turno y por orden de llegada.",
  how: "La página publica días, horarios y la dirección del instituto.",
  limit: "La página no informa el costo.",
  url: "https://buenosaires.gob.ar/gcaba_historico/salud/hospitales-y-establecimientos-de-salud/instituto-de-zoonosis-luis-pasteur/vacunacion",
}

/** SA06: pre-appointment online with Muni Express, then a call to confirm; mayores de 18 con residencia; the page does not state the cost clearly. A preturno is not a confirmed surgery */
export const NEUQUEN: MunicipalService = {
  id: "neuquen",
  place: "Ciudad de Neuquén",
  by: "Municipalidad de Neuquén · Bienestar animal",
  offers: "Esterilización de perros, en quirófanos fijos y móviles.",
  who: "Mayores de 18 años con residencia en la ciudad. Perros desde los seis meses.",
  how: "Preturno online. El personal de Bienestar Animal llama después para confirmar el día y el horario.",
  limit: "La página no deja claro el costo. Un preturno no es una cirugía confirmada.",
  url: "https://www.neuquencapital.gov.ar/tramites/bienestar-animal/esterilizacion-de-canes/",
}

/** SA14: castraciones gratuitas by order of arrival at the operativo; no dates, no localities, nothing says it is still running */
export const PROTENENCIA: MunicipalService = {
  id: "protenencia",
  place: "Operativos de municipios de todo el país",
  by: "Ministerio de Salud de la Nación · Protenencia",
  offers: "La página describe castraciones gratuitas de animales de compañía, por orden de llegada al operativo.",
  who: "Personas mayores de edad con DNI, hasta dos animales por persona.",
  how: "La página indica comunicarse con el referente del municipio para saber dónde.",
  limit: "No informa fechas, localidades ni si el programa sigue vigente.",
  url: "https://www.argentina.gob.ar/salud/protenencia/castraciones",
}

export const NOT_CONFIRMED: MunicipalService[] = [PASTEUR, NEUQUEN, PROTENENCIA]

/** ── Sources of the general information ── */

/** "Rabia", glosario del Ministerio de Salud de la Nación: yearly vaccine of dogs and cats from 3 months and for life; avoid contact with wild animals; after a bite go quickly to a health center. No date */
export const RABIA: Source = {
  label: "Rabia · Ministerio de Salud de la Nación",
  url: "https://www.argentina.gob.ar/node/29491",
}

/** Senasa, zoonosis: the definition; it works on production animals; dogs and cats "se manejan a nivel municipal y/o provincial", with the local zoonosis center or the Ministerio de Salud. No date */
export const ZOONOSIS: Source = {
  label: "Zoonosis · Senasa, argentina.gob.ar",
  url: "https://www.argentina.gob.ar/senasa/programas-sanitarios/zoonosis",
}

/** SA07: "Todos los servicios son arancelados" and "no atiende urgencias sin previa coordinación" */
export const UBA_HOSPITAL: Source = {
  label: "Hospital Escuela · Facultad de Ciencias Veterinarias, UBA",
  url: "https://www.fvet.uba.ar/hospital/",
}

/** SA08, 22/3/2024: "Los servicios son arancelados" */
export const UNLP_HOSPITAL: Source = {
  label: "Atención clínica primaria de pequeños animales · Facultad de Ciencias Veterinarias, UNLP",
  url: "https://www.fcv.unlp.edu.ar/index.php/hospital/servicio-de-atencion-clinica-primaria-de-pequenos-animales/",
}
