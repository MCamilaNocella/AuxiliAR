import { COVERAGE } from "@/data/resources"
import type { ProvinceCode, ProvinceCoverage } from "@/data/resources"

/**
 * Up to this many places in total, opening the Mapa AuxiliAR without a province downloads every covered province. Above it,
 * the person chooses a province first and only that file is downloaded. A number of places, not of bytes: a place is around
 * 3 KB in the file, so this is a few MB at most.
 */
export const LOAD_ALL_UP_TO = 1500

export type LoadPlan = {
  /** The provinces that may have something current on that day: what the province filter offers */
  covered: ProvinceCode[]
  /** The files to download now */
  toLoad: ProvinceCode[]
  /** There is too much for "all": a province has to be chosen before anything is downloaded */
  needsProvince: boolean
}

/**
 * Which files the Mapa AuxiliAR downloads, decided from the coverage index alone:
 *  - a province asked for that is covered: only its file
 *  - a province asked for that is not covered: nothing (there is nothing to download)
 *  - no province: every covered one if they are few enough; otherwise a province has to be chosen first
 */
export const planLoad = ({ coverage = COVERAGE, day, province, limit = LOAD_ALL_UP_TO }: { coverage?: Partial<Record<ProvinceCode, ProvinceCoverage>>, day: string, province: ProvinceCode | null, limit?: number }): LoadPlan => {
  const covered = (Object.entries(coverage) as [ProvinceCode, ProvinceCoverage][])
    .filter(([, { places, currentUntil }]) => places > 0 && currentUntil !== null && day < currentUntil)
    .map(([code]) => code)
    .sort()
  if (province) return { covered, toLoad: covered.includes(province) ? [province] : [], needsProvince: false }
  const total = covered.reduce((sum, code) => sum + (coverage[code]?.places ?? 0), 0)
  return total <= limit ? { covered, toLoad: covered, needsProvince: false } : { covered, toLoad: [], needsProvince: true }
}
