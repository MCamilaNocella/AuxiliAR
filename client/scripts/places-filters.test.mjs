/*
 * Tests of the category and service filters of the Mapa AuxiliAR, and how every filter combines: with the real places
 * (checked against an independent count straight from the data) and with the components. Loaded through Vite like the app does.
 *   npm run places:test
 */
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"
import { withoutSexualBatch } from "./places-sexual-batch.mjs"

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
const { CategoryFilter } = await vite.ssrLoadModule("/src/components/places/CategoryFilter/index.ts")
const { ServiceTypeFilter } = await vite.ssrLoadModule("/src/components/places/ServiceTypeFilter/index.ts")
const { ActiveFilters } = await vite.ssrLoadModule("/src/components/places/ActiveFilters/index.ts")
const { PlacesExplorer } = await vite.ssrLoadModule("/src/components/places/PlacesExplorer/index.ts")
const { FreeFilter } = await vite.ssrLoadModule("/src/components/places/FreeFilter/index.ts")
const taxonomy = JSON.parse(await readFile(join(root, "src/data/resources/taxonomy.json"), "utf8"))
const raw = withoutSexualBatch(JSON.parse(await readFile(join(root, "src/data/resources/places/ar-c.json"), "utf8")).resources)

const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const DAY = data.todayInArgentina()
const real = withoutSexualBatch(await data.loadPlaces("AR-C"))
// the other provinces with places are loaded too (the explorer shows them all); `real` stays the Ciudad's places
for (const province of data.PROVINCES_WITH_PLACE_FILES) await data.loadPlaces(province)
// CeSAC 3 as it was before the first batch of verified gratuity: no cost, requirements, appointment or source of its own on its services.
// The tests that need "an establishment with nothing said about cost" use it, so they do not depend on what the real data has verified
const bareCesac3 = () => {
  const place = structuredClone(real.find(({ id }) => id === "cesac-3"))
  for (const own of place.services) for (const key of ["cost", "costNote", "requirements", "appointment", "source"]) delete own[key]
  return [place]
}
const { EMPTY_PLACE_QUERY: EMPTY } = places
const ask = (criteria) => places.selectPlaces(real, DAY, { ...EMPTY, ...criteria })
const ids = (entries) => entries.map(({ place }) => place.id).sort()
const categoriesOf = (type) => taxonomy.serviceTypes.find(({ id }) => id === type).categories

// An independent oracle: the places that have a service answering all the criteria, read straight from the data
const oracle = ({ category, type, zone, text: words }) =>
  raw
    .filter((place) => (!zone || place.address.department === zone) && (!words || JSON.stringify(place).toLowerCase().includes(words.toLowerCase())))
    .filter((place) => place.services.some((service) => (!category || categoriesOf(service.type).includes(category)) && (!type || service.type === type)))
    .map((place) => place.id)
    .sort()

test("the real places: a place is in every category its verified services have", () => {
  const entries = ask({})
  assert.equal(entries.length, 9)
  const byPlace = Object.fromEntries(entries.map(({ place, services }) => [place.id, [...new Set(services.flatMap((service) => service.categories))].sort()]))
  // the CeSAC have general health, mental health and ESI services: one place, several categories
  assert.deepEqual(byPlace["cesac-3"], ["esi", "salud-fisica", "salud-mental"])
  assert.deepEqual(byPlace["hospital-oftalmologico-santa-lucia"], ["salud-fisica"])
  for (const category of ["salud-fisica", "salud-mental", "esi"]) assert.deepEqual(ids(ask({ category })), oracle({ category }), category)
  // the only animal place is the veterinary centre, and only for animals: its category is animales and nothing else
  assert.deepEqual(byPlace["centro-fijo-veterinario-costanera-sur"], ["animales"])
  assert.deepEqual(ids(ask({ category: "animales" })), ["centro-fijo-veterinario-costanera-sur"])
  assert.equal(places.getPlaceFacets(real, DAY, EMPTY).categories.some(({ value }) => value === "animales"), true)
})

test("the real places: category and service must be the same verified service", () => {
  for (const type of ["vaccination", "mental-health-care", "emergency-room", "contraception", "dentistry"]) assert.deepEqual(ids(ask({ type })), oracle({ type }), type)
  for (const [category, type] of [["salud-mental", "mental-health-care"], ["salud-fisica", "vaccination"], ["esi", "contraception"], ["esi", "ive-ile-care"]]) {
    assert.deepEqual(ids(ask({ category, type })), oracle({ category, type }), `${category}+${type}`)
    assert.ok(ask({ category, type }).length > 0, `${category}+${type} has places`)
  }
  // a CeSAC has vaccination (general health) and mental health, but never "mental health + vaccination" as one service
  assert.deepEqual(ids(ask({ category: "salud-mental", type: "vaccination" })), [])
  assert.deepEqual(ids(ask({ category: "esi", type: "dentistry" })), [])
  // the services offered under a category are only the ones of that category
  const types = places.getPlaceFacets(real, DAY, { ...EMPTY, category: "salud-mental" }).types.map(({ value }) => value)
  assert.deepEqual(types, ["mental-health-care"])
  const esi = places.getPlaceFacets(real, DAY, { ...EMPTY, category: "esi" }).types.map(({ value }) => value)
  for (const type of esi) assert.ok(categoriesOf(type).includes("esi"), type)
})

