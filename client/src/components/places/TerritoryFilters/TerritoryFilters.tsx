import { useId } from "react"
import type { ProvinceCode } from "@/data/resources"
import { divisionNames, provinceLabel, sortDivisions } from "@/utils/places"
import type { PlaceFacet } from "@/utils/places"

type TerritoryFiltersProps = {
  /** The provinces with verified places (the coverage), not filtered by what else is chosen */
  coverage: ProvinceCode[]
  province: ProvinceCode | null
  onProvinceChange: (province: ProvinceCode | null) => void
  /** The divisions of the chosen province that have places, with how many (see getPlaceFacets) */
  zones: PlaceFacet<string>[]
  zone: string | null
  onZoneChange: (zone: string | null) => void
}

const selectClass = "min-h-11 w-full cursor-pointer rounded-xl border border-control-line bg-field px-3 py-2 text-base text-ink"

/**
 * Where: the province (only those with verified places) and, once one is chosen, its division - a comuna, a partido or a
 * departamento, depending on the province. Native selects: they work with any device and assistive technology. It says
 * which provinces are covered, so that an empty result is never read as "there are no services there". It renders into the
 * grid of the filters panel (its fields, then the note across the whole row).
 */
export const TerritoryFilters = ({ coverage, province, onProvinceChange, zones, zone, onZoneChange }: TerritoryFiltersProps) => {
  const provinceId = useId()
  const zoneId = useId()
  const coverageId = useId()
  if (coverage.length === 0) return null

  const covered = province !== null && coverage.includes(province)
  const names = province ? divisionNames(province) : null
  // The chosen division stays in the list even if another filter left it without places
  const options = sortDivisions([...new Set([...zones.map(({ value }) => value), ...(zone ? [zone] : [])])])
  const countOf = (value: string) => zones.find((entry) => entry.value === value)?.count ?? 0

  return (
    <>
        <div>
          <label htmlFor={provinceId} className="mb-1 block font-bold">
            Provincia
          </label>
          <select
            id={provinceId}
            value={covered ? province : ""}
            aria-describedby={coverageId}
            onChange={(event) => onProvinceChange((event.target.value || null) as ProvinceCode | null)}
            className={selectClass}
          >
            <option value="">Todas las zonas con cobertura</option>
            {coverage.map((code) => (
              <option key={code} value={code}>
                {provinceLabel(code)}
              </option>
            ))}
          </select>
        </div>

        {covered && names && options.length > 0 && (
          <div>
            <label htmlFor={zoneId} className="mb-1 block font-bold">
              {names.singular}
            </label>
            <select id={zoneId} value={zone ?? ""} onChange={(event) => onZoneChange(event.target.value || null)} className={selectClass}>
              <option value="">{names.all}</option>
              {options.map((value) => (
                <option key={value} value={value}>
                  {`${value} (${countOf(value)})`}
                </option>
              ))}
            </select>
          </div>
        )}

      <p id={coverageId} className="order-last col-span-full m-0 text-ink-soft">
        {coverage.length === 1
          ? `Por ahora hay centros verificados en ${provinceLabel(coverage[0])}.`
          : `Por ahora hay centros verificados en ${coverage.map(provinceLabel).join(", ")}.`}{" "}
        Que otras provincias no aparezcan no quiere decir que no haya servicios.
      </p>
    </>
  )
}
