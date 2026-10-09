/*
 * The first veterinary place of the map: the Centro Fijo Veterinario Costanera Sur (Animales BA), only for castration. What the data
 * says, where it shows (the Salud animal filter and never the filters for people), that its gratuity is the castration's and not
 * "any veterinary care", that card and panel explain the conditions, that the point is said to be approximate, and that nothing
 * is made up (hours, phone, residence, other services). The Indoamericano centre is NOT in the data.
 *   npm run places:test
 */
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const raw = JSON.parse(await readFile(join(root, "src/data/resources/places/ar-c.json"), "utf8")).resources
const server = JSON.parse(await readFile(resolve(root, "../server/src/main/resources/data/resources.json"), "utf8")).resources

const { createServer } = await import("vite")
const vite = await createServer({ root, logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())
const { createElement } = await import("react")
const { renderToStaticMarkup } = await import("react-dom/server")
const { MemoryRouter } = await import("react-router")
const places = await vite.ssrLoadModule("/src/utils/places/index.ts")
const data = await vite.ssrLoadModule("/src/data/resources/index.ts")
const { PlaceDetail } = await vite.ssrLoadModule("/src/components/places/PlaceDetail/index.ts")
const { PlaceCard } = await vite.ssrLoadModule("/src/components/places/PlaceCard/index.ts")
const { PlacesMapView } = await vite.ssrLoadModule("/src/components/places/PlacesMapView/index.ts")

const DAY = data.todayInArgentina()
const ID = "centro-fijo-veterinario-costanera-sur"
const PAGE = "https://buenosaires.gob.ar/gcaba_historico/atencion-veterinaria-y-castraciones-gratuitas"
const real = await data.loadPlaces("AR-C")
const { EMPTY_PLACE_QUERY: EMPTY, selectPlaces, matchingServices, isVerifiedFree, buildPlaceView } = places
const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const centre = raw.find(({ id }) => id === ID)
const ask = (criteria) => selectPlaces(real, DAY, { ...EMPTY, ...criteria }).map(({ place }) => place.id).sort()
const entry = () => selectPlaces(real, DAY, EMPTY).find(({ place }) => place.id === ID)

test("the data: one place, one service (castration), what the official page documents and nothing else", () => {
  assert.ok(centre)
  assert.equal(centre.facilityType, "public-veterinary")
  assert.equal(centre.kind, "service")
  assert.deepEqual(centre.services.map(({ id, type }) => [id, type]), [["castracion", "spaying-neutering"]])
  assert.match(centre.name, /Costanera Sur/)
  assert.deepEqual([centre.address.street, centre.address.number, centre.address.department, centre.address.province], ["Av. Dr. T. Achával Rodríguez", "1550", "Comuna 1", "AR-C"])
  assert.match(centre.address.reference, /fuente de Lola Mora/)
  // nothing made up: no phone, no hours, no residence, no other service
  assert.equal(centre.contacts, undefined, "no phone: the page does not give one")
  const service = centre.services[0]
  assert.equal(service.hours, null, "no hours: the page gives an agenda by day, which is not a permanent schedule")
  assert.equal(centre.hours, undefined)
  assert.ok(!/residen|domicilio en la ciudad|vecin/i.test(service.requirements.join(" ")), "no residence requirement is invented")
  assert.match(service.costNote, /no aclara si hace falta vivir en la Ciudad/, "and it says the page does not say")
  assert.ok(!centre.services.some(({ type }) => ["veterinary-care", "rabies-vaccination", "zoonosis"].includes(type)), "no guardia, general care or vaccination")
  assert.equal(service.appointment.mode, "required")
  assert.match(service.appointment.howTo, /viernes a las 10 h/)
})

test("sources: the official page for gratuity, existence and how to ask, the official map for the point, each with its date", () => {
  const service = centre.services[0]
  assert.equal(service.source.url, PAGE)
  assert.match(service.source.note, /totalmente gratuito/)
  assert.deepEqual(service.evidence.map(({ kind }) => kind), ["cost", "existence", "access"])
  for (const item of [...service.evidence, service.source, centre.source]) {
    assert.equal(item.retrievedAt, "2026-10-09")
    assert.match(item.url, /^https:\/\/buenosaires\.gob\.ar\//)
  }
  assert.match(centre.source.note, /mapa\.buenosaires\.gob\.ar\/mapas\/\?lat=-34\.617546&lng=-58\.356478/)
  assert.match(service.evidence.find(({ kind }) => kind === "access").note, /No confirma que haya turnos disponibles/)
})

test("the point is the official map's, verified, and said to be approximate", () => {
  const c = centre.coordinates
  assert.deepEqual([c.lat, c.lng, c.precision, c.status, c.method], [-34.617546, -58.356478, "approximate", "verified", "geocoded-usig"])
  assert.match(c.note, /no la entrada exacta/)
  assert.ok(data.isMappable(centre))
  assert.equal(places.hasApproximateLocation(centre), true)
  // the approximate point is told in the panel and under the map; a place with no point says nothing of it
  assert.ok(text(renderToStaticMarkup(createElement(PlaceDetail, { entry: entry(), onClose() {} }))).includes("Ubicación aproximada en el mapa: marca la dirección, no necesariamente la entrada."))
  const exact = structuredClone(centre)
  exact.coordinates.precision = "exact"
  assert.equal(places.hasApproximateLocation(exact), false, "an exact point does not say it is approximate")
  const mapView = (list) => text(renderToStaticMarkup(createElement(MemoryRouter, null, createElement(PlacesMapView, { entries: selectPlaces(list, DAY, EMPTY), onOpen() {}, onBackToList() {}, selectedId: null, onSelect() {} }))))
  assert.ok(mapView([centre]).includes("La ubicación de este punto es aproximada: marca la dirección, no necesariamente la entrada."))
  assert.ok(!mapView([exact]).includes("aproximada"), "an exact entrance is not called approximate")
})

test("it is current (verified, review date ahead) and the review is soon, because the agenda changes", () => {
  assert.equal(data.isCurrent(centre, DAY), true)
  assert.equal(centre.verification.verifiedAt, "2026-10-09")
  assert.ok(centre.verification.nextReviewDue <= "2026-11-08")
})

test("filters: in Salud animal and in the free filter, never in the filters for people", () => {
  assert.deepEqual(ask({ filterId: "animal-health" }), [ID])
  assert.deepEqual(ask({ filterId: "animal-health", free: true }), [ID])
  assert.deepEqual(ask({ category: "animales" }), [ID])
  assert.deepEqual(ask({ type: "spaying-neutering" }), [ID])
  for (const filterId of ["medical", "mental-health", "sexual-health", "vaccination", "dentistry", "emergency"]) assert.ok(!ask({ filterId }).includes(ID), filterId)
  for (const category of ["salud-fisica", "salud-mental", "esi"]) assert.ok(!ask({ category }).includes(ID), category)
  assert.ok(ask({}).includes(ID), "and it is in 'Todos'")
  assert.ok(ask({ free: true }).includes(ID))
  // the human places are the same as before: not in the animal filter
  for (const id of ["cesac-3", "cesac-41", "cesac-47", "hospital-odontologia-carrillo", "hospital-odontologia-duenas", "hospital-oftalmologico-santa-lucia"]) assert.ok(!ask({ filterId: "animal-health" }).includes(id), id)
})

test("the gratuity is the castration's, not any veterinary care", () => {
  const c = entry()
  const service = data.getServices(centre)[0]
  assert.equal(isVerifiedFree(centre, service), true)
  assert.deepEqual(matchingServices(c, { ...EMPTY, filterId: "animal-health", free: true }).map(({ id }) => id), ["castracion"])
  assert.deepEqual(ask({ text: "castracion gratuita" }), [ID])
  assert.deepEqual(ask({ text: "castracion gratis" }), [ID])
  for (const term of ["vacuna antirrabica gratuita", "guardia veterinaria gratuita", "consulta veterinaria gratuita", "urgencias gratuitas", "desparasitacion gratuita", "zoonosis gratuita"]) {
    assert.deepEqual(ask({ text: term }), [], `${term} is not offered by this centre`)
  }
  // the view says castration and nothing else about what is free
  const view = buildPlaceView(c)
  assert.deepEqual(view.services.map(({ name }) => name), ["Castración de perros y gatos"])
  assert.ok([...view.highlights, ...view.services[0].chips].includes("Gratuita con condiciones"))
  assert.ok(![...view.highlights, ...view.services[0].chips].includes("Atención gratuita"), "never plain free: it has conditions")
})

test("the card and the panel explain the conditions: turn first, miBA, an adult companion, the preparation", () => {
  const card = text(renderToStaticMarkup(createElement(MemoryRouter, null, createElement(PlaceCard, { entry: entry(), onOpen() {} }))))
  assert.match(card, /Castración de perros y gatos/)
  assert.match(card, /Gratuita con condiciones/)
  assert.match(card, /Solo con turno previo, que se pide online con cuenta miBA/)
  assert.match(card, /mayor de 18 años/)
  assert.ok(!/Gratuidad no confirmada/.test(card), "its one service is confirmed")
  const panel = text(renderToStaticMarkup(createElement(PlaceDetail, { entry: entry(), onClose() {} })))
  for (const piece of ["Con turno previo", "cuenta miBA", "mayor de 18 años", "toda la mañana", "collar y correa", "ayunas", "viernes a las 10 h", "Pedir turno", "Gratuita con condiciones", "no se atiende a quienes se acercan sin turno"]) assert.ok(panel.includes(piece), piece)
  assert.ok(!/Podés ir sin turno/.test(panel), "no walk-in")
  // no hours, no phone: the panel says what is missing and does not tell to call
  assert.ok(!/Horario de|\d{1,2}:\d{2} a \d{1,2}:\d{2}/.test(panel), "no hours")
  assert.ok(panel.includes("Todavía no tenemos el horario verificado: consultá antes de ir."))
  assert.ok(panel.includes("Por ahora no tenemos un teléfono verificado de este lugar."))
  assert.ok(!panel.includes("llamá antes de ir"))
  assert.ok(!/tel:/.test(renderToStaticMarkup(createElement(PlaceDetail, { entry: entry(), onClose() {} }))))
})

test("official links: the page once under 'Fuentes oficiales', with what it backs", () => {
  const html = renderToStaticMarkup(createElement(PlaceDetail, { entry: entry(), onClose() {} }))
  assert.ok(text(html).includes("Fuentes oficiales"))
  assert.equal(html.split(`href="${PAGE}"`).length - 1, 2, "once in the sources and once in 'Pedir turno' (a different purpose)")
  const view = buildPlaceView(entry())
  assert.equal(view.sources.length, 1)
  assert.deepEqual(view.sources[0].backs, [
    "Respalda la gratuidad de: Castración de perros y gatos",
    "Confirma que la sede ofrece: Castración de perros y gatos",
    "Explica cómo pedir turno para: Castración de perros y gatos. No confirma que haya turnos disponibles",
  ])
})

test("the Indoamericano centre is not in the data, and the other places did not change", () => {
  assert.equal(raw.some(({ id }) => id === "centro-fijo-veterinario-indoamericano"), false)
  assert.equal(raw.length, 7)
  assert.deepEqual(raw.map(({ id }) => id).sort(), ["centro-fijo-veterinario-costanera-sur", "cesac-3", "cesac-41", "cesac-47", "hospital-odontologia-carrillo", "hospital-odontologia-duenas", "hospital-oftalmologico-santa-lucia"])
  // vaccination and mental health of CeSAC 47, mental health of the others and dentistry: still not confirmed free
  const notFree = [["cesac-47", "vacunacion"], ["cesac-47", "psiquiatria"], ["cesac-47", "psicologia"], ["cesac-3", "salud-mental"], ["cesac-41", "salud-mental"], ["cesac-3", "odontologia"], ["cesac-41", "odontologia"], ["cesac-47", "odontologia"]]
  for (const [placeId, serviceId] of notFree) {
    const place = raw.find(({ id }) => id === placeId)
    assert.equal(isVerifiedFree(place, data.resolveService(place, place.services.find(({ id }) => id === serviceId))), false, `${placeId}/${serviceId}`)
  }
})

test("the server copy has the centre, without the evidence (the server does not use it)", () => {
  const copy = server.find(({ id }) => id === ID)
  assert.ok(copy)
  assert.equal(copy.services[0].cost, "free")
  assert.equal(copy.services[0].evidence, undefined)
  assert.equal(server.length, 21)
})