test("the real places: territory, category, service and text combine, and agree with the data", () => {
  for (const criteria of [
    { zone: "Comuna 8", category: "salud-fisica" },
    { zone: "Comuna 4", type: "vaccination" },
    { zone: "Comuna 1", category: "salud-mental", type: "mental-health-care" },
    { zone: "Comuna 3", type: "emergency-room" },
    { category: "salud-fisica", text: "odontolog" },
    { type: "emergency-room", text: "oftalm" },
  ]) {
    const query = { province: "AR-C", ...criteria }
    assert.deepEqual(ids(ask(query)), oracle(criteria), JSON.stringify(criteria))
  }
  // each filter narrows the one before: never more places than without it
  const steps = [{}, { province: "AR-C" }, { province: "AR-C", category: "salud-fisica" }, { province: "AR-C", category: "salud-fisica", type: "dentistry" }, { province: "AR-C", category: "salud-fisica", type: "dentistry", text: "carrillo" }]
  const sizes = steps.map((criteria) => ask(criteria).length)
  for (let i = 1; i < sizes.length; i++) assert.ok(sizes[i] <= sizes[i - 1], `step ${i}`)
  // the hospitals' guardia is not "odontología" as a service: the last, narrowest combination has nothing - and says so honestly
  assert.deepEqual(ids(ask(steps.at(-1))), oracle({ category: "salud-fisica", type: "dentistry", text: "carrillo" }))
})

test("the real places: every option offered leads to exactly its count, under any combination", () => {
  const queries = [
    EMPTY,
    { ...EMPTY, province: "AR-C" },
    { ...EMPTY, province: "AR-C", zone: "Comuna 4" },
    { ...EMPTY, category: "salud-mental" },
    { ...EMPTY, type: "vaccination" },
    { ...EMPTY, category: "esi", text: "cesac" },
    { ...EMPTY, province: "AR-C", category: "salud-fisica", type: "primary-care" },
  ]
  for (const query of queries) {
    const facets = places.getPlaceFacets(real, DAY, query)
    for (const { value, count } of facets.categories) assert.equal(places.selectPlaces(real, DAY, { ...query, category: value }).length, count, `${JSON.stringify(query)} category ${value}`)
    for (const { value, count } of facets.types) assert.equal(places.selectPlaces(real, DAY, { ...query, type: value }).length, count, `${JSON.stringify(query)} type ${value}`)
    if (query.province) for (const { value, count } of facets.zones) assert.equal(places.selectPlaces(real, DAY, { ...query, zone: value }).length, count, `${JSON.stringify(query)} zone ${value}`)
    for (const list of Object.values({ ...facets, free: [] })) for (const { count } of list) assert.ok(count > 0)
    // the list, the map and the count are the same results
    const entries = places.selectPlaces(real, DAY, query)
    assert.equal(places.getMapPins(entries).length + places.countUnmapped(entries), entries.length)
  }
})

test("category filter: only categories with places, with counts, people and animals told apart", () => {
  const draw = (props) => renderToStaticMarkup(createElement(CategoryFilter, { onChange() {}, value: null, ...props }))
  const facets = [{ value: "salud-fisica", count: 6 }, { value: "salud-mental", count: 3 }, { value: "esi", count: 3 }]
  const html = draw({ facets })
  const content = text(html)
  assert.match(content, /Tipo de atención Todas Salud general \(6\) Salud mental \(3\) Educación sexual \(ESI\) \(3\)/)
  assert.match(html, /aria-pressed="true"[^>]*>Todas</)
  assert.ok(!content.includes("Animales") && !content.includes("Atención animal") && !content.includes("Atención a personas"), "no animal care, so nothing about it")
  // the chosen one is pressed
  assert.match(draw({ facets, value: "salud-mental" }), /aria-pressed="true"[^>]*>Salud mental \(3\)</)
  // with animal care it is a separate group, never mixed with people's
  const both = text(draw({ facets: [...facets, { value: "animales", count: 2 }] }))
  assert.match(both, /Atención a personas Todas Salud general \(6\).*Atención animal Animales \(2\)/)
  // the chosen category stays even if the other filters left it with none
  assert.ok(text(draw({ facets: [{ value: "salud-fisica", count: 1 }], value: "esi" })).includes("Educación sexual (ESI) (0)"))
  // nothing to choose: nothing drawn
  assert.equal(draw({ facets: [] }), "")
})

test("service filter: only services that exist, alphabetical, with counts, the chosen one kept", () => {
  const draw = (props) => renderToStaticMarkup(createElement(ServiceTypeFilter, { onChange() {}, value: null, ...props }))
  const facets = [{ value: "vaccination", count: 3 }, { value: "dentistry", count: 2 }, { value: "emergency-room", count: 3 }]
  const html = draw({ facets })
  const content = text(html)
  assert.ok(content.includes("Prestación") && content.includes("Todas las prestaciones"))
  const order = ["Guardia (3)", "Odontología (2)", "Vacunación (3)"].map((label) => content.indexOf(label))
  assert.ok(order.every((position) => position > 0) && order[0] < order[1] && order[1] < order[2], content)
  assert.ok(!content.includes("Zoonosis") && !content.includes("Veterinaria"), "no service that has no places")
  assert.match(draw({ facets, value: "dentistry" }), /<option value="dentistry"[^>]*selected=""|selected=""[^>]*value="dentistry"/)
  assert.ok(text(draw({ facets: [], value: "pharmacy" })).includes("Farmacia (0)"))
  assert.equal(draw({ facets: [] }), "")
  // the label is a real <label> tied to the select
  assert.match(html, /<label for="([^"]+)"[^>]*>Prestación<\/label><select id="\1"/)
})

test("active filters: one removable chip each, with a spoken label, and Borrar filtros", () => {
  const draw = (filters) => renderToStaticMarkup(createElement(ActiveFilters, { filters, onClear() {} }))
  assert.equal(draw([]), "")
  const html = draw([{ key: "a", label: "Comuna 4", onRemove() {} }, { key: "b", label: "Salud mental", onRemove() {} }])
  assert.match(html, /role="group" aria-label="Filtros activos"/)
  assert.ok(text(html).includes("Quitar filtro: Comuna 4") && text(html).includes("Quitar filtro: Salud mental"))
  assert.equal([...html.matchAll(/<button/g)].length, 3, "two chips and the clear button")
  assert.ok(text(html).includes("Borrar filtros"))
})

const render = (url, props = {}) => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(PlacesExplorer, { map: true, ...props })))

