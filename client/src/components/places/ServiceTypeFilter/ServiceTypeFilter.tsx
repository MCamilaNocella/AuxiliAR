import { useId } from "react"
import type { ServiceType } from "@/data/resources"
import { serviceTypeLabel } from "@/utils/places"
import type { PlaceFacet } from "@/utils/places"

type ServiceTypeFilterProps = {
  /** The services that have verified places under the other filters, with how many places (see getPlaceFacets) */
  facets: PlaceFacet<ServiceType>[]
  value: ServiceType | null
  onChange: (type: ServiceType | null) => void
}

/**
 * The service ("prestación"). Only services that exist in the verified places are listed, in alphabetical order, with how many
 * places have each; if a kind of care is chosen, only the services of that kind. The chosen one stays in the list.
 */
export const ServiceTypeFilter = ({ facets, value, onChange }: ServiceTypeFilterProps) => {
  const id = useId()
  const options = [...new Set([...facets.map((facet) => facet.value), ...(value ? [value] : [])])].sort((a, b) => serviceTypeLabel(a).localeCompare(serviceTypeLabel(b), "es", { sensitivity: "base" }))
  if (options.length === 0) return null
  const countOf = (type: ServiceType) => facets.find((facet) => facet.value === type)?.count ?? 0

  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-bold">
        Prestación
      </label>
      <select
        id={id}
        value={value ?? ""}
        onChange={(event) => onChange((event.target.value || null) as ServiceType | null)}
        className="min-h-11 w-full cursor-pointer rounded-xl border border-control-line bg-field px-3 py-2 text-base text-ink"
      >
        <option value="">Todas las prestaciones</option>
        {options.map((type) => (
          <option key={type} value={type}>
            {`${serviceTypeLabel(type)} (${countOf(type)})`}
          </option>
        ))}
      </select>
    </div>
  )
}
