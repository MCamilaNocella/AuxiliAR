import { getHelpLine, lineContact } from "@/data/resources/lines"
import type { GuideSource } from "./types"

/** Official sources of the guides: Ministerio de Salud de la Nación, Dirección Nacional de Emergencias Sanitarias (DINESA) */

export const MANUAL: GuideSource = {
  label: "Manual de primeros auxilios y prevención de lesiones · Ministerio de Salud de la Nación (DINESA)",
  url: "https://iah.msal.gov.ar/doc/Documento152.pdf",
}

export const MINI_GUIA_RCP: GuideSource = {
  label: "Mini Guía de Reanimación Cardiopulmonar Básica (RCP.B) 2025 · Ministerio de Salud de la Nación",
  url: "https://www.argentina.gob.ar/sites/default/files/mini-guia-reanimacion-cardiovascular-2025.pdf",
}

export const RCP_ADULTOS: GuideSource = {
  label: "RCP en adultos · Primeros auxilios, argentina.gob.ar/salud",
  url: "https://www.argentina.gob.ar/salud/primerosauxilios/rcp/adultos",
}

export const FRACTURAS: GuideSource = {
  label: "Fracturas · Primeros auxilios, argentina.gob.ar/salud",
  url: "https://www.argentina.gob.ar/salud/primerosauxilios/situaciones/fracturas",
}

export const VIA_PUBLICA: GuideSource = {
  label: "Qué hacer ante emergencias en la vía pública · DINESA, argentina.gob.ar/salud",
  url: "https://www.argentina.gob.ar/salud/dinesa/recomendaciones/emergencias-via-publica",
}

/**
 * Allergic reactions. The Argentine official pages found cover symptoms (ANMAT) and where to go (Ciudad de Buenos Aires), but
 * none of them has a first aid page for allergic reactions; the steps come from MedlinePlus, the official health information
 * service of the US National Library of Medicine (NIH). It is not an Argentine source: the guide says so and keeps the emergency
 * number of each place out of the text.
 */
export const MEDLINEPLUS_ALERGIAS: GuideSource = {
  label: "Reacciones alérgicas · MedlinePlus, Biblioteca Nacional de Medicina de EE. UU. (sitio oficial del Gobierno de EE. UU.)",
  url: "https://medlineplus.gov/spanish/ency/article/000005.htm",
}

export const MEDLINEPLUS_ANAFILAXIA: GuideSource = {
  label: "Anafilaxia · MedlinePlus, Biblioteca Nacional de Medicina de EE. UU. (sitio oficial del Gobierno de EE. UU.)",
  url: "https://medlineplus.gov/spanish/ency/article/000844.htm",
}

export const ANMAT_ALERGIAS: GuideSource = {
  label: "Alergias alimentarias: síntomas · ANMAT, argentina.gob.ar",
  url: "https://www.argentina.gob.ar/anmat/regulados/alimentos/alergenos-alimentarios/alergenos-alimentarios/sintomas",
}

export const CABA_ALERGIAS: GuideSource = {
  label: "Dónde acudir ante un ataque de alergia · Gobierno de la Ciudad de Buenos Aires (2 de enero de 2020)",
  url: "https://buenosaires.gob.ar/gcaba_historico/noticias/donde-acudir-ante-un-ataque-de-alergia",
}

/** Centro Nacional de Intoxicaciones (Hospital Posadas): free line given by the Manual and by the app's help numbers */
export const POISON_CENTER = { number: lineContact(getHelpLine("intoxicaciones-cni-posadas")).display, tel: lineContact(getHelpLine("intoxicaciones-cni-posadas")).dial }

/** The last time the guides were compared with these sources */
export const CHECKED_AT = "2026-10-07"