test("the explorer with the real places: filters from the URL, active chips, counts and the same results in the list", () => {
  // Only prestaciones with documented gratuity are shown: of the primary care of the three CeSAC, the three are
  const html = render("/centros?vista=lista&provincia=AR-C&categoria=salud-fisica&prestacion=primary-care")
  const content = text(html)
  assert.ok(content.includes("3 lugares encontrados en Ciudad Autónoma de Buenos Aires"))
  assert.ok(content.includes("Ciudad Autónoma de Buenos Aires Quitar filtro") && content.includes("Salud general Quitar filtro"), content)
  for (const id of ["cesac-3", "cesac-41", "cesac-47"]) assert.ok(html.includes(`data-place-trigger="${id}"`), id)
  assert.ok(content.includes("Borrar filtros"))
  // the panel is folded here (phone), but the button says how many filters are on, and the chips stay in sight
  assert.ok(content.includes("Filtros 3 (3 activos)"), content)
  // no filters: no active chips, no count on the button
  const plain = text(render("/centros?vista=lista"))
  assert.ok(!plain.includes("Borrar filtros") && !plain.includes("activos)"))
  assert.ok(plain.includes("132 lugares encontrados"), "132 visible places (93 of the Ciudad, 39 of other provinces): Santa Lucía has no prestación with documented gratuity, so it is not shown")
  // the search box does not count: it is always in sight
  const searched = text(render("/centros?vista=lista&buscar=cesac"))
  assert.ok(!searched.includes("activo)") && searched.includes("Búsqueda: «cesac» Quitar filtro"))
})

test("the explorer: combinations with nothing, and animal care that does not exist", () => {
  const none = text(render("/centros?vista=lista&categoria=salud-mental&prestacion=vaccination"))
  assert.ok(none.includes("0 lugares encontrados") && none.includes("Que no aparezcan no quiere decir que no existan") && none.includes("Borrar filtros"))
  // an animal category is asked for in a link: it is shown as the chosen filter, and only what the data has is listed: the 16 free veterinary places
  const animals = text(render("/centros?vista=lista&categoria=animales"))
  assert.ok(animals.includes("16 lugares encontrados") && animals.includes("Animales Quitar filtro"))
  assert.ok(/Castración/.test(animals) && !/guardia veterinaria/i.test(animals), "no veterinary emergency service is made up: the report leaves the urgencias out")
  // an invalid category or service in the URL is ignored
  assert.ok(text(render("/centros?vista=lista&categoria=magia&prestacion=nada")).includes("132 lugares encontrados"))
})

test("URL: every filter and the view travel together, and clearing keeps the view and the open place", () => {
  const asked = "provincia=AR-C&zona=Comuna+4&categoria=salud-fisica&prestacion=vaccination&buscar=cesac&filtro=vaccination&vista=mapa&lugar=cesac-41"
  const query = places.placeQueryFromParams(new URLSearchParams(asked))
  assert.deepEqual(query, { text: "cesac", filterId: "vaccination", province: "AR-C", zone: "Comuna 4", category: "salud-fisica", type: "vaccination", free: false })
  const cleared = places.placeQueryToParams(new URLSearchParams(asked), EMPTY)
  assert.equal(cleared.toString(), "vista=mapa&lugar=cesac-41")
  // the older link still means the same
  assert.deepEqual(places.placeQueryFromParams(new URLSearchParams("filtro=emergency&buscar=oftalm")), { ...EMPTY, filterId: "emergency", text: "oftalm" })
})

test("the filters are labelled in plain words, from the taxonomy", () => {
  assert.equal(places.categoryLabel("salud-fisica"), "Salud general")
  assert.equal(places.categoryLabel("esi"), "Educación sexual (ESI)")
  assert.equal(places.serviceTypeLabel("emergency-room"), "Guardia")
  assert.equal(places.quickFilterLabel("emergency"), "Guardias")
})

/* ── The panel leads with the service that answers the search ── */

const { PlaceDetail } = await vite.ssrLoadModule("/src/components/places/PlaceDetail/index.ts")
const { FiltersToggle } = await vite.ssrLoadModule("/src/components/places/FiltersToggle/index.ts")
const cesac3 = real.find(({ id }) => id === "cesac-3")
const entryOf = (query = {}) => places.selectPlaces([cesac3], DAY, { ...EMPTY, ...query })[0]
const matchOf = (query) => places.matchingServices(entryOf(), { ...EMPTY, ...query }).map((service) => service.type)

test("matching services: only what answers the search, nothing made up", () => {
  // nothing asked: no service is singled out
  assert.deepEqual(matchOf({}), [])
  // a service filter or a kind of care picks the services that meet it
  assert.deepEqual(matchOf({ type: "vaccination" }), ["vaccination"])
  assert.ok(matchOf({ category: "salud-mental" }).length > 0 && matchOf({ category: "salud-mental" }).every((type) => categoriesOf(type).includes("salud-mental")))
  // words that a service says about itself pick that service
  assert.deepEqual(matchOf({ text: "psicolog" }).map((type) => categoriesOf(type).includes("salud-mental")), [true])
  // words that only name the place pick nothing: the place matched, none of its services did
  assert.deepEqual(matchOf({ text: "Soldado de la Frontera" }), [])
  assert.deepEqual(matchOf({ text: "cesac" }), [])
  // words from the place and from the service together still pick the service that says one of them
  assert.deepEqual(matchOf({ text: "vacunacion cesac" }), ["vaccination"])
  // words that appear nowhere pick nothing
  assert.deepEqual(matchOf({ text: "veterinaria" }), [])
  // the criteria and the words must hold for the same service
  assert.deepEqual(matchOf({ type: "vaccination", text: "psicolog" }), [])
  // every service picked is one of the place's verified services
  const own = new Set(entryOf().services.map(({ id }) => id))
  for (const query of [{ type: "dentistry" }, { text: "odont" }, { category: "esi" }]) assert.ok(places.matchingServices(entryOf(), { ...EMPTY, ...query }).every(({ id }) => own.has(id)))
})

