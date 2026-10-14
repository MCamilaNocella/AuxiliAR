import type { Source } from "@/components/health/SourceList"

/**
 * Sources of "Más recursos" that are not already those of another category (rights of mental health and sexual health, the
 * vaccination calendar and the vaginal condom are shown from their own modules, one copy each). Read on 2026-10-08.
 */
export const CHECKED_AT = "2026-10-08"

/** Ley 153 (Ciudad), arts. 2, 3 (g, i) and 4: scope, gratuity of the state area, rights of the people. Consolidated by Ley 6.764 */
export const LEY_153: Source = {
  label: "Ley 153, Ley Básica de Salud de la Ciudad de Buenos Aires · Boletín Oficial de la Ciudad",
  url: "https://boletinoficial.buenosaires.gob.ar/normativaba/norma/3800",
}

/** Ley 27.491, arts. 2, 7, 9 and 10: gratuity of vaccines and of the vaccination services, obligation, proof, responsibility for minors */
export const LEY_27491: Source = {
  label: "Ley 27.491, control de enfermedades prevenibles por vacunación · argentina.gob.ar",
  url: "https://www.argentina.gob.ar/normativa/nacional/ley-27491-318455/texto",
}

/** "Solicitud de turnos en Centros de salud y Acción Comunitaria (CESAC)": requirements, empadronamiento, ways to ask, free of cost, first level of care */
export const TURNOS_CESAC: Source = {
  label: "Solicitud de turnos en Centros de salud y Acción Comunitaria (CESAC) · Gobierno de la Ciudad de Buenos Aires",
  url: "https://buenosaires.gob.ar/tramites/solicitud-de-turnos-en-centros-de-salud-y-accion-comunitaria-cesac",
}

/** "Calendario Nacional de Vacunación": the vaccines are available in public centers and hospitals and "no requieren de una orden médica" (2026-10-09) */
export const VACUNAS_PAGINA: Source = {
  label: "Calendario Nacional de Vacunación · Ministerio de Salud de la Nación",
  url: "https://www.argentina.gob.ar/salud/vacunas",
}

/** Day the two guides below were compared with their official pages (read-only; the pages show no date of update) */
export const CHECKED_AT_GUIDES = "2026-10-10"

/** "Cómo obtener el Certificado Único de Discapacidad (CUD)": what it is, voluntary and free of cost, the steps, the personalized consultation */
export const CUD_PAGINA: Source = {
  label: "Cómo obtener el Certificado Único de Discapacidad (CUD) · argentina.gob.ar",
  url: "https://www.argentina.gob.ar/servicio/como-obtener-el-certificado-unico-de-discapacidad-cud",
}

/** "Cronograma de Más servicios en tu barrio": the itinerant program of the Ciudad; its services and dates change by week and operation */
export const MAS_SERVICIOS_PAGINA: Source = {
  label: "Cronograma de Más servicios en tu barrio · Gobierno de la Ciudad de Buenos Aires",
  url: "https://buenosaires.gob.ar/gcaba_historico/cronograma-de-mas-servicios-en-tu-barrio",
}

/** The pages the cronograma of «Más servicios en tu barrio» points to for what AuxiliAR cannot do: the turnos of odontología and oftalmología, and the social networks where the state of each operativo is told (read on 2026-10-11) */
export const BARRIO_TURNO_ODONTOLOGIA: Source = { label: "Turno de odontología en Más servicios en tu barrio · Gobierno de la Ciudad de Buenos Aires", url: "https://serviciosba.buenosaires.gob.ar/servicio/15" }
export const BARRIO_TURNO_OFTALMOLOGIA: Source = { label: "Turno de oftalmología en Más servicios en tu barrio · Gobierno de la Ciudad de Buenos Aires", url: "https://serviciosba.buenosaires.gob.ar/servicio/16" }
export const BARRIO_REDES: Source = { label: "Redes de Más servicios en tu barrio (Instagram)", url: "https://www.instagram.com/masserviciosentubarrio/" }
export const CHECKED_AT_AGENDA = "2026-10-11"

/*
 * Sources listed under each section ("Fuentes oficiales"), with the labels of the model (recursos-1). Added on 2026-10-14 with the
 * rights for migrants (Ley 25.871, art. 8), the right to be attended (Ley 26.529, art. 2 a) and the Superintendencia de Servicios de Salud.
 */
export const CHECKED_AT_MODEL = "2026-10-14"

export const LEY_26529: Source = { label: "Ley 26.529, Derechos del Paciente · argentina.gob.ar", url: "https://www.argentina.gob.ar/normativa/nacional/ley-26529-160432/texto" }
export const LEY_25871: Source = { label: "Ley 25.871 de Migraciones (art. 8) · argentina.gob.ar", url: "https://www.argentina.gob.ar/normativa/nacional/ley-25871-92016/texto" }
export const LEY_26657_MODEL: Source = { label: "Ley Nacional de Salud Mental 26.657 · argentina.gob.ar", url: "https://www.argentina.gob.ar/normativa/nacional/ley-26657-175977/texto" }
export const LEY_25673_MODEL: Source = { label: "Ley 25.673, Salud Sexual y Procreación Responsable · argentina.gob.ar", url: "https://www.argentina.gob.ar/normativa/nacional/ley-25673-79831/texto" }
export const LEY_26150_MODEL: Source = { label: "Ley 26.150, Educación Sexual Integral · argentina.gob.ar", url: "https://www.argentina.gob.ar/normativa/nacional/ley-26150-121222/texto" }
/** The Superintendencia de Servicios de Salud: controls obras sociales and prepagas; consultations and complaints by phone (0800-222-72583, 8 to 16 h), its Centro de Atención Virtual or with an appointment */
export const SSSALUD: Source = { label: "Superintendencia de Servicios de Salud · argentina.gob.ar", url: "https://www.argentina.gob.ar/sssalud" }
export const ANTICONCEPTIVOS_CABA: Source = { label: "Métodos anticonceptivos · Gobierno de la Ciudad de Buenos Aires", url: "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos" }
export const TURNOS_CESAC_MODEL: Source = { label: "Solicitud de turnos en Centros de Salud y Acción Comunitaria (CeSAC) · Gobierno de la Ciudad de Buenos Aires", url: TURNOS_CESAC.url }
