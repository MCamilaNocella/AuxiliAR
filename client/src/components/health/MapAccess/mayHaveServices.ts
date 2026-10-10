import { COVERAGE } from "@/data/resources"
import type { ProvinceCoverage, ServiceType } from "@/data/resources"

/**
 * Whether the places of a province can have a service of those types today, from the coverage index alone (it is small and
 * brings no places: the map is not loaded here). The index counts every place of each file, so "yes" means "the map may have
 * some"; the map itself decides what it shows (it ignores a filter with nothing to show). "No" is certain.
 */
export const mayHaveServices = (serviceTypes: readonly ServiceType[], day: string, coverage: Partial<Record<string, ProvinceCoverage>> = COVERAGE) =>
  Object.values(coverage).some(
    (province) => province !== undefined && province.places > 0 && province.currentUntil !== null && day < province.currentUntil && province.serviceTypes.some((type) => serviceTypes.includes(type)),
  )
