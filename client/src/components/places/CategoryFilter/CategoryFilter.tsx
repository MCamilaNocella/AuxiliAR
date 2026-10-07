import { useId } from "react"
import type { CategoryId } from "@/data/resources"
import { categoryLabel } from "@/utils/places"
import type { PlaceFacet } from "@/utils/places"

type CategoryFilterProps = {
  /** The categories that have verified places under the other filters, with how many (see getPlaceFacets) */
  facets: PlaceFacet<CategoryId>[]
  value: CategoryId | null
  onChange: (category: CategoryId | null) => void
}

/** Care for people and care for animals are told apart: they are different things, and a person is never sent to the other one by mistake */
const GROUPS: { id: string, label: string, categories: CategoryId[] }[] = [
  { id: "people", label: "Atención a personas", categories: ["salud-fisica", "salud-mental", "esi"] },
  { id: "animals", label: "Atención animal", categories: ["animales"] },
]

const chipClass = (active: boolean) =>
  `min-h-11 cursor-pointer rounded-full border px-4 py-2 font-semibold ${active ? "border-control-line bg-brand font-extrabold text-on-brand" : "border-control-line bg-card text-ink hover:bg-field"}`

/**
 * The kind of care: Salud general, Salud mental, ESI, and animals when there are. Only the categories that have places are
 * offered (nothing is listed to be empty), each with how many; the chosen one stays even if another filter left it with none.
 * A place can be in several, according to the services it has verified.
 */
export const CategoryFilter = ({ facets, value, onChange }: CategoryFilterProps) => {
  const headingId = useId()
  const countOf = (category: CategoryId) => facets.find((facet) => facet.value === category)?.count ?? 0
  const groups = GROUPS.map((group) => ({ ...group, categories: group.categories.filter((category) => countOf(category) > 0 || category === value) })).filter((group) => group.categories.length > 0)
  if (groups.length === 0) return null
  // The group names only matter once there is more than one kind of care
  const showGroupNames = groups.length > 1

  return (
    <div role="group" aria-labelledby={headingId} className="flex flex-col gap-2">
      <p id={headingId} className="m-0 font-bold">
        Tipo de atención
      </p>
      <div className="flex flex-col gap-3">
        {groups.map((group, index) => (
          <div key={group.id} role={showGroupNames ? "group" : undefined} aria-label={showGroupNames ? group.label : undefined} className="flex flex-col gap-1">
            {showGroupNames && <p className="m-0 text-ink-soft">{group.label}</p>}
            <div className="flex flex-wrap gap-2">
              {index === 0 && (
                <button type="button" aria-pressed={value === null} onClick={() => onChange(null)} className={chipClass(value === null)}>
                  Todas
                </button>
              )}
              {group.categories.map((category) => (
                <button key={category} type="button" aria-pressed={value === category} onClick={() => onChange(category)} className={chipClass(value === category)}>
                  {`${categoryLabel(category)} (${countOf(category)})`}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