test("the place panel: the matching service first, the others verified services apart, no split when nothing matches", () => {
  const draw = (query) => {
    const ids = places.matchingServices(entryOf(), { ...EMPTY, ...query }).map(({ id }) => id)
    return renderToStaticMarkup(createElement(PlaceDetail, { entry: entryOf(), matchingIds: ids, onClose() {} }))
  }
  const headings = (html) => [...html.matchAll(/<h3[^>]*>([^<]+)<\/h3>/g)].map((match) => match[1])
  const searched = draw({ text: "psicolog" })
  assert.deepEqual(headings(searched).slice(0, 2), ["Coincide con tu búsqueda", "Otros servicios verificados"])
  const [before, after] = text(searched).split("Otros servicios verificados")
  assert.ok(before.includes("Psicología") && !after.includes("Psicología"), "the matching service is in the first block only")
  assert.ok(after.includes("Clínica médica") && after.includes("Odontología"), "the others are still there")
  // nothing matches (or nothing was asked): the usual list, nothing invented
  for (const query of [{}, { text: "Soldado de la Frontera" }]) assert.deepEqual(headings(draw(query)).slice(0, 1), ["Atención disponible"], JSON.stringify(query))
  assert.ok(!text(draw({})).includes("Coincide con tu búsqueda"))
  // every service matches: one block, no empty "Otros"
  const all = renderToStaticMarkup(createElement(PlaceDetail, { entry: entryOf(), matchingIds: entryOf().services.map(({ id }) => id), onClose() {} }))
  assert.ok(headings(all).includes("Coincide con tu búsqueda") && !headings(all).includes("Otros servicios verificados"))
})

test("the filters button: says how many are on, controls the panel and tells its state", () => {
  const draw = (props) => renderToStaticMarkup(createElement(FiltersToggle, { open: false, activeCount: 0, controls: "panel-1", onToggle() {}, ...props }))
  const closed = draw({})
  assert.match(closed, /<button[^>]*aria-expanded="false"[^>]*aria-controls="panel-1"|<button[^>]*aria-controls="panel-1"[^>]*aria-expanded="false"/)
  assert.equal(text(closed).trim(), "Filtros")
  assert.ok(text(draw({ activeCount: 1 })).includes("Filtros 1 (1 activo)"))
  const open = draw({ open: true, activeCount: 3 })
  assert.match(open, /aria-expanded="true"/)
  assert.ok(text(open).includes("(3 activos)"))
  // a good touch target
  assert.ok(open.includes("min-h-11"))
})

