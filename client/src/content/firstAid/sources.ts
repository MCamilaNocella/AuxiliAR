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

/** Centro Nacional de Intoxicaciones (Hospital Posadas): free line given by the Manual and by the app's help numbers */
export const POISON_CENTER = { number: "0800-333-0160", tel: "08003330160" }

/** The last time the guides were compared with these sources */
export const CHECKED_AT = "2026-10-07"
