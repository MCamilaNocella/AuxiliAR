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

test("the provinces offered are those with a places file: the Ciudad de Buenos Aires and the provinces of the verified lists", () => {
  const files = readdirSync(join(root, "src/data/resources/places")).filter((name) => name.endsWith(".json")).map((name) => name.replace(".json", "").toUpperCase()).sort()
  assert.deepEqual([...data.PROVINCES_WITH_PLACE_FILES], files)
  assert.deepEqual([...data.PROVINCES_WITH_PLACE_FILES], ["AR-B", "AR-C", "AR-F", "AR-N", "AR-R", "AR-S", "AR-T", "AR-V", "AR-X"])
})

test("the real places: every one has its division, apart from barrio and locality, and the divisions are comunas", async () => {
  const resources = await data.loadPlaces("AR-C")
  const day = data.todayInArgentina()
  const entries = places.selectPlaces(resources, day, places.EMPTY_PLACE_QUERY)
  assert.equal(entries.length, 68)
  const facets = places.getPlaceFacets(resources, day, { ...places.EMPTY_PLACE_QUERY, province: "AR-C" })
  assert.deepEqual(Object.fromEntries(facets.zones.map(({ value, count }) => [value, count])), { "Comuna 1": 3, "Comuna 2": 3, "Comuna 3": 4, "Comuna 4": 16, "Comuna 5": 2, "Comuna 6": 2, "Comuna 7": 7, "Comuna 8": 10, "Comuna 9": 5, "Comuna 10": 2, "Comuna 11": 3, "Comuna 12": 4, "Comuna 14": 4, "Comuna 15": 2 })
  assert.deepEqual(places.getPlaceFacets(resources, day, places.EMPTY_PLACE_QUERY).provinces, [{ value: "AR-C", count: 68 }])
  // choosing a division returns exactly those places, and the map shows the same ones
  const inComuna4 = places.selectPlaces(resources, day, { ...places.EMPTY_PLACE_QUERY, province: "AR-C", zone: "Comuna 4" })
  assert.deepEqual(inComuna4.map(({ place }) => place.id).sort(), ["cesac-1", "cesac-10", "cesac-16", "cesac-32", "cesac-35", "cesac-39", "cesac-41", "cesac-46", "cesac-8", "cesac-9", "hospital-argerich", "hospital-de-pediatria-dr-j-garrahan", "hospital-especializado-de-infecciosas-f-muniz", "hospital-general-de-agudos-j-a-penna", "hospital-general-de-ninos-pedro-de-elizalde", "hospital-sarda"])
  assert.deepEqual(places.getMapPins(inComuna4).map(({ id }) => id).sort(), ["cesac-1", "cesac-10", "cesac-16", "cesac-32", "cesac-35", "cesac-39", "cesac-41", "cesac-46", "cesac-8", "cesac-9", "hospital-argerich", "hospital-de-pediatria-dr-j-garrahan", "hospital-especializado-de-infecciosas-f-muniz", "hospital-general-de-agudos-j-a-penna", "hospital-general-de-ninos-pedro-de-elizalde", "hospital-sarda"])
  // a division of another province, or none, is not a comuna of the Ciudad
  assert.equal(places.selectPlaces(resources, day, { ...places.EMPTY_PLACE_QUERY, province: "AR-B", zone: "Comuna 4" }).length, 0)
})