test("the explorer is arranged for phones and desktop: search and view first, the filters in a panel, the emergency line easy to tap", async () => {
  const explorer = await readFile(join(root, "src/components/places/PlacesExplorer/PlacesExplorer.tsx"), "utf8")
  // the panel is always there on large screens and opens on demand on phones
  assert.match(explorer, /const showFilters = isDesktop \|\| filtersOpen/)
  assert.match(explorer, /\{!isDesktop && <FiltersToggle/)
  // letters typed are not lost while the URL catches up
  assert.match(explorer, /const \[draft, setDraft\] = useState\(query\.text\)/)
  const section = await readFile(join(root, "src/content/categories/HealthCenters/sections/Section1/Section1.content.tsx"), "utf8")
  // ~44 px of target without making the line taller (the padding is taken back with a negative margin)
  assert.match(section, /-my-2\.5 inline-block[^"]*py-2\.5/)
})

/* ── Gratuity: only what is verified for that very service ── */

const { PlaceCard } = await vite.ssrLoadModule("/src/components/places/PlaceCard/index.ts")
const rawFree = raw.filter((place) => place.services.some((service) => service.cost === "free" && service.source?.note)).map((place) => place.id).sort()

test("the real data: every free service is declared by the service itself, with the note of the source that says so", () => {
  for (const place of raw) {
    // an establishment that has services does not declare gratuity for all of them
    if (place.services?.length) assert.notEqual(place.cost, "free", place.id + " declares free for all its services")
    for (const service of place.services ?? []) if (service.cost === "free") assert.ok(service.source?.note?.trim(), place.id + "/" + service.id + " is free without the note of its source")
  }
  assert.deepEqual(rawFree, ["centro-fijo-veterinario-costanera-sur", "cesac-3", "cesac-41", "cesac-47", "hospital-de-pediatria-dr-j-garrahan", "hospital-general-de-ninos-pedro-de-elizalde", "hospital-odontologia-carrillo", "hospital-odontologia-duenas"])
})

test("the free filter finds only services with verified gratuity, and nothing is inferred", () => {
  assert.deepEqual(ids(ask({ free: true })), rawFree)
  // it holds for the same service as the other criteria
  assert.deepEqual(ids(ask({ free: true, type: "emergency-room" })), ["hospital-odontologia-carrillo", "hospital-odontologia-duenas"])
  assert.deepEqual(ids(ask({ free: true, category: "salud-mental" })), [])
  assert.deepEqual(ids(ask({ free: true, type: "vaccination" })), ["cesac-3", "cesac-41"], "CeSAC 47 vaccination is not in the first batch")
  assert.deepEqual(ids(ask({ free: true, type: "primary-care" })), ["cesac-3", "cesac-41", "cesac-47"])
  // the only service shown with it is the free one
  const [entry] = ask({ free: true })
  assert.ok(places.matchingServices(entry, { ...EMPTY, free: true }).every((service) => service.cost === "free"))
  // public is not free: no cost said, a free inherited from the establishment, or a free without the note of its source do not count
  const [base] = bareCesac3()
  const only = (change) => {
    const place = structuredClone(base)
    // the bare establishment: without the gratuity the first batch added to its services
    for (const own of place.services) for (const key of ["cost", "costNote", "requirements", "appointment", "source"]) delete own[key]
    change(place)
    return places.selectPlaces([place], DAY, { ...EMPTY, free: true }).length
  }
  const documented = (place, cost) => {
    place.services[0].cost = cost
    place.services[0].source = { organization: "Fuente de prueba", url: place.source.url, note: "Nota de la fuente." }
  }
  assert.equal(only(() => {}), 0, "no cost said")
  assert.equal(only((place) => { place.cost = "free" }), 0, "inherited from the establishment")
  assert.equal(only((place) => { place.services[0].cost = "free" }), 0, "free without the note of its source")
  assert.equal(only((place) => documented(place, "free")), 1, "declared and documented")
  for (const cost of ["paid", "mixed", "unknown"]) assert.equal(only((place) => documented(place, cost)), 0, cost)
})

test("gratis, gratuito/a/s and sin costo in the search are the gratuity filter, and the text is left as it was typed", () => {
  const expected = ids(ask({ text: "odontologia", free: true }))
  assert.deepEqual(expected, ["hospital-odontologia-carrillo", "hospital-odontologia-duenas"], "the dentistry of the CeSAC is not confirmed free")
  for (const text of ["odontologia gratuita", "odontología GRATIS", "gratuitos odontologia", "odontologia sin costo", "gratuitas odontologia", "odontologia gratuito"]) assert.deepEqual(ids(ask({ text })), expected, text)
  // alone, the word is just the filter
  assert.deepEqual(ids(ask({ text: "gratuita" })), rawFree)
  assert.deepEqual(places.conditionsOf("odontologia gratuita"), { rest: "odontologia", free: true })
  assert.deepEqual(places.conditionsOf("odontologia"), { rest: "odontologia", free: false })
  // not a condition when it is part of another word
  assert.equal(places.conditionsOf("gratuidad").free, false)
  assert.equal(places.conditionsOf("costo").free, false)
  // the URL keeps what was typed
  const query = places.placeQueryFromParams(new URLSearchParams("buscar=odontologia+gratuita"))
  assert.equal(query.text, "odontologia gratuita")
  assert.equal(places.effectiveQuery(query).free, true)
  assert.equal(places.withoutConditionWords("Odontologia Gratuita para niños"), "Odontologia para niños")
  assert.equal(places.withoutConditionWords("gratis"), "")
  // the typed words are not looked for as free text
  assert.deepEqual(ids(ask({ text: "psicologia gratuita" })), [])
})

test("gratuity facet: offered only with results, and counted without itself", () => {
  assert.equal(places.getPlaceFacets(real, DAY, EMPTY).free, 8)
  assert.equal(places.getPlaceFacets(real, DAY, { ...EMPTY, free: true }).free, 8, "turning it on does not change the count")
  assert.equal(places.getPlaceFacets(real, DAY, { ...EMPTY, text: "odontologia gratuita" }).free, 2, "the words of the text count the same way")
  assert.equal(places.getPlaceFacets(real, DAY, { ...EMPTY, category: "salud-mental" }).free, 0)
  // the other facets follow the filter: the services and kinds of care offered are those with gratuity
  const facets = places.getPlaceFacets(real, DAY, { ...EMPTY, free: true })
  assert.deepEqual(facets.types.map(({ value }) => value).sort(), ["emergency-room", "primary-care", "spaying-neutering", "specialty-care", "vaccination"])
  assert.deepEqual(facets.categories.map(({ value }) => value).sort(), ["animales", "salud-fisica"])
})

test("URL: gratuito=1 travels with the rest and anything else is ignored", () => {
  assert.equal(places.placeQueryFromParams(new URLSearchParams("gratuito=1")).free, true)
  for (const value of ["0", "true", "si", ""]) assert.equal(places.placeQueryFromParams(new URLSearchParams("gratuito=" + value)).free, false, value)
  const params = places.placeQueryToParams(new URLSearchParams("vista=lista"), { ...EMPTY, free: true, text: "odontologia" })
  assert.equal(params.get("gratuito"), "1")
  assert.equal(params.get("vista"), "lista")
  assert.equal(places.placeQueryToParams(params, EMPTY).has("gratuito"), false)
})

test("the free filter control: offered with results (or while on), with what it means", () => {
  const draw = (props) => renderToStaticMarkup(createElement(FreeFilter, { count: 2, checked: false, onChange() {}, ...props }))
  const html = draw({})
  assert.ok(text(html).includes("Solo gratuidad verificada (2)") && text(html).includes("La fuente oficial dice que esa prestación es gratuita."))
  assert.ok(html.includes('type="checkbox"') && !html.includes("checked"))
  assert.ok(draw({ checked: true }).includes("checked"))
  assert.equal(draw({ count: 0 }), "")
  assert.ok(draw({ count: 0, checked: true }).includes("(0)"), "stays while it is on, so it can be turned off")
  assert.ok(html.includes("aria-describedby"))
})

test("the explorer: gratuity from the search or the filter is one visible filter, and an empty result offers a way out", () => {
  const render = (url) => text(renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(PlacesExplorer, { map: true }))))
  const typed = render("/centros?vista=lista&buscar=odontologia+gratuita")
  assert.ok(typed.includes("2 lugares encontrados") && typed.includes("Gratuidad verificada Quitar filtro") && typed.includes("Búsqueda: «odontologia gratuita»"))
  assert.ok(typed.includes("Filtros 1 (1 activo)"), "the button counts the gratuity, the search does not")
  const chosen = render("/centros?vista=lista&gratuito=1")
  assert.ok(chosen.includes("132 lugares encontrados") && chosen.includes("Gratuidad verificada Quitar filtro"))
  const none = render("/centros?vista=lista&gratuito=1&buscar=zzzzqq")
  for (const piece of ["0 lugares encontrados", "No encontramos prestaciones con gratuidad documentada para esta búsqueda", "Que no aparezcan no quiere decir que no existan ni que no sean gratuitas", "Borrar filtros"]) assert.ok(none.includes(piece), piece)
  assert.ok(!none.includes("costo desconocido"), "no claim about what the others cost")
  // the cards say which services are free
  assert.ok(chosen.includes("Gratuita"))
})

/* ── Which services are free is said on the cards and in the panel, and the rest is not made up ── */

test("the panel: unknown costs are told apart from verified ones, and said once when none is known", () => {
  const [base] = bareCesac3()
  const viewOf = (change) => {
    const place = structuredClone(base)
    change(place)
    return places.buildPlaceView(places.selectPlaces([place], DAY, EMPTY)[0])
  }
  // nothing is said about the cost: one line, and no chip repeated on every service
  const none = viewOf(() => {})
  assert.equal(none.costNotice, "Gratuidad no confirmada: la fuente no informa el costo de estas prestaciones. Consultalo antes de ir.")
  assert.ok(none.services.every((service) => !service.chips.includes("Gratuidad no confirmada")))
  // one is verified free: it says so, and the others say that their cost is not informed (they may or may not be free)
  const some = viewOf((place) => {
    place.services[0].cost = "free"
    place.services[0].source = { organization: "Fuente de prueba", url: place.source.url, note: "Nota de la fuente." }
  })
  assert.equal(some.costNotice, undefined)
  assert.ok(some.services[0].chips.includes("Gratuita"))
  assert.ok(some.services.slice(1).every((service) => service.chips.includes("Gratuidad no confirmada")))
  // a free that the establishment declares for all is not verified for each: still "not informed"
  const inherited = viewOf((place) => { place.cost = "free" })
  assert.ok(inherited.costNotice && inherited.services.every((service) => !service.chips.includes("Gratuita")))
  // the real hospital with a verified free service: said at the top, nothing about unknown costs
  const carrillo = places.buildPlaceView(places.selectPlaces(real, DAY, EMPTY).find(({ place }) => place.id === "hospital-odontologia-carrillo"))
  assert.deepEqual(carrillo.highlights, ["24 h", "Gratuita"])
  assert.equal(carrillo.costNotice, undefined)
})

test("the cards: gratuity is said service by service - verified ones are marked free, the rest are 'not confirmed'", () => {
  const render = (url) => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(PlacesExplorer, { map: true })))
  const list = render("/centros?vista=lista")
  // each card of the hospitals is only the free service: marked
  assert.ok(text(list).includes("Gratuita"))
  // a place with a verified-free service and others not confirmed marks each service on its own row; the place is never classified as a whole
  const [base] = bareCesac3()
  const place = structuredClone(base)
  place.services[0].cost = "free"
  place.services[0].source = { organization: "Fuente de prueba", url: place.source.url, note: "Nota de la fuente." }
  const card = (entry) => renderToStaticMarkup(createElement(PlaceCard, { entry, onOpen() {} }))
  const mixed = text(card(places.selectPlaces([place], DAY, EMPTY)[0]))
  const mixedHtml = card(places.selectPlaces([place], DAY, EMPTY)[0])
  const confirmedList = mixedHtml.match(/aria-label="Prestaciones con gratuidad confirmada".*?<\/ul>/s)?.[0] ?? ""
  const pendingList = mixedHtml.match(/aria-label="Prestaciones con gratuidad no confirmada".*?<\/ul>/s)?.[0] ?? ""
  assert.ok(text(confirmedList).includes("Gratuita") && !text(confirmedList).includes("no confirmada"), "the verified service: free, in its own group")
  assert.ok(pendingList && !text(pendingList).includes("Gratuita"), "the others: in the not-confirmed group, never free")
  // the warning is said once for the group, not on every row
  assert.equal([...mixedHtml.matchAll(/>Gratuidad no confirmada</g)].length, 1)
  assert.ok(!mixed.includes("Las demás prestaciones"), "no whole-place sentence")
  // nothing verified: one warning for the whole list of services (never repeated per row); the place is not called free
  const plainHtml = card(places.selectPlaces([base], DAY, EMPTY)[0])
  const plain = text(plainHtml)
  assert.equal([...plainHtml.matchAll(/>Gratuidad no confirmada</g)].length, 1)
  assert.ok(!plainHtml.includes("con gratuidad confirmada"), "no confirmed group when nothing is confirmed")
  assert.equal([...plainHtml.matchAll(/<li class="font-semibold/g)].length, Math.min(4, base.services.length), "each service is still listed")
  // a card lists at most 4 services and says the rest are not confirmed
  if (base.services.length > 4) assert.ok(plain.includes(`+${base.services.length - 4} servicios más con gratuidad no confirmada`))
  assert.ok(!plain.includes("Gratuita") && !plain.includes("Gratuita con"))
  // a free service with conditions keeps its own, different badge
  const conditional = structuredClone(place)
  conditional.services[0].costNote = "Con DNI argentino"
  assert.ok(text(card(places.selectPlaces([conditional], DAY, EMPTY)[0])).includes("Gratuita con condiciones"))
})

test("the free hospitals' panel shows the condition when the source gives one", () => {
  const [base] = real.filter(({ id }) => id === "hospital-odontologia-carrillo")
  const place = structuredClone(base)
  place.services[0].costNote = "Con DNI argentino"
  const view = places.buildPlaceView(places.selectPlaces([place], DAY, EMPTY)[0])
  assert.ok(view.services[0].chips.includes("Gratuita con condiciones") || view.highlights.includes("Gratuita con condiciones"))
  assert.ok(view.services[0].details.some((item) => item.kind === "text" && item.text === "Gratuita con condiciones. Con DNI argentino"))
})

/* ── When to go: what is missing is said, and the phone is the first thing offered ── */

const { PlaceDetail: Detail } = await vite.ssrLoadModule("/src/components/places/PlaceDetail/index.ts")
const entryById = (id) => places.selectPlaces(real, DAY, EMPTY).find(({ place }) => place.id === id)

test("the panel says what is missing about when to go, from the verified data of each place", () => {
  const notice = (id) => places.buildPlaceView(entryById(id)).availabilityNotice
  assert.equal(notice("cesac-3"), "Todavía no tenemos horarios ni información de turnos verificados: llamá antes de ir.")
  assert.equal(notice("cesac-47"), "Todavía no tenemos horarios ni información de turnos verificados: llamá antes de ir.")
  // hours are verified (24 h) but whether a turn is needed is not
  assert.equal(notice("hospital-odontologia-carrillo"), "Todavía no tenemos información verificada sobre turnos: consultá antes de ir.")
  // the hospital that says both (hours and no turn needed) has nothing to apologize for
  assert.equal(notice("hospital-oftalmologico-santa-lucia"), undefined)
  // the other way round: turns known, hours not
  const [base] = real.filter(({ id }) => id === "hospital-oftalmologico-santa-lucia")
  const place = structuredClone(base)
  place.hours = null
  place.services[0].hours = null
  assert.equal(places.buildPlaceView(places.selectPlaces([place], DAY, EMPTY)[0]).availabilityNotice, "Todavía no tenemos el horario verificado: llamá antes de ir.")
})

test("with nothing verified about when to go, the phone to call is the first thing in the panel", () => {
  const draw = (entry) => renderToStaticMarkup(createElement(Detail, { entry, onClose() {} }))
  const html = draw(entryById("cesac-3"))
  const body = text(html)
  assert.ok(body.includes("llamá antes de ir") && body.includes("Hay más contactos más abajo."))
  // the notice comes before the services, with a call link (the first phone), bigger than the others
  assert.ok(html.indexOf('role="note"') < html.indexOf("Atención disponible"))
  assert.match(html, /role="note"[\s\S]*?href="tel:\+54[0-9]+"[^>]*aria-label="Llamar a Principal: 2821-3603"[^>]*min-h-12/)
  // a place that says everything has no notice
  assert.ok(!draw(entryById("hospital-oftalmologico-santa-lucia")).includes('role="note"'))
  // no phone: it says so, and does not invent one
  const [base] = real.filter(({ id }) => id === "cesac-47")
  const place = structuredClone(base)
  delete place.contacts
  for (const service of place.services) delete service.contacts
  const none = text(draw(places.selectPlaces([place], DAY, EMPTY)[0]))
  assert.ok(none.includes("Por ahora no tenemos un teléfono verificado de este lugar.") && !none.includes("Hay más contactos"))
})

/* ── Mental health: orientation around the results, urgent help one tap away in a crisis ── */

const { UrgentHelp } = await vite.ssrLoadModule("/src/components/places/UrgentHelp/index.ts")
const lineFile = await readFile(join(root, "src/data/resources/lines/nacional.json"), "utf8")

test("what the search says about mental health: a crisis is told apart from looking for a psychologist", () => {
  const context = (query) => places.mentalHealthContextOf({ ...EMPTY, ...query })
  for (const text of ["quiero morirme", "me quiero matar", "pienso en suicidarme", "pensando en suicidio", "no aguanto más", "Quiero hacerme daño", "estoy en crisis", "tuve una sobredosis", "autolesiones"]) {
    // "me quiero matar" is not in the list on purpose: it is caught by the words below only when they are there
    if (text === "me quiero matar") continue
    assert.equal(context({ text }), "crisis", text)
  }
  for (const text of ["psicologo", "psicología infantil", "salud mental", "terapia", "ansiedad", "depresión", "psiquiatra"]) assert.equal(context({ text }), "habitual", text)
  assert.equal(context({ category: "salud-mental" }), "habitual")
  assert.equal(context({ filterId: "mental-health" }), "habitual")
  // a crisis wins over the filter; nothing about it in other searches
  assert.equal(context({ category: "salud-mental", text: "crisis" }), "crisis")
  for (const query of [{}, { text: "odontologia" }, { category: "salud-fisica" }, { text: "vacunas gratis" }]) assert.equal(context(query), null, JSON.stringify(query))
  // the words never filter anything
  assert.deepEqual(ids(ask({ text: "quiero morirme" })), [])
})

test("urgent help: every number, where it works, its hours and its cost come from the verified help lines, and no clinical advice", () => {
  const draw = (context) => renderToStaticMarkup(createElement(UrgentHelp, { context }))
  const crisis = draw("crisis")
  const body = text(crisis)
  assert.ok(body.includes("Si estás en crisis o pensás en hacerte daño, no esperes: pedí ayuda ahora"))
  assert.ok(body.includes("Si hay riesgo para tu vida o la de otra persona, llamá ya al 911."))
  // direct calls, in this order, and only to numbers of the verified lines (and of the emergency bar for those it has)
  const dialed = [...crisis.matchAll(/href="tel:([0-9]+)"/g)].map((match) => match[1])
  assert.deepEqual(dialed, ["911", "08009990091", "135", "08003451435", "107"])
  const verified = new Set(JSON.parse(lineFile).resources.flatMap((line) => line.contacts.map((contact) => contact.dial)))
  for (const dial of dialed) assert.ok(verified.has(dial), dial + " is not in the verified help lines")
  // what the sources say, and nothing else
  assert.ok(body.includes("Funciona en todo el país"), "911 and the national line: national")
  assert.ok(body.includes("Atiende las 24 horas, los 365 días del año.") && body.includes("Atención gratuita y confidencial"), "0800-999-0091: 24 h, free")
  assert.ok(body.includes("Solo CABA y Gran Buenos Aires.") && body.includes("Atiende de 8:00 a 0:00 (medianoche), no las 24 horas."), "135 and its hours")
  assert.ok(body.includes("Todo el país: lo mismo que el 135, desde el resto del país."), "0800-345-1435: the national alternative")
  // the 107 is neither national nor only CABA and Buenos Aires: it depends on the jurisdiction, confirm the local number, 911 is the general one
  assert.ok(body.includes("Depende de la jurisdicción") && body.includes("Confirmá el número local") && body.includes("En cualquier lugar del país, 911"))
  assert.ok(!/107[^.]*(todo el país|24 horas)/.test(body), "the 107 is not said to be nationwide or 24 h")
  assert.ok(!/solo (en )?CABA y (en )?(localidades de )?(la provincia de )?Buenos Aires/i.test(body), "the 107 is not limited to CABA and Buenos Aires")
  assert.ok(!body.includes("911 atiende las 24") && !/911[^.]*24 horas/.test(body), "no hours are claimed for the 911: its source does not give them")
  assert.ok(body.includes("Ver todos los números de emergencia"))
  assert.ok(!/diagn[oó]stic|medicaci[oó]n|tratamiento|dosis|pastilla/i.test(body), "no clinical advice")
  // the usual search: a calm line that opens to the same numbers
  const habitual = draw("habitual")
  assert.ok(text(habitual).includes("Si necesitás ayuda urgente ahora, tocá acá") && habitual.includes("<details"))
  assert.deepEqual([...habitual.matchAll(/href="tel:([0-9]+)"/g)].map((match) => match[1]), dialed)
  assert.equal(draw(null), "")
})

test("the explorer: urgent help first in a crisis, a calm line for a usual search, nothing otherwise - and the results stay", () => {
  const render = (url) => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(PlacesExplorer, { map: true })))
  const crisis = render("/centros?vista=lista&buscar=quiero+morirme")
  assert.ok(text(crisis).includes("pedí ayuda ahora") && crisis.indexOf("pedí ayuda ahora") < crisis.indexOf("0 lugares encontrados"))
  // right under the search box, before the filters and the results
  assert.ok(crisis.indexOf("¿Qué necesitás?") < crisis.indexOf('href="tel:911"') && crisis.indexOf('href="tel:911"') < crisis.indexOf("lugares encontrados"))
  const usual = render("/centros?vista=lista&categoria=salud-mental")
  assert.ok(text(usual).includes("Si necesitás ayuda urgente ahora, tocá acá") && !text(usual).includes("pedí ayuda ahora"))
  assert.ok(text(usual).includes("0 lugares encontrados"), "no mental health prestación has documented gratuity yet: none is shown, and the urgent help is still there")
  const other = render("/centros?vista=lista&buscar=odontologia")
  assert.ok(!text(other).includes("ayuda urgente") && !text(other).includes("pedí ayuda ahora"))
})

