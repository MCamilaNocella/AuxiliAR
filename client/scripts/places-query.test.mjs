/*
 * Tests of the single query of the Mapa AuxiliAR: which places answer it, what can be chosen next (with counts) and
 * how it travels in the URL. Pure logic, with made-up places: nothing here depends on the real data.
 *   npm run places:test
 */
import assert from "node:assert/strict"
import { dirname, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const { createServer } = await import("vite")
const vite = await createServer({ root: resolve(here, ".."), logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())

const places = await vite.ssrLoadModule("/src/utils/places/index.ts")
const { EMPTY_PLACE_QUERY, selectPlaces, getPlaceFacets, getPlaceEntries, filterPlaces, placeQueryFromParams, placeQueryToParams, getMapPins, countUnmapped } = places

const DAY = "2026-10-07"
const CURRENT = { status: "verified", verifiedAt: "2026-10-01", verifiedBy: "test", nextReviewDue: "2099-01-01" }
const EXPIRED = { status: "verified", verifiedAt: "2019-01-01", verifiedBy: "test", nextReviewDue: "2020-01-01" }

const NAMES = { A: "Alfa", B: "Bravo", C: "Charlie", D: "Delta", E: "Eco", F: "Foxtrot" }
const place = (id, { province = "AR-C", department, types, verification = CURRENT, point }) => ({
  id,
  name: `Centro ${NAMES[id]}`,
  kind: "service",
  facilityType: "health-center",
  address: { street: "Calle", number: "1", province, ...(department ? { department } : {}) },
  ...(point ? { coordinates: { lat: point[0], lng: point[1], precision: "exact", status: "verified" } } : {}),
  services: types.map((type, index) => ({ id: `s${index}`, type })),
  source: { organization: "test" },
  verification,
})

const A = place("A", { department: "Comuna 1", types: ["primary-care", "vaccination", "mental-health-care"], point: [-34.6, -58.4] })
const B = place("B", { department: "Comuna 4", types: ["emergency-room"], point: [-34.64, -58.4] })
const C = place("C", { department: "Comuna 4", types: ["primary-care", "sexual-reproductive-health"] })
const D = place("D", { province: "AR-B", department: "Lanús", types: ["veterinary-care", "rabies-vaccination"] })
const E = place("E", { province: "AR-B", department: "Lomas de Zamora", types: ["primary-care"], verification: EXPIRED })
const F = place("F", { types: ["vaccination"] })
const PLACES = [A, B, C, D, E, F]

const ids = (entries) => entries.map(({ place: { id } }) => id).sort()
const ask = (criteria) => ids(selectPlaces(PLACES, DAY, { ...EMPTY_PLACE_QUERY, ...criteria }))
const facetValues = (facets) => Object.fromEntries(Object.entries({ ...facets, free: [] }).map(([name, list]) => [name, Object.fromEntries(list.map(({ value, count }) => [value, count]))]))

test("an empty query shows every current place, and never an expired one", () => {
  assert.deepEqual(ask({}), ["A", "B", "C", "D", "F"])
})

test("province and division: the division is the one of that province, and alone it means nothing", () => {
  assert.deepEqual(ask({ province: "AR-C" }), ["A", "B", "C", "F"])
  assert.deepEqual(ask({ province: "AR-C", zone: "Comuna 4" }), ["B", "C"])
  assert.deepEqual(ask({ province: "AR-B", zone: "Comuna 4" }), [])
  assert.deepEqual(ask({ province: "AR-B" }), ["D"])
  // a place whose division the data doesn't say is not in any division, but it is in its province
  assert.ok(!ask({ province: "AR-C", zone: "Comuna 1" }).includes("F"))
})

test("a place belongs to every category its verified services have", () => {
  assert.deepEqual(ask({ category: "salud-mental" }), ["A"])
  assert.deepEqual(ask({ category: "salud-fisica" }), ["A", "B", "C", "F"])
  assert.deepEqual(ask({ category: "esi" }), ["C"])
  const a = selectPlaces(PLACES, DAY, EMPTY_PLACE_QUERY).find(({ place: { id } }) => id === "A")
  assert.deepEqual([...new Set(a.services.flatMap((service) => service.categories))].sort(), ["salud-fisica", "salud-mental"])
  // human and animal care are different categories: a veterinary service never shows up as a health one
  assert.deepEqual(ask({ category: "animales" }), ["D"])
  assert.ok(!ask({ category: "salud-fisica" }).includes("D"))
})

test("the service criteria have to hold for the same service", () => {
  assert.deepEqual(ask({ type: "vaccination" }), ["A", "F"])
  // A has a vaccination and a mental health service, but no single service is both
  assert.deepEqual(ask({ category: "salud-mental", type: "vaccination" }), [])
  assert.deepEqual(ask({ category: "salud-fisica", type: "vaccination" }), ["A", "F"])
  assert.deepEqual(ask({ filterId: "vaccination", province: "AR-C" }), ["A", "F"])
  assert.deepEqual(ask({ filterId: "emergency", category: "salud-fisica" }), ["B"])
  assert.deepEqual(ask({ text: "Bravo" }), ["B"])
  assert.deepEqual(ask({ text: "bravo", province: "AR-B" }), [])
})

test("the services that answer the query come first inside each place", () => {
  const entry = selectPlaces(PLACES, DAY, { ...EMPTY_PLACE_QUERY, type: "mental-health-care" }).find(({ place: { id } }) => id === "A")
  assert.equal(entry.services[0].type, "mental-health-care")
  assert.equal(entry.services.length, 3, "the place keeps its other services")
})

test("facets: what can be chosen next, with counts, changing your mind included", () => {
  const all = facetValues(getPlaceFacets(PLACES, DAY, EMPTY_PLACE_QUERY))
  assert.deepEqual(all.provinces, { "AR-C": 4, "AR-B": 1 })
  assert.deepEqual(all.zones, {}, "no divisions until a province is chosen")
  assert.deepEqual(all.categories, { "salud-fisica": 4, "salud-mental": 1, esi: 1, animales: 1 })
  assert.equal(all.types["primary-care"], 2)
  assert.equal(all.types.vaccination, 2)

  // with a province chosen: its divisions, and the other provinces are still there to switch to
  const inCaba = facetValues(getPlaceFacets(PLACES, DAY, { ...EMPTY_PLACE_QUERY, province: "AR-C" }))
  assert.deepEqual(inCaba.zones, { "Comuna 1": 1, "Comuna 4": 2 })
  assert.deepEqual(inCaba.provinces, { "AR-C": 4, "AR-B": 1 })
  assert.deepEqual(inCaba.categories, { "salud-fisica": 4, "salud-mental": 1, esi: 1 })

  // a division chosen: the other divisions of the province remain
  const comuna4 = facetValues(getPlaceFacets(PLACES, DAY, { ...EMPTY_PLACE_QUERY, province: "AR-C", zone: "Comuna 4" }))
  assert.deepEqual(comuna4.zones, { "Comuna 1": 1, "Comuna 4": 2 })
  assert.deepEqual(comuna4.categories, { "salud-fisica": 2, esi: 1 })

  // a category chosen: the services offered are the ones of that category
  const mental = facetValues(getPlaceFacets(PLACES, DAY, { ...EMPTY_PLACE_QUERY, category: "salud-mental" }))
  assert.deepEqual(mental.types, { "mental-health-care": 1 })
  assert.deepEqual(mental.categories, { "salud-fisica": 4, "salud-mental": 1, esi: 1, animales: 1 }, "the category itself can be changed")
})

test("facets never offer an option with no places", () => {
  const queries = [
    EMPTY_PLACE_QUERY,
    { ...EMPTY_PLACE_QUERY, province: "AR-C" },
    { ...EMPTY_PLACE_QUERY, province: "AR-B", zone: "Lanús" },
    { ...EMPTY_PLACE_QUERY, category: "animales" },
    { ...EMPTY_PLACE_QUERY, type: "vaccination", text: "centro" },
    { ...EMPTY_PLACE_QUERY, filterId: "emergency" },
  ]
  for (const query of queries) {
    const facets = getPlaceFacets(PLACES, DAY, query)
    for (const [name, list] of Object.entries({ ...facets, free: [] })) for (const { value, count } of list) assert.ok(count > 0, `${name}:${value}`)
    // and every option leads somewhere: choosing it returns exactly that many places
    for (const { value, count } of facets.categories) assert.equal(selectPlaces(PLACES, DAY, { ...query, category: value }).length, count, `category ${value}`)
    for (const { value, count } of facets.types) assert.equal(selectPlaces(PLACES, DAY, { ...query, type: value }).length, count, `type ${value}`)
    for (const { value, count } of facets.provinces) assert.equal(selectPlaces(PLACES, DAY, { ...query, province: value, zone: null }).length, count, `province ${value}`)
  }
})

test("the list and the map are two views of the same results", () => {
  for (const criteria of [{}, { province: "AR-C" }, { zone: "Comuna 4", province: "AR-C" }, { category: "salud-mental" }, { text: "Charlie" }]) {
    const entries = selectPlaces(PLACES, DAY, { ...EMPTY_PLACE_QUERY, ...criteria })
    const pins = getMapPins(entries)
    // every pin is a result; the places without a verified point are counted, not guessed
    assert.ok(pins.every(({ id }) => entries.some(({ place: { id: other } }) => other === id)))
    assert.equal(pins.length + countUnmapped(entries), entries.length)
  }
  assert.deepEqual(getMapPins(selectPlaces(PLACES, DAY, EMPTY_PLACE_QUERY)).map(({ id }) => id).sort(), ["A", "B"])
})

test("the older entry points are the same query: one copy of the logic", () => {
  assert.deepEqual(ids(getPlaceEntries(PLACES, DAY, "vaccination")), ids(selectPlaces(PLACES, DAY, { ...EMPTY_PLACE_QUERY, filterId: "vaccination" })))
  assert.deepEqual(ids(filterPlaces(PLACES, DAY, { query: "bravo", filterId: "all" })), ["B"])
  assert.deepEqual(ids(getPlaceEntries(PLACES, DAY, "all", { category: "salud-mental" })), ["A"], "a scope still works")
})

test("URL: a query goes into the params and comes back the same, keeping the other params", () => {
  const query = { text: "guardia", filterId: "emergency", province: "AR-C", zone: "Comuna 4", category: "salud-fisica", type: "emergency-room", free: false }
  const params = placeQueryToParams(new URLSearchParams("lugar=cesac-3&vista=mapa"), query)
  assert.equal(params.get("lugar"), "cesac-3")
  assert.equal(params.get("vista"), "mapa")
  assert.equal(params.get("provincia"), "AR-C")
  assert.equal(params.get("zona"), "Comuna 4")
  assert.equal(params.get("categoria"), "salud-fisica")
  assert.equal(params.get("prestacion"), "emergency-room")
  assert.equal(params.get("filtro"), "emergency")
  assert.equal(params.get("buscar"), "guardia")
  assert.deepEqual(placeQueryFromParams(params), query)
  // an empty query leaves nothing behind but the params that are not its own
  const cleared = placeQueryToParams(params, EMPTY_PLACE_QUERY)
  assert.equal(cleared.toString(), "lugar=cesac-3&vista=mapa")
  assert.deepEqual(placeQueryFromParams(cleared), EMPTY_PLACE_QUERY)
})

test("URL: what is not valid is ignored, and a division needs its province", () => {
  const parsed = placeQueryFromParams(new URLSearchParams("provincia=XX&zona=Comuna%204&categoria=centros&prestacion=magia&filtro=nada&buscar=ok"))
  assert.deepEqual(parsed, { ...EMPTY_PLACE_QUERY, text: "ok" })
  // a division with no province is dropped; with one it stays
  assert.equal(placeQueryFromParams(new URLSearchParams("zona=Comuna%204")).zone, null)
  assert.equal(placeQueryFromParams(new URLSearchParams("provincia=AR-C&zona=Comuna%204")).zone, "Comuna 4")
  // changing the province drops the division when the query is written
  assert.ok(!placeQueryToParams(new URLSearchParams(), { ...EMPTY_PLACE_QUERY, zone: "Comuna 4" }).has("zona"))
  // the links that already exist keep working
  assert.deepEqual(placeQueryFromParams(new URLSearchParams("filtro=vaccination&buscar=cesac")), { ...EMPTY_PLACE_QUERY, filterId: "vaccination", text: "cesac" })
  // the text is bounded
  assert.equal(placeQueryFromParams(new URLSearchParams({ buscar: "x".repeat(500) })).text.length, 120)
})
