/*
 * Tests of the batch of sexual health of the Mapa AuxiliAR (12/10/2026): the places of the Ciudad with consejería en salud sexual, acceso a
 * métodos anticonceptivos and, where the official map says so, entrega de preservativos. What is checked: that each service says its cost
 * only as the source does, with the sources apart for the existence and for the gratuity; that nothing about IVE/ILE or surgery came in;
 * that the contact of the IVE/ILE directory is not used as the phone of the place; that the points have a verified origin; and that these places
 * have their own symbol on the map, apart from Salud general.
 *   npm run places:test
 */
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"
import { isBatchService, isSexualBatchService } from "./places-sexual-batch.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const { createServer } = await import("vite")
const vite = await createServer({ root, logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())

const places = await vite.ssrLoadModule("/src/utils/places/index.ts")
const data = await vite.ssrLoadModule("/src/data/resources/index.ts")
const { glyphOf } = await vite.ssrLoadModule("/src/components/places/PlacesMap/PlacesMap.glyphs.ts")
const file = JSON.parse(await readFile(join(root, "src/data/resources/places/ar-c.json"), "utf8")).resources
const all = await data.loadPlaces("AR-C")
const DAY = data.todayInArgentina()
const { EMPTY_PLACE_QUERY: EMPTY, selectPlaces, getMapPins } = places

// the places with a sexual health service of the batch; `onlyBatch` are the new ones (every service of theirs is of a batch: they have a vaccination point too since the page of vacunatorios)
const withBatch = file.filter(({ services }) => services.some(isSexualBatchService))
const onlyBatch = withBatch.filter(({ services }) => services.every(isBatchService))
const shown = (query = {}) => selectPlaces(all, DAY, { ...EMPTY, ...query }, { confirmedOnly: true })

test("44 new places and 3 that already existed (CeSAC 3, CeSAC 41, Elizalde) now have the sexual health services", () => {
  assert.equal(onlyBatch.length, 44)
  assert.deepEqual(withBatch.filter((place) => !onlyBatch.includes(place)).map(({ id }) => id).sort(), ["cesac-3", "cesac-41", "hospital-general-de-ninos-pedro-de-elizalde"])
  // CeSAC 47 (excluded: its address differs between sources) did not change: no service of the batch
  assert.ok(!withBatch.some(({ id }) => id === "cesac-47"))
  // each place of the batch is once: the ids of the existing three were not duplicated
  assert.equal(new Set(file.map(({ id }) => id)).size, file.length)
  // 15 centers of the directory were left out for their address or location
  for (const id of ["cesac-30", "cesac-31", "cesac-37", "hospital-velez-sarsfield", "hospital-penna", "cesac-21", "cesac-25", "cesac-27", "cesac-15", "cesac-7", "cesac-18", "cesac-29", "cesac-2", "cesac-24"]) assert.ok(!file.some((place) => place.id === id && place.services.some(isSexualBatchService)), `${id}: not with sexual health services (some are in the map now for their vaccination point)`)
})

test("each service declares free by itself, with the sources of the existence and of the gratuity apart", () => {
  for (const place of withBatch) {
    for (const service of place.services.filter(isSexualBatchService)) {
      const where = `${place.id}/${service.id}`
      assert.equal(service.cost, "free", where)
      assert.ok(service.source?.note && service.costNote, `${where}: the note of the source and of the cost`)
      const kinds = service.evidence.map(({ kind }) => kind).sort()
      assert.deepEqual(kinds, ["cost", "existence"], where)
      const cost = service.evidence.find(({ kind }) => kind === "cost")
      const existence = service.evidence.find(({ kind }) => kind === "existence")
      assert.notEqual(cost.url, existence.url, `${where}: two different sources`)
      assert.ok(service.evidence.every(({ url, retrievedAt }) => url.startsWith("https://") && retrievedAt === "2026-10-12"), where)
      assert.equal(service.verification.status, "verified")
      assert.equal(service.verification.nextReviewDue, "2026-11-12")
    }
  }
})

test("the gratuity is said as the sources say it, and never as a guarantee of stock", () => {
  const counseling = onlyBatch[0].services.find(({ id }) => id === "consejeria-salud-sexual")
  const methods = onlyBatch[0].services.find(({ id }) => id === "metodos-anticonceptivos")
  assert.ok(methods.costNote.includes("«La atención y los métodos son gratuitos en el sistema público»"))
  assert.ok(methods.costNote.includes("No confirma que haya stock"))
  assert.ok(counseling.costNote.includes("No incluye procedimientos de IVE/ILE ni anticoncepción quirúrgica"))
  for (const place of withBatch) for (const service of place.services.filter(isSexualBatchService)) assert.ok(!/siempre|garantiza|hay stock|disponible hoy/i.test(service.costNote.replace("No confirma que haya stock", "")), `${place.id}/${service.id}`)
})

test("condoms only where the official map has the place: 6 centers do not have it corroborated and keep the other two services", () => {
  const without = onlyBatch.filter(({ services }) => !services.some(({ id }) => id === "preservativos"))
  assert.deepEqual(without.map(({ id }) => id).sort(), ["cesac-16", "cesac-17", "cesac-20", "cesac-4", "cesac-43", "cesac-8"])
  for (const place of without) assert.deepEqual(place.services.filter(isSexualBatchService).map(({ id }) => id), ["consejeria-salud-sexual", "metodos-anticonceptivos"], place.id)
  const withCondoms = onlyBatch.filter(({ services }) => services.some(({ id }) => id === "preservativos"))
  assert.equal(withCondoms.length, 38)
  for (const place of withCondoms) {
    const condoms = place.services.find(({ id }) => id === "preservativos")
    assert.equal(condoms.type, "condoms")
    assert.ok(condoms.evidence.find(({ kind }) => kind === "existence").url.startsWith("https://epok.buenosaires.gob.ar/getObjectContent/?id=centros_de_prevencion"), place.id)
  }
})

test("nothing about IVE/ILE or surgical contraception, and no contact of the IVE/ILE directory as the phone of a place", () => {
  for (const place of onlyBatch) {
    assert.ok(place.services.filter(isSexualBatchService).every(({ type }) => ["sexual-health-counseling", "contraception", "condoms"].includes(type)), place.id)
    assert.ok(place.services.every(({ type }) => ["sexual-health-counseling", "contraception", "condoms", "vaccination"].includes(type)), place.id)
    const text = JSON.stringify(place)
    assert.ok(!/ligadura|vasectom/i.test(text), place.id)
  }
  // the directory's contact is labelled for IVE/ILE: the phones loaded are the general ones of the individual pages
  const phones = Object.fromEntries(onlyBatch.map((place) => [place.id, place.contacts.map(({ display }) => display)]))
  assert.deepEqual(phones["hospital-pirovano"], [], "no general phone is published for the Pirovano")
  assert.deepEqual(phones["hospital-ramos"], ["4127-0400"], "not the 11-4931-1884 of the IVE/ILE directory")
  assert.deepEqual(phones["hospital-alvarez"], ["4611-6666"], "not the 11-4630-2900 of the IVE/ILE directory")
  assert.deepEqual(phones["cesac-44"], ["4601-3686"])
  for (const place of onlyBatch) for (const contact of place.contacts) assert.equal(contact.dial, `+5411${contact.display.replace(/\D/g, "")}`, place.id)
})

test("every place has a verified point whose origin is the official map of the program, approximate, with its note; the points of the existing three are kept", () => {
  for (const place of onlyBatch) {
    assert.equal(place.coordinates.status, "verified", place.id)
    assert.equal(place.coordinates.method, "official-map-link", place.id)
    assert.equal(place.coordinates.precision, "approximate", place.id)
    assert.ok(place.coordinates.note.includes("enlace oficial del programa"), place.id)
    assert.ok(place.coordinates.lat < -34.5 && place.coordinates.lat > -34.75 && place.coordinates.lng < -58.3 && place.coordinates.lng > -58.6, `${place.id} is inside the Ciudad`)
    assert.ok(place.address.department?.startsWith("Comuna "), `${place.id}: the comuna comes from the official dataset`)
    assert.equal(Object.keys(place.externalIds).length, 1, place.id)
  }
  assert.equal(file.find(({ id }) => id === "cesac-41").coordinates.method, "official-dataset")
  assert.equal(file.find(({ id }) => id === "cesac-3").coordinates.method, "official-dataset")
})

test("the places of the batch are visible in the list and on the map, and the pins are 44 + the 3 existing ones", () => {
  const visible = shown({ filterId: "sexual-health" })
  assert.equal(visible.length, 47)
  assert.equal(getMapPins(visible).length, 47)
  // consejería and methods in every place; the free filter keeps them all
  assert.equal(shown({ filterId: "sexual-health", free: true }).length, 47)
  assert.ok(visible.every((entry) => places.matchingServices(entry, { ...EMPTY, filterId: "sexual-health" }).every(({ type }) => ["sexual-health-counseling", "contraception", "condoms"].includes(type))), "with the filter on, the services that answer are the ones of the filter")
})

test("the symbol: a place whose services are of sexual health has its own pin, apart from Salud general; a CeSAC with both is Salud general until the filter or the search asks for sexual health", () => {
  assert.notDeepEqual(glyphOf("esi"), glyphOf("salud-fisica"))
  const pinsOf = (query) => new Map(getMapPins(shown(query), { ...EMPTY, ...query }).map((pin) => [pin.id, pin.category]))
  const filtered = pinsOf({ filterId: "sexual-health" })
  assert.ok([...filtered.values()].every((category) => category === "esi"), "with the filter, every pin is the sexual health one")
  const unfiltered = pinsOf({})
  for (const place of onlyBatch) assert.equal(unfiltered.get(place.id), place.services.some(({ type }) => type === "vaccination") ? "salud-fisica" : "esi", `${place.id}: Salud general when it also has a vaccination point, the sexual health symbol when it has only those services`)
  for (const id of ["cesac-3", "cesac-41", "hospital-general-de-ninos-pedro-de-elizalde"]) assert.equal(unfiltered.get(id), "salud-fisica", `${id} has general services too`)
  for (const id of ["cesac-3", "cesac-41", "hospital-general-de-ninos-pedro-de-elizalde"]) assert.equal(filtered.get(id), "esi", `${id} with the filter on`)
})

test("a search for sexual health finds the batch, and the sector of a boca (Salud Mental, Infectología) does not make a hospital a mental health result", () => {
  assert.ok(shown({ text: "anticonceptivos" }).length >= 44)
  assert.ok(shown({ text: "preservativos gratis" }).length >= 38)
  assert.deepEqual(shown({ filterId: "mental-health" }).map(({ place }) => place.id).filter((id) => id.startsWith("hospital-d") || id.startsWith("hospital-r")), [])
  assert.ok(!shown({ text: "salud mental" }).some(({ place }) => ["hospital-durand", "hospital-rivadavia"].includes(place.id)))
})
