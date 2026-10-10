import { COVERAGE } from "@/data/resources"
import type { ProvinceCoverage } from "@/data/resources"

/**
 * What the map can show for a quick filter today, from the coverage index alone (it is small and brings no places: the map
 * is not loaded here). The index is computed with the explorer's own rules (current establishment and service, gratuity
 * documented), so the answer is the explorer's:
 *  - "pins": some place is in the list AND has verified coordinates (it is drawn on the map)
 *  - "list": some place is in the list, but none has verified coordinates yet
 *  - "none": nothing the map can show
 * An entry is valid while today is BEFORE its date (a review date is already out on that day), as in the explorer.
 */
export type QuickFilterAvailability = "pins" | "list" | "none"

export const quickFilterAvailability = (filterId: string, day: string, coverage: Partial<Record<string, ProvinceCoverage>> = COVERAGE): QuickFilterAvailability => {
  const entries = Object.values(coverage).flatMap((province) => {
    const entry = province?.quickFilters?.[filterId]
    return entry ? [entry] : []
  })
  if (entries.some(({ map }) => map !== undefined && day < map)) return "pins"
  if (entries.some(({ list }) => day < list)) return "list"
  return "none"
}
