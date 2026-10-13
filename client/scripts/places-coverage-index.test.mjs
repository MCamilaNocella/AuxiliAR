/*
 * Tests of what the coverage index (src/data/resources/coverage.json, made by scripts/resources-visibility.mjs) says the Mapa AuxiliAR
 * can show for each quick filter: it has to say what the explorer shows, on every day, with the same rules (no copy of them), tell the
 * pins from the list, and never promise what the explorer would leave out. The places of these tests are made up.
 *   npm run places:test
 */
import assert from "node:assert/strict"
import { dirname, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const { createServer } = await import("vite")
const vite = await createServer({ root, logLevel: "error", server: { middlewareMode: true }, appType: "custom" })

const { createElement } = await import("react")
const { renderToStaticMarkup } = await import("react-dom/server")
const { MemoryRouter } = await import("react-router")
const places = await vite.ssrLoadModule("/src/utils/places/index.ts")
const data = await vite.ssrLoadModule("/src/data/resources/index.ts")
const { PlacesExplorer } = await vite.ssrLoadModule("/src/components/places/PlacesExplorer/index.ts")
const { quickFilterAvailability } = await vite.ssrLoadModule("/src/components/health/MapAccess/quickFilterAvailability.ts")
const { MapAccess } = await vite.ssrLoadModule("/src/components/health/MapAccess/index.ts")
const { centersLink } = await vite.ssrLoadModule("/src/router/centersLink.ts")
const { buildQuickFilterCoverage } = await import("./resources-visibility.mjs")
// Registered once everything is loaded (a hook registered before a pending load could close the server in the middle of it)
after(() => vite.close())

const { EMPTY_PLACE_QUERY: EMPTY, PLACE_FILTERS, selectPlaces } = places
const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const DAY = data.todayInArgentina()
await data.loadPlaces("AR-C")
// the other provinces with places are loaded too (the explorer shows them all); `real` stays the Ciudad's places
for (const province of data.PROVINCES_WITH_PLACE_FILES) await data.loadPlaces(province)
const visibility = { selectPlaces, PLACE_FILTERS, EMPTY_PLACE_QUERY: EMPTY, isMappable: data.isMappable }

const dayBefore = (day) => new Date(Date.parse(`${day}T00:00:00Z`) - 86400000).toISOString().slice(0, 10)
const dayAfter = (day) => new Date(Date.parse(`${day}T00:00:00Z`) + 86400000).toISOString().slice(0, 10)

/** A made-up place with exactly what a test needs: its own verification, services and coordinates (nothing comes from a real one) */
const place = (id, { due = "2027-06-01", verified = true, verifiedAt = "2026-01-01", coordinates = "verified", services }) => ({
  id,
  name: `Lugar ${id}`,
  kind: "service",
  facilityType: "health-center",
  address: { street: "Calle", number: "1", province: "AR-C" },
  coordinates: { lat: -34.6, lng: -58.4, precision: "exact", status: coordinates },
  verification: { status: verified ? "verified" : "needs-review", ...(verifiedAt ? { verifiedAt } : {}), nextReviewDue: due },
  services,
})
const free = (type, extra = {}) => ({ id: type, type, cost: "free", source: { organization: "Fuente de prueba", note: "Dice que es gratuita." }, ...extra })

const SCENARIO = [
  // in the list and on the map until its review date
  place("con-pin", { due: "2027-03-01", services: [free("nutrition-care")] }),
  // in the list only: its point was not verified
  place("solo-lista", { due: "2027-02-01", coordinates: "unverified", services: [free("physical-activity")] }),
  // the establishment lasts longer than its service: the service's own review date decides
  place("servicio-vence-antes", { due: "2027-06-01", services: [free("dentistry", { verification: { status: "verified", verifiedAt: "2026-01-01", nextReviewDue: "2027-04-01" } })] }),
  // gratuity not documented: "free" said only by the establishment (no source note), and an unknown cost
  place("gratuidad-sin-nota", { due: "2027-06-01", services: [{ id: "primary-care", type: "primary-care", cost: "free" }] }),
  place("costo-desconocido", { due: "2027-06-01", services: [{ id: "vaccination", type: "vaccination", source: { organization: "Fuente", note: "Nota." } }] }),
  // not verified, and verified without the day it was verified: the explorer shows neither
  place("sin-verificar", { verified: false, services: [free("emergency-room")] }),
  place("sin-fecha-de-verificacion", { verifiedAt: null, services: [free("mental-health-care")] }),
]
const NOTHING = ["medical", "vaccination", "emergency", "mental-health"]
const asIndex = (list) => ({ "AR-C": { places: list.length, currentUntil: null, categories: [], serviceTypes: [], divisions: [], quickFilters: buildQuickFilterCoverage(list, visibility) } })

/** What the explorer shows on a day: the oracle the index is compared with (pins: a place on the map; list: only in the list) */
const explorerSays = (list, filterId, day) => {
  const entries = selectPlaces(list, day, { ...EMPTY, filterId }, { confirmedOnly: true })
  return entries.some(({ place: shown }) => data.isMappable(shown)) ? "pins" : entries.length > 0 ? "list" : "none"
}
const reviewDatesOf = (list) => [...new Set(list.flatMap((entry) => [entry.verification.nextReviewDue, ...entry.services.map((service) => service.verification?.nextReviewDue)]).filter(Boolean))]

test("the index says what the explorer shows, for every filter, on every day around a review date", () => {
  const coverage = asIndex(SCENARIO)
  const days = ["2000-01-01", DAY, "2100-01-01", ...reviewDatesOf(SCENARIO).flatMap((date) => [dayBefore(date), date, dayAfter(date)])]
  assert.ok(days.length >= 15)
  for (const { id } of PLACE_FILTERS) {
    for (const day of days) assert.equal(quickFilterAvailability(id, day, coverage), explorerSays(SCENARIO, id, day), `${id} on ${day}`)
  }
})

test("a review date is already out: visible the day before, gone on the day itself", () => {
  const coverage = asIndex(SCENARIO)
  const at = (filter, day) => quickFilterAvailability(filter, day, coverage)
  // pins until the place's date
  assert.equal(at("nutrition-food", "2027-02-28"), "pins")
  assert.equal(at("nutrition-food", "2027-03-01"), "none")
  assert.equal(coverage["AR-C"].quickFilters["nutrition-food"].map, "2027-03-01")
  // the place without a verified point: the list until its date, never pins
  assert.equal(at("physical-activity", "2027-01-31"), "list")
  assert.equal(at("physical-activity", "2027-02-01"), "none")
  assert.equal(coverage["AR-C"].quickFilters["physical-activity"].map, undefined)
  // the service that expires before its establishment: its own date is the end
  assert.equal(at("dentistry", "2027-03-31"), "pins")
  assert.equal(at("dentistry", "2027-04-01"), "none")
  assert.equal(coverage["AR-C"].quickFilters.dentistry.list, "2027-04-01")
  // "Todos" lasts while any filter has something
  assert.equal(at("all", "2027-03-31"), "pins")
  assert.equal(at("all", "2027-04-01"), "none")
})

test("gratuity not documented, unverified and never-verified places make no entry", () => {
  const filters = asIndex(SCENARIO)["AR-C"].quickFilters
  for (const id of NOTHING) {
    assert.equal(filters[id], undefined, `${id} has nothing the explorer can show`)
    for (const day of ["2000-01-01", DAY]) assert.equal(quickFilterAvailability(id, day, asIndex(SCENARIO)), "none", `${id} on ${day}`)
  }
  // the same service WITH documented gratuity does make an entry: it is the gratuity, nothing else, that left it out
  assert.ok(asIndex([place("p", { services: [free("primary-care")] })])["AR-C"].quickFilters.medical)
  // the pins are a part of the list: they never last longer
  for (const { list, map } of Object.values(filters)) if (map !== undefined) assert.ok(map <= list)
})

test("the pins and the list are told apart: a place without a verified point is in the list, not on the map", () => {
  const onlyList = [place("sin-punto", { coordinates: "unverified", services: [free("nutrition-care")] })]
  assert.equal(quickFilterAvailability("nutrition-food", DAY, asIndex(onlyList)), "list")
  assert.equal(explorerSays(onlyList, "nutrition-food", DAY), "list")
  // a second place with a point gives pins while it lasts, and then only the list is left
  const both = [...onlyList, place("con-punto", { due: "2027-01-10", services: [free("food-assistance")] })]
  assert.equal(quickFilterAvailability("nutrition-food", "2027-01-09", asIndex(both)), "pins")
  assert.equal(quickFilterAvailability("nutrition-food", "2027-01-10", asIndex(both)), "list")
  assert.equal(explorerSays(both, "nutrition-food", "2027-01-10"), "list")
})

test("the real index agrees with the explorer on the real places, around every real review date", async () => {
  const index = { ...data.COVERAGE }
  const everyPlace = await data.loadPlaces("AR-C") // the index counts every place, the sexual health batch too
  const dates = reviewDatesOf(everyPlace)
  assert.ok(dates.length >= 2)
  for (const { id } of PLACE_FILTERS) {
    for (const day of ["2000-01-01", DAY, ...dates.flatMap((date) => [dayBefore(date), date])]) {
      assert.equal(quickFilterAvailability(id, day, index), explorerSays(everyPlace, id, day), `${id} on ${day}`)
    }
  }
  // and the new subsections have nothing today
  assert.equal(quickFilterAvailability("nutrition-food", DAY, index), "none")
  assert.equal(quickFilterAvailability("physical-activity", DAY, index), "none")
})

const withEntry = (entry) => ({ "AR-C": { places: 1, currentUntil: "2099-01-01", categories: [], serviceTypes: [], divisions: [], quickFilters: entry } })
const render = (coverage, day = "2026-12-01") => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(MapAccess, { filter: "nutrition-food", topic: "alimentación y nutrición", coverage, day })))
const hrefsIn = (markup) => [...markup.matchAll(/href="([^"]+)"/g)].map((match) => match[1].replace(/&amp;/g, "&"))

