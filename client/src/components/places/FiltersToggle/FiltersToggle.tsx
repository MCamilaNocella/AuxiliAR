import { forwardRef } from "react"
import { ChevronDown, SlidersHorizontal } from "lucide-react"

type FiltersToggleProps = {
  open: boolean
  /** How many filters are on (not counting the search box, which is always in sight) */
  activeCount: number
  /** The id of the panel it opens */
  controls: string
  onToggle: () => void
}

/** Opens and closes the filters panel on phones. It says how many filters are on, so a closed panel never hides that results are filtered */
export const FiltersToggle = forwardRef<HTMLButtonElement, FiltersToggleProps>(({ open, activeCount, controls, onToggle }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-expanded={open}
    aria-controls={controls}
    onClick={onToggle}
    className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-control-line bg-card px-4 py-2 font-extrabold text-ink hover:bg-field"
  >
    <SlidersHorizontal aria-hidden="true" className="size-5 shrink-0" />
    Filtros
    {activeCount > 0 && (
      <>
        <span aria-hidden="true" className="inline-flex min-w-6 items-center justify-center rounded-full bg-brand px-1.5 text-sm text-on-brand">
          {activeCount}
        </span>
        <span className="sr-only">{activeCount === 1 ? "(1 activo)" : `(${activeCount} activos)`}</span>
      </>
    )}
    <ChevronDown aria-hidden="true" className={`size-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
  </button>
))
FiltersToggle.displayName = "FiltersToggle"
