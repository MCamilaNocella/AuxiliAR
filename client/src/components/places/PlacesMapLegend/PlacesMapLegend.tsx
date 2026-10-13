import { useMemo } from "react"
import { Brain, HeartHandshake, HeartPulse, PawPrint } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { CategoryId } from "@/data/resources"
import { categoryLabel, getMapPins } from "@/utils/places"
import type { PlaceEntry, PlaceQuery } from "@/utils/places"

/** The symbol of each category on the pins (the same as in the pins of the map, drawn by PlacesMap.glyphs) */
const LEGEND_ICONS: Partial<Record<CategoryId, LucideIcon>> = { "salud-fisica": HeartPulse, "salud-mental": Brain, esi: HeartHandshake, animales: PawPrint }

/** What the symbols of the map mean: only those of the pins drawn. It sits above the map, right under the count of places, a bit highlighted (a bordered strip) */
export const PlacesMapLegend = ({ entries, query }: { entries: PlaceEntry[], query?: PlaceQuery }) => {
  const legend = useMemo(() => [...new Set(getMapPins(entries, query).map(({ category }) => category))], [entries, query])
  if (legend.length === 0) return null
  return (
    <ul role="list" aria-label="Qué significa el símbolo de cada punto" className="m-0 flex w-fit max-w-full list-none flex-wrap items-center gap-x-5 gap-y-1.5 rounded-xl border border-control-line bg-field px-4 py-2 font-semibold text-ink">
      {legend.map((category) => {
        const Icon = LEGEND_ICONS[category] ?? HeartPulse
        return (
          <li key={category} className="inline-flex items-center gap-2">
            <Icon aria-hidden="true" className="size-6 shrink-0 text-brand" />
            {categoryLabel(category)}
          </li>
        )
      })}
    </ul>
  )
}
