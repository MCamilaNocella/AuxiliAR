import { X } from "lucide-react"

export type ActiveFilter = { key: string, label: string, onRemove: () => void }

type ActiveFiltersProps = {
  filters: ActiveFilter[]
  onClear: () => void
}

/**
 * What is filtering the results right now, one removable chip each, and "Borrar filtros". Nothing is hidden: a person who
 * arrives with a link that has filters sees them here and can take them off. Clearing keeps the view (list or map).
 */
export const ActiveFilters = ({ filters, onClear }: ActiveFiltersProps) => {
  if (filters.length === 0) return null
  return (
    <div role="group" aria-label="Filtros activos" className="flex flex-wrap items-center gap-2">
      <ul role="list" className="m-0 flex list-none flex-wrap gap-2 p-0">
        {filters.map(({ key, label, onRemove }) => (
          <li key={key}>
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex min-h-11 max-w-full cursor-pointer items-center gap-2 rounded-full border border-control-line bg-card px-4 py-2 text-left font-semibold text-ink hover:bg-field"
            >
              <span className="min-w-0 break-words">{label}</span>
              <X aria-hidden="true" className="size-4 shrink-0" />
              <span className="sr-only">{`Quitar filtro: ${label}`}</span>
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={onClear} className="inline-flex min-h-11 cursor-pointer items-center rounded-xl border border-control-line bg-field px-4 py-2 font-extrabold">
        Borrar filtros
      </button>
    </div>
  )
}