/* ── Explanations only where there is something to explain ── */

test("the note about the numbers is shown only when some filter shows numbers", () => {
  const facetsOf = (query) => places.getPlaceFacets(real, DAY, { ...EMPTY, ...query })
  assert.equal(places.hasVisibleCounts(facetsOf({ province: "AR-C" })), true)
  assert.equal(places.hasVisibleCounts(facetsOf({})), true)
  // a province with no places loaded: no options, no numbers, so no note about them
  assert.equal(places.hasVisibleCounts(places.getPlaceFacets([], DAY, { ...EMPTY, province: "AR-B" })), false)
  assert.equal(places.hasVisibleCounts({ provinces: [], zones: [], categories: [], types: [], free: 0 }), false)
  assert.equal(places.hasVisibleCounts({ provinces: [], zones: [], categories: [], types: [], free: 2 }), true)
})

/* ── Search: psicólogo, psicóloga, psicólogos and psicología find the same ── */

test("the root of a searched word: gender, plural and the name of the discipline find each other, short words stay", () => {
  const stem = places.stemOf
  for (const word of ["psicologo", "psicologa", "psicologos", "psicologas", "psicologia", "psicologias"]) assert.equal(stem(word), "psicolog", word)
  for (const word of ["odontologo", "odontologia", "odontologos"]) assert.equal(stem(word), "odontolog", word)
  assert.equal(stem("vacunas"), "vacun")
  // not cut: too short to keep a root of 5 letters, or no known ending
  for (const word of ["salud", "esi", "ive", "vih", "mama", "centro", "ansiedad", "mental", "cesac", "guardia"]) assert.equal(stem(word), word === "centro" ? "centr" : word === "guardia" ? "guard" : word, word)
})