test("the way to the map has three states, and never opens a filter the index says is empty", () => {
  const pins = render(withEntry({ "nutrition-food": { list: "2027-03-01", map: "2027-03-01" } }))
  assert.deepEqual(hrefsIn(pins), ["/centros?filtro=nutrition-food"])
  assert.ok(text(pins).includes("Ver el mapa de alimentación y nutrición"))

  const list = render(withEntry({ "nutrition-food": { list: "2027-03-01" } }))
  assert.deepEqual(hrefsIn(list), ["/centros?filtro=nutrition-food&vista=lista"])
  assert.ok(text(list).includes("sin ubicación en el mapa") && text(list).includes("Ver la lista de alimentación y nutrición"))

  // the pins end before the list: on that day the list is what is left
  assert.deepEqual(hrefsIn(render(withEntry({ "nutrition-food": { list: "2027-03-01", map: "2026-12-01" } }))), ["/centros?filtro=nutrition-food&vista=lista"])

  const empties = [render({}), render(withEntry({})), render(withEntry({ "physical-activity": { list: "2027-03-01", map: "2027-03-01" } })), render(withEntry({ "nutrition-food": { list: "2026-12-01" } }))]
  for (const none of empties) {
    assert.deepEqual(hrefsIn(none), ["/centros"])
    assert.ok(text(none).includes("Todavía no hay lugares verificados") && text(none).includes("Ver el mapa general"))
    assert.ok(!none.includes("filtro="), "no filter is switched on")
  }
})

test("the list view exists and opens with a filter on", () => {
  assert.equal(centersLink({ filter: "nutrition-food", list: true }), "/centros?filtro=nutrition-food&vista=lista")
  assert.equal(centersLink({ list: true }), "/centros?vista=lista")
  assert.equal(centersLink({ filter: "emergency", query: "oftalm" }), "/centros?filtro=emergency&buscar=oftalm", "the existing links are as they were")
  // the explorer opens the list for ?vista=lista (on a big screen too) with the filter active
  const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ["/centros?filtro=vaccination&vista=lista"] }, createElement(PlacesExplorer, { map: true, filters: ["vaccination", "nutrition-food"] })))
  assert.match(html, /aria-pressed="true"[^>]*>(?:<[^>]+>)*Lista</)
  assert.ok(text(html).includes("Tipo: Vacunación"))
})
