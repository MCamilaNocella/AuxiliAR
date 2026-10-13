/*
 * Tests of the vaccination points of the Mapa AuxiliAR loaded from the page «Lugares y horarios de vacunatorios» of the Ciudad (12/10/2026):
 * the gratuity rests on the norm (Ley 27.491), never on the page, which says nothing about cost; the schedules are the page's; the points
 * of the page that are not reliable (a point that does not match the establishment, a CeSAC listed twice with different schedules, a place
 * with no ficha) are not loaded.
 *   npm run places:test
 */
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"
import { isBatchService, isVaccinationBatchService } from "./places-sexual-batch.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const { createServer } = await import("vite")
const vite = await createServer({ root, logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())

const places = await vite.ssrLoadModule("/src/utils/places/index.ts")
const data = await vite.ssrLoadModule("/src/data/resources/index.ts")
const file = JSON.parse(await readFile(join(root, "src/data/resources/places/ar-c.json"), "utf8")).resources
const all = await data.loadPlaces("AR-C")
const DAY = data.todayInArgentina()
const PAGE = "https://buenosaires.gob.ar/gcaba_historico/lugares-y-horarios-de-vacunatorios"
const { EMPTY_PLACE_QUERY: EMPTY, selectPlaces, getMapPins } = places

const withVaccination = file.filter(({ services }) => services.some(isVaccinationBatchService))
const NEW_IDS = ["cesac-2", "cesac-21", "cesac-24", "cesac-27", "cesac-29", "cesac-31", "cesac-37", "cesac-46", "cesac-50", "cesac-7", "hospital-especializado-de-infecciosas-f-muniz", "hospital-general-de-agudos-d-velez-sarsfield", "hospital-general-de-agudos-j-a-penna"]
const newOnes = withVaccination.filter(({ id }) => NEW_IDS.includes(id))
const vaccinationOf = (id) => file.find((place) => place.id === id).services.find(({ id: serviceId }) => serviceId === "vacunacion")

test("55 places have the vaccination point of the page: 42 that were already there for sexual health, 13 new ones, and 3 that had their own are kept", () => {
  assert.equal(withVaccination.length, 55)
  assert.deepEqual(newOnes.map(({ id }) => id).sort(), ["cesac-2", "cesac-21", "cesac-24", "cesac-27", "cesac-29", "cesac-31", "cesac-37", "cesac-46", "cesac-50", "cesac-7", "hospital-especializado-de-infecciosas-f-muniz", "hospital-general-de-agudos-d-velez-sarsfield", "hospital-general-de-agudos-j-a-penna"])
  // CeSAC 3, 41 and 47 had a vaccination service of their own: the batch does not add a second one, nor changes theirs
  for (const id of ["cesac-3", "cesac-41", "cesac-47"]) assert.equal(file.find((place) => place.id === id).services.filter(({ id: serviceId }) => serviceId === "vacunacion").length, 1, id)
  assert.ok(!withVaccination.some(({ id }) => ["cesac-3", "cesac-41", "cesac-47"].includes(id)))
})

test("what the page cannot back stays out: points that do not match, CeSACs listed twice, places without a ficha", () => {
  // CeSAC 18 and 43 appear twice with different schedules; 15, 25, 42 and CeSAC 23 (its point is another CeSAC's) have no usable point; CeSAC 30's point is 535 m from the official dataset's; the two CCI have no ficha; the page crosses the points of Rivadavia and Santojanni, so their vaccination is not loaded either
  for (const id of ["cesac-15", "cesac-18", "cesac-23", "cesac-25", "cesac-30", "cesac-42", "hospital-rivadavia", "hospital-santojanni"]) assert.ok(!file.some((place) => place.id === id && place.services.some(isVaccinationBatchService)), id)
  assert.ok(!file.some((place) => /^cci-|rodrigo-bueno|fraga/i.test(place.id)))
  // CeSAC 43 is in the map for sexual health: the vaccination of its two listings with different hours is not loaded
  assert.ok(!file.find((place) => place.id === "cesac-43").services.some(isVaccinationBatchService))
})

test("each vaccination service is free only because of the norm, with the page as the source of its existence and its schedule", () => {
  for (const place of withVaccination) {
    const service = place.services.find(isVaccinationBatchService)
    const where = `${place.id}/vacunacion`
    assert.equal(service.type, "vaccination", where)
    assert.equal(service.cost, "free", where)
    assert.ok(service.costNote.startsWith("La gratuidad alcanza a las vacunas del Calendario Nacional"), where)
    assert.ok(service.costNote.includes("No hay información sobre qué vacunas aplica este vacunatorio"), where)
    const cost = service.evidence.find(({ kind }) => kind === "cost")
    assert.equal(cost.url, "https://www.argentina.gob.ar/normativa/nacional/ley-27491-318455/texto", where)
    const existence = service.evidence.find(({ kind }) => kind === "existence")
    assert.equal(existence.url, PAGE, where)
    assert.ok(existence.note.includes("No dice qué vacunas se aplican ni si son gratuitas"), `${where}: the page says nothing about cost and the evidence says so`)
    assert.ok(service.source.note.includes("sin fecha de actualización") && service.source.note.includes("sin confirmar"), where)
    assert.equal(service.verification.nextReviewDue, "2026-11-12", where)
  }
})

test("the schedules are the page's: structured with Sunday as 0, and what cannot be structured is said as the page says it", () => {
  for (const place of withVaccination) {
    const service = place.services.find(isVaccinationBatchService)
    assert.ok(service.hours?.schedule?.length > 0, `${place.id}: every schedule of this batch could be loaded`)
    for (const block of service.hours.schedule) assert.ok(block.days.every((day) => day >= 0 && day <= 6) && block.from < block.to, `${place.id}: ${JSON.stringify(block)}`)
  }
  const h = (id) => vaccinationOf(id).hours.schedule
  assert.deepEqual(h("hospital-durand"), [{ days: [1, 2, 3, 4, 5], from: "08:00", to: "17:00" }, { days: [0, 6], from: "08:00", to: "14:00" }])
  assert.deepEqual(h("cesac-9"), [
    { days: [1, 3, 5], from: "08:00", to: "12:00" },
    { days: [1, 3, 5], from: "13:00", to: "17:00" },
    { days: [2, 4], from: "08:30", to: "12:00" },
    { days: [2, 4], from: "14:00", to: "17:00" },
  ])
  assert.deepEqual(h("cesac-13").at(-1), { days: [4], from: "14:00", to: "15:00" })
  // Argerich: the page has two vacunatorios; the one at Pi y Margall (its address in the map) is the schedule, and the other is told
  assert.deepEqual(h("hospital-argerich"), [{ days: [1, 2, 3, 4, 5], from: "08:00", to: "12:00" }])
  assert.ok(vaccinationOf("hospital-argerich").appointment.howTo.includes("Almirante Brown 250"))
  // holidays and covid are told, not turned into hours
  assert.ok(vaccinationOf("hospital-durand").appointment.howTo.includes("feriados"))
  assert.ok(vaccinationOf("cesac-17").appointment.howTo.includes("covid"))
})

test("the turno: required only where the page says so (CeSAC 32 and 34), unknown elsewhere", () => {
  for (const place of withVaccination) {
    const service = place.services.find(isVaccinationBatchService)
    assert.equal(service.appointment.mode, ["cesac-32", "cesac-34"].includes(place.id) ? "required" : "unknown", place.id)
  }
  assert.ok(vaccinationOf("cesac-34").appointment.howTo.includes("2821-3634"))
  assert.ok(vaccinationOf("cesac-32").appointment.howTo.includes("interno 120"))
  assert.ok(!vaccinationOf("cesac-33").appointment.howTo.includes("turno previo"), "«Turno mañana / Turno tarde» are shifts, not appointments")
})

test("the new places come from the official datasets: point, comuna and link to their record", () => {
  assert.equal(newOnes.length, 13)
  for (const place of newOnes) {
    assert.equal(place.coordinates.status, "verified", place.id)
    assert.ok(["official-dataset", "official-dataset-reprojected"].includes(place.coordinates.method), place.id)
    assert.ok(place.coordinates.note.includes("Cotejado el 12/10/2026 con el punto del enlace oficial de la página de vacunatorios"), place.id)
    assert.ok(place.address.department?.startsWith("Comuna "), place.id)
    assert.equal(Object.keys(place.externalIds).length, 1, place.id)
    assert.deepEqual(place.contacts, [], `${place.id}: the dataset's phones are not published`)
    assert.equal(place.services.filter(isVaccinationBatchService).length, 1, place.id)
    // Muñiz and Penna have, besides, their guardia de salud mental (report of 12/10/2026)
    assert.ok(place.services.length === 1 || place.services.length === 2, place.id)
  }
})

test("in the map and the list: the vaccination filter finds the points, with their schedule, and they are Salud general", () => {
  const visible = selectPlaces(all, DAY, { ...EMPTY, filterId: "vaccination" }, { confirmedOnly: true })
  assert.equal(visible.length, 57, "the 55 of the batch plus CeSAC 3 and 41 (CeSAC 47 has its vaccination unconfirmed: not shown)")
  const pins = getMapPins(visible, { ...EMPTY, filterId: "vaccination" })
  assert.equal(pins.length, 57)
  assert.ok(pins.every(({ category }) => category === "salud-fisica"), "vaccination is Salud general")
  for (const place of newOnes) assert.ok(visible.some((entry) => entry.place.id === place.id), place.id)
})
