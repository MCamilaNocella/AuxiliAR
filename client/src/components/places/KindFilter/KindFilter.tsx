import { useId } from "react"
import { PLACE_KINDS, placeKindLabel } from "@/utils/places"
import type { PlaceFacet, PlaceKindId } from "@/utils/places"

type KindFilterProps = {
  /** The kinds of place that have results under the other filters, with how many (see getPlaceFacets) */
  facets: PlaceFacet<PlaceKindId>[]
  value: PlaceKindId | null
  onChange: (kind: PlaceKindId | null) => void
}

const chipClass = (active: boolean) =>
  `min-h-11 cursor-pointer rounded-full border px-4 py-2 font-semibold ${active ? "border-control-line bg-brand font-extrabold text-on-brand" : "border-control-line bg-card text-ink hover:bg-field"}`

/**
 * What kind of place the kind of care lists: hospitales, centros de salud, vacunatorios, guardias… Only the kinds that have places are
 * offered, each with how many; a place can be of more than one (a hospital with a vacunatorio). With a single kind there is nothing to
 * choose, so it is not shown (unless one is already chosen, which stays so it can be undone).
 */
export const KindFilter = ({ facets, value, onChange }: KindFilterProps) => {
  const headingId = useId()
  const countOf = (kind: PlaceKindId) => facets.find((facet) => facet.value === kind)?.count ?? 0
  const kinds = PLACE_KINDS.filter(({ id }) => countOf(id) > 0 || id === value)
  if (kinds.length < 2 && !value) return null

  return (
    <div role="group" aria-labelledby={headingId} className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-3">
      <p id={headingId} className="m-0 font-bold">
        Tipo de lugar
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={value === null} onClick={() => onChange(null)} className={chipClass(value === null)}>
          Todos
        </button>
        {kinds.map(({ id }) => (
          <button key={id} type="button" aria-pressed={value === id} onClick={() => onChange(id)} className={chipClass(value === id)}>
            {`${placeKindLabel(id)} (${countOf(id)})`}
          </button>
        ))}
      </div>
    </div>
  )
}
