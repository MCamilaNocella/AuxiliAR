import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router"
import { DESKTOP_QUERY } from "@/components/category/CategorySidebar/CategorySidebar.constants"
import { todayInArgentina } from "@/data/resources"
import type { Resource } from "@/data/resources"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { usePlacesOf } from "@/hooks/usePlaces"
import { PLACE_PARAM, PLACE_VIEW_LIST, PLACE_VIEW_MAP, PLACE_VIEW_PARAM } from "@/router/paths"
import { EMPTY_PLACE_QUERY, getPlaceFacets, placeQueryFromParams, placeQueryToParams, emptyStateOf, planLoad, provinceLabel, resolveView, selectPlaces } from "@/utils/places"
import type { PlaceFilterId, PlaceQuery, PlacesScope } from "@/utils/places"
import { PlaceDetail } from "../PlaceDetail"
import { PlaceList } from "../PlaceList"
import { PlacesMapView } from "../PlacesMapView"
import { PlacesToolbar } from "../PlacesToolbar"
import { PlacesViewSwitch } from "../PlacesViewSwitch"
import type { PlacesView } from "../PlacesViewSwitch"
import { TerritoryFilters } from "../TerritoryFilters"
import { PLACES_EXPLORER_INTRO } from "./PlacesExplorer.constants"

const NO_PLACES: readonly Resource[] = []
const NO_FILTERS: PlaceFilterId[] = []

const buttonClass = "inline-flex min-h-11 cursor-pointer items-center rounded-xl border border-control-line bg-field px-4 py-2 font-extrabold"

/**
 * Finds verified places (list, map, search, filters) and opens the information of each one in a panel.
 * Shows only what is verified and hasn't expired today. What is asked (search, quick filter, province, division) and
 * the open place live in the URL, so a view can be linked and Back works. The list and the map are two views of the
 * same results. It is contextual: the section that embeds it decides the scope and the quick filters.
 */
type PlacesExplorerProps = {
  /** What belongs to the place where it is embedded; out-of-scope services are hidden everywhere. No scope: everything */
  scope?: PlacesScope
  /** Quick filters shown besides "Todos", suited to the context. None: no chips. Pass a stable value (a constant) */
  filters?: PlaceFilterId[]
  intro?: string
  /** Adds the "Lista | Mapa" switch: the map opens on large screens, the list on phones (or what ?vista= asks for). Same results in both */
  map?: boolean
}

export const PlacesExplorer = ({ scope, filters = NO_FILTERS, intro = PLACES_EXPLORER_INTRO, map = false }: PlacesExplorerProps) => {
  // One day for the whole visit: what expires is decided against it
  const [day] = useState(() => todayInArgentina())
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const countRef = useRef<HTMLParagraphElement>(null)
  const lastOpenId = useRef<string | null>(null)

  // What is asked, from the URL. A quick filter this context doesn't offer is ignored
  const asked = useMemo(() => placeQueryFromParams(searchParams), [searchParams])
  const query: PlaceQuery = useMemo(() => (asked.filterId === "all" || filters.includes(asked.filterId) ? asked : { ...asked, filterId: "all" }), [asked, filters])

  // Which files to download is decided from the coverage index: only the chosen province, or every covered one if they are few
  const plan = useMemo(() => planLoad({ day, province: query.province }), [day, query.province])
  const state = usePlacesOf(plan.toLoad)
  const places = state.status === "ready" ? state.places : NO_PLACES
  const allEntries = useMemo(() => selectPlaces(places, day, EMPTY_PLACE_QUERY, scope), [places, day, scope])
  const results = useMemo(() => selectPlaces(places, day, query, scope), [places, day, query, scope])
  const facets = useMemo(() => getPlaceFacets(places, day, query, scope), [places, day, query, scope])
  // Where there are verified places at all, whatever else is chosen: it doesn't move with the search
  const coverage = plan.covered

  const changeQuery = (changes: Partial<PlaceQuery>) =>
    setSearchParams((previous) => placeQueryToParams(previous, { ...query, ...changes }), { replace: true, preventScrollReset: true })

  // List or map: what the URL asks for (?vista=), or else the map on large screens and the list on phones.
  // Search and filters are the same for both: they show the same results
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const view: PlacesView = resolveView({ hasMap: map, requested: searchParams.get(PLACE_VIEW_PARAM), isDesktop })
  const changeView = (next: PlacesView) =>
    setSearchParams(
      (previous) => {
        const params = new URLSearchParams(previous)
        // Written either way, so a shared link opens the view the person was looking at
        params.set(PLACE_VIEW_PARAM, next === "map" ? PLACE_VIEW_MAP : PLACE_VIEW_LIST)
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

  const clearSearch = () => changeQuery(EMPTY_PLACE_QUERY)

  const empty = emptyStateOf({ ready: state.status === "ready", total: allEntries.length, shown: results.length, province: query.province, coverage, needsProvince: plan.needsProvince })
  const where = query.zone ? ` en ${query.zone}` : query.province ? ` en ${provinceLabel(query.province)}` : ""
  const count =
    state.status === "loading"
      ? "Cargando lugares…"
      : state.status === "error" || empty === "choose-province" || empty === "uncovered"
        ? ""
        : `${results.length} ${results.length === 1 ? "lugar encontrado" : "lugares encontrados"}${where}`

  return (
    <div className="mt-2 flex flex-col gap-5">
      <p className="m-0 max-w-prose text-muted">{intro}</p>

      <TerritoryFilters
        coverage={coverage}
        province={query.province}
        onProvinceChange={(province) => changeQuery({ province, zone: null })}
        zones={facets.zones}
        zone={query.zone}
        onZoneChange={(zone) => changeQuery({ zone })}
      />

      <PlacesToolbar filters={filters} query={query.text} onQueryChange={(text) => changeQuery({ text })} filterId={query.filterId} onFilterChange={(filterId) => changeQuery({ filterId })} />

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

      {empty === "choose-province" && <p className="m-0">Hay muchos centros para mostrarlos todos juntos: elegí una provincia para ver los de esa zona.</p>}

      {empty === "no-data" && (
        <p className="m-0">
          Por ahora no hay información verificada y vigente para mostrar acá. Eso no significa que no existan servicios: AuxiliAR solo muestra datos mientras están dentro de su
          plazo de revisión.
        </p>
      )}

      {empty === "uncovered" && query.province && (
        <div className="flex flex-col items-start gap-3">
          <p className="m-0">
            {`Todavía no tenemos centros verificados en ${provinceLabel(query.province)}. Eso no significa que no haya servicios: estamos incorporando jurisdicciones de a poco.`}
          </p>
          <button type="button" onClick={() => changeQuery({ province: null, zone: null })} className={buttonClass}>
            Ver todas las zonas con cobertura
          </button>
        </div>
      )}

      {empty === "no-results" && (
        <div className="flex flex-col items-start gap-3">
          <p className="m-0">
            {`No encontramos lugares verificados con esta búsqueda${where}. Que no aparezcan no quiere decir que no existan: solo mostramos lo que está verificado. Probá con otras palabras o quitá los filtros.`}
          </p>
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
