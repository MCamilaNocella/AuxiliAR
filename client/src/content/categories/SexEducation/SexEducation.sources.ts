import type { Source } from "@/components/health/SourceList"

/**
 * Sources of Salud sexual y ESI (fichas SS01 to SS18 of the resources document, 8/10/2026). Two kinds, kept apart:
 *  - the sources of what the three sections SAY (official pages of the Nación and the laws): listed under "Fuentes oficiales";
 *  - the resources the sections only POINT TO (other official pages and a civil organization): listed as "no verificados
 *    por AuxiliAR", with no claim about them beyond what their own page says about itself.
 * Compared by hand on CHECKED_AT; when the text or a source changes, compare again and change the day.
 */
export const CHECKED_AT = "2026-10-08"

/** ── What the sections say ── */

/** "Salud sexual y reproductiva" (SS02): "información clara, basada en evidencia científica, promoviendo la toma de decisiones informadas y autónomas". No date */
export const PORTAL: Source = {
  label: "Salud sexual y reproductiva · Ministerio de Salud de la Nación",
  url: "https://www.argentina.gob.ar/salud/sexual",
}

/** SS03: the nine methods it names, the condom as the only one that also prevents ITS, and the right of access (Ley 25.673). No date */
export const METODOS: Source = {
  label: "Métodos anticonceptivos · Ministerio de Salud de la Nación",
  url: "https://www.argentina.gob.ar/salud/sexual/metodos-anticonceptivos",
}

/** SS04: where methods are obtained (centros de salud, hospitales, obras sociales y prepagas). No date */
export const PREGUNTAS: Source = {
  label: "Preguntas frecuentes de salud sexual · Ministerio de Salud de la Nación",
  url: "https://www.argentina.gob.ar/salud/sexual/preguntas-frecuentes",
}

/** SS01: confidential consultations; hours differ on weekdays and weekends, so the page is linked and no number or hour is copied. No date */
export const LINEA: Source = {
  label: "Línea nacional de salud sexual · Ministerio de Salud de la Nación",
  url: "https://www.argentina.gob.ar/salud/saludsexual/lineasaludsexual",
}

/** Ley 25.673, art. 2: "Garantizar a toda la población el acceso a la información, orientación, métodos y prestaciones" */
export const LEY_25673: Source = {
  label: "Ley 25.673, Programa Nacional de Salud Sexual y Procreación Responsable · argentina.gob.ar",
  url: "https://www.argentina.gob.ar/normativa/nacional/ley-25673-79831/texto",
}

/** Ley 26.150, art. 1: the right to ESI in public, state-run and private schools; and what ESI articulates */
export const LEY_26150: Source = {
  label: "Ley 26.150, Programa Nacional de Educación Sexual Integral · argentina.gob.ar",
  url: "https://www.argentina.gob.ar/normativa/nacional/ley-26150-121222/texto",
}

/** Ley 27.610, arts. 1, 2 and 12: object, right to decide, and full and free coverage by the public sector. No weeks, no procedure */
export const LEY_27610: Source = {
  label: "Ley 27.610, acceso a la interrupción voluntaria del embarazo · argentina.gob.ar",
  url: "https://www.argentina.gob.ar/normativa/nacional/ley-27610-346231/texto",
}

/** SS11: "sencillo, confidencial y gratuito en el sistema público"; "no es necesario estar en ayunas ni ser mayor de edad"; centers attend on different days and hours. Page of the Ciudad, no editorial date */
export const CABA_TEST: Source = {
  label: "Test de VIH y sífilis y centros de testeo · Gobierno de la Ciudad de Buenos Aires",
  url: "https://buenosaires.gob.ar/gcaba_historico/test-de-vih-y-sifilis-y-centros-de-testeo-0",
}

