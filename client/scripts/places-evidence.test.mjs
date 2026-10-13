/*
 * Tests of the optional `evidence` of a service (more than one official source, each saying what it backs), of how the panel
 * shows it under "Fuentes oficiales", and of the rules that keep gratuity, search, cards and hours honest in the CeSAC of the
 * first batch: a search for a free specialty only finds places whose THAT specialty is confirmed free, a card highlights only the
 * services that meet the filter, a condition of gratuity shows its text and requirements, and the hours of a service are said
 * as its own and never attributed to another.
 *   npm run places:test
 */
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"
import { validateDataset } from "./resources-validate.mjs"
import { withoutSexualBatch } from "./places-sexual-batch.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const sourceDir = join(root, "src/data/resources")
const readJson = async (file) => JSON.parse(await readFile(file, "utf8"))
const file = await readJson(join(sourceDir, "places/ar-c.json"))
const schema = await readJson(join(sourceDir, "resource.schema.json"))
const taxonomy = await readJson(join(sourceDir, "taxonomy.json"))
const serverCopy = await readFile(resolve(root, "../server/src/main/resources/data/resources.json"), "utf8")

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
const explorer = await vite.ssrLoadModule("/src/components/places/PlacesExplorer/index.ts")
const about = await vite.ssrLoadModule("/src/content/categories/About/About.sources.ts")

const DAY = data.todayInArgentina()
const real = withoutSexualBatch(file.resources)
const { EMPTY_PLACE_QUERY: EMPTY, selectPlaces, matchingServices, buildPlaceView, isVerifiedFree } = places
const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const find = (id) => real.find((place) => place.id === id)
const entryOf = (id, list = real) => selectPlaces(list, DAY, EMPTY).find(({ place }) => place.id === id)
const ids = (query, list = real) => selectPlaces(list, DAY, { ...EMPTY, ...query }).map(({ place }) => place.id).sort()
// The sources of every place are in Sobre AuxiliAR (group «Centros de atención (mapa)»), not in the panel: it keeps the dates and a link there
const aboutPlace = (id) => about.REFERENCE_GROUPS.find((group) => group.id === "centros-mapa").blocks.find((block) => block.id === `centro-${id}`)
const panel = (id, list = real) => renderToStaticMarkup(createElement(PlaceDetail, { entry: entryOf(id, list), onClose() {} }))
const batch = [
  ["cesac-3", "atencion-primaria"], ["cesac-41", "atencion-primaria"], ["cesac-47", "atencion-primaria"], ["cesac-47", "pediatria"],
  ["cesac-3", "vacunacion"], ["cesac-41", "vacunacion"],
]
const ownService = (placeId, serviceId) => find(placeId).services.find(({ id }) => id === serviceId)
const check = (changeData) => {
  const copy = structuredClone(file)
  changeData(copy)
  return validateDataset({ files: [{ name: "places/ar-c.json", data: copy }], schema, taxonomy }).errors
}

/* ── Layout: the row of the view switch and the filters button wraps ── */

test("the row with the view switch and the filters button can wrap (at 320 px they do not fit in one row and the page grew wider than the screen)", () => {
  const { PlacesExplorer } = explorer
  const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ["/centros?vista=lista"] }, createElement(PlacesExplorer, { map: true })))
  const row = html.slice(0, html.indexOf("Filtros")).lastIndexOf('<div class="')
  const classes = html.slice(row).match(/^<div class="([^"]*)"/)[1].split(" ")
  assert.ok(classes.includes("flex-wrap"), `the row is: ${classes.join(" ")}`)
})

/* ── Compatibility ── */

