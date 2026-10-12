/*
 * What the Mapa AuxiliAR can show for each quick filter, per province, for the coverage index (coverage.json).
 *
 * It does not copy the rules of visibility: it CALLS the app's own functions (selectPlaces with the gratuity-confirmed scope the
 * explorer always uses, and isMappable), loaded the way resources-sync loads the categories. If those rules change, the index
 * changes with them, and `resources:check` notices.
 *
 * What is stored are dates, not counts: a count would be true on one day only. For each filter:
 *   list: the first day on which no place is visible in the list any more (the explorer shows a place on a day when
 *         the day is BEFORE its nextReviewDue, so that date itself is already out)
 *   map:  the same, for the places that also have verified coordinates (the pins); never later than `list`
 * A filter with nothing visible has no entry. Both are meant to be read as "visible while day < date".
 */
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const clientRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")

/** Before any date a review can have: what is visible with every review still to come */
const FAR_PAST = "0001-01-01"

/** Every date on which something of a place can stop being visible: the review date of the place and of each service */
const reviewDates = (places) =>
  new Set(
    places
      .flatMap((place) => [place.verification?.nextReviewDue, ...(place.services ?? []).map((service) => service.verification?.nextReviewDue)])
      .filter((date) => typeof date === "string"),
  )

/**
 * The first day on which nothing is visible any more, or null if nothing is visible at all. Visibility only ever shrinks as the
 * days pass (a review date is the only thing that changes with the day), so it can only change on those dates: the first of
 * them with nothing visible is the end, and the day before it still has something.
 */
export const firstEmptyDay = (isVisibleOn, dates) => {
  if (!isVisibleOn(FAR_PAST)) return null
  for (const date of [...dates].sort()) if (!isVisibleOn(date)) return date
  throw new Error("Algo sigue siendo visible después de todas las fechas de revisión: el índice de cobertura no puede calcular hasta cuándo")
}

/**
 * The quick-filter coverage of one province's places: { [filterId]: { list: date, map?: date } }.
 * `app` is the app's own code: { selectPlaces, PLACE_FILTERS, EMPTY_PLACE_QUERY, isMappable }.
 */
export const buildQuickFilterCoverage = (places, app) => {
  const { selectPlaces, PLACE_FILTERS, EMPTY_PLACE_QUERY, isMappable } = app
  const dates = reviewDates(places)
  const coverage = {}
  for (const { id } of PLACE_FILTERS) {
    const visible = (day) => selectPlaces(places, day, { ...EMPTY_PLACE_QUERY, filterId: id }, { confirmedOnly: true })
    const list = firstEmptyDay((day) => visible(day).length > 0, dates)
    if (list === null) continue
    const map = firstEmptyDay((day) => visible(day).some(({ place }) => isMappable(place)), dates)
    coverage[id] = map === null ? { list } : { list, map }
  }
  return coverage
}

/**
 * Loads the app's code the way the sync loads the categories (Vite, server side). `close` has to be called when done.
 * Fails loudly: with no way to apply the real rules there is no coverage index to write.
 */
export const loadApp = async () => {
  const { createServer } = await import("vite")
  const vite = await createServer({ root: clientRoot, logLevel: "error", server: { middlewareMode: true, hmr: false }, appType: "custom" })
  try {
    const places = await vite.ssrLoadModule("/src/utils/places/index.ts")
    const data = await vite.ssrLoadModule("/src/data/resources/index.ts")
    const app = { selectPlaces: places.selectPlaces, PLACE_FILTERS: places.PLACE_FILTERS, EMPTY_PLACE_QUERY: places.EMPTY_PLACE_QUERY, isMappable: data.isMappable }
    for (const [name, value] of Object.entries(app)) if (value === undefined) throw new Error(`No se pudo cargar ${name} de la app`)
    return { app, close: () => vite.close() }
  } catch (error) {
    await vite.close()
    throw error
  }
}
