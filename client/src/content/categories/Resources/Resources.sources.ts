import type { Source } from "@/components/health/SourceList"

/**
 * Sources of "Más recursos" that are not already those of another category (rights of mental health and sexual health, the
 * vaccination calendar and the vaginal condom are shown from their own modules, one copy each). Texts saved in
 * docs/investigacion/evidencia: caba-ley-153-arts-1-3.txt, nacion-ley-27491-art-2-y-7.txt, caba-turnos-cesac-tramite.txt (all 2026-10-08).
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