/** SS10: it names "Preservativos gratis" and the "bocas de distribución". Page of the Ciudad, no date */
export const CABA_COORDINACION: Source = {
  label: "Salud sexual, VIH e ITS · Gobierno de la Ciudad de Buenos Aires",
  url: "https://buenosaires.gob.ar/gcaba_historico/salud/coordinacion-salud-sexual-vih-infecciones-de-transmision-sexual",
}

/** SS15, 4/10/2022: láminas, desplegables, cuadernillos for inicial, primario y secundario, and audiovisuales (some in LSA) */
export const ESI_MATERIALES: Source = {
  label: "Educación Sexual Integral: nuevos materiales educativos · argentina.gob.ar, 4/10/2022",
  url: "https://www.argentina.gob.ar/noticias/educacion-sexual-integral-nuevos-materiales-educativos",
}

/** ── What the sections only point to (not verified one by one by AuxiliAR) ── */

export type Pointer = {
  label: string
  /** Who runs it, as the page says */
  by: string
  url: string
}

/** SS16: Dirección de ESI, Dirección General de Cultura y Educación de la Provincia de Buenos Aires */
export const ESI_PBA: Pointer = {
  label: "Programa provincial de Educación Sexual Integral",
  by: "Provincia de Buenos Aires",
  url: "https://abc.gob.ar/secretarias/areas/subsecretaria-de-educacion/programa-provincial-de-educacion-sexual-integral/programa",
}

/** SS17: "Educación Sexual Integral – Recursos", Ministerio de Educación del Chaco */
export const ESI_CHACO: Pointer = {
  label: "Educación Sexual Integral: recursos",
  by: "Chaco",
  url: "https://dirdocumentacion.educacion.chaco.gob.ar/esi/recursos/",
}

/** SS09: "Aborto Salud Sexual y Reproductiva", Ministerio de Salud de la Provincia de Buenos Aires: information and a map of public establishments */
export const PBA_SSR: Pointer = {
  label: "Salud sexual y reproductiva, con mapa de establecimientos",
  by: "Ministerio de Salud de la Provincia de Buenos Aires",
  url: "https://www.ms.gba.gov.ar/sitios/aborto/",
}

/** SS13: "Interrupción Voluntaria del Embarazo (IVE) - Ley 27.610", Gobierno de Santa Fe, with a map of efectores */
export const SANTA_FE_IVE: Pointer = {
  label: "Interrupción Voluntaria del Embarazo (Ley 27.610), con mapa de efectores",
  by: "Gobierno de Santa Fe",
  url: "https://www.santafe.gob.ar/index.php/web/content/view/full/139666/",
}

/** SS12, 19/8/2026: Ministerio de Salud Pública de Tucumán */
export const TUCUMAN_ANTICONCEPCION: Pointer = {
  label: "Métodos anticonceptivos y asesoramiento en la provincia",
  by: "Ministerio de Salud Pública de Tucumán",
  url: "https://msptucuman.gov.ar/el-sistema-de-salud-ofrece-metodos-anticonceptivos-y-asesoramiento-gratuito-en-toda-la-provincia/",
}

/** SS05: "Dónde", tool created by Fundación Huésped. It says nothing about the gratuity of what it lists */
export const HUESPED_DONDE: Pointer = {
  label: "Dónde: buscador de servicios de salud sexual y reproductiva y vacunatorios",
  by: "Fundación Huésped (organización civil)",
  url: "https://donde.huesped.org.ar/",
}

/** SS06: testing and counseling service of Fundación Huésped in the Ciudad. Its own page says its services are free; no address, hour or contact is copied here */
export const HUESPED_SERVICIOS: Pointer = {
  label: "Testeo de VIH y sífilis y consejería en Fundación Huésped (CABA)",
  by: "Fundación Huésped (organización civil)",
  url: "https://new.huesped.org.ar/servicios",
}

/** SS07: educational guide on methods and rights (information, not care) */
export const HUESPED_METODOS: Pointer = {
  label: "Guía de métodos anticonceptivos",
  by: "Fundación Huésped (organización civil)",
  url: "https://huesped.org.ar/informacion/metodos-anticonceptivos",
}
