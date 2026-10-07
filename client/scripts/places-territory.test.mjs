/*
 * Tests of the territorial filters of the Mapa AuxiliAR: provinces with verified coverage, the division of each province
 * (comuna, partido, departamento), and telling "no results" apart from "no services". Loaded through Vite like the app does.
 *   npm run places:test
 */
import assert from "node:assert/strict"
import { readdirSync } from "node:fs"
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
const { TerritoryFilters } = await vite.ssrLoadModule("/src/components/places/TerritoryFilters/index.ts")
const { PlacesExplorer } = await vite.ssrLoadModule("/src/components/places/PlacesExplorer/index.ts")

const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const noop = () => {}
const filters = (props) =>
  renderToStaticMarkup(createElement(TerritoryFilters, { coverage: ["AR-C"], province: null, onProvinceChange: noop, zones: [], zone: null, onZoneChange: noop, ...props }))

test("the names of the division depend on the province, and are never the neighborhood", () => {
  assert.deepEqual(places.divisionNames("AR-C"), { singular: "Comuna", all: "Todas las comunas" })
  assert.deepEqual(places.divisionNames("AR-B"), { singular: "Partido", all: "Todos los partidos" })
  assert.deepEqual(places.divisionNames("AR-X"), { singular: "Departamento", all: "Todos los departamentos" })
  assert.equal(places.provinceLabel("AR-C"), "Ciudad Autónoma de Buenos Aires")
  assert.equal(places.provinceLabel("AR-B"), "Buenos Aires")
  assert.deepEqual(places.sortDivisions(["Comuna 10", "Comuna 2", "Comuna 1", "Comuna 15", "Comuna 3"]), ["Comuna 1", "Comuna 2", "Comuna 3", "Comuna 10", "Comuna 15"])
  assert.deepEqual(places.sortDivisions(["Lomas de Zamora", "Avellaneda", "Lanús"]), ["Avellaneda", "Lanús", "Lomas de Zamora"])
})

test("the provinces offered are those with a places file: today only the Ciudad de Buenos Aires", () => {
  const files = readdirSync(join(root, "src/data/resources/places")).filter((name) => name.endsWith(".json")).map((name) => name.replace(".json", "").toUpperCase()).sort()
  assert.deepEqual([...data.PROVINCES_WITH_PLACE_FILES], files)
  assert.deepEqual([...data.PROVINCES_WITH_PLACE_FILES], ["AR-C"])
})

test("the real places: every one has its division, apart from barrio and locality, and the divisions are comunas", async () => {
  const resources = await data.loadPlaces("AR-C")
  const day = data.todayInArgentina()
  const entries = places.selectPlaces(resources, day, places.EMPTY_PLACE_QUERY)
  assert.equal(entries.length, 6)
  const facets = places.getPlaceFacets(resources, day, { ...places.EMPTY_PLACE_QUERY, province: "AR-C" })
  assert.deepEqual(Object.fromEntries(facets.zones.map(({ value, count }) => [value, count])), { "Comuna 1": 1, "Comuna 2": 1, "Comuna 3": 1, "Comuna 4": 1, "Comuna 5": 1, "Comuna 8": 1 })
  assert.deepEqual(places.getPlaceFacets(resources, day, places.EMPTY_PLACE_QUERY).provinces, [{ value: "AR-C", count: 6 }])
  // choosing a division returns exactly those places, and the map shows the same ones
  const inComuna4 = places.selectPlaces(resources, day, { ...places.EMPTY_PLACE_QUERY, province: "AR-C", zone: "Comuna 4" })
  assert.deepEqual(inComuna4.map(({ place }) => place.id), ["cesac-41"])
  assert.deepEqual(places.getMapPins(inComuna4).map(({ id }) => id), ["cesac-41"])
  // a division of another province, or none, is not a comuna of the Ciudad
  assert.equal(places.selectPlaces(resources, day, { ...places.EMPTY_PLACE_QUERY, province: "AR-B", zone: "Comuna 4" }).length, 0)
})