test("evidence is optional: a service without it resolves to none, shows no 'Fuentes oficiales' and keeps its own source link", () => {
  const carrillo = find("hospital-odontologia-carrillo")
  const resolved = data.getServices(carrillo)[0]
  assert.deepEqual(resolved.evidence, [])
  const view = buildPlaceView(entryOf("hospital-odontologia-carrillo"))
  assert.deepEqual(view.sources, [])
  assert.ok(!text(panel("hospital-odontologia-carrillo")).includes("Fuentes oficiales"))
  // its own source is kept, now in Sobre AuxiliAR (if the place shows there) and never as a link in the panel
  assert.ok(!panel("hospital-odontologia-carrillo").includes(carrillo.source.url))
  assert.ok(panel("hospital-odontologia-carrillo").includes("href=\"/sobre-auxiliar\""))
  assert.deepEqual(check(() => {}), [], "the real dataset validates")
})

test("evidence never replaces the original source: the six services keep theirs, with its note", () => {
  for (const [placeId, serviceId] of batch) {
    const own = ownService(placeId, serviceId)
    assert.ok(own.source?.url && own.source.note && own.source.retrievedAt, `${placeId}/${serviceId} keeps its source`)
    assert.ok(own.evidence.length >= 3, `${placeId}/${serviceId} has evidence besides it`)
    assert.equal(data.getServices(find(placeId)).find(({ id }) => id === serviceId).source, own.source, "resolved source is the original")
    assert.equal(isVerifiedFree(find(placeId), data.getServices(find(placeId)).find(({ id }) => id === serviceId)), true)
  }
})

test("the evidence is for the app: the server copy does not carry it, so the server does not change with it", () => {
  assert.ok(!serverCopy.includes('"evidence"'))
})

test("validation: valid evidence passes; a repeated source, a bad link, an unknown kind or key, or gratuity without cost evidence do not", () => {
  const service = (copy) => copy.resources.find(({ id }) => id === "cesac-47").services.find(({ id }) => id === "pediatria")
  const evidence = (copy) => service(copy).evidence
  assert.deepEqual(check(() => {}), [])
  assert.match(check((copy) => evidence(copy).push({ ...evidence(copy)[0] })).join("\n"), /repetida/)
  assert.match(check((copy) => { evidence(copy)[0].url = "ley-153" }).join("\n"), /url/)
  assert.match(check((copy) => { evidence(copy)[0].kind = "turnos" }).join("\n"), /kind/)
  assert.match(check((copy) => { evidence(copy)[0].extra = 1 }).join("\n"), /extra|no admite|adicional/i)
  assert.match(check((copy) => { delete evidence(copy)[0].retrievedAt }).join("\n"), /retrievedAt/)
  assert.match(check((copy) => { evidence(copy)[0].retrievedAt = "2026-02-31" }).join("\n"), /fecha/)
  assert.match(check((copy) => { service(copy).evidence = evidence(copy).filter(({ kind }) => kind !== "cost") }).join("\n"), /kind "cost"/)
  // a service with no evidence at all is not asked for any
  assert.deepEqual(check((copy) => { delete service(copy).evidence }), [])
})

/* ── How the panel shows the sources ── */

const urlCount = (html, url) => html.split(`href="${url}"`).length - 1

test("'Fuentes oficiales': each link once, saying what it backs for which service", () => {
  for (const id of ["cesac-3", "cesac-41", "cesac-47"]) {
    const html = panel(id, file.resources)
    const view = buildPlaceView(entryOf(id, file.resources))
    // the panel has no list of sources: it points to Sobre AuxiliAR, where each link is once, with what it backs
    assert.ok(!text(html).includes("Fuentes oficiales") && text(html).includes("están en Sobre AuxiliAR"), id)
    assert.equal(new Set(view.sources.map(({ url }) => url)).size, view.sources.length, "no repeated link in the list")
    const block = aboutPlace(id)
    assert.deepEqual(block.references.filter(({ detail }) => detail).map(({ url }) => url), view.sources.map(({ url }) => url), `${id}: the same sources, once each`)
    for (const { url } of view.sources) assert.equal(urlCount(html, url), 0, `${id}: ${url} is not in the panel`)
    assert.ok(block.checkedAt?.length === 1 && block.checkedKind === "place", `${id}: the day it was verified`)
  }
  // CeSAC 47 has two services with the same norm: one link that names both
  const view = buildPlaceView(entryOf("cesac-47"))
  const ley = view.sources.find(({ url }) => url.includes("norma/3800"))
  assert.deepEqual(ley.backs, ["Respalda la gratuidad de: Medicina general y Pediatría"])
})

