/*
 * Tests of the quick filters "Alimentación y nutrición" and "Actividad física y bienestar" of the Mapa AuxiliAR: what each one
 * groups, that "Atención médica" stays as it was, that a filter with no place to show is not offered (a link to it is ignored),
 * and that nothing is made up: the real data has no such service yet, so the places of these tests are copies of a real one.
 *   npm run places:test
 */
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const { createServer } = await import("vite")
const vite = await createServer({ root, logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())

const { createElement } = await import("react")
const { renderToStaticMarkup } = await import("react-dom/server")
const { MemoryRouter } = await import("react-router")
const places = await vite.ssrLoadModule("/src/utils/places/index.ts")
const data = await vite.ssrLoadModule("/src/data/resources/index.ts")
const { PlacesExplorer } = await vite.ssrLoadModule("/src/components/places/PlacesExplorer/index.ts")
const taxonomy = JSON.parse(await readFile(join(root, "src/data/resources/taxonomy.json"), "utf8"))

const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const DAY = data.todayInArgentina()
const real = await data.loadPlaces("AR-C")
// the other provinces with places are loaded too (the explorer shows them all); `real` stays the Ciudad's places
for (const province of ["AR-B", "AR-F", "AR-T", "AR-X"]) await data.loadPlaces(province)
const { EMPTY_PLACE_QUERY: EMPTY, PLACE_FILTERS, selectPlaces, quickFilterHasData, offeredQuickFilters } = places

const NUTRITION = ["nutrition-care", "food-assistance", "food-program-enrollment"]
const ACTIVITY = ["physical-activity"]
const FREE_NOTE = { organization: "Fuente de prueba", url: "https://example.org/prueba", note: "Nota de prueba que dice que es gratuita." }
const filterOf = (id) => PLACE_FILTERS.find((filter) => filter.id === id)

// A place made up from a copy of a real one, with only the services given
const madeUp = (id, types) => {
  const copy = structuredClone(real.find(({ id: realId }) => realId === "cesac-3"))
  copy.id = id
  copy.name = `Lugar de prueba ${id}`
  copy.services = types.map((type) => ({ id: type, type, cost: "free", source: FREE_NOTE }))
  return copy
}
const WITH_NEW = [...real, madeUp("prueba-nutricion", ["nutrition-care"]), madeUp("prueba-comedor", ["food-assistance", "food-program-enrollment"]), madeUp("prueba-actividad", ["physical-activity"])]
const ask = (criteria, list = WITH_NEW) => selectPlaces(list, DAY, { ...EMPTY, ...criteria }).map(({ place }) => place.id).sort()

test("the two filters group exactly the new service types, all of Salud general", () => {
  assert.deepEqual(filterOf("nutrition-food").types, NUTRITION)
  assert.equal(filterOf("nutrition-food").label, "Alimentación y nutrición")
  assert.deepEqual(filterOf("physical-activity").types, ACTIVITY)
  assert.equal(filterOf("physical-activity").label, "Actividad física y bienestar")
  for (const type of [...NUTRITION, ...ACTIVITY]) {
    assert.deepEqual(taxonomy.serviceTypes.find(({ id }) => id === type).categories, ["salud-fisica"], type)
  }
  // no other filter has them, and they are not mixed with each other
  for (const filter of PLACE_FILTERS.filter(({ id }) => id !== "nutrition-food" && id !== "physical-activity" && id !== "all")) {
    for (const type of [...NUTRITION, ...ACTIVITY]) assert.ok(!filter.types.includes(type), `${filter.id} has ${type}`)
  }
  assert.ok(filterOf("nutrition-food").onlyWithData && filterOf("physical-activity").onlyWithData)
})

test("'Atención médica' and the other filters are exactly as they were", () => {
  const expected = {
    medical: ["primary-care", "specialty-care", "ophthalmology", "diagnostic-imaging", "laboratory", "pharmacy"],
    "mental-health": ["mental-health-care", "mental-health-emergency"],
    "sexual-health": ["sexual-reproductive-health", "contraception", "emergency-contraception", "condoms", "pregnancy-care", "sti-testing-care", "ive-ile-care", "sexual-health-counseling"],
    vaccination: ["vaccination"],
    dentistry: ["dentistry"],
    emergency: ["emergency-room", "mental-health-emergency"],
    "animal-health": ["rabies-vaccination", "spaying-neutering", "veterinary-care", "zoonosis"],
  }
  for (const [id, types] of Object.entries(expected)) {
    assert.deepEqual(filterOf(id).types, types, id)
    assert.ok(!filterOf(id).onlyWithData, `${id} is offered as before`)
  }
  assert.equal(filterOf("medical").label, "Atención médica")
  assert.deepEqual(PLACE_FILTERS.map(({ id }) => id), ["all", ...Object.keys(expected), "nutrition-food", "physical-activity"])
})

test("each filter finds the places that have a service of it, and 'Atención médica' does not", () => {
  assert.deepEqual(ask({ filterId: "nutrition-food" }), ["prueba-comedor", "prueba-nutricion"])
  assert.deepEqual(ask({ filterId: "physical-activity" }), ["prueba-actividad"])
  const medical = ask({ filterId: "medical" })
  for (const id of ["prueba-nutricion", "prueba-comedor", "prueba-actividad"]) assert.ok(!medical.includes(id), `${id} is not medical care`)
  // the real places answer "Atención médica" the same with or without the made-up ones
  assert.deepEqual(medical, ask({ filterId: "medical" }, real))
  // they are Salud general, and the service type filter finds them too
  for (const id of ["prueba-nutricion", "prueba-comedor", "prueba-actividad"]) assert.ok(ask({ category: "salud-fisica" }).includes(id), id)
  assert.deepEqual(ask({ type: "food-program-enrollment" }), ["prueba-comedor"])
})

test("a filter with no place to show is not offered; with one it is", () => {
  const candidates = ["medical", "dentistry", "nutrition-food", "physical-activity"]
  const realEntries = selectPlaces(real, DAY, EMPTY)
  assert.equal(quickFilterHasData("nutrition-food", realEntries), false)
  assert.equal(quickFilterHasData("physical-activity", realEntries), false)
  assert.deepEqual(offeredQuickFilters(candidates, realEntries), ["medical", "dentistry"], "the real data has none of the new services yet")

  assert.deepEqual(offeredQuickFilters(candidates, selectPlaces(WITH_NEW, DAY, EMPTY)), candidates)
  // each one on its own
  const onlyNutrition = selectPlaces([...real, madeUp("prueba-nutricion", ["nutrition-care"])], DAY, EMPTY)
  assert.deepEqual(offeredQuickFilters(candidates, onlyNutrition), ["medical", "dentistry", "nutrition-food"])
  const onlyActivity = selectPlaces([...real, madeUp("prueba-actividad", ["physical-activity"])], DAY, EMPTY)
  assert.deepEqual(offeredQuickFilters(candidates, onlyActivity), ["medical", "dentistry", "physical-activity"])
  // the filters that existed before keep being offered whatever the data
  assert.deepEqual(offeredQuickFilters(["animal-health", "vaccination"], []), ["animal-health", "vaccination"])
  // a context that does not list them never offers them
  assert.deepEqual(offeredQuickFilters(["medical"], selectPlaces(WITH_NEW, DAY, EMPTY)), ["medical"])
})

test("a service that is not current does not make a filter offered", () => {
  const expired = madeUp("prueba-vencido", ["physical-activity"])
  expired.verification = { ...expired.verification, nextReviewDue: "2020-01-01" }
  assert.deepEqual(offeredQuickFilters(["physical-activity"], selectPlaces([...real, expired], DAY, EMPTY)), [])
})

test("links: the new filters are valid in the URL and travel in it; unknown ones are ignored", () => {
  for (const id of ["nutrition-food", "physical-activity"]) {
    const query = places.placeQueryFromParams(new URLSearchParams(`filtro=${id}`))
    assert.equal(query.filterId, id)
    assert.equal(places.placeQueryToParams(new URLSearchParams(), query).get("filtro"), id)
    assert.equal(places.quickFilterLabel(id), filterOf(id).label)
  }
  assert.equal(places.placeQueryFromParams(new URLSearchParams("filtro=alimentos")).filterId, "all")
})

const render = (url, filters) => text(renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(PlacesExplorer, { map: true, filters }))))
const ALL_FILTERS = ["medical", "mental-health", "sexual-health", "vaccination", "dentistry", "emergency", "animal-health", "nutrition-food", "physical-activity"]

test("the explorer ignores a link to a filter that has nothing to show: no chip, no empty list", () => {
  // The real data has no such service. Rendering is on the server, where nothing is loaded yet: either way the filter is not applied
  for (const id of ["nutrition-food", "physical-activity"]) {
    const html = render(`/centros?vista=lista&filtro=${id}`, ALL_FILTERS)
    assert.ok(!html.includes(`Tipo: ${filterOf(id).label}`), `${id} is not shown as an active filter`)
  }
  // the filters that existed are still applied
  assert.ok(render("/centros?vista=lista&filtro=dentistry", ALL_FILTERS).includes("Tipo: Odontología"))
})