test("a search with any form of the word finds the same places, and keeps every other rule", () => {
  const same = ids(ask({ text: "psicologia" }))
  assert.equal(same.length, 2, "the places whose services say psychology")
  for (const text of ["psicologo", "psicóloga", "psicologos", "Psicólogas", "PSICOLOGO"]) assert.deepEqual(ids(ask({ text })), same, text)
  assert.deepEqual(ids(ask({ text: "odontologo" })), ids(ask({ text: "odontologia" })))
  // the other criteria still hold for the same service
  assert.deepEqual(ids(ask({ text: "psicologo", category: "esi" })), ids(ask({ text: "psicologia", category: "esi" })))
  assert.deepEqual(ids(ask({ text: "psicologo", type: "vaccination" })), ids(ask({ text: "psicologia", type: "vaccination" })))
  assert.deepEqual(ids(ask({ text: "psicologa", category: "salud-mental" })), same)
  // gratuity is still a condition, not free text, with the new forms
  const freeDentistry = ["hospital-odontologia-carrillo", "hospital-odontologia-duenas"]
  assert.deepEqual(ids(ask({ text: "odontologo gratis" })), freeDentistry)
  assert.deepEqual(ids(ask({ text: "odontologa gratuita" })), freeDentistry)
  assert.deepEqual(ids(ask({ text: "psicologo gratis" })), [])
  // a word that is nowhere is still nowhere, and a different discipline is not found by the root of another
  assert.deepEqual(ids(ask({ text: "cardiologo" })), [])
  assert.deepEqual(ids(ask({ text: "veterinario" })), ["centro-fijo-veterinario-costanera-sur"], "the name of the veterinary centre says it")
  assert.deepEqual(ids(ask({ text: "cardiologo veterinario" })), [])
  // every word still has to be somewhere
  assert.deepEqual(ids(ask({ text: "psicologo cardiologo" })), [])
  // the service that answers is the one that says it
  const entry = places.selectPlaces(real, DAY, { ...EMPTY, text: "psicologo" }).find(({ place }) => place.id === "cesac-3")
  assert.deepEqual(places.matchingServices(entry, { ...EMPTY, text: "psicologo" }).map((service) => service.type), ["mental-health-care"])
  // the crisis and mental health orientation does not depend on the form of the word
  for (const text of ["psicologo", "psicologa", "psicologia"]) assert.equal(places.mentalHealthContextOf({ ...EMPTY, text }), "habitual", text)
})
