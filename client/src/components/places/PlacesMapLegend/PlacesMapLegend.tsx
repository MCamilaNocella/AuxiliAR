import { useMemo } from "react"
import { Brain, HeartHandshake, HeartPulse, PawPrint } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { CategoryId } from "@/data/resources"
import { categoryLabel, getMapPins } from "@/utils/places"
import type { PlaceEntry } from "@/utils/places"

/** The symbol of each category on the pins (the same as in the pins of the map, drawn by PlacesMap.glyphs) */
const LEGEND_ICONS: Partial<Record<CategoryId, LucideIcon>> = { "salud-fisica": HeartPulse, "salud-mental": Brain, esi: HeartHandshake, animales: PawPrint }

/** What the symbols of the map mean: only those of the pins drawn. It sits above the map, next to the search box and the Lista/Mapa switch */
export const PlacesMapLegend = ({ entries }: { entries: PlaceEntry[] }) => {
  const legend = useMemo(() => [...new Set(getMapPins(entries).map(({ category }) => category))], [entries])
  if (legend.length === 0) return null
  return (
    <ul role="list" aria-label="Qué significa el símbolo de cada punto" className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-ink-soft">
      {legend.map((category) => {
        const Icon = LEGEND_ICONS[category] ?? HeartPulse
        return (
          <li key={category} className="inline-flex items-center gap-1.5">
            <Icon aria-hidden="true" className="size-5 shrink-0 text-brand" />
            {categoryLabel(category)}
          </li>
        )
      })}
    </ul>
  )
}
