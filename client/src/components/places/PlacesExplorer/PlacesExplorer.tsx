import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router"
import { todayInArgentina } from "@/data/resources"
import type { ProvinceCode, Resource } from "@/data/resources"
import { usePlaces } from "@/hooks/usePlaces"
import { PLACE_FILTER_PARAM, PLACE_PARAM, PLACE_QUERY_PARAM, PLACE_VIEW_MAP, PLACE_VIEW_PARAM } from "@/router/paths"
import { filterPlaces, getPlaceEntries } from "@/utils/places"
import type { PlaceFilterId, PlacesScope } from "@/utils/places"
import { PlaceDetail } from "../PlaceDetail"
import { PlaceList } from "../PlaceList"
import { PlacesMapView } from "../PlacesMapView"
import { PlacesToolbar } from "../PlacesToolbar"
import { PlacesViewSwitch } from "../PlacesViewSwitch"
import type { PlacesView } from "../PlacesViewSwitch"
import { PLACES_EXPLORER_INTRO } from "./PlacesExplorer.constants"

const NO_PLACES: readonly Resource[] = []
const NO_FILTERS: PlaceFilterId[] = []

const buttonClass = "inline-flex min-h-11 cursor-pointer items-center rounded-xl border border-control-line bg-field px-4 py-2 font-extrabold"

/**
 * Finds verified places (list, search, simple filters) and opens the information of each one in a panel.
 * Shows only what is verified and hasn't expired today. The open place lives in the URL (?lugar=<id>) so it can be
 * linked and Back closes it. It is contextual: the section that embeds it decides the scope and the filters, and
 * provides the heading.
 */
type PlacesExplorerProps = {
  province?: ProvinceCode
  /** What belongs to the place where it is embedded; out-of-scope services are hidden everywhere. No scope: everything */
  scope?: PlacesScope
  /** Filters shown besides "Todos", suited to the context. None: no chips. Pass a stable value (a constant) */
  filters?: PlaceFilterId[]
  intro?: string
  /** Adds the "Lista | Mapa" switch. The list stays the main view; the map shows the places with verified coordinates */
  map?: boolean
}

export const PlacesExplorer = ({ province = "AR-C", scope, filters = NO_FILTERS, intro = PLACES_EXPLORER_INTRO, map = false }: PlacesExplorerProps) => {
  const state = usePlaces(province)
  // One day for the whole visit: what expires is decided against it
  const [day] = useState(() => todayInArgentina())
  const [searchParams, setSearchParams] = useSearchParams()
  // A link can open the explorer with a search or one of this context's filters already applied (?filtro=, ?buscar=)
  const [query, setQuery] = useState(() => searchParams.get(PLACE_QUERY_PARAM) ?? "")
  const [filterId, setFilterId] = useState<PlaceFilterId>(() => {
    const requested = searchParams.get(PLACE_FILTER_PARAM) as PlaceFilterId | null
    return requested && filters.includes(requested) ? requested : "all"
  })
  const navigate = useNavigate()
  const location = useLocation()
  const countRef = useRef<HTMLParagraphElement>(null)
  const lastOpenId = useRef<string | null>(null)

  const places = state.status === "ready" ? state.places : NO_PLACES
  const allEntries = useMemo(() => getPlaceEntries(places, day, "all", scope), [places, day, scope])
  const results = useMemo(() => filterPlaces(places, day, { query, filterId, scope }), [places, day, query, filterId, scope])

  // List or map: in the URL (?vista=mapa) so it survives Back and links; search and filters are the same for both
  const view: PlacesView = map && searchParams.get(PLACE_VIEW_PARAM) === PLACE_VIEW_MAP ? "map" : "list"
  const changeView = (next: PlacesView) =>
    setSearchParams(
      (previous) => {
        const params = new URLSearchParams(previous)
        if (next === "map") params.set(PLACE_VIEW_PARAM, PLACE_VIEW_MAP)
        else params.delete(PLACE_VIEW_PARAM)
        return params
      },
      { replace: true, preventScrollReset: true },
    )

  const placeParam = searchParams.get(PLACE_PARAM)
  const activeEntry = allEntries.find(({ place }) => place.id === placeParam)
  const activeId = activeEntry?.place.id ?? null

  // A link to a place that doesn't exist (or isn't current anymore) just opens the list
  useEffect(() => {
    if (state.status !== "ready" || !placeParam || activeEntry) return
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        next.delete(PLACE_PARAM)
        return next
      },
      { replace: true, preventScrollReset: true },
    )
  }, [state.status, placeParam, activeEntry, setSearchParams])

  // Closing the panel puts focus back on the card that opened it (or on the results when it came from a link)
  useEffect(() => {
    if (activeId) {
      lastOpenId.current = activeId
      return
    }
    const id = lastOpenId.current
    if (!id) return
    lastOpenId.current = null
    const trigger = document.querySelector<HTMLElement>(`[data-place-trigger="${CSS.escape(id)}"]`)
    ;(trigger ?? countRef.current)?.focus({ preventScroll: true })
  }, [activeId])

  const open = (placeId: string) =>
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        next.set(PLACE_PARAM, placeId)
        return next
      },
      { preventScrollReset: true, state: { placeOpened: true } },
    )

  // Opened from the list: Back is the natural close. Opened from a link: just drop the param
  const close = () => {
    if ((location.state as { placeOpened?: boolean } | null)?.placeOpened) {
      navigate(-1)
      return
    }
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        next.delete(PLACE_PARAM)
        return next
      },
      { replace: true, preventScrollReset: true },
    )
  }

  const clearSearch = () => {
    setQuery("")
    setFilterId("all")
  }

  const count =
    state.status === "loading"
      ? "Cargando lugares…"
      : state.status === "error"
        ? ""
        : `${results.length} ${results.length === 1 ? "lugar encontrado" : "lugares encontrados"}`

  return (
    <div className="mt-2 flex flex-col gap-5">
      <p className="m-0 max-w-prose text-muted">{intro}</p>

      <PlacesToolbar filters={filters} query={query} onQueryChange={setQuery} filterId={filterId} onFilterChange={setFilterId} />

      {map && <PlacesViewSwitch view={view} onChange={changeView} />}

      <p ref={countRef} role="status" aria-live="polite" tabIndex={-1} className="m-0 font-bold outline-none">
        {count}
      </p>

      {state.status === "error" && (
        <div className="flex flex-col items-start gap-3">
          <p className="m-0">No pudimos cargar la información. Revisá tu conexión e intentá de nuevo.</p>
          <button type="button" onClick={state.retry} className={buttonClass}>
            Reintentar
          </button>
        </div>
      )}

      {state.status === "ready" && allEntries.length === 0 && (
        <p className="m-0">
          Por ahora no hay información verificada y vigente para mostrar acá. AuxiliAR solo muestra datos mientras están dentro de su plazo de revisión.
        </p>
      )}

      {state.status === "ready" && allEntries.length > 0 && results.length === 0 && (
        <div className="flex flex-col items-start gap-3">
          <p className="m-0">No encontramos lugares con esa búsqueda. Probá con otras palabras o quitá el filtro.</p>
          <button type="button" onClick={clearSearch} className={buttonClass}>
            Borrar búsqueda y filtros
          </button>
        </div>
      )}

      {results.length > 0 && view === "list" && <PlaceList entries={results} onOpen={open} />}
      {results.length > 0 && view === "map" && <PlacesMapView entries={results} onOpen={open} onBackToList={() => changeView("list")} />}

      {activeEntry && <PlaceDetail entry={activeEntry} onClose={close} />}
    </div>
  )
}
