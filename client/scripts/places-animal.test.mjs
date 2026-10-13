/*
 * Tests of the quick filter "Atención veterinaria" of the Mapa AuxiliAR and of the wall between human and animal care:
 * no veterinary service type is in a filter meant for people, the animal filter has only veterinary types, the gratuity
 * stays verified service by service, and with no veterinary service loaded a link to the filter says so. The veterinary place
 * of these tests is made up from a copy of a real one (the real data has no veterinary service and none is added here).
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
const { centersLink } = await vite.ssrLoadModule("/src/router/centersLink.ts")
const { PlacesExplorer } = await vite.ssrLoadModule("/src/components/places/PlacesExplorer/index.ts")
const taxonomy = JSON.parse(await readFile(join(root, "src/data/resources/taxonomy.json"), "utf8"))

const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const DAY = data.todayInArgentina()
const real = withoutSexualBatch(await data.loadPlaces("AR-C"))
// the other provinces with places are loaded too (the explorer shows them all); `real` stays the Ciudad's places
for (const province of data.PROVINCES_WITH_PLACE_FILES) await data.loadPlaces(province)
// The places for people (everything but the veterinary centre): the wall tests below add a made-up veterinary place to them
const realHuman = real.filter(({ facilityType }) => facilityType !== "public-veterinary")
const { EMPTY_PLACE_QUERY: EMPTY, PLACE_FILTERS, selectPlaces, matchingServices, quickFilterHasData } = places

const animalTypes = taxonomy.serviceTypes.filter(({ categories }) => categories.includes("animales")).map(({ id }) => id)
const humanTypes = taxonomy.serviceTypes.filter(({ categories }) => !categories.includes("animales")).map(({ id }) => id)
const FREE_NOTE = { organization: "Fuente de prueba", url: "https://example.org/prueba", note: "Nota de prueba que dice que es gratuita." }

// A veterinary place made up from a copy of a real human one (the real veterinary centre has its own tests, at the end)
const vetPlace = () => {
  const copy = structuredClone(real.find(({ id }) => id === "cesac-3"))
  copy.id = "prueba-veterinaria"
  copy.name = "Veterinaria pública de prueba"
  copy.facilityType = "public-veterinary"
  copy.services = [
    { id: "vacuna-antirrabica", type: "rabies-vaccination" },
    { id: "castracion", type: "spaying-neutering", cost: "free", source: FREE_NOTE },
  ]
  return copy
}
const humanVaccination = () => real.find(({ id }) => id === "cesac-41")
const WITH_VET = [...realHuman, vetPlace()]
const ids = (entries) => entries.map(({ place }) => place.id).sort()
const ask = (criteria, list = WITH_VET) => ids(selectPlaces(list, DAY, { ...EMPTY, ...criteria }))

test("the veterinary service types are exactly the ones of the category 'animales', and they are known", () => {
  assert.deepEqual([...animalTypes].sort(), ["rabies-vaccination", "spaying-neutering", "veterinary-care", "zoonosis"])
})

test("the wall: a veterinary service type is only in the animal filter, and never in one meant for people", () => {
  const animal = PLACE_FILTERS.find(({ id }) => id === "animal-health")
  assert.ok(animal, "the filter exists")
  assert.equal(animal.label, "Atención veterinaria")
  assert.deepEqual([...animal.types].sort(), [...animalTypes].sort(), "the animal filter has every veterinary type and only those")
  for (const filter of PLACE_FILTERS.filter(({ id }) => id !== "animal-health" && id !== "all")) {
    for (const type of filter.types) {
      assert.ok(!animalTypes.includes(type), `${filter.id} (a filter for people) has the veterinary type ${type}`)
      assert.ok(humanTypes.includes(type), `${filter.id}: ${type} is a known human type`)
    }
  }
  // the filter of human vaccination, written out: the rabies vaccine of pets is not in it
  assert.deepEqual(PLACE_FILTERS.find(({ id }) => id === "vaccination").types, ["vaccination"])
})

test("a veterinary place never answers the human filters, and a human place never answers the animal one", () => {
  const vet = "prueba-veterinaria"
  assert.deepEqual(ask({ filterId: "animal-health" }), [vet])
  for (const filterId of ["medical", "mental-health", "sexual-health", "vaccination", "dentistry", "emergency"]) assert.ok(!ask({ filterId }).includes(vet), filterId)
  assert.ok(!ask({ filterId: "vaccination" }).includes(vet), "the pets' rabies vaccine is not human vaccination")
  assert.deepEqual(ask({ filterId: "vaccination" }), ask({ filterId: "vaccination" }, real), "human vaccination is the same with or without a veterinary place (the real centre included)")
  // by category too: human health is not animal care, and the veterinary place is in 'Todos'
  assert.ok(!ask({ category: "salud-fisica" }).includes(vet) && !ask({ category: "salud-mental" }).includes(vet) && !ask({ category: "esi" }).includes(vet))
  assert.deepEqual(ask({ category: "animales" }), [vet])
  assert.ok(ask({}).includes(vet))
  // and a place with human services only is not in the animal filter
  assert.ok(!ask({ filterId: "animal-health" }).includes(humanVaccination().id))
})

test("inside a place that had both kinds, the services of the other kind are not the ones the filter asks for", () => {
  const mixed = vetPlace()
  mixed.services.push({ id: "vacunacion-humana", type: "vaccination" })
  const entry = selectPlaces([mixed], DAY, { ...EMPTY, filterId: "vaccination" })[0]
  assert.deepEqual(matchingServices(entry, { ...EMPTY, filterId: "vaccination" }).map(({ id }) => id), ["vacunacion-humana"])
  assert.deepEqual(matchingServices(entry, { ...EMPTY, filterId: "animal-health" }).map(({ id }) => id).sort(), ["castracion", "vacuna-antirrabica"])
})

test("gratuity stays verified service by service in the animal filter: nothing is inferred", () => {
  const entry = selectPlaces(WITH_VET, DAY, { ...EMPTY, filterId: "animal-health" })[0]
  const free = (id) => data.getCurrentServices(entry.place, DAY).find((service) => service.id === id)
  assert.ok(places.isVerifiedFree(entry.place, free("castracion")), "the one that declares it with its source")
  assert.ok(!places.isVerifiedFree(entry.place, free("vacuna-antirrabica")), "the other one has no gratuity: it is not free")
  assert.deepEqual(ask({ filterId: "animal-health", free: true }), ["prueba-veterinaria"])
  assert.deepEqual(matchingServices(selectPlaces(WITH_VET, DAY, { ...EMPTY, filterId: "animal-health", free: true })[0], { ...EMPTY, filterId: "animal-health", free: true }).map(({ id }) => id), ["castracion"])
  // with no free veterinary service the free filter shows none
  const noFree = vetPlace()
  delete noFree.services[1].cost
  delete noFree.services[1].source
  assert.deepEqual(ask({ filterId: "animal-health", free: true }, [noFree]), [])
})

test("the filter travels in the link: the same as the other quick filters", () => {
  assert.equal(centersLink({ filter: "animal-health" }), "/centros?filtro=animal-health")
  const query = places.placeQueryFromParams(new URLSearchParams("filtro=animal-health"))
  assert.equal(query.filterId, "animal-health")
  assert.equal(places.placeQueryToParams(new URLSearchParams(), query).get("filtro"), "animal-health")
  // an unknown filter is still ignored
  assert.equal(places.placeQueryFromParams(new URLSearchParams("filtro=veterinaria")).filterId, "all")
})

test("without any veterinary service the filter promises nothing; with one (the real centre, or a made-up one) it does", () => {
  const humanOnly = selectPlaces(realHuman, DAY, EMPTY)
  assert.equal(quickFilterHasData("animal-health", humanOnly), false)
  assert.equal(quickFilterHasData("vaccination", humanOnly), true)
  assert.deepEqual(ask({ filterId: "animal-health" }, realHuman), [])
  assert.equal(quickFilterHasData("animal-health", selectPlaces(WITH_VET, DAY, EMPTY)), true)
  assert.equal(quickFilterHasData("animal-health", selectPlaces(real, DAY, EMPTY)), true, "the real data has the Costanera Sur centre")
})

const render = (url) => text(renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(PlacesExplorer, { map: true, filters: ["medical", "mental-health", "sexual-health", "vaccination", "dentistry", "emergency", "animal-health"] }))))

// With the real data there is a veterinary service. To see the empty state the explorer is embedded with a scope that leaves out the
// animal services (as a page about human health would): the same state a link to Atención veterinaria found before the first centre was loaded
const HUMAN_SCOPE = { category: "salud-fisica" }
const renderScoped = (url) => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(PlacesExplorer, { map: true, scope: HUMAN_SCOPE, filters: ["animal-health"] })))

test("a link to Atención veterinaria with no veterinary service says so, clearly, and offers the way out", () => {
  const html = renderScoped("/centros?vista=lista&filtro=animal-health")
  const content = text(html)
  assert.ok(content.includes("Todavía no tenemos prestaciones veterinarias gratuitas confirmadas para mostrar en el mapa. Podés consultar las campañas y recursos municipales disponibles en Atención veterinaria"))
  assert.ok(content.includes("Tipo: Atención veterinaria"), "the chip says which filter is on")
  assert.ok(content.includes("0 lugares encontrados"))
  assert.ok(html.includes('href="/temas/animales"') && content.includes("Ver Atención veterinaria"), "the way to the campaigns that official pages inform")
  assert.ok(content.includes("Borrar filtros"))
  // not the generic message, and no card, no phone, nothing made up
  assert.ok(!content.includes("No encontramos lugares verificados con esta búsqueda"))
  assert.ok(!html.includes("<article") && !html.includes("tel:"))
})

test("the same with the free filter on: the message is about the veterinary resources, not about gratuity", () => {
  const content = text(renderScoped("/centros?vista=lista&filtro=animal-health&buscar=gratuita"))
  assert.ok(content.includes("Todavía no tenemos prestaciones veterinarias gratuitas confirmadas para mostrar en el mapa"))
  assert.ok(!content.includes("No encontramos prestaciones con gratuidad verificada"))
})

test("the other quick filters and the human vaccination link keep working as before", () => {
  const vaccination = render("/centros?vista=lista&filtro=vaccination")
  assert.ok(vaccination.includes("Tipo: Vacunación") && vaccination.includes("lugares encontrados") && !vaccination.includes("prestaciones veterinarias"))
  assert.ok(render("/centros?vista=lista&filtro=mental-health").includes("Tipo: Salud mental"))
  // the generic empty state of any other search is not replaced
  const none = render("/centros?vista=lista&buscar=zzzzqq")
  assert.ok(none.includes("No encontramos prestaciones con gratuidad documentada para esta búsqueda") && !none.includes("prestaciones veterinarias"))
})