test("a general norm backs gratuity only: never that a turn exists, and the turn page is not a proof of availability", () => {
  const view = buildPlaceView(entryOf("cesac-3"))
  const norm = view.sources.find(({ url }) => url.includes("norma/3800"))
  assert.ok(norm.backs.every((line) => /gratuidad/.test(line) && !/turno|horario|disponib/i.test(line)), "the norm backs gratuity and nothing else")
  const access = view.sources.find(({ url }) => url.includes("solicitud-de-turnos"))
  assert.ok(access.backs.every((line) => /cómo pedir turno/.test(line) && /No confirma que haya turnos disponibles/.test(line)))
  const ficha = view.sources.find(({ url }) => url.includes("salud/cesac-3"))
  assert.match(ficha.backs.join(" "), /Confirma que la sede ofrece: Clínica médica y Programas de vacunación/)
  assert.ok(ficha.backs.every((line) => !/gratuidad|turno/.test(line)), "the page of the establishment backs existence, not gratuity")
})

test("gratuity source and existence source are told apart; the vaccination scope has its own", () => {
  const view = buildPlaceView(entryOf("cesac-41"))
  const kinds = (fragment) => view.sources.find(({ url }) => url.includes(fragment)).backs.join(" | ")
  assert.match(kinds("ley-27491"), /Respalda la gratuidad de: Vacunatorio/)
  assert.match(kinds("norma-423397"), /Dice hasta dónde llega la gratuidad de: Vacunatorio/)
  assert.match(kinds("argentina.gob.ar/salud/vacunas"), /Dice hasta dónde llega la gratuidad/)
  // one page that confirms the vaccination site AND publishes its hours: one link, two lines
  const lines = view.sources.find(({ url }) => url.includes("lugares-y-horarios-de-vacunatorios")).backs
  assert.deepEqual(lines, ["Confirma que la sede ofrece: Vacunatorio", "Publica el horario de: Vacunatorio"])
  // the establishment's own page is in its block of Sobre AuxiliAR, once
  assert.equal(aboutPlace("cesac-41").references.filter(({ url }) => url === find("cesac-41").source.url).length, 1)
})

test("the service that has evidence does not repeat its source link inside its own block", () => {
  const html = panel("cesac-3")
  assert.equal(urlCount(html, ownService("cesac-3", "vacunacion").source.url), 0, "its source is in Sobre AuxiliAR")
  assert.equal(aboutPlace("cesac-3").references.filter(({ url }) => url === ownService("cesac-3", "vacunacion").source.url).length, 1)
  assert.ok(!/Fuente:/.test(text(html)), "no inline 'Fuente' links")
})

/* ── Hours: a service's hours are its own ── */

test("hours: the general hours and those of a service are said apart, and never attributed to another service", () => {
  const view = buildPlaceView(entryOf("cesac-41"))
  const general = view.howTo.find((item) => item.kind === "hours")
  assert.equal(general.label, "Horario general")
  assert.match(general.note, /no es el de cada servicio/)
  const withHours = view.services.filter(({ details }) => details.some((item) => item.kind === "hours"))
  assert.deepEqual(withHours.map(({ id }) => id), ["vacunacion"])
  assert.equal(withHours[0].details.find((item) => item.kind === "hours").label, "Horario de vacunatorio")
  // the other services of the CeSAC 41 have no hours of their own: not known, never inherited from vaccination
  for (const resolved of data.getServices(find("cesac-41")).filter(({ id }) => id !== "vacunacion")) assert.equal(resolved.hours, null, resolved.id)
  // and no other CeSAC shows the vaccination hours
  for (const id of ["cesac-3", "cesac-47"]) assert.ok(!text(panel(id)).includes("Lunes, miércoles, jueves y viernes"), id)
})

