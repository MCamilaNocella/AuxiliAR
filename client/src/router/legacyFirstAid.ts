import { PATHS, SECTION_PARAM } from "./paths"

/** The id Primeros auxilios had as a section of Salud general, before it became its own category */
export const LEGACY_FIRST_AID_SECTION = "section-3"

/**
 * Where an old link to Salud general → Primeros auxilios goes now: the Primeros auxilios category.
 * Null for any other address, which stays where it is. Only the section param is dropped; the rest of the query and the hash travel along.
 */
export const legacyFirstAidTarget = (search: string, hash: string) => {
  const params = new URLSearchParams(search)
  if (params.get(SECTION_PARAM) !== LEGACY_FIRST_AID_SECTION) return null
  params.delete(SECTION_PARAM)
  const rest = params.toString()
  return { pathname: PATHS.firstAid, search: rest ? `?${rest}` : "", hash }
}
