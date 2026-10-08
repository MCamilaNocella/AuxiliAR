import { useEffect, useId, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router"
import { DESKTOP_QUERY } from "@/components/category/CategorySidebar/CategorySidebar.constants"
import { categoriesOfServiceType, todayInArgentina } from "@/data/resources"
import type { Resource } from "@/data/resources"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { usePlacesOf } from "@/hooks/usePlaces"
import { PLACE_PARAM, PLACE_VIEW_LIST, PLACE_VIEW_MAP, PLACE_VIEW_PARAM } from "@/router/paths"
import { EMPTY_PLACE_QUERY, categoryLabel, effectiveQuery, getPlaceFacets, matchingServices, withoutConditionWords, placeQueryFromParams, placeQueryToParams, emptyStateOf, planLoad, provinceLabel, quickFilterLabel, resolveView, selectPlaces, serviceTypeLabel } from "@/utils/places"
import type { PlaceFilterId, PlaceQuery, PlacesScope } from "@/utils/places"
import { ActiveFilters } from "../ActiveFilters"
import { NoCoverageHelp } from "../NoCoverageHelp"
import type { ActiveFilter } from "../ActiveFilters/ActiveFilters"
import { CategoryFilter } from "../CategoryFilter"
import { FiltersToggle } from "../FiltersToggle"
import { FreeFilter } from "../FreeFilter"
import { PlaceDetail } from "../PlaceDetail"
import { PlaceList } from "../PlaceList"
import { PlacesMapView } from "../PlacesMapView"
import { PlacesToolbar } from "../PlacesToolbar"
import { PlacesViewSwitch } from "../PlacesViewSwitch"
import { ServiceTypeFilter } from "../ServiceTypeFilter"
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
  intro?: ReactNode
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
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  // On phones the filters live in a panel that opens on demand; on large screens they are always there
  const [filtersOpen, setFiltersOpen] = useState(false)

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

  // Each change of filter is a step in the history (Back undoes it). Typing is one step: the first letter adds it and the next
  // ones replace it, so a search is not a hundred of them and Back undoes the whole word. Every other param (the view, the open place) stays
  const typingFrom = useRef<string | null>(null)
  const changeQuery = (changes: Partial<PlaceQuery>, replace = false) =>
    setSearchParams((previous) => placeQueryToParams(previous, { ...query, ...changes }), { replace, preventScrollReset: true })

  // What is typed is kept here as well as in the URL: the URL follows a moment later, and a fast typist must not lose letters in between.
  // A change that comes from outside (Back, "Borrar filtros", a link) replaces what is typed
  const [draft, setDraft] = useState(query.text)
  const pendingText = useRef<string | null>(null)
  const pendingTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => {
    if (pendingText.current !== null && query.text !== pendingText.current) return
    setDraft(query.text)
  }, [query.text])
  useEffect(() => () => clearTimeout(pendingTimer.current), [])
  const typeText = (text: string) => {
    setDraft(text)
    pendingText.current = text
    clearTimeout(pendingTimer.current)
    pendingTimer.current = setTimeout(() => { pendingText.current = null }, 600)
    // Same filters as when the word was started: still the same step. Anything else changed (a filter, Back): a new one
    const filtersNow = placeQueryToParams(searchParams, { ...query, text: "" }).toString()
    changeQuery({ text }, typingFrom.current === filtersNow)
    typingFrom.current = filtersNow
  }

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

  const showFilters = isDesktop || filtersOpen
  // Esc folds the panel and puts focus back on the button that opened it
  const foldOnEscape = (event: React.KeyboardEvent) => {
    if (event.key !== "Escape" || isDesktop) return
    event.stopPropagation()
    setFiltersOpen(false)
    toggleRef.current?.focus()
  }

  const placeParam = searchParams.get(PLACE_PARAM)
  const activeEntry = allEntries.find(({ place }) => place.id === placeParam)
  // The services of the open place that answer what was searched: the panel leads with them
  const matchingIds = useMemo(() => (activeEntry ? matchingServices(activeEntry, query).map(({ id }) => id) : []), [activeEntry, query])
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

  // Gratuity can come from the filter or from the words of the search ("gratis", "gratuita"): either way it is one filter,
  // and taking it off takes the words off the text too (they would ask for it again). The text is never changed otherwise
  const freeOn = effectiveQuery(query).free
  const setFree = (free: boolean) => changeQuery(free ? { free: true } : { free: false, text: withoutConditionWords(query.text) })

  // What is filtering right now, each one removable. A link with a filter from before ("filtro") shows up here too
  const activeFilters: ActiveFilter[] = [
    ...(query.text.trim() ? [{ key: "text", label: `Búsqueda: «${query.text.trim()}»`, onRemove: () => changeQuery({ text: "" }) }] : []),
    ...(query.filterId !== "all" ? [{ key: "quick", label: `Tipo: ${quickFilterLabel(query.filterId)}`, onRemove: () => changeQuery({ filterId: "all" }) }] : []),
    ...(query.province ? [{ key: "province", label: provinceLabel(query.province), onRemove: () => changeQuery({ province: null, zone: null }) }] : []),
    ...(query.zone ? [{ key: "zone", label: query.zone, onRemove: () => changeQuery({ zone: null }) }] : []),
    ...(query.category ? [{ key: "category", label: categoryLabel(query.category), onRemove: () => changeQuery({ category: null }) }] : []),
    ...(query.type ? [{ key: "type", label: serviceTypeLabel(query.type), onRemove: () => changeQuery({ type: null }) }] : []),
    ...(freeOn ? [{ key: "free", label: "Gratuidad verificada", onRemove: () => setFree(false) }] : []),
  ]

  // The search box is always in sight, so it doesn't count for the button that folds the other filters
  const panelFilters = activeFilters.filter(({ key }) => key !== "text").length

  // Choosing the covered places keeps whatever else was asked: nothing is cleared without the person seeing it
  const otherFilters = activeFilters.filter(({ key }) => key !== "province" && key !== "zone")
  const exploreCovered = () => changeQuery({ province: coverage.length === 1 ? coverage[0] : null, zone: null })

  const empty = emptyStateOf({ ready: state.status === "ready", total: allEntries.length, shown: results.length, province: query.province, coverage, needsProvince: plan.needsProvince })
  const where = query.zone ? ` en ${query.zone}` : query.province ? ` en ${provinceLabel(query.province)}` : ""
  const count =
    state.status === "loading"
      ? "Cargando lugares…"
      : state.status === "error" || empty === "choose-province" || empty === "uncovered"
        ? ""
        : `${results.length} ${results.length === 1 ? "lugar encontrado" : "lugares encontrados"}${where}`

  return (
    <div className="mt-2 flex flex-col gap-3 lg:gap-3.5">
      <p className="m-0 text-muted">{intro}</p>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="lg:flex-1">
          <PlacesToolbar filters={NO_FILTERS} query={draft} onQueryChange={typeText} filterId={query.filterId} onFilterChange={(filterId) => changeQuery({ filterId })} />
        </div>
        <div className="flex items-center gap-2">
          {map && <PlacesViewSwitch view={view} onChange={changeView} />}
          {!isDesktop && <FiltersToggle ref={toggleRef} open={filtersOpen} activeCount={panelFilters} controls={panelId} onToggle={() => setFiltersOpen((open) => !open)} />}
        </div>
      </div>

      {showFilters && (
        <div id={panelId} onKeyDown={foldOnEscape} className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="col-span-full">
            <CategoryFilter facets={facets.categories} value={query.category} // A service that does not belong to the new kind of care would leave nothing to show: it is dropped, any other stays
              onChange={(category) => changeQuery({ category, type: category && query.type && !categoriesOfServiceType(query.type).includes(category) ? null : query.type })} />
          </div>
          <TerritoryFilters
            coverage={coverage}
            province={query.province}
            onProvinceChange={(province) => changeQuery({ province, zone: null })}
            zones={facets.zones}
            zone={query.zone}
            onZoneChange={(zone) => changeQuery({ zone })}
          />
          <ServiceTypeFilter facets={facets.types} value={query.type} onChange={(type) => changeQuery({ type })} />
          <FreeFilter count={facets.free} checked={freeOn} onChange={setFree} />
          {activeFilters.length > 0 && <p className="order-last col-span-full m-0 text-ink-soft">Los números muestran cuántos lugares cumplen tu búsqueda y los demás filtros.</p>}
        </div>
      )}

      <ActiveFilters filters={activeFilters} onClear={clearSearch} />

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
            {"Todavía no tenemos centros verificados en " + provinceLabel(query.province) + ". Eso no significa que no haya servicios: estamos incorporando jurisdicciones de a poco."}
          </p>
          {otherFilters.length > 0 && <p className="m-0 text-ink-soft">{"Tus otros filtros siguen activos: " + otherFilters.map(({ label }) => label).join(", ") + "."}</p>}
          <NoCoverageHelp coverage={coverage} onExploreCovered={exploreCovered} />
        </div>
      )}

      {empty === "no-results" && freeOn && (
        <div className="flex flex-col items-start gap-3">
          <p className="m-0">{"No encontramos prestaciones con gratuidad verificada para esta búsqueda" + where + ". Eso no significa que no sean gratuitas: solo mostramos la gratuidad que la fuente oficial confirma."}</p>
          <p className="m-0">Si quitás este filtro, vas a ver todas las prestaciones de la búsqueda, con o sin gratuidad verificada. Consultá el costo de cada una antes de ir.</p>
          <button type="button" onClick={() => setFree(false)} className={buttonClass}>
            Quitar el filtro de gratuidad
          </button>
        </div>
      )}

      {empty === "no-results" && !freeOn && (
        <div className="flex flex-col items-start gap-3">
          <p className="m-0">
            {"No encontramos lugares verificados con esta búsqueda" + where + ". Que no aparezcan no quiere decir que no existan: solo mostramos lo que está verificado. Probá con otras palabras o quitá los filtros."}
          </p>
          <button type="button" onClick={clearSearch} className={buttonClass}>
            Borrar filtros
          </button>
          {!query.province && coverage.length > 0 && (
            <>
              <p className="m-0">Si buscás en otra zona del país, elegí tu provincia en los filtros: ahí ves si ya tenemos centros verificados cerca.</p>
              <NoCoverageHelp coverage={coverage} onExploreCovered={exploreCovered} />
            </>
          )}
        </div>
      )}

      {results.length > 0 && view === "list" && <PlaceList entries={results} onOpen={open} />}
      {results.length > 0 && view === "map" && <PlacesMapView entries={results} onOpen={open} onBackToList={() => changeView("list")} />}

      {activeEntry && <PlaceDetail entry={activeEntry} matchingIds={matchingIds} onClose={close} />}
    </div>
  )
}
