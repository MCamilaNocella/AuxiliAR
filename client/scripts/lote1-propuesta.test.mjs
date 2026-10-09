/*
 * Technical control of the proposal of the first batch (client/curation/proposals/lote-1.cambios-propuestos.json).
 * The proposal is NOT in the data: this test applies it in memory to a copy of the real places and checks that the model keeps
 * apart what must not be mixed - the gratuity, the conditions of access and the availability (hours, appointments) - and that
 * a free service with conditions is never shown as free for everyone. It also checks that the drafts of new places are valid
 * and do not show while they are waiting for review. Nothing here writes to src/data.
 *   npm run lote1:test
 */
import assert from "node:assert/strict"
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath, pathToFileURL } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const proposal = JSON.parse(await readFile(join(root, "curation/proposals/lote-1.cambios-propuestos.json"), "utf8"))
const realPlaces = JSON.parse(await readFile(join(root, "src/data/resources/places/ar-c.json"), "utf8"))

const { createServer } = await import("vite")
const vite = await createServer({ root, logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
const temp = await mkdtemp(join(tmpdir(), "lote1-"))
after(async () => {
  await vite.close()
  await rm(temp, { recursive: true, force: true })
})

const places = await vite.ssrLoadModule("/src/utils/places/index.ts")
const data = await vite.ssrLoadModule("/src/data/resources/index.ts")
const { run } = await import(pathToFileURL(join(here, "resources-sync.mjs")).href)
const DAY = data.todayInArgentina()
const { EMPTY_PLACE_QUERY: EMPTY, selectPlaces, matchingServices, buildPlaceView, serviceHighlights, isVerifiedFree } = places

// The real places with the proposal applied (again) to a copy: it is already in the data, so this only checks it is idempotent: the services it names get the fields it sets
const applied = () => {
  const copy = structuredClone(realPlaces)
  for (const change of proposal.serviceChanges) {
    const place = copy.resources.find(({ id }) => id === change.placeId)
    const service = place.services.find(({ id }) => id === change.serviceId)
    Object.assign(service, structuredClone(change.set))
  }
  for (const { draft } of proposal.newPlaces) copy.resources.push(structuredClone(draft))
  return copy
}
// What the app would show if the team approved the drafts: only used to look at how they would be drawn
const approvedDrafts = (file) => {
  const copy = structuredClone(file)
  for (const { draft } of proposal.newPlaces) {
    const place = copy.resources.find(({ id }) => id === draft.id)
    place.verification = { status: "verified", verifiedAt: "2026-10-08", verifiedBy: "prueba", nextReviewDue: "2099-01-01" }
  }
  return copy
}

const entriesOf = (file, query = {}) => selectPlaces(file.resources, DAY, { ...EMPTY, ...query })
const entry = (file, id) => entriesOf(file).find(({ place }) => place.id === id)
const service = (file, placeId, serviceId) => file.resources.find(({ id }) => id === placeId).services.find(({ id }) => id === serviceId)
const resolved = (file, placeId, serviceId) => {
  const place = file.resources.find(({ id }) => id === placeId)
  return data.resolveService(place, place.services.find(({ id }) => id === serviceId))
}

test("the proposal only touches services that exist and only sets fields that are fields of a service", () => {
  const allowed = new Set(["cost", "costNote", "requirements", "appointment", "hours", "source", "audience", "evidence"])
  for (const change of proposal.serviceChanges) {
    const place = realPlaces.resources.find(({ id }) => id === change.placeId)
    assert.ok(place?.services.some(({ id }) => id === change.serviceId), `${change.ficha}: that service does not exist`)
    for (const key of Object.keys(change.set)) assert.ok(allowed.has(key), `${change.ficha}: ${key} is not a field to change`)
    assert.equal(change.set.cost, "free", `${change.ficha}`)
    assert.ok(change.set.source?.url && change.set.source.note && change.set.source.retrievedAt, `${change.ficha}: the source needs URL, note and date`)
  }
})

test("the proposal changes nothing about the establishments (verification, address, coordinates, contacts)", () => {
  const before = realPlaces.resources.filter(({ id }) => ["cesac-3", "cesac-41", "cesac-47"].includes(id))
  const after = applied().resources.filter(({ id }) => ["cesac-3", "cesac-41", "cesac-47"].includes(id))
  for (const old of before) {
    const now = after.find(({ id }) => id === old.id)
    for (const key of ["verification", "address", "coordinates", "contacts", "source", "hours", "facilityType"]) assert.deepEqual(now[key], old[key], `${old.id}.${key}`)
  }
})

test("the applied dataset passes the same validation as the real one (with the drafts as needs-review)", async () => {
  const dir = join(temp, "resources")
  await cp(join(root, "src/data/resources"), dir, { recursive: true })
  await writeFile(join(dir, "places/ar-c.json"), JSON.stringify(applied(), null, 2))
  const result = await run({ mode: "sync", sourceDir: dir, outFile: join(temp, "resources.json"), coverageFile: null })
  assert.deepEqual(result.errors, [])
  assert.ok(result.ok)
})

test("gratuity: only the services of the proposal are verified free, and the rest of each CeSAC still is not", () => {
  const file = applied()
  const proposed = new Set(proposal.serviceChanges.map(({ placeId, serviceId }) => `${placeId}/${serviceId}`))
  for (const id of ["cesac-3", "cesac-41", "cesac-47"]) {
    const place = file.resources.find((resource) => resource.id === id)
    for (const own of place.services) {
      const free = isVerifiedFree(place, resolved(file, id, own.id))
      assert.equal(free, proposed.has(`${id}/${own.id}`), `${id}/${own.id}`)
    }
  }
})

test("the real data now has exactly the approved free services of the batch, and none of the ones left out", () => {
  const free = []
  for (const place of realPlaces.resources) {
    for (const own of place.services ?? []) if (isVerifiedFree(place, data.resolveService(place, own))) free.push(`${place.id}/${own.id}${own.costNote ? " (con condiciones)" : ""}`)
  }
  assert.deepEqual(free.sort(), [
    "cesac-3/atencion-primaria",
    "cesac-3/vacunacion (con condiciones)",
    "cesac-41/atencion-primaria",
    "cesac-41/vacunacion (con condiciones)",
    "cesac-47/atencion-primaria",
    "cesac-47/pediatria",
    "hospital-odontologia-carrillo/guardia-odontologica",
    "hospital-odontologia-duenas/guardia-odontologica",
  ])
  for (const { placeId, serviceId } of proposal.notProposed) {
    const place = realPlaces.resources.find(({ id }) => id === placeId)
    assert.equal(isVerifiedFree(place, data.resolveService(place, place.services.find(({ id }) => id === serviceId))), false, `${placeId}/${serviceId} stays unconfirmed`)
  }
  for (const id of ["salud-mental", "psiquiatria", "psicologia"]) {
    for (const place of realPlaces.resources.filter(({ id: placeId }) => placeId.startsWith("cesac-"))) {
      const own = place.services.find((entry) => entry.id === id)
      if (own) assert.equal(isVerifiedFree(place, data.resolveService(place, own)), false, `${place.id}/${id} stays unconfirmed`)
    }
  }
  assert.equal(realPlaces.resources.some(({ id }) => id.startsWith("centro-fijo-veterinario")), false, "the veterinary centres are not loaded")
})

test("primary care: 'Atención gratuita' with no condition note, and nothing that promises a walk-in", () => {
  const file = applied()
  for (const [id, serviceId] of [["cesac-3", "atencion-primaria"], ["cesac-41", "atencion-primaria"], ["cesac-47", "atencion-primaria"], ["cesac-47", "pediatria"]]) {
    const place = file.resources.find((resource) => resource.id === id)
    const view = resolved(file, id, serviceId)
    assert.deepEqual(serviceHighlights(view, place), ["Atención gratuita"], `${id}/${serviceId}`)
    assert.equal(view.appointment.mode, "unknown", "whether a turno is needed is not confirmed")
    assert.ok(!view.costNote, "the legal basis goes in the source, not in a condition note")
  }
})

test("vaccination: free WITH conditions (only the Calendar vaccines), never plain free", () => {
  const file = applied()
  for (const id of ["cesac-3", "cesac-41"]) {
    const place = file.resources.find((resource) => resource.id === id)
    const view = resolved(file, id, "vacunacion")
    assert.deepEqual(serviceHighlights(view, place), ["Gratuita con condiciones"], id)
    assert.match(view.costNote, /Calendario Nacional/)
    assert.match(view.costNote, /No hay información sobre qué vacunas aplica/)
    assert.notEqual(view.appointment.mode, "not-required", "it does not say 'sin turno'")
  }
})

test("the free filter returns only the verified services of a CeSAC, not its other services", () => {
  const file = applied()
  const query = { ...EMPTY, free: true }
  const hit = entriesOf(file, { free: true }).find(({ place }) => place.id === "cesac-3")
  assert.ok(hit)
  assert.deepEqual(matchingServices(hit, query).map(({ id }) => id).sort(), ["atencion-primaria", "vacunacion"])
  const other = entriesOf(file, { free: true }).find(({ place }) => place.id === "cesac-47")
  assert.deepEqual(matchingServices(other, query).map(({ id }) => id).sort(), ["atencion-primaria", "pediatria"])
})

test("the panel of a CeSAC keeps saying what is missing about when to go", () => {
  const file = applied()
  for (const id of ["cesac-3", "cesac-47"]) {
    const view = buildPlaceView(entry(file, id))
    assert.match(view.availabilityNotice ?? "", /horario/, `${id}: no verified hours, so it says to call first`)
    assert.doesNotMatch(JSON.stringify(view), /Podés ir sin turno/)
  }
})

test("the hours of one service no longer silence the notice of the others (it was a limit of the model, now corrected)", () => {
  const file = applied()
  const withHours = structuredClone(file)
  const target = service(withHours, "cesac-3", "vacunacion")
  Object.assign(target, { hours: { open24h: false, schedule: [{ days: [1], from: "07:00", to: "12:00" }] } })
  assert.match(buildPlaceView(entry(withHours, "cesac-3")).availabilityNotice ?? "", /horario/, "primary care and the rest still have no hours: the notice stays")
  assert.ok(proposal.serviceChanges.every(({ set }) => !("hours" in set)), "so the proposal does not set any service hours")
  assert.ok(proposal.deferredHours["cesac-3/vacunacion"].length > 0, "the published hours are kept in the proposal, deferred")
})

test("the drafts of the veterinary centres do not show, and are not on the map, until the team approves them", () => {
  const file = applied()
  for (const { draft } of proposal.newPlaces) {
    assert.equal(entriesOf(file).some(({ place }) => place.id === draft.id), false, `${draft.id} is waiting for review`)
    assert.equal(draft.verification.status, "needs-review")
    assert.equal(draft.coordinates.status, "unverified")
    assert.equal(data.isMappable(draft), false)
  }
})

test("an approved veterinary centre is free WITH conditions (turno), animal-only, and only castration", () => {
  const file = approvedDrafts(applied())
  for (const { draft } of proposal.newPlaces) {
    const found = entry(file, draft.id)
    assert.ok(found, "it shows once verified")
    assert.deepEqual(found.services.map(({ type }) => type), ["spaying-neutering"])
    const view = buildPlaceView(found)
    assert.ok(view.highlights.includes("Gratuita con condiciones"))
    assert.ok(!view.highlights.includes("Atención gratuita"))
    assert.ok(!view.highlights.includes("Podés ir sin turno"))
    assert.match(JSON.stringify(view), /Con turno previo/)
    const animal = entriesOf(file, { filterId: "animal-health", free: true }).map(({ place }) => place.id)
    assert.ok(animal.includes(draft.id), "it is in the Salud animal filter")
    const human = entriesOf(file, { filterId: "vaccination" }).map(({ place }) => place.id)
    assert.ok(!human.includes(draft.id), "and not in the filters meant for people")
  }
})