test("territory filters: the province select lists the 24 jurisdictions, the covered ones apart, with 'Todas las zonas con cobertura' first", () => {
  const html = filters({})
  const content = text(html)
  assert.ok(content.includes("Provincia"))
  assert.ok(html.includes('<option value="" selected="">Todas las zonas con cobertura</option><optgroup label="Con centros verificados"><option value="AR-C">Ciudad Autónoma de Buenos Aires</option></optgroup><optgroup label="Todavía sin centros verificados">'))
  // a person from a province without places can choose it, and it says so
  assert.ok(html.includes('<option value="AR-B">Buenos Aires (sin centros verificados)</option>'))
  assert.equal([...html.matchAll(/<option value="AR-[A-Z]"/g)].length, 24, "every jurisdiction, once")
  // asked for by a link, a province without places is the one selected (not "Todas las zonas")
  assert.ok(filters({ province: "AR-B" }).includes('<option value="AR-B" selected="">Buenos Aires (sin centros verificados)</option>'))
  assert.deepEqual(places.provinceOptions(["AR-C"]).covered, ["AR-C"])
  assert.equal(places.provinceOptions(["AR-C"]).uncovered.length, 23)
  assert.ok(!places.provinceOptions(["AR-C"]).uncovered.includes("AR-C"))
  assert.ok(content.includes("Por ahora hay centros verificados en Ciudad Autónoma de Buenos Aires."))
  assert.ok(content.includes("Que otras provincias no aparezcan no quiere decir que no haya servicios"))
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

test("an empty result says what it is: no data, an uncovered province, no match, or too many to show - never 'there are no services'", () => {
  const ask = (input) => places.emptyStateOf({ ready: true, total: 6, shown: 0, province: null, coverage: ["AR-C"], ...input })
  assert.equal(places.emptyStateOf({ ready: false, total: 0, shown: 0, province: null, coverage: [] }), null, "still loading")
  assert.equal(ask({ shown: 3 }), null)
  assert.equal(ask({ total: 0 }), "no-data")
  // a province with no verified places is known from the coverage alone: nothing was loaded for it
  assert.equal(ask({ province: "AR-B", total: 0 }), "uncovered")
  assert.equal(ask({ province: "AR-B" }), "uncovered")
  assert.equal(ask({ province: "AR-C" }), "no-results")
  assert.equal(ask({}), "no-results")
  assert.equal(ask({ total: 0, needsProvince: true }), "choose-province")
})

test("the messages of an empty result do not say there are no services", async () => {
  const { readFile } = await import("node:fs/promises")
  const source = await readFile(join(root, "src/components/places/PlacesExplorer/PlacesExplorer.tsx"), "utf8")
  for (const message of ["Eso no significa que no existan servicios", "Eso no significa que no haya servicios", "Que no aparezcan no quiere decir que no existan"]) assert.ok(source.includes(message), message)
  assert.ok(!/no hay (servicios|centros|hospitales) en/i.test(source), "never states an absence as a fact")
})

test("the explorer reads the territory from the URL and keeps the other params, in the same view", async () => {
  for (const province of data.PROVINCES_WITH_PLACE_FILES) await data.loadPlaces(province)
  const render = (url, props = {}) => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(PlacesExplorer, { map: true, ...props })))
  const html = render("/centros?provincia=AR-C&zona=Comuna%204&vista=lista")
  assert.match(html, /aria-pressed="true"[^>]*>(?:<[^>]+>)*Lista</)
  assert.ok(text(html).includes("16 lugares encontrados en Comuna 4"))
  assert.ok(html.includes('data-place-trigger="cesac-41"') && html.includes('data-place-trigger="hospital-de-pediatria-dr-j-garrahan"') && html.includes('data-place-trigger="hospital-general-de-ninos-pedro-de-elizalde"') && !html.includes('data-place-trigger="cesac-3"'))
  // a search that finds nothing says so without saying there are no services
  const none = text(render("/centros?provincia=AR-C&zona=Comuna%204&buscar=zzzz&vista=lista"))
  assert.ok(none.includes("0 lugares encontrados en Comuna 4") && none.includes("Que no aparezcan no quiere decir que no existan"))
  // a province with no verified places: said from the coverage, nothing is counted or listed
  const uncovered = text(render("/centros?provincia=AR-G"))
  assert.ok(uncovered.includes("Todavía no tenemos centros verificados en Santiago del Estero. Eso no significa que no haya servicios"))
  assert.ok(!uncovered.includes("lugares encontrados"))
  // ...and what to do meanwhile: general steps, the emergency numbers, and the covered places as the secondary option
  for (const piece of ["Qué podés hacer mientras tanto", "hospital o al centro de salud público más cercano", "Dónde atenderme", "llamá por teléfono", "Mirá los números de emergencia", "Explorar las zonas con centros verificados"]) assert.ok(uncovered.includes(piece), piece)
  // the other filters stay, and the person is told so
  const kept = text(render("/centros?provincia=AR-G&categoria=salud-mental"))
  assert.ok(kept.includes("Tus otros filtros siguen activos: Salud mental") && kept.includes("Santiago del Estero Quitar filtro") && kept.includes("Salud mental Quitar filtro"))
  // a search with no result and no province: the same way out, and how to tell us where they are
  const lost = text(render("/centros?buscar=Mar+del+Plata"))
  assert.ok(lost.includes("0 lugares encontrados") && lost.includes("elegí tu provincia en los filtros") && lost.includes("Qué podés hacer mientras tanto"))
  // with a covered province chosen, there is no such block
  assert.ok(!text(render("/centros?provincia=AR-C&buscar=zzzz")).includes("Qué podés hacer mientras tanto"))
  // an invalid province in the URL is just ignored
  assert.ok(text(render("/centros?provincia=XX&zona=Comuna%204")).includes("85 lugares encontrados"))
  // the links that already exist keep working
  const legacy = text(render("/centros?filtro=emergency&buscar=oftalm", { filters: ["emergency"] }))
  assert.ok(legacy.includes("Tipo: Guardias") && legacy.includes("Búsqueda: «oftalm»"))
})

