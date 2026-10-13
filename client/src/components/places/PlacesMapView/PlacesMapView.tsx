import { lazy, Suspense, useEffect, useMemo, useState } from "react"
import { X } from "lucide-react"
import { ActionLink } from "@/components/health/ActionLink"
import { countApproximate, countUnmapped, getMapPins } from "@/utils/places"
import type { PlaceEntry, PlaceQuery } from "@/utils/places"
import { PlaceCard } from "../PlaceCard"

// Leaflet and its styles are downloaded only when the map is opened
const PlacesMap = lazy(() => import("../PlacesMap/PlacesMap"))

type PlacesMapViewProps = {
  /** The places of the current search and filter: the same ones as the list */
  entries: PlaceEntry[]
  /** What was searched and filtered: the symbol of a pin follows the services that answer it */
  query?: PlaceQuery
  /** Opens the full information of a place (the explorer's panel) */
  onOpen: (placeId: string) => void
  onBackToList: () => void
}

/**
 * The "Mapa" side of the explorer. It draws only the places with verified coordinates and says so when some of the
 * results can't be on the map; those are still in the list. A tapped pin opens the place's summary (the same card as
 * the list) in a side bar next to the map (on phones, a sheet over its lower part), so the place and the map are seen
 * together. Its "Ver información" opens the full panel; the "Cerrar" button (or Esc) folds the bar.
 */
export const PlacesMapView = ({ entries, query, onOpen, onBackToList }: PlacesMapViewProps) => {
  // Stable while the results are the same: the map redraws and re-frames only when the places shown change
  const pins = useMemo(() => getMapPins(entries, query), [entries, query])
  const unmapped = countUnmapped(entries)
  const approximate = countApproximate(entries)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  // A new search or filter that leaves the selected place out simply has nothing selected
  const selected = pins.some(({ id }) => id === selectedId) ? entries.find(({ place }) => place.id === selectedId) : undefined

  useEffect(() => {
    if (!selected) return
    const foldOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null)
    }
    document.addEventListener("keydown", foldOnEscape)
    return () => document.removeEventListener("keydown", foldOnEscape)
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
      {/* Large screens: map and side bar one next to the other. Phones: the bar is a sheet over the lower part of the map */}
      <div className="relative lg:flex lg:gap-3">
        <div className="min-w-0 flex-1">
          <Suspense fallback={<p role="status" className="m-0 flex h-80 items-center justify-center rounded-2xl border-2 border-line-strong bg-field text-muted">Cargando mapa…</p>}>
            <PlacesMap pins={pins} selectedId={selected?.place.id ?? null} onSelect={setSelectedId} />
          </Suspense>
        </div>
        <div aria-live="polite" className="contents">
          {selected && (
            <aside
              aria-label={`Información de ${selected.place.name}`}
              className="absolute inset-x-2 bottom-2 z-[1001] flex max-h-[62%] flex-col overflow-hidden rounded-2xl border-2 border-line-strong bg-card shadow-lg lg:static lg:z-auto lg:h-[min(62dvh,32rem)] lg:max-h-none lg:min-h-80 lg:w-96 lg:flex-none lg:shadow-none"
            >
              <div className="flex justify-end border-b border-line px-2 py-1">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg border-0 bg-transparent px-3 font-bold text-ink hover:bg-field"
                >
                  <X aria-hidden="true" className="size-5" />
                  Cerrar
                </button>
              </div>
              <div className="overflow-y-auto overscroll-contain p-2">
                <PlaceCard entry={selected} onOpen={onOpen} />
              </div>
            </aside>
          )}
        </div>
      </div>

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

      {!selected && <p className="m-0 text-muted">Tocá un punto del mapa para ver el lugar. La lista tiene los mismos lugares y todas las acciones.</p>}
    </div>
  )
}
