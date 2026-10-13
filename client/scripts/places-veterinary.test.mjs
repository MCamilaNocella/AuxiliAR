/*
 * Tests of the free public veterinary centres of the Mapa AuxiliAR (report of 13/10/2026): 15 places loaded next to the Costanera Sur one.
 * What is checked: that each service is free only for what the official source says and with its conditions; that what the report leaves out
 * (urgencias, the Rosario hospital with conditioned gratuity, the temporary operativo, Salta, the tarifed microchip) is not there; that only
 * the places with a point backed by a source have a pin and the rest are in the list; and that the contacts are the published ones.
 *   npm run places:test
 */
import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"
import { isVeterinaryBatchPlace } from "./places-sexual-batch.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const dir = join(root, "src/data/resources/places")
const { createServer } = await import("vite")
const vite = await createServer({ root, logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())

const places = await vite.ssrLoadModule("/src/utils/places/index.ts")
const data = await vite.ssrLoadModule("/src/data/resources/index.ts")
const files = Object.fromEntries(await Promise.all((await readdir(dir)).filter((name) => name.endsWith(".json")).map(async (name) => [name.replace(".json", ""), JSON.parse(await readFile(join(dir, name), "utf8")).resources])))
const batch = Object.entries(files).flatMap(([file, resources]) => resources.filter(isVeterinaryBatchPlace).map((place) => ({ file, place })))
const find = (id) => batch.find(({ place }) => place.id === id)?.place
const ANIMAL_TYPES = ["spaying-neutering", "rabies-vaccination", "veterinary-care", "zoonosis"]
const DAY = data.todayInArgentina()
for (const province of data.PROVINCES_WITH_PLACE_FILES) await data.loadPlaces(province)
const everyPlace = (await Promise.all(data.PROVINCES_WITH_PLACE_FILES.map((province) => data.loadPlaces(province)))).flat()
const { EMPTY_PLACE_QUERY: EMPTY, selectPlaces, getMapPins } = places

test("15 places in 8 jurisdictions, one file each, apart from the Costanera Sur centre that was already there", () => {
  assert.equal(batch.length, 15)
  assert.deepEqual(Object.fromEntries(Object.entries(Object.groupBy(batch, ({ file }) => file)).map(([file, list]) => [file, list.length])), { "ar-c": 2, "ar-x": 3, "ar-n": 2, "ar-s": 5, "ar-v": 1, "ar-r": 1, "ar-b": 1 })
  for (const { file, place } of batch) assert.equal(place.address.province, file.toUpperCase().replace("AR-", "AR-"), place.id)
  // the Costanera Sur centre is not duplicated nor touched by this batch
  const costanera = files["ar-c"].filter(({ id }) => id === "centro-fijo-veterinario-costanera-sur")
  assert.equal(costanera.length, 1)
  assert.ok(!isVeterinaryBatchPlace(costanera[0]))
})

test("what the report leaves out is not loaded: urgencias, conditioned gratuity, temporary operativos, Salta, the tarifed microchip", () => {
  const ids = Object.values(files).flat().map(({ id }) => id).join(" ")
  for (const left of ["hospital-municipal-de-salud-animal", "gimnasio", "mendoza", "salta", "godoy", "neuquen", "trelew", "vecinal"]) assert.ok(!new RegExp(left, "i").test(ids), left)
  for (const { place } of batch) {
    for (const service of place.services) {
      assert.ok(ANIMAL_TYPES.includes(service.type), `${place.id}/${service.id}`)
      assert.ok(!/urgencia|guardia|emergencia|internaci|cirug/i.test(service.name), `${place.id}/${service.id}: no urgencias, internación or surgery as a service`)
      assert.ok(!/microchip.*(felino|gato)/i.test(service.name), service.id)
    }
  }
  // Berazategui: the 24 h passive guard is not loaded as free, and the note says why
  const berazategui = find("clinica-veterinaria-municipal-berazategui")
  assert.deepEqual(berazategui.services.map(({ id }) => id), ["castracion", "vacuna-antirrabica", "desparasitacion", "atencion-clinica-primaria"])
  assert.ok(berazategui.services[0].costNote.includes("guardia pasiva de 24 h") && berazategui.services[0].costNote.includes("guía de 2024"))
  // Ushuaia: dogs' microchip only, and the cats' one (tarifed) is said
  const ushuaia = find("direccion-de-zoonosis-ushuaia")
  assert.ok(ushuaia.services.find(({ id }) => id === "microchip-perros").requirements[0].includes("Solo perros"))
  assert.ok(ushuaia.services[0].costNote.includes("microchip para gatos es arancelado"))
})

test("each service is free by its own source, with the cost, the existence and the way to ask apart", () => {
  for (const { place } of batch) {
    for (const service of place.services) {
      const where = `${place.id}/${service.id}`
      assert.equal(service.cost, "free", where)
      assert.ok(service.costNote.length > 40 && service.source.note, where)
      assert.deepEqual(service.evidence.map(({ kind }) => kind).sort(), ["access", "cost", "existence"], where)
      assert.ok(service.evidence.every(({ url, retrievedAt }) => url.startsWith("https://") && retrievedAt === "2026-10-13"), where)
      assert.equal(service.verification.nextReviewDue, "2026-11-12", where)
      assert.ok(service.appointment.howTo.length > 0, where)
    }
  }
  const pasteur = find("instituto-de-zoonosis-luis-pasteur")
  assert.deepEqual(pasteur.services.map(({ id }) => id), ["consulta-diagnostico-zoonosis", "observacion-antirrabica", "recepcion-muestras", "vacuna-antirrabica", "recepcion-animales-fallecidos"])
  assert.ok(pasteur.services[0].costNote.includes("no incluye guardia ni urgencias clínicas"))
  assert.ok(pasteur.services[4].costNote.includes("No se verificó cremación individual ni devolución de cenizas"))
  assert.equal(pasteur.services[4].hours.open24h, true)
  assert.deepEqual(pasteur.services[3].hours.schedule, [{ days: [0, 1, 2, 3, 4, 5, 6], from: "08:00", to: "18:00" }])
  assert.ok(pasteur.services[3].appointment.howTo.includes("9 a 12 y de 14 a 17"), "the discrepancy with the general page is said")
})

test("conditions and access as the sources say them", () => {
  const cba = find("centro-castraciones-alberdi-cordoba")
  assert.deepEqual(cba.services[0].requirements, ["Vecinos de la ciudad de Córdoba.", "La disponibilidad de turnos es limitada."])
  assert.equal(cba.services[0].appointment.mode, "required")
  assert.ok(cba.services[0].appointment.howTo.includes("jueves hábiles desde las 8"))
  assert.ok(find("centro-castraciones-la-france-cordoba").address.number === "3129" && find("centro-castraciones-la-france-cordoba").source.note.includes("3179"))
  const imusa = find("imusa-zaiman-posadas")
  assert.ok(imusa.services.every(({ requirements }) => requirements.some((text) => text.includes("mayores de 18 años residentes en Posadas"))))
  assert.deepEqual(imusa.services.map(({ appointment }) => appointment.mode), ["required", "unknown", "unknown"])
  const rosario = find("cmd-oeste-red-salud-animal-rosario")
  assert.ok(rosario.services.every(({ appointment }) => appointment.mode === "not-required"))
  assert.equal(rosario.services[0].hours.schedule.length, 2)
  const bariloche = find("sanidad-animal-sede-central-bariloche")
  assert.deepEqual(bariloche.services.map(({ id, appointment }) => [id, appointment.mode]), [["vacuna-antirrabica", "not-required"], ["castracion", "required"]])
  assert.ok(bariloche.services[0].costNote.includes("la consulta clínica general y una guardia de emergencias no están verificadas"))
  for (const id of ["imusa-parque-garay-santa-fe", "imusa-jardin-botanico-santa-fe", "imusa-alto-verde-santa-fe"]) {
    assert.ok(find(id).services.every(({ appointment }) => appointment.mode === "required"), id)
    assert.ok(find(id).services[0].requirements.includes("El responsable tiene que ser mayor de edad y llevar DNI."), id)
  }
  assert.deepEqual(find("imusa-alto-verde-santa-fe").services[0].hours.schedule, [{ days: [1, 2, 3, 4, 5], from: "08:00", to: "12:00" }])
})

test("the contacts are the published ones: none where the report says they are not published", () => {
  const phones = Object.fromEntries(batch.map(({ place }) => [place.id, (place.contacts ?? []).map(({ display, dial }) => `${display}|${dial}`)]))
  assert.deepEqual(phones["instituto-de-zoonosis-luis-pasteur"], ["4958-9900|+541149589900"])
  assert.deepEqual(phones["centro-castraciones-alberdi-cordoba"], ["351 860-6269|+543518606269"])
  assert.deepEqual(phones["imusa-parque-garay-santa-fe"], ["0342 15 539-4576|+5493425394576"])
  assert.deepEqual(phones["direccion-de-zoonosis-ushuaia"], ["02901 422377|+542901422377"])
  for (const id of ["centro-fijo-veterinario-indoamericano", "imusa-jardin-botanico-santa-fe", "imusa-alto-verde-santa-fe", "cmd-oeste-red-salud-animal-rosario", "centro-de-salud-pasteur-red-salud-animal-rosario", "clinica-veterinaria-municipal-berazategui"]) assert.deepEqual(phones[id], [], id)
})

test("only the places whose point is backed by a source have a pin; the rest are in the list and none is guessed", () => {
  const withPoint = batch.filter(({ place }) => place.coordinates).map(({ place }) => place.id).sort()
  assert.deepEqual(withPoint, ["imusa-parque-garay-santa-fe", "instituto-de-zoonosis-luis-pasteur"])
  for (const { place } of batch) assert.ok(!place.coordinates || place.coordinates.status === "verified", place.id)
  assert.equal(find("instituto-de-zoonosis-luis-pasteur").coordinates.method, "official-dataset-reprojected")
  assert.equal(find("instituto-de-zoonosis-luis-pasteur").address.department, "Comuna 6")
  assert.equal(find("imusa-parque-garay-santa-fe").coordinates.method, "official-map-link")
  const visible = selectPlaces(everyPlace, DAY, { ...EMPTY, filterId: "animal-health" }, { confirmedOnly: true })
  assert.equal(visible.length, 16, "the 15 and the Costanera Sur centre")
  assert.deepEqual(getMapPins(visible).map(({ id }) => id).sort(), ["centro-fijo-veterinario-costanera-sur", "imusa-parque-garay-santa-fe", "instituto-de-zoonosis-luis-pasteur"])
  assert.ok(getMapPins(visible).every(({ category }) => category === "animales"))
  assert.equal(places.countUnmapped(visible), 13)
})

test("the filter «Atención veterinaria» finds each service type, and a human health filter never shows these places", () => {
  const ask = (query) => selectPlaces(everyPlace, DAY, { ...EMPTY, ...query }, { confirmedOnly: true }).map(({ place }) => place.id)
  assert.ok(ask({ text: "castracion" }).includes("imusa-zaiman-posadas"))
  assert.ok(ask({ text: "zoonosis" }).includes("instituto-de-zoonosis-luis-pasteur"))
  for (const filterId of ["medical", "vaccination", "mental-health", "sexual-health", "dentistry", "emergency"]) {
    const ids = ask({ filterId })
    assert.ok(!batch.some(({ place }) => ids.includes(place.id)), `${filterId}: the veterinary places stay out of the human filters`)
  }
})
