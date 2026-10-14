import { serviceTypeLabel } from "@/utils/places"
import type { PlaceFacet } from "@/utils/places"
import type { ServiceType } from "@/data/resources"

type ServiceTypeFilterProps = {
  facets: PlaceFacet<ServiceType>[]
  value: ServiceType | null
  onChange: (type: ServiceType | null) => void
}

const chipClass = (active: boolean) =>
  `min-h-11 cursor-pointer rounded-full border px-4 py-2 font-semibold ${active ? "border-control-line bg-brand font-extrabold text-on-brand" : "border-control-line bg-card text-ink hover:bg-field"}`

/** Services available within the selected category, counted by place and narrowed by the other filters. */
export const ServiceTypeFilter = ({ facets, value, onChange }: ServiceTypeFilterProps) => {
  if (facets.length === 0 && !value) return null

  return (
    <div role="group" aria-label="Servicio" className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-3">
      <p className="m-0 font-bold">Servicio</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={value === null} onClick={() => onChange(null)} className={chipClass(value === null)}>
          Todos
        </button>
        {facets.map(({ value: type, count }) => (
          <button key={type} type="button" aria-pressed={value === type} onClick={() => onChange(type)} className={chipClass(value === type)}>
            {`${serviceTypeLabel(type)} (${count})`}
          </button>
        ))}
      </div>
    </div>
  )
}