test("hours of one service do not make the establishment look as if all its hours were known", () => {
  const copy = structuredClone(real)
  const cesac = copy.find(({ id }) => id === "cesac-3")
  cesac.services.find(({ id }) => id === "vacunacion").hours = { open24h: false, schedule: [{ days: [1], from: "07:00", to: "12:00" }] }
  const view = buildPlaceView(entryOf("cesac-3", copy))
  assert.match(view.availabilityNotice, /horario/, "primary care still has no hours: the notice stays")
  // the same data, with hours for EVERY service, does lose the notice about hours
  for (const own of cesac.services) own.hours = { open24h: false, schedule: [{ days: [1], from: "07:00", to: "12:00" }] }
  assert.doesNotMatch(buildPlaceView(entryOf("cesac-3", copy)).availabilityNotice ?? "", /horario/)
})

/* ── Search, card and conditions ── */

test("searching a free specialty only finds the places whose THAT specialty is confirmed free", () => {
  assert.deepEqual(ids({ text: "odontologia gratuita" }), ["hospital-odontologia-carrillo", "hospital-odontologia-duenas"], "the CeSAC dentistry is not confirmed")
  assert.deepEqual(ids({ text: "odontologia gratis" }), ["hospital-odontologia-carrillo", "hospital-odontologia-duenas"])
  assert.deepEqual(ids({ text: "vacunacion gratuita" }), ["cesac-3", "cesac-41"], "CeSAC 47 vaccination is not confirmed")
  assert.deepEqual(ids({ text: "pediatria gratuita" }), ["cesac-47", "hospital-de-pediatria-dr-j-garrahan", "hospital-general-de-ninos-pedro-de-elizalde"], "the pediatrics of CeSAC 3 and 41 is not a service of its own; the Garrahan is a pediatric hospital")
  assert.deepEqual(ids({ text: "medicina general gratuita" }), ["cesac-41", "cesac-47"])
  // "clínica médica" is also the name of the type of care (primary care): every confirmed primary-care service answers it
  assert.deepEqual(ids({ text: "clinica medica gratuita" }), ["cesac-3", "cesac-41", "cesac-47"])
  for (const term of ["psicologia", "psiquiatria", "salud mental", "ecografia", "farmacia", "laboratorio", "anticonceptivos", "vih", "oftalmologica"]) {
    assert.deepEqual(ids({ text: `${term} gratuita` }), [], `${term} has no confirmed gratuity`)
  }
  // without the gratuity word the same words still find the places
  assert.ok(ids({ text: "psicologia" }).length > 0 && ids({ text: "ecografia" }).length > 0)
})

test("the rule holds for any specialty: a result always has a confirmed-free service that the words are about", () => {
  const words = new Set()
  for (const place of real) for (const own of place.services) for (const word of places.normalizeText(own.name ?? own.type).split(/\s+/)) if (word.length > 3) words.add(word)
  for (const word of words) {
    for (const entry of selectPlaces(real, DAY, { ...EMPTY, text: `${word} gratuita` })) {
      const answers = entry.services.some((service) => {
        if (!isVerifiedFree(entry.place, service)) return false
        const typeLabel = taxonomy.serviceTypes.find(({ id }) => id === service.type)?.label
        const own = places.normalizeText([places.serviceName(service), typeLabel, service.costNote, service.appointment.howTo, ...service.requirements].filter(Boolean).join(" "))
        const placeText = places.normalizeText([entry.place.name, entry.place.shortName, ...(entry.place.aliases ?? [])].filter(Boolean).join(" "))
        return own.includes(places.stemOf(word)) || placeText.includes(places.stemOf(word))
      })
      assert.ok(answers, `"${word} gratuita" returned ${entry.place.id}, which has no confirmed-free service about it`)
    }
  }
})

