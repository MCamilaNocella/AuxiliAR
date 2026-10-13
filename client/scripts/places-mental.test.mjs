/*
 * Tests of the mental health and wellbeing places of the Mapa AuxiliAR (report of 12/10/2026): the 17 guardias de salud mental of CABA,
 * the Estaciones Saludables and the yoga of Plazas Activas, the red municipal of Córdoba, La Rioja, Crespo, Salta and Rosario.
 * What is checked: that each service says its cost only as the source does (and its conditions), that the wellbeing activities are not
 * presented as psychotherapy nor as urgent care, that what the report leaves out is not loaded, that only the places with a point backed by a
 * source have a pin, and that the guardias do not change the numbers of the emergency lines.
 *   npm run places:test
 */
import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"
import { isMentalBatchService } from "./places-batches.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const dir = join(root, "src/data/resources/places")
const { createServer } = await import("vite")
const vite = await createServer({ root, logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())

const places = await vite.ssrLoadModule("/src/utils/places/index.ts")
const data = await vite.ssrLoadModule("/src/data/resources/index.ts")
const { glyphOf } = await vite.ssrLoadModule("/src/components/places/PlacesMap/PlacesMap.glyphs.ts")
const files = Object.fromEntries(await Promise.all((await readdir(dir)).filter((name) => name.endsWith(".json")).map(async (name) => [name.replace(".json", ""), JSON.parse(await readFile(join(dir, name), "utf8")).resources])))
const all = Object.entries(files).flatMap(([file, resources]) => resources.map((place) => ({ file, place })))
const withMental = all.filter(({ place }) => place.services.some(isMentalBatchService))
const find = (id) => all.find(({ place }) => place.id === id)?.place
const DAY = data.todayInArgentina()
for (const province of data.PROVINCES_WITH_PLACE_FILES) await data.loadPlaces(province)
const everyPlace = (await Promise.all(data.PROVINCES_WITH_PLACE_FILES.map((province) => data.loadPlaces(province)))).flat()
const { EMPTY_PLACE_QUERY: EMPTY, selectPlaces, getMapPins } = places
const shown = (query = {}) => selectPlaces(everyPlace, DAY, { ...EMPTY, ...query }, { confirmedOnly: true })
const GUARDIAS = ["hospital-alvarez", "hospital-alvear", "hospital-argerich", "hospital-borda", "hospital-durand", "hospital-fernandez", "hospital-grierson", "hospital-moyano", "hospital-especializado-de-infecciosas-f-muniz", "hospital-general-de-agudos-j-a-penna", "hospital-pirovano", "hospital-ramos", "hospital-rivadavia", "hospital-santojanni", "hospital-tobar", "hospital-tornu", "hospital-zubizarreta"]

test("17 guardias de salud mental of CABA: 13 added to hospitals that were already loaded and 4 new hospitals; Piñero, Vélez Sarsfield, Elizalde and Gutiérrez are not there", () => {
  const withGuardia = all.filter(({ place }) => place.services.some(({ id }) => id === "guardia-de-salud-mental")).map(({ place }) => place.id).sort()
  assert.deepEqual(withGuardia, [...GUARDIAS].sort())
  for (const id of ["hospital-pinero", "hospital-general-de-agudos-d-velez-sarsfield", "hospital-general-de-ninos-pedro-de-elizalde", "hospital-gutierrez"]) assert.ok(!find(id)?.services.some(({ id: serviceId }) => serviceId === "guardia-de-salud-mental"), id)
  // the 4 new hospitals come from the official dataset and are linked to their record
  for (const id of ["hospital-alvear", "hospital-borda", "hospital-moyano", "hospital-tobar"]) {
    const place = find(id)
    assert.equal(place.coordinates.method, "official-dataset-reprojected", id)
    assert.ok(place.coordinates.note.includes("Cotejado el 12/10/2026"), id)
    assert.equal(Object.keys(place.externalIds).length, 1, id)
    assert.ok(place.address.department?.startsWith("Comuna "), id)
    assert.equal(place.services.length, 1, id)
  }
})

test("each guardia is free only as the hospital's ficha says, 24 hours without appointment, and it is not an emergency line", () => {
  for (const id of GUARDIAS) {
    const guardia = find(id).services.find(({ id: serviceId }) => serviceId === "guardia-de-salud-mental")
    assert.equal(guardia.type, "mental-health-emergency", id)
    assert.equal(guardia.cost, "free", id)
    assert.ok(guardia.evidence.find(({ kind }) => kind === "cost").note.includes("declara gratuito el sistema público"), id)
    assert.ok(guardia.costNote.includes("Alcanza a la guardia de salud mental; no a otras prestaciones del hospital"), id)
    assert.equal(guardia.hours.open24h, true, id)
    assert.equal(guardia.appointment.mode, "not-required", id)
    assert.deepEqual(guardia.evidence.map(({ kind }) => kind).sort(), ["access", "cost", "existence"], id)
    assert.ok(guardia.evidence.find(({ kind }) => kind === "existence").url.endsWith("/guardias-hospitalarias-de-salud-mental"), id)
    assert.ok(guardia.evidence.find(({ kind }) => kind === "cost").url.startsWith("https://buenosaires.gob.ar/hospital"), `${id}: the cost comes from the hospital's own ficha`)
    assert.ok(guardia.contacts.length >= 1 && guardia.contacts.every(({ dial, display }) => dial === `+5411${display.replace(/\D/g, "")}`), id)
    assert.ok(guardia.requirements[0].includes("criterios de admisión"), id)
    assert.ok(guardia.appointment.howTo.includes("no corresponde a consultorios externos"), id)
  }
  // the numbers are the ones of each ficha, with the abbreviations as the source gives them (said, not turned into numbers)
  const contacts = (id) => find(id).services.find(({ id: serviceId }) => serviceId === "guardia-de-salud-mental").contacts.map(({ display }) => display)
  assert.deepEqual(contacts("hospital-alvarez"), ["4611-6666"])
  assert.deepEqual(contacts("hospital-especializado-de-infecciosas-f-muniz"), ["4360-5713", "4360-5700"])
  assert.ok(find("hospital-argerich").services.find(({ id }) => id === "guardia-de-salud-mental").appointment.howTo.includes("terminaciones 0695, 0696, 0702 y 0900"))
  assert.ok(find("hospital-moyano").services[0].contacts[0].label.includes("internos 6183 y 6215"))
})

test("Estaciones Saludables and yoga: wellbeing activities with their own type, never psychotherapy or urgent care", () => {
  const stations = all.filter(({ place }) => place.id.startsWith("estacion-saludable-")).map(({ place }) => place)
  assert.equal(stations.length, 18)
  for (const station of stations) {
    assert.equal(station.facilityType, "health-promotion-station", station.id)
    assert.equal(station.services[0].type, "wellbeing-activity", station.id)
    assert.ok(station.services[0].costNote.includes("no se afirma yoga, meditación ni atención psicológica en cada estación"), station.id)
    assert.ok(station.address.department.startsWith("Comuna "), station.id)
    assert.ok(station.services[0].appointment.howTo.includes("11 3161-9798"), station.id)
  }
  for (const entry of withMental) for (const service of entry.place.services.filter((s) => s.type === "wellbeing-activity")) assert.ok(!/psicoterapia|psicol|terapia|urgencia/i.test(service.name), `${entry.place.id}/${service.id}`)
  // yoga of Plazas Activas: adults, with the inscription by email; Centenario has no schedule (the page's are contradictory)
  const yoga = (id) => find(id).services.find(({ id: serviceId }) => serviceId === "yoga")
  assert.deepEqual(yoga("plazas-activas-yoga-rosedal").hours.schedule, [{ days: [6], from: "14:00", to: "16:00" }])
  assert.deepEqual(yoga("plazas-activas-yoga-parque-saavedra").hours.schedule, [{ days: [1, 3], from: "10:00", to: "11:30" }])
  assert.equal(yoga("plazas-activas-yoga-parque-centenario").hours, null)
  for (const id of ["plazas-activas-yoga-rosedal", "plazas-activas-yoga-parque-saavedra", "plazas-activas-yoga-parque-centenario", "plazas-activas-yoga-parque-patricios", "estacion-saludable-parque-chacabuco"]) {
    assert.equal(yoga(id).appointment.mode, "required", id)
    assert.ok(yoga(id).requirements.includes("Mayores de 18 años."), id)
    assert.ok(yoga(id).appointment.howTo.includes("inscripciones.dsydd@buenosaires.gob.ar"), id)
  }
  // Chacabuco: the station and the yoga are one place (two services), and it has no pin until the meeting point is confirmed
  assert.deepEqual(find("estacion-saludable-parque-chacabuco").services.map(({ id }) => id), ["talleres-y-actividad-fisica", "yoga"])
  assert.equal(find("estacion-saludable-parque-chacabuco").coordinates, undefined)
  // the Parque Avellaneda point of the link is a map centre, and the Parque de la Ciudad has none: no pin
  assert.equal(find("estacion-saludable-parque-avellaneda").coordinates, undefined)
  assert.equal(find("estacion-saludable-parque-de-la-ciudad").coordinates, undefined)
})

test("regional services: conditions as the sources say them, and the cost scope kept narrow", () => {
  const cba = find("cordoba-tramas").services[0]
  assert.ok(cba.requirements.some((text) => text.includes("Residentes de Córdoba Capital")) && cba.requirements.some((text) => text.includes("mayores de 16 años")))
  assert.deepEqual(find("cordoba-jaire").services[0].hours.schedule, [{ days: [1], from: "14:30", to: "19:30" }, { days: [2, 3, 4, 5], from: "09:00", to: "19:30" }])
  assert.equal(find("cordoba-las-aldeas-pec-arguello").services[0].hours, null, "the dispositivos have different schedules: none is made up")
  assert.ok(!all.some(({ place }) => place.id === "cordoba-pec-arguello"), "Las Aldeas and PEC Argüello are one establishment")
  // yoga for people over 60 in Córdoba: free only for them
  for (const id of ["cordoba-club-municipalidad-de-cordoba", "cordoba-polideportivo-corral-de-palos", "cordoba-polideportivo-los-gigantes"]) {
    const service = find(id).services[0]
    assert.ok(service.requirements[0].includes("Solo gratuito para mayores de 60 años"), id)
    assert.ok(service.costNote.includes("no se afirma gratuidad para ellas") && service.costNote.includes("no se verificó la gratuidad de los estudios médicos"), id)
  }
  // La Rioja: San Agustín and DTC Solar are not loaded (same corner, written two ways: the building is not confirmed)
  assert.ok(!all.some(({ place }) => /san-agustin|dtc-solar/.test(place.id)))
  assert.deepEqual(files["ar-f"].filter((place) => place.services.some(isMentalBatchService)).map(({ id }) => id).sort(), ["la-rioja-centro-de-dia-comunitario-infantil", "la-rioja-centro-terapeutico-munay", "la-rioja-dispositivo-asistencial-en-socioadicciones", "la-rioja-hospital-de-dia-en-adicciones"])
  // Crespo: the NIDO has three services in one place
  assert.deepEqual(find("crespo-nido-dr-adolfo-goldenberg").services.map(({ id }) => id), ["atencion-psicologica", "padres-en-accion", "orientacion-familiar"])
  // Salta: the gratuity is of a 2023 note: it is said
  assert.ok(find("salta-consulta-orientacion").services[0].costNote.includes("2023"))
  assert.ok(find("salta-consulta-orientacion").services[0].costNote.includes("confirmá que siga vigente"))
  // Rosario: five activities in one place, with the preinscription that does not guarantee a place
  const carrasco = find("rosario-hospital-carrasco")
  assert.equal(carrasco.services.length, 5)
  assert.ok(carrasco.services.every((service) => service.requirements.some((text) => text.includes("la preinscripción no garantiza lugar"))))
  assert.ok(carrasco.services[0].costNote.includes("estudios externos sean gratuitos"))
})

test("only the places with a point backed by a source have a pin: 4 hospitals and 20 CABA places, the regional ones are in the list", () => {
  const withPoint = withMental.filter(({ place }) => place.coordinates).map(({ place }) => place.id)
  // 13 hospitals already had theirs; the 4 new ones, 15 stations and the 4 yoga have it
  const newPlaces = withMental.filter(({ place }) => place.services.every(isMentalBatchService))
  assert.equal(newPlaces.length, 47)
  assert.equal(newPlaces.filter(({ place }) => place.coordinates).length, 4 + 15 + 4)
  assert.equal(newPlaces.filter(({ file }) => file !== "ar-c").filter(({ place }) => place.coordinates).length, 0, "no regional place has a point: the report leaves the geolocation pending")
  for (const { place } of newPlaces.filter(({ place }) => place.id.startsWith("estacion") || place.id.startsWith("plazas"))) assert.ok(!place.coordinates || place.coordinates.method === "official-map-link", place.id)
  assert.ok(withPoint.length >= 23)
  const visible = shown({ filterId: "mental-health" })
  assert.equal(visible.length, 60)
  assert.equal(places.countUnmapped(visible), 60 - getMapPins(visible).length)
})

test("the symbol and the filters: a guardia puts a hospital under Salud mental and Guardias; wellbeing places are Salud mental", () => {
  assert.notDeepEqual(glyphOf("salud-mental"), glyphOf("salud-fisica"))
  const pins = new Map(getMapPins(shown({ filterId: "mental-health" }), { ...EMPTY, filterId: "mental-health" }).map((pin) => [pin.id, pin.category]))
  assert.ok([...pins.values()].every((category) => category === "salud-mental"), "with the filter on, every pin is the Salud mental one")
  assert.ok(pins.has("hospital-alvarez"))
  assert.ok(pins.has("estacion-saludable-ruben-dario") && pins.has("plazas-activas-yoga-rosedal") && pins.has("hospital-borda"))
  const guardias = shown({ filterId: "emergency" }).map(({ place }) => place.id)
  for (const id of GUARDIAS) assert.ok(guardias.includes(id), `${id} is under «Guardias»`)
  // a search for yoga finds the wellbeing places, and a human health filter does not show them
  const yoga = shown({ text: "yoga" }).map(({ place }) => place.id)
  assert.ok(yoga.includes("plazas-activas-yoga-rosedal") && yoga.includes("cordoba-club-municipalidad-de-cordoba") && yoga.includes("rosario-hospital-carrasco"))
  for (const filterId of ["medical", "vaccination", "sexual-health", "animal-health"]) assert.ok(!shown({ filterId }).some(({ place }) => place.id.startsWith("estacion-saludable-")), filterId)
})

test("what the report does not map stays out of the data: lines, virtual consultations and the services without respaldo", () => {
  const ids = all.map(({ place }) => place.id).join(" ")
  for (const left of ["linea-", "sedronar", "boton-de-salud-mental", "csm-", "bonaparte", "mapa-comunitario", "varela"]) assert.ok(!ids.includes(left), left)
  // the emergency lines are the Emergencias team's: this batch adds no line and no number to them
  for (const { place } of withMental.filter(({ file }) => file !== "ar-c")) assert.ok(!place.contacts?.some(({ display }) => /^(141|135|108|0800)/.test(display)), place.id)
})