test("territory filters: the province select lists only the covered ones, with 'Todo el país' first", () => {
  const html = filters({})
  const content = text(html)
  assert.ok(content.includes("Provincia"))
  assert.match(html, /<option value=""[^>]*>Todo el país<\/option><option value="AR-C">Ciudad Autónoma de Buenos Aires<\/option>/)
  assert.ok(!html.includes('value="AR-B"'), "a province with no verified places is not offered")
  assert.ok(content.includes("Por ahora hay centros verificados en Ciudad Autónoma de Buenos Aires."))
  assert.ok(content.includes("que no aparezcan no quiere decir que no haya servicios"))
  // no division select until a province is chosen
  assert.ok(!content.includes("Comuna"))
  // several provinces are listed together
  assert.ok(text(filters({ coverage: ["AR-C", "AR-B"] })).includes("verificados en Ciudad Autónoma de Buenos Aires, Buenos Aires."))
  // nothing covered: nothing to choose
  assert.equal(filters({ coverage: [] }), "")
})

test("territory filters: the division of the chosen province, in numeric order, with its counts", () => {
  const zones = [{ value: "Comuna 10", count: 3 }, { value: "Comuna 2", count: 1 }, { value: "Comuna 4", count: 2 }]
  const html = filters({ province: "AR-C", zones })
  const content = text(html)
  assert.ok(content.includes("Comuna"))
  assert.match(html, /selected=""[^>]*value="AR-C"|value="AR-C"[^>]*selected=""/)
  assert.ok(content.indexOf("Todas las comunas") < content.indexOf("Comuna 2 (1)"))
  assert.ok(content.indexOf("Comuna 2 (1)") < content.indexOf("Comuna 4 (2)") && content.indexOf("Comuna 4 (2)") < content.indexOf("Comuna 10 (3)"))
  // a partido is a Partido
  const partidos = text(filters({ coverage: ["AR-B"], province: "AR-B", zones: [{ value: "Lanús", count: 2 }] }))
  assert.ok(partidos.includes("Partido") && partidos.includes("Todos los partidos") && partidos.includes("Lanús (2)"))
  // the chosen division stays even if another filter left it without places
  assert.ok(text(filters({ province: "AR-C", zones, zone: "Comuna 7" })).includes("Comuna 7 (0)"))
  // a province with no division in the data has no division select (nothing is made up)
  assert.ok(!text(filters({ province: "AR-C", zones: [] })).includes("Todas las comunas"))
  // a division is only offered inside a covered province
  assert.ok(!text(filters({ province: "AR-B", zones })).includes("Comuna 2"))
})

test("an empty result says what it is: no data, an uncovered province, or no match - never 'there are no services'", () => {
  const ask = (input) => places.emptyStateOf({ ready: true, total: 6, shown: 0, province: null, coverage: ["AR-C"], ...input })
  assert.equal(places.emptyStateOf({ ready: false, total: 0, shown: 0, province: null, coverage: [] }), null, "still loading")
  assert.equal(ask({ shown: 3 }), null)
  assert.equal(ask({ total: 0 }), "no-data")
  assert.equal(ask({ province: "AR-B" }), "uncovered")
  assert.equal(ask({ province: "AR-C" }), "no-results")
  assert.equal(ask({}), "no-results")
})

test("the messages of an empty result do not say there are no services", async () => {
  const { readFile } = await import("node:fs/promises")
  const source = await readFile(join(root, "src/components/places/PlacesExplorer/PlacesExplorer.tsx"), "utf8")
  for (const message of ["Eso no significa que no existan servicios", "Eso no significa que no haya servicios", "Que no aparezcan no quiere decir que no existan"]) assert.ok(source.includes(message), message)
  assert.ok(!/no hay (servicios|centros|hospitales) en/i.test(source), "never states an absence as a fact")
})

test("the explorer reads the territory from the URL and keeps the other params, in the same view", () => {
  const render = (url, props = {}) => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(PlacesExplorer, { map: true, ...props })))
  // while loading (a server never runs effects) the territory block, search and view switch are already there
  const html = render("/centros?provincia=AR-C&zona=Comuna%204&buscar=guardia&vista=lista")
  assert.match(html, /value="guardia"/)
  assert.match(html, /aria-pressed="true"[^>]*>(?:<[^>]+>)*Lista</)
  // an invalid province in the URL is just ignored
  assert.ok(text(render("/centros?provincia=XX&zona=Comuna%204")).includes("Cargando lugares…"))
  // the links that already exist keep working
  assert.match(render("/centros?filtro=emergency&buscar=oftalm", { filters: ["emergency"] }), /aria-pressed="true"[^>]*>Guardias</)
})
