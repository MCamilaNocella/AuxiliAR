import taxonomy from "@/data/resources/taxonomy.json"
import type { ProvinceCode } from "@/data/resources"

/** The name of a province as the taxonomy writes it */
export const provinceLabel = (code: ProvinceCode) => taxonomy.provinces.find(({ id }) => id === code)?.label ?? code

/**
 * Every jurisdiction there is, told apart by whether AuxiliAR has verified places there: the covered ones first (in the
 * order of the coverage), then the others alphabetically. A person from a province without places can still choose it and
 * be told so, instead of finding that it does not exist.
 */
export const provinceOptions = (coverage: readonly ProvinceCode[]): { covered: ProvinceCode[], uncovered: ProvinceCode[] } => {
  const all = taxonomy.provinces.map(({ id }) => id as ProvinceCode)
  const covered = coverage.filter((code) => all.includes(code))
  const uncovered = all.filter((code) => !covered.includes(code)).sort((a, b) => provinceLabel(a).localeCompare(provinceLabel(b), "es", { sensitivity: "base" }))
  return { covered: [...covered], uncovered }
}

/**
 * What the administrative division of a province is called (address.department): a comuna in the Ciudad de Buenos
 * Aires, a partido in the province of Buenos Aires, a departamento in the rest. It is never the neighborhood (barrio)
 * nor the locality: those are other fields. A province whose division is called differently gets its own line here
 * when it is incorporated.
 */
export const divisionNames = (province: ProvinceCode): { singular: string, all: string } => {
  if (province === "AR-C") return { singular: "Comuna", all: "Todas las comunas" }
  if (province === "AR-B") return { singular: "Partido", all: "Todos los partidos" }
  return { singular: "Departamento", all: "Todos los departamentos" }
}

/** "Comuna 2" before "Comuna 10": names with numbers in numeric order, the rest alphabetically */
export const sortDivisions = (zones: readonly string[]) => [...zones].sort((a, b) => a.localeCompare(b, "es", { numeric: true, sensitivity: "base" }))

/**
 * Why there is nothing to show, because they are not the same thing:
 *  - "choose-province": there are too many places to show them all together: a province has to be chosen first
 *  - "no-data": there are no verified, current places at all (in this context)
 *  - "uncovered": a province was asked for where AuxiliAR has no verified places yet - not "there are no services"
 *  - "no-results": there are places, but none answers this search or these filters
 *  - null: there are results (or it is still loading)
 */
export type EmptyState = "choose-province" | "no-data" | "uncovered" | "no-results" | null

export const emptyStateOf = ({
  ready,
  total,
  shown,
  province,
  coverage,
  needsProvince = false,
}: {
  ready: boolean
  total: number
  shown: number
  province: ProvinceCode | null
  coverage: readonly ProvinceCode[]
  needsProvince?: boolean
}): EmptyState => {
  if (!ready) return null
  if (needsProvince) return "choose-province"
  // A province without verified places is known from the coverage index alone: nothing was downloaded for it
  if (province && !coverage.includes(province)) return "uncovered"
  if (shown > 0) return null
  if (total === 0) return "no-data"
  return "no-results"
}
