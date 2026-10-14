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

/**
 * STATUS: in editorial and legal review (team decision, 8/10/2026) - not final for publication. Add no deadline, requirement or
 * procedure unless a current official source backs it.
 * Ley 27.610, arts. 1, 2 and 12: object, right to decide, and full and free coverage by the public sector. No weeks, no procedure */
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
  by: "Solo para la provincia de Buenos Aires · Dirección General de Cultura y Educación",
  url: "https://abc.gob.ar/secretarias/areas/subsecretaria-de-educacion/programa-provincial-de-educacion-sexual-integral/programa",
}

/** SS17: "Educación Sexual Integral – Recursos", Ministerio de Educación del Chaco */
export const ESI_CHACO: Pointer = {
  label: "Educación Sexual Integral: recursos",
  by: "Solo para la provincia del Chaco · Ministerio de Educación",
  url: "https://dirdocumentacion.educacion.chaco.gob.ar/esi/recursos/",
}

/** SS09: "Aborto Salud Sexual y Reproductiva", Ministerio de Salud de la Provincia de Buenos Aires: information and a map of public establishments */
export const PBA_SSR: Pointer = {
  label: "Salud sexual y reproductiva, con mapa de establecimientos",
  by: "Solo para la provincia de Buenos Aires · Ministerio de Salud",
  url: "https://www.ms.gba.gov.ar/sitios/aborto/",
}

/** SS13: "Interrupción Voluntaria del Embarazo (IVE) - Ley 27.610", Gobierno de Santa Fe, with a map of efectores */
export const SANTA_FE_IVE: Pointer = {
  label: "Interrupción Voluntaria del Embarazo (Ley 27.610), con mapa de efectores",
  by: "Solo para la provincia de Santa Fe · Gobierno de Santa Fe",
  url: "https://www.santafe.gob.ar/index.php/web/content/view/full/139666/",
}

/** SS12, 19/8/2026: Ministerio de Salud Pública de Tucumán */
export const TUCUMAN_ANTICONCEPCION: Pointer = {
  label: "Métodos anticonceptivos y asesoramiento en la provincia",
  by: "Solo para la provincia de Tucumán · Ministerio de Salud Pública",
  url: "https://msptucuman.gov.ar/el-sistema-de-salud-ofrece-metodos-anticonceptivos-y-asesoramiento-gratuito-en-toda-la-provincia/",
}

/** SS05: "Dónde", tool created by Fundación Huésped. It says nothing about the gratuity of what it lists */
export const HUESPED_DONDE: Pointer = {
  label: "Dónde: buscador de servicios de salud sexual y reproductiva y vacunatorios",
  by: "Fundación Huésped (organización civil)",
  url: "https://donde.huesped.org.ar/",
}

/** ── Round 3 (9/10/2026): the pages of the Nación and the Ciudad that the "Anticoncepción y prevención" section explains in its own words ── */

export const CHECKED_AT_METHODS = "2026-10-09"

/** Preguntas frecuentes sobre preservativo vaginal (Ministerio de Salud, CC BY 4.0): what it is, how it works, how it is used, who can use it, where to ask. No date. Text saved in docs/investigacion/evidencia */
export const PRESERVATIVO_VAGINAL: Source = {
  label: "Preguntas frecuentes sobre preservativo vaginal · Ministerio de Salud de la Nación",
  url: "https://www.argentina.gob.ar/salud/vih-sida/preguntas-frecuentes-sobre-preservativo-vaginal",
}

/** The page of each method of the Ministerio de Salud (SS03 lists them; each one has its own page). No date */
export const PRESERVATIVOS: Source = { label: "Preservativos · Ministerio de Salud de la Nación", url: "https://www.argentina.gob.ar/salud/sexual/preservativos" }
export const METODO_PASTILLAS_COMBINADAS: Source = { label: "Pastillas combinadas · Ministerio de Salud de la Nación", url: "https://www.argentina.gob.ar/salud/sexual/pastillas-combinadas" }
export const METODO_PASTILLAS_UNA_HORMONA: Source = { label: "Pastillas de una sola hormona · Ministerio de Salud de la Nación", url: "https://www.argentina.gob.ar/salud/sexual/pastillas-una-hormona" }
export const METODO_INYECTABLES: Source = { label: "Anticonceptivos inyectables · Ministerio de Salud de la Nación", url: "https://www.argentina.gob.ar/salud/sexual/anticonceptivos-inyectables" }
export const METODO_IMPLANTE: Source = { label: "Implantes subdérmicos · Ministerio de Salud de la Nación", url: "https://www.argentina.gob.ar/salud/sexual/metodos-anticonceptivos/implante-subdermico" }
export const METODO_DIU: Source = { label: "Dispositivos intrauterinos (DIU) · Ministerio de Salud de la Nación", url: "https://www.argentina.gob.ar/salud/sexual/diu" }
export const METODO_AHE: Source = { label: "Anticoncepción hormonal de emergencia · Ministerio de Salud de la Nación", url: "https://www.argentina.gob.ar/salud/sexual/ahe" }
export const METODO_LIGADURA: Source = { label: "Ligadura tubaria · Ministerio de Salud de la Nación", url: "https://www.argentina.gob.ar/salud/sexual/ligadura-tubaria" }
export const METODO_VASECTOMIA: Source = { label: "Vasectomía · Ministerio de Salud de la Nación", url: "https://www.argentina.gob.ar/salud/sexual/vasectomia" }

/** "La atención y los métodos son gratuitos en el sistema público y deben ser entregados sin costo adicional en obras sociales y prepagas". CC Reconocimiento 2.5 AR. No date */
export const CABA_METODOS: Source = {
  label: "Métodos anticonceptivos · Gobierno de la Ciudad de Buenos Aires",
  url: "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/metodos-anticonceptivos",
}

/** "En los siguientes centros de salud y hospitales se puede acceder a los métodos anticonceptivos y a la interrupción del embarazo" (62 establishments; ligadura and vasectomía marked). No date */
export const CABA_CONSEJERIAS: Source = {
  label: "Consejerías en salud sexual · Gobierno de la Ciudad de Buenos Aires",
  url: "https://buenosaires.gob.ar/gcaba_historico/salud-sexual-y-reproductiva/consejerias-en-salud-sexual",
}

/** ── IVE/ILE (9/10/2026) ── */

export const CHECKED_AT_IVE = "2026-10-09"

/**
 * «Acceso a la Interrupción Voluntaria del Embarazo (IVE)», argentina.gob.ar/generos (Ministerio de Justicia): what the Ley 27.610
 * recognizes, IVE and ILE, what is needed, the 10-day term, the rights in the attention, and where to ask or to report obstacles.
 * No date.
 */
export const IVE_PAGINA: Source = {
  label: "Acceso a la Interrupción Voluntaria del Embarazo (IVE) · argentina.gob.ar",
  url: "https://www.argentina.gob.ar/generos/acceso-la-interrupcion-voluntaria-del-embarazo-ive",
}