/* ── What is downloaded: decided from the coverage index ── */

const DAY = "2026-10-07"
const entry = (placesCount, currentUntil = "2027-01-05") => ({ places: placesCount, currentUntil, categories: [], serviceTypes: [], divisions: [] })

test("the app's coverage index names the same provinces as the places files, and the loaders agree", () => {
  const files = readdirSync(join(root, "src/data/resources/places")).filter((name) => name.endsWith(".json")).map((name) => name.replace(".json", "").toUpperCase()).sort()
  assert.deepEqual(Object.keys(data.COVERAGE).sort(), files)
  assert.deepEqual([...data.PROVINCES_WITH_PLACE_FILES], files)
  assert.equal(data.COVERAGE["AR-C"].places, 68)
})

test("load plan: opening /centros downloads the covered files only, and a province asked for downloads only its own", () => {
  const coverage = { "AR-C": entry(6), "AR-B": entry(400), "AR-S": entry(300, "2026-09-01") }
  // AR-S has nothing that can still be current: it is not offered and not downloaded
  assert.deepEqual(places.planLoad({ coverage, day: DAY, province: null }), { covered: ["AR-B", "AR-C"], toLoad: ["AR-B", "AR-C"], needsProvince: false })
  assert.deepEqual(places.planLoad({ coverage, day: DAY, province: "AR-C" }), { covered: ["AR-B", "AR-C"], toLoad: ["AR-C"], needsProvince: false })
  // a province with no verified places: nothing to download
  assert.deepEqual(places.planLoad({ coverage, day: DAY, province: "AR-S" }).toLoad, [])
  assert.deepEqual(places.planLoad({ coverage, day: DAY, province: "AR-X" }).toLoad, [])
  // too many places to show them all together: choose a province first, and nothing is downloaded until then
  const big = { "AR-C": entry(6), "AR-B": entry(places.LOAD_ALL_UP_TO) }
  assert.deepEqual(places.planLoad({ coverage: big, day: DAY, province: null }), { covered: ["AR-B", "AR-C"], toLoad: [], needsProvince: true })
  assert.deepEqual(places.planLoad({ coverage: big, day: DAY, province: "AR-B" }).toLoad, ["AR-B"])
  // the day matters: on the review date a province stops being offered
  assert.deepEqual(places.planLoad({ coverage, day: "2027-01-05", province: null }).covered, [])
  // nothing to plan with an empty index
  assert.deepEqual(places.planLoad({ coverage: {}, day: DAY, province: null }), { covered: [], toLoad: [], needsProvince: false })
  // the real index, today
  assert.deepEqual(places.planLoad({ day: DAY, province: null }), { covered: ["AR-B", "AR-C", "AR-F", "AR-N", "AR-R", "AR-S", "AR-T", "AR-V", "AR-X"], toLoad: ["AR-B", "AR-C", "AR-F", "AR-N", "AR-R", "AR-S", "AR-T", "AR-V", "AR-X"], needsProvince: false })
})

test("the explorer does not download the other provinces: it asks the plan, and never lists the files itself", async () => {
  const { readFile } = await import("node:fs/promises")
  const source = await readFile(join(root, "src/components/places/PlacesExplorer/PlacesExplorer.tsx"), "utf8")
  // The province comes from the URL query: the quick filters are decided after the places are loaded (offeredQuickFilters), so they cannot be its source
  assert.match(source, /planLoad\(\{ day, province: asked\.province \}\)/)
  assert.match(source, /usePlacesOf\(plan\.toLoad\)/)
  assert.ok(!source.includes("PROVINCES_WITH_PLACE_FILES"))
})

test("the numbers of the index are never shown: the screens count the results of the query", async () => {
  const { readFile, readdir } = await import("node:fs/promises")
  const dirs = ["src/components/places", "src/content/categories/HealthCenters"]
  const walk = async (dir) => (await readdir(join(root, dir), { withFileTypes: true })).flatMap((e) => (e.isDirectory() ? [] : [join(dir, e.name)]))
  const files = (await Promise.all(dirs.map(async (dir) => [...(await walk(dir)), ...(await Promise.all((await readdir(join(root, dir), { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => walk(join(dir, e.name))))).flat()]))).flat()
  for (const file of files.filter((name) => /\.tsx?$/.test(name))) assert.ok(!/COVERAGE/.test(await readFile(join(root, file), "utf8")), file + " shows counts of the index")
})