test("a mixed centre: the card highlights only the services that are confirmed, under any filter", () => {
  const render = (entry) => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(PlaceCard, { entry, onOpen() {} })))
  for (const query of [{ free: true }, { filterId: "all" }, { free: true, text: "pediatria" }]) {
    const entry = selectPlaces(real, DAY, { ...EMPTY, ...query }).find(({ place }) => place.id === "cesac-47")
    const html = render(entry)
    // the badges are lists too: the groups are cut by their own markers
    const confirmed = html.slice(html.indexOf('aria-label="Prestaciones con gratuidad confirmada"'), html.indexOf("Gratuidad no confirmada</p>"))
    const pending = html.slice(html.indexOf('aria-label="Prestaciones con gratuidad no confirmada"'), html.indexOf("data-place-trigger"))
    assert.ok(confirmed.length > 0 && pending.length > 0)
    assert.deepEqual([...text(confirmed).matchAll(/Medicina general|Pediatría/g)].map(([name]) => name), ["Medicina general", "Pediatría"], JSON.stringify(query))
    assert.equal((text(confirmed).match(/Gratuita/g) ?? []).length, 2, "one badge for each confirmed service")
    assert.ok(!/Gratuita/.test(text(pending)), "no badge on the ones not confirmed")
    assert.ok(!/Medicina general|Pediatría/.test(text(pending)), "the confirmed ones are not in the pending group")
  }
  // with the filter on, only the services that meet it are the ones the panel leads with
  const entry = selectPlaces(real, DAY, { ...EMPTY, free: true }).find(({ place }) => place.id === "cesac-47")
  assert.deepEqual(matchingServices(entry, { ...EMPTY, free: true }).map(({ id }) => id).sort(), ["atencion-primaria", "pediatria"])
  const cesac3 = selectPlaces(real, DAY, { ...EMPTY, free: true }).find(({ place }) => place.id === "cesac-3")
  assert.deepEqual(matchingServices(cesac3, { ...EMPTY, free: true }).map(({ id }) => id).sort(), ["atencion-primaria", "vacunacion"])
})

test("free with conditions shows the condition and the requirements; plain free shows its requirements and no condition", () => {
  for (const id of ["cesac-3", "cesac-41"]) {
    const view = buildPlaceView(entryOf(id))
    const vaccination = view.services.find((service) => service.id === "vacunacion")
    const condition = vaccination.details.find((item) => item.kind === "text" && item.text.startsWith("Gratuita con condiciones."))
    assert.match(condition.text, /Calendario Nacional de Vacunación/)
    assert.match(condition.text, /No hay información sobre qué vacunas aplica este vacunatorio, sobre su disponibilidad/)
    assert.ok([...vaccination.chips, ...view.highlights].includes("Gratuita con condiciones"))
    const primary = view.services.find((service) => service.id === "atencion-primaria")
    assert.ok(primary.details.some((item) => item.kind === "list" && item.items.some((line) => /empadronar/.test(line))), `${id}: primary care shows its requirement`)
    assert.ok(!primary.details.some((item) => item.kind === "text" && item.text.startsWith("Gratuita con condiciones.")), "plain free has no condition text")
  }
  // a free service with a condition AND requirements, made up: both are in the panel
  const copy = structuredClone(real)
  const own = copy.find(({ id }) => id === "cesac-3").services.find(({ id }) => id === "vacunacion")
  own.requirements = ["Llevar el carnet de vacunación"]
  const html = text(panel("cesac-3", copy))
  assert.ok(html.includes("Gratuita con condiciones") && html.includes("Llevar el carnet de vacunación") && html.includes("La gratuidad alcanza a las vacunas del Calendario Nacional"))
})
