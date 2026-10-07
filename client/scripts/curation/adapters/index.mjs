import * as cabaCesac from "./caba-cesac.mjs"
import * as cabaHospitales from "./caba-hospitales.mjs"

/** One adapter per kind of source. A manifest names its adapter; adding a province is an adapter + a manifest + a mapping */
export const ADAPTERS = { "caba-cesac": cabaCesac, "caba-hospitales": cabaHospitales }

export const getAdapter = (name) => {
  const adapter = ADAPTERS[name]
  if (!adapter) throw new Error(`adapter desconocido: "${name}" (hay: ${Object.keys(ADAPTERS).join(", ")})`)
  return adapter
}
