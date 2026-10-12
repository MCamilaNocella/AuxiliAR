import { useId } from "react"
import { Search } from "lucide-react"
import { PLACE_FILTERS } from "@/utils/places"
import type { PlaceFilterId } from "@/utils/places"

type PlacesToolbarProps = {
  /** Filters shown besides "Todos"; none means no chips (the search box only) */
  filters: PlaceFilterId[]
  query: string
  onQueryChange: (query: string) => void
  filterId: PlaceFilterId
  onFilterChange: (filterId: PlaceFilterId) => void
}

/** Search box and the simple filters (one active at a time) */
export const PlacesToolbar = ({ filters, query, onQueryChange, filterId, onFilterChange }: PlacesToolbarProps) => {
  const inputId = useId()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor={inputId} className="mb-1 block font-bold">
          ¿Qué necesitás?
        </label>
        <div className="relative max-w-xl">
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted" />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            autoComplete="off"
            enterKeyHint="search"
            className="min-h-11 w-full rounded-xl border border-control-line bg-field py-2 pr-3 pl-10 text-base text-ink"
          />
        </div>
      </div>

      {filters.length > 0 && (
      <div role="group" aria-label="Filtrar por tipo de atención" className="flex flex-wrap gap-2">
        {PLACE_FILTERS.filter(({ id }) => id === "all" || filters.includes(id)).map(({ id, label }) => {
          const isActive = id === filterId
          return (
            <button
              key={id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onFilterChange(id)}
              className={`min-h-11 cursor-pointer rounded-full border px-4 py-2 font-semibold ${
                isActive ? "border-control-line bg-brand font-extrabold text-on-brand" : "border-control-line bg-card text-ink hover:bg-field"
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
      )}
    </div>
  )
}
