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
const taxonomy = JSON.parse(await readFile(join(root, "src/data/resources/taxonomy.json"), "utf8"))
const raw = JSON.parse(await readFile(join(root, "src/data/resources/places/ar-c.json"), "utf8")).resources

const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const DAY = data.todayInArgentina()
const real = await data.loadPlaces("AR-C")
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
  assert.equal(entries.length, 6)
  const byPlace = Object.fromEntries(entries.map(({ place, services }) => [place.id, [...new Set(services.flatMap((service) => service.categories))].sort()]))
  // the CeSAC have general health, mental health and ESI services: one place, several categories
  assert.deepEqual(byPlace["cesac-3"], ["esi", "salud-fisica", "salud-mental"])
  assert.deepEqual(byPlace["hospital-oftalmologico-santa-lucia"], ["salud-fisica"])
  for (const category of ["salud-fisica", "salud-mental", "esi"]) assert.deepEqual(ids(ask({ category })), oracle({ category }), category)
  // there is nothing about animals in the data: nothing is shown for them
  assert.deepEqual(ids(ask({ category: "animales" })), [])
  assert.equal(places.getPlaceFacets(real, DAY, EMPTY).categories.some(({ value }) => value === "animales"), false)
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
    for (const list of Object.values(facets)) for (const { count } of list) assert.ok(count > 0)
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
  const html = render("/centros?vista=lista&provincia=AR-C&categoria=salud-mental&prestacion=mental-health-care")
  const content = text(html)
  assert.ok(content.includes("3 lugares encontrados en Ciudad Autónoma de Buenos Aires"))
  assert.ok(content.includes("Ciudad Autónoma de Buenos Aires Quitar filtro") && content.includes("Salud mental Quitar filtro"))
  for (const id of ["cesac-3", "cesac-41", "cesac-47"]) assert.ok(html.includes(`data-place-trigger="${id}"`), id)
  assert.ok(content.includes("Borrar filtros") && content.includes("Los números muestran cuántos lugares cumplen tu búsqueda y los demás filtros"))
  // chips and select reflect the URL
  assert.match(html, /aria-pressed="true"[^>]*>Salud mental \(3\)</)
  assert.match(html, /<option value="mental-health-care"[^>]*selected=""|selected=""[^>]*value="mental-health-care"/)
  // no filters: no active chips, no note about the numbers
  const plain = text(render("/centros?vista=lista"))
  assert.ok(!plain.includes("Borrar filtros") && !plain.includes("Los números muestran"))
  assert.ok(plain.includes("6 lugares encontrados"))
})

test("the explorer: combinations with nothing, and animal care that does not exist", () => {
  const none = text(render("/centros?vista=lista&categoria=salud-mental&prestacion=vaccination"))
  assert.ok(none.includes("0 lugares encontrados") && none.includes("Que no aparezcan no quiere decir que no existan") && none.includes("Borrar filtros"))
  // an animal category is asked for in a link: it is shown as the chosen filter, nothing is listed and nothing is said to exist
  const animals = text(render("/centros?vista=lista&categoria=animales"))
  assert.ok(animals.includes("0 lugares encontrados") && animals.includes("Animales (0)"))
  assert.ok(!/veterinari|zoonosis|castraci/i.test(animals), "no animal service is made up")
  // an invalid category or service in the URL is ignored
  assert.ok(text(render("/centros?vista=lista&categoria=magia&prestacion=nada")).includes("6 lugares encontrados"))
})

test("URL: every filter and the view travel together, and clearing keeps the view and the open place", () => {
  const asked = "provincia=AR-C&zona=Comuna+4&categoria=salud-fisica&prestacion=vaccination&buscar=cesac&filtro=vaccination&vista=mapa&lugar=cesac-41"
  const query = places.placeQueryFromParams(new URLSearchParams(asked))
  assert.deepEqual(query, { text: "cesac", filterId: "vaccination", province: "AR-C", zone: "Comuna 4", category: "salud-fisica", type: "vaccination" })
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
