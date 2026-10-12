import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react"
import { ActionLink } from "@/components/health/ActionLink"
import { Brain, HeartHandshake, HeartPulse, PawPrint } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { CategoryId } from "@/data/resources"
import { categoryLabel, countApproximate, countUnmapped, getMapPins } from "@/utils/places"
import type { PlaceEntry } from "@/utils/places"
import { PlaceCard } from "../PlaceCard"

/** The symbol of each category on the pins (the same as in the pins of the map, drawn by PlacesMap.glyphs) */
const LEGEND_ICONS: Partial<Record<CategoryId, LucideIcon>> = { "salud-fisica": HeartPulse, "salud-mental": Brain, esi: HeartHandshake, animales: PawPrint }

// Leaflet and its styles are downloaded only when the map is opened
const PlacesMap = lazy(() => import("../PlacesMap/PlacesMap"))

type PlacesMapViewProps = {
  /** The places of the current search and filter: the same ones as the list */
  entries: PlaceEntry[]
  /** Opens the full information of a place (the explorer's panel) */
  onOpen: (placeId: string) => void
  onBackToList: () => void
}

/**
 * The "Mapa" side of the explorer. It draws only the places with verified coordinates and says so when some of the
 * results can't be on the map; those are still in the list. A tapped pin shows the place's summary (the same card as
 * the list) and its "Ver información" opens the full panel.
 */
export const PlacesMapView = ({ entries, onOpen, onBackToList }: PlacesMapViewProps) => {
  // Stable while the results are the same: the map redraws and re-frames only when the places shown change
  const pins = useMemo(() => getMapPins(entries), [entries])
  const unmapped = countUnmapped(entries)
  const approximate = countApproximate(entries)
  // What the symbols on this map mean: only those of the pins drawn
  const legend = [...new Set(pins.map(({ category }) => category))]
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  // A new search or filter that leaves the selected place out simply has nothing selected
  const selected = pins.some(({ id }) => id === selectedId) ? entries.find(({ place }) => place.id === selectedId) : undefined

  // The summary shows up below the map: bring it into view without moving focus (it is announced instead)
  useEffect(() => {
    if (selected) summaryRef.current?.scrollIntoView({ block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })
  }, [selected])

  if (pins.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-2xl border-2 border-line-strong bg-card p-4">
        <p className="m-0 text-lg font-bold">Ninguno de estos lugares se puede mostrar en el mapa.</p>
        <p className="m-0 text-ink-soft">
          {unmapped === 1 ? "Este lugar todavía no tiene una ubicación verificada." : `Estos ${unmapped} lugares todavía no tienen una ubicación verificada.`} En la lista
          está toda su información.
        </p>
        <ActionLink onClick={onBackToList} variant="primary">
          Volver a la lista
        </ActionLink>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <Suspense fallback={<p role="status" className="m-0 flex h-80 items-center justify-center rounded-2xl border-2 border-line-strong bg-field text-muted">Cargando mapa…</p>}>
        <PlacesMap pins={pins} selectedId={selected?.place.id ?? null} onSelect={setSelectedId} />
      </Suspense>

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

      {approximate > 0 && (
        <p className="m-0 text-ink-soft">
          {approximate === 1 ? "La ubicación de este punto es aproximada: marca la dirección, no necesariamente la entrada." : "Las ubicaciones son aproximadas: marcan la dirección, no necesariamente la entrada."}
        </p>
      )}

      {unmapped > 0 && (
        <p className="m-0 text-ink-soft">
          {unmapped === 1 ? "1 lugar no tiene una ubicación verificada y no aparece en el mapa." : `${unmapped} lugares no tienen una ubicación verificada y no aparecen en el mapa.`}{" "}
          <button type="button" onClick={onBackToList} className="cursor-pointer border-0 bg-transparent p-0 font-bold text-brand underline underline-offset-4">
            Verlos en la lista
          </button>
        </p>
      )}

      <div ref={summaryRef} aria-live="polite">
        {selected ? (
          <PlaceCard entry={selected} onOpen={onOpen} />
        ) : (
          <p className="m-0 text-muted">Tocá un punto del mapa para ver el lugar. La lista tiene los mismos lugares y todas las acciones.</p>
        )}
      </div>
    </div>
  )
}
