/*
 * Tests of the "Tipo de lugar" sub-filter of the Mapa AuxiliAR: inside a kind of care (Salud general, Salud mental, ESI, Animales) it tells
 * apart hospitales, centros de salud, vacunatorios, guardias… What is checked: that the options and their counts come from the places that
 * answer the other filters, that vacunatorio and guardia are decided by the services (so a hospital can be several kinds), that the choice
 * travels in the URL only inside a kind of care, and what the explorer shows.
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
after(() => vite.close())

const { createElement } = await import("react")
const { renderToStaticMarkup } = await import("react-dom/server")
const { MemoryRouter } = await import("react-router")
const places = await vite.ssrLoadModule("/src/utils/places/index.ts")
const data = await vite.ssrLoadModule("/src/data/resources/index.ts")
const { PlacesExplorer } = await vite.ssrLoadModule("/src/components/places/PlacesExplorer/index.ts")
for (const province of data.PROVINCES_WITH_PLACE_FILES) await data.loadPlaces(province)
const everyPlace = (await Promise.all(data.PROVINCES_WITH_PLACE_FILES.map((province) => data.loadPlaces(province)))).flat()
const DAY = data.todayInArgentina()
const { EMPTY_PLACE_QUERY: EMPTY, selectPlaces, getPlaceFacets, kindsOf, placeQueryFromParams, placeQueryToParams } = places
const SCOPE = { confirmedOnly: true }
const ask = (query) => selectPlaces(everyPlace, DAY, { ...EMPTY, ...query }, SCOPE)
const ids = (entries) => entries.map(({ place }) => place.id)
const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const render = (url) => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(PlacesExplorer, { map: true })))

test("the kinds of a place: its facility type, and vacunatorio or guardia when a service that answers is one", () => {
  const find = (id) => everyPlace.find((place) => place.id === id)
  const entry = (id) => ask({}).find(({ place }) => place.id === id)
  assert.deepEqual(kindsOf(find("hospital-durand"), entry("hospital-durand").services).sort(), ["emergency-room", "hospital", "vaccination-point"], "a hospital with a vacunatorio and a guardia is the three")
  assert.deepEqual(kindsOf(find("cesac-9"), entry("cesac-9").services).sort(), ["health-center", "vaccination-point"])
  assert.deepEqual(kindsOf(find("estacion-saludable-ruben-dario"), entry("estacion-saludable-ruben-dario").services), ["health-promotion-station"])
  // only the services that answer count: for the sexual health care, a hospital is not a vacunatorio
  const sexual = ask({ category: "esi" }).find(({ place }) => place.id === "hospital-durand")
  assert.deepEqual(kindsOf(sexual.place, sexual.services.filter((service) => service.categories.includes("esi"))), ["hospital"])
})

test("the options come from the places that answer the other filters, with how many", () => {
  const kinds = (query) => Object.fromEntries(getPlaceFacets(everyPlace, DAY, { ...EMPTY, ...query }, SCOPE).kinds.map(({ value, count }) => [value, count]))
  const general = kinds({ category: "salud-fisica" })
  assert.ok(general.hospital > 0 && general["health-center"] > 0 && general["vaccination-point"] > 0 && general["emergency-room"] > 0)
  assert.equal(general["vaccination-point"], ask({ category: "salud-fisica", filterId: "vaccination" }).length, "the vacunatorios are the places with a vaccination service")
  assert.equal(general.hospital, ask({ category: "salud-fisica", kind: "hospital" }).length)
  // Salud mental: hospitals with a guardia, centers, stations; no vacunatorio (its vaccination is Salud general)
  const mental = kinds({ category: "salud-mental" })
  assert.ok(mental.hospital > 0 && mental["emergency-room"] > 0 && mental["health-promotion-station"] > 0 && mental["mental-health-center"] > 0)
  assert.equal(mental["vaccination-point"], undefined)
  // Animales: only veterinarian kinds
  assert.deepEqual(Object.keys(kinds({ category: "animales" })).sort(), ["public-veterinary", "zoonosis-center"])
  // the counts follow the other filters: in the Ciudad there are fewer than in the country
  const inCaba = kinds({ category: "salud-fisica", province: "AR-C" })
  assert.ok(inCaba.hospital <= general.hospital)
  const free = kinds({ category: "salud-fisica", free: true })
  assert.ok(Object.values(free).every((count) => count > 0), "no option is offered empty")
})

test("choosing a kind narrows the results to those places, and each kind says what it is", () => {
  const hospitals = ask({ category: "salud-fisica", kind: "hospital" })
  assert.ok(hospitals.length > 5 && hospitals.every(({ place }) => place.facilityType === "hospital"))
  const centers = ask({ category: "salud-fisica", kind: "health-center" })
  assert.ok(centers.every(({ place }) => place.facilityType === "health-center"))
  const vacunatorios = ask({ category: "salud-fisica", kind: "vaccination-point" })
  assert.ok(vacunatorios.length > 50 && vacunatorios.every(({ services }) => services.some(({ type }) => type === "vaccination")))
  // they overlap: a hospital with a vacunatorio is in both
  assert.ok(ids(hospitals).some((id) => ids(vacunatorios).includes(id)))
  const guardias = ask({ category: "salud-mental", kind: "emergency-room" })
  assert.ok(guardias.length >= 17 && guardias.every(({ services }) => services.some(({ type }) => ["emergency-room", "mental-health-emergency"].includes(type))))
  // a kind a category does not have gives nothing, never someone else's results
  assert.deepEqual(ask({ category: "animales", kind: "hospital" }), [])
  assert.equal(places.placeKindLabel("vaccination-point"), "Vacunatorios")
})

test("the choice travels in the URL only inside a kind of care", () => {
  const query = placeQueryFromParams(new URLSearchParams("categoria=salud-fisica&tipo=hospital"))
  assert.equal(query.kind, "hospital")
  assert.equal(placeQueryToParams(new URLSearchParams(""), query).toString(), "categoria=salud-fisica&tipo=hospital")
  // alone, or with a kind that does not exist, it means nothing
  assert.equal(placeQueryFromParams(new URLSearchParams("tipo=hospital")).kind, null)
  assert.equal(placeQueryFromParams(new URLSearchParams("categoria=salud-fisica&tipo=magia")).kind, null)
  // clearing the kind of care clears it too
  assert.equal(placeQueryToParams(new URLSearchParams("tipo=hospital&categoria=salud-fisica"), { ...query, category: null }).toString(), "")
})

test("the explorer shows the chosen kind as a removable filter, and the component lists the options with counts and nothing when there is nothing to tell apart", async () => {
  const { KindFilter } = await vite.ssrLoadModule("/src/components/places/KindFilter/index.ts")
  const chosen = text(render("/centros?vista=lista&categoria=salud-fisica&tipo=vaccination-point"))
  assert.ok(chosen.includes("Vacunatorios Quitar filtro"), "the active filter says it and can be removed")
  assert.ok(/\d+ lugares encontrados/.test(chosen))
  const facetsOf = (query) => getPlaceFacets(everyPlace, DAY, { ...EMPTY, ...query }, SCOPE).kinds
  const view = (query, value = null) => text(renderToStaticMarkup(createElement(KindFilter, { facets: facetsOf(query), value, onChange() {} })))
  const general = view({ category: "salud-fisica" })
  assert.ok(general.includes("Tipo de lugar") && general.includes("Todos") && /Hospitales \(\d+\)/.test(general) && /Centros de salud \(\d+\)/.test(general) && /Vacunatorios \(\d+\)/.test(general))
  const mental = view({ category: "salud-mental" })
  assert.ok(/Guardias \(\d+\)/.test(mental) && /Estaciones Saludables \(\d+\)/.test(mental) && !mental.includes("Vacunatorios"))
  // the chosen one is pressed, and with a single kind (nothing to choose) the filter is not shown
  const pressed = renderToStaticMarkup(createElement(KindFilter, { facets: facetsOf({ category: "salud-fisica" }), value: "hospital", onChange() {} }))
  assert.match(pressed, /aria-pressed="true"[^>]*>Hospitales \(\d+\)</)
  assert.equal(renderToStaticMarkup(createElement(KindFilter, { facets: [{ value: "hospital", count: 3 }], value: null, onChange() {} })), "")
})
