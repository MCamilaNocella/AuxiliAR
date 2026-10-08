import { useId } from "react"

type FreeFilterProps = {
  /** How many places have a service with verified gratuity under the other filters (see getPlaceFacets) */
  count: number
  checked: boolean
  onChange: (checked: boolean) => void
}

/**
 * "Solo gratuidad verificada": only the services whose source says they are free, one by one. It is offered when there is
 * at least one (nothing is listed to find it empty) and stays while it is on, so it can always be turned off. It says what
 * it means in one line: a service whose cost is not known is not "paid", it is just not in this list.
 */
export const FreeFilter = ({ count, checked, onChange }: FreeFilterProps) => {
  const helpId = useId()
  if (count === 0 && !checked) return null

  return (
    <div className="flex items-end">
      <label className="flex min-h-11 w-full cursor-pointer items-start gap-3 rounded-xl border border-control-line bg-field px-3 py-2">
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-describedby={helpId} className="mt-1 size-5 shrink-0 cursor-pointer accent-brand" />
        <span className="min-w-0">
          <span className="block font-bold">{`Solo gratuidad verificada (${count})`}</span>
          <span id={helpId} className="block text-ink-soft">
            La fuente oficial dice que esa prestación es gratuita.
          </span>
        </span>
      </label>
    </div>
  )
}
