/*
 * Tests of the places explorer's logic (src/utils/places), loaded through Vite like the app does.
 * They run against the real verified places of CABA: what a person sees must follow what the data says.
 *   npm run places:test
 */
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const sourceDir = resolve(here, "../src/data/resources")
const readJson = async (file) => JSON.parse(await readFile(file, "utf8"))
// The places of these tests are the ones for people: the first veterinary centre has its own tests (places-vet.test.mjs) and the
// panel, cards and filters here are about human health
const places = (await readJson(join(sourceDir, "places/ar-c.json"))).resources.filter(({ facilityType }) => facilityType !== "public-veterinary")
const taxonomy = await readJson(join(sourceDir, "taxonomy.json"))

const { createServer } = await import("vite")
const vite = await createServer({ root: resolve(here, ".."), logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())
const util = await vite.ssrLoadModule("/src/utils/places/index.ts")
const data = await vite.ssrLoadModule("/src/data/resources/index.ts")
const { createElement } = await import("react")
const { renderToStaticMarkup } = await import("react-dom/server")
const { PlacesToolbar } = await vite.ssrLoadModule("/src/components/places/PlacesToolbar/index.ts")
const { PlaceDetail } = await vite.ssrLoadModule("/src/components/places/PlaceDetail/index.ts")

const DAY = "2026-10-08"
const ids = (entries) => entries.map(({ place }) => place.id).sort()
const find = (id) => places.find((place) => place.id === id)
const service = (placeId, serviceId) => data.getServices(find(placeId)).find(({ id }) => id === serviceId)

test("search ignores case and accents, in names, services and useful data", () => {
  assert.equal(util.normalizeText("  Odontología "), "odontologia")
  const search = (query) => ids(util.filterPlaces(places, DAY, { query, filterId: "all" }))
  assert.deepEqual(search("ODONTOLOGIA"), ["cesac-3", "cesac-41", "cesac-47", "hospital-odontologia-carrillo", "hospital-odontologia-duenas"])
  assert.deepEqual(search("santa lucia"), ["hospital-oftalmologico-santa-lucia"])
  assert.deepEqual(search("la boca"), ["cesac-41"])
  assert.deepEqual(search("sanchez de bustamante"), ["hospital-odontologia-carrillo"])
  assert.deepEqual(search("vih"), ["cesac-3", "cesac-47"])
  // every word has to match, and a word that is nowhere finds nothing
  assert.deepEqual(search("guardia oftalmologica"), ["hospital-oftalmologico-santa-lucia"])
  assert.deepEqual(search("guardia xyz"), [])
  assert.equal(search("").length, 6)
})

test("simple filters group service types", () => {
  const withFilter = (filterId) => ids(util.filterPlaces(places, DAY, { query: "", filterId }))
  assert.equal(withFilter("all").length, 6)
  assert.deepEqual(withFilter("vaccination"), ["cesac-3", "cesac-41", "cesac-47"])
  assert.deepEqual(withFilter("emergency"), ["hospital-odontologia-carrillo", "hospital-odontologia-duenas", "hospital-oftalmologico-santa-lucia"])
  assert.deepEqual(withFilter("sexual-health"), ["cesac-3", "cesac-47"])
  assert.deepEqual(withFilter("mental-health"), ["cesac-3", "cesac-41", "cesac-47"])
  assert.deepEqual(withFilter("medical"), ["cesac-3", "cesac-41", "cesac-47"])
  assert.deepEqual(withFilter("dentistry"), ["cesac-3", "cesac-41", "cesac-47"])
  // the services of the active filter come first in the card
  const [entry] = util.getPlaceEntries([find("cesac-41")], DAY, "vaccination")
  assert.equal(entry.services[0].type, "vaccination")
  // every type of every group exists in the taxonomy
  const known = new Set(taxonomy.serviceTypes.map(({ id }) => id))
  for (const { types } of util.PLACE_FILTERS) for (const type of types ?? []) assert.ok(known.has(type), type)
})

test("nothing expired or unverified is shown", () => {
  assert.equal(util.getPlaceEntries(places, "2027-01-04").length, 6)
  assert.equal(util.getPlaceEntries(places, "2027-01-05").length, 0)
  const unverified = structuredClone(find("cesac-3"))
  unverified.verification.status = "needs-review"
  assert.equal(util.getPlaceEntries([unverified], DAY).length, 0)
  // a service whose own verification isn't current is left out, the others stay
  const partial = structuredClone(find("cesac-3"))
  partial.services[0].verification = { status: "unverified" }
  const [entry] = util.getPlaceEntries([partial], DAY)
  assert.equal(entry.services.length, partial.services.length - 1)
})

test("hours: only what the data says", () => {
  assert.deepEqual(util.describeHours(null), { kind: "unknown" })
  assert.deepEqual(util.describeHours(undefined), { kind: "unknown" })
  assert.deepEqual(util.describeHours({ open24h: true, note: "Todos los días" }), { kind: "open24h", note: "Todos los días" })
  // a service with `hours: null` does not inherit the establishment's general hours
  assert.deepEqual(util.describeHours(service("cesac-41", "odontologia").hours), { kind: "unknown" })
  assert.equal(util.describeHours(find("cesac-41").hours).lines[0].days, "Lunes a viernes")
  assert.equal(util.describeHours(find("cesac-41").hours).lines[0].times, "8:00 a 18:00 h")
  const vaccination = util.describeHours(service("cesac-41", "vacunacion").hours)
  assert.deepEqual(vaccination.lines, [
    { days: "Lunes, miércoles, jueves y viernes", times: "8:00 a 12:00 y 13:00 a 17:00 h" },
    { days: "Martes", times: "8:00 a 12:00 y 14:00 a 17:00 h" },
  ])
  assert.equal(util.formatDays([0, 6]), "Sábado y domingo")
})

test("cost, appointment and highlights are never assumed", () => {
  assert.equal(util.costLabel("unknown"), undefined)
  assert.equal(util.costLabel("free"), "Gratuita")
  assert.equal(util.appointmentLabel({ mode: "unknown" }), undefined)
  // Only what the data states is highlighted: primary care (free, no condition) and vaccination (free WITH conditions); the other services of the CeSAC say nothing
  const highlightsOf = { "atencion-primaria": ["Gratuita"], vacunacion: ["Gratuita con condiciones"] }
  for (const resolved of data.getServices(find("cesac-3"))) assert.deepEqual(util.serviceHighlights(resolved, find("cesac-3")), highlightsOf[resolved.id] ?? [], resolved.id)
  assert.deepEqual(util.serviceHighlights(service("hospital-odontologia-carrillo", "guardia-odontologica"), find("hospital-odontologia-carrillo")), ["24 h", "Gratuita"])
  assert.deepEqual(util.serviceHighlights(service("hospital-oftalmologico-santa-lucia", "guardia-oftalmologica"), find("hospital-oftalmologico-santa-lucia")), ["24 h", "Podés ir sin turno"])
})

test("address and date wording", () => {
  assert.equal(util.shortAddress(find("hospital-odontologia-carrillo").address), "Sánchez de Bustamante 2529, Recoleta")
  assert.equal(util.shortAddress(null), undefined)
  assert.equal(util.formatDate("2026-10-07"), "7 de octubre de 2026")
})

/* ── Scope: the explorer only shows what belongs to the place where it is embedded ── */

const visibleText = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")

const inScope = (scope, filterId = "all", query = "") => util.filterPlaces(places, DAY, { query, filterId, scope })
const serviceIds = (entries, placeId) => entries.find(({ place }) => place.id === placeId)?.services.map(({ id }) => id)

test("scope by category: places keep only the services that derive to it", () => {
  const physical = inScope({ category: "salud-fisica" })
  assert.equal(physical.length, 6)
  // CeSAC 3 offers mental health, contraception, IVE/ILE and HIV tests too: none of them shows up in physical health
  assert.deepEqual(serviceIds(physical, "cesac-3"), ["atencion-primaria", "vacunacion", "odontologia", "ecografia", "farmacia"])
  for (const { services } of physical) for (const { categories } of services) assert.ok(categories.includes("salud-fisica"))

  const mental = inScope({ category: "salud-mental" })
  assert.deepEqual(ids(mental), ["cesac-3", "cesac-41", "cesac-47"])
  assert.deepEqual(serviceIds(mental, "cesac-47"), ["psiquiatria", "psicologia"])
  assert.deepEqual(serviceIds(mental, "cesac-3"), ["salud-mental"])

  assert.deepEqual(ids(inScope({ category: "esi" })), ["cesac-3", "cesac-47"])
  assert.deepEqual(inScope({ category: "animales" }), [])
  // no scope: everything, as before
  assert.equal(ids(inScope(undefined)).length, 6)
  assert.equal(ids(inScope({})).length, 6)
})

test("scope by service types, and both together", () => {
  const dentistry = inScope({ serviceTypes: ["dentistry"] })
  assert.deepEqual(ids(dentistry), ["cesac-3", "cesac-41", "cesac-47"])
  for (const { services } of dentistry) assert.deepEqual(services.map(({ type }) => type), ["dentistry"])
  // with both only the types in both count: dentistry isn't mental health
  assert.deepEqual(inScope({ category: "salud-mental", serviceTypes: ["dentistry"] }), [])
  assert.deepEqual(ids(inScope({ category: "salud-fisica", serviceTypes: ["dentistry"] })), ["cesac-3", "cesac-41", "cesac-47"])
})

test("out-of-scope services are hidden from search and filters too", () => {
  assert.deepEqual(inScope({ category: "salud-fisica" }, "all", "psicologia"), [])
  assert.deepEqual(inScope({ category: "salud-fisica" }, "all", "vih"), [])
  assert.deepEqual(ids(inScope({ category: "salud-mental" }, "all", "psicologia")), ["cesac-3", "cesac-47"])
  // a filter of another context finds nothing here
  assert.deepEqual(inScope({ category: "salud-mental" }, "dentistry"), [])
  assert.deepEqual(inScope({ category: "salud-mental" }, "emergency"), [])
})

test("the panel and the chips only show what the context allows", () => {
  const [cesac3] = util.getPlaceEntries([find("cesac-3")], DAY, "all", { category: "salud-fisica" })
  const detail = visibleText(renderToStaticMarkup(createElement(PlaceDetail, { entry: cesac3, onClose() {} })))
  for (const hidden of ["Psicología", "Anticonceptivos", "IVE/ILE", "VIH"]) assert.ok(!detail.includes(hidden), hidden)
  for (const shown of ["Clínica médica", "Odontología", "Programas de vacunación"]) assert.ok(detail.includes(shown), shown)

  const chips = (filters) => visibleText(renderToStaticMarkup(createElement(PlacesToolbar, { filters, query: "", onQueryChange() {}, filterId: "all", onFilterChange() {} })))
  const physicalChips = chips(["medical", "vaccination", "dentistry", "emergency"])
  assert.match(physicalChips, /Todos Atención médica Vacunación Odontología Guardias/)
  assert.ok(!physicalChips.includes("Salud mental"))
  // a context with no filters shows the search box only
  assert.ok(!chips([]).includes("Todos"))
  assert.ok(chips([]).includes("¿Qué necesitás?"))
})

/* ── What the panel says: useful information first, nothing about what isn't known ── */

const view = (placeId, scope = { category: "salud-fisica" }) => util.buildPlaceView(util.getPlaceEntries([find(placeId)], DAY, "all", scope)[0])
const panelText = (placeId, scope) => {
  const [entry] = util.getPlaceEntries([find(placeId)], DAY, "all", scope ?? { category: "salud-fisica" })
  return visibleText(renderToStaticMarkup(createElement(PlaceDetail, { entry, onClose() {} })))
}

test("the panel leads with verified highlights and never writes what is unknown", () => {
  for (const id of places.map((place) => place.id)) {
    const text = panelText(id)
    for (const empty of ["no informado", "null", "unknown", "undefined"]) assert.ok(!text.includes(empty), id + ": " + empty)
  }
  const lucia = view("hospital-oftalmologico-santa-lucia")
  assert.deepEqual(lucia.highlights, ["24 h", "Podés ir sin turno"])
  assert.equal(lucia.services[0].chips.length, 0)
  // the name already says "Hospital": no repeated label; a CeSAC's name doesn't say what kind of establishment it is
  assert.equal(lucia.facilityType, undefined)
  assert.equal(view("cesac-41").facilityType, "Centro de salud (CeSAC, CAPS)")
  // cost is unknown for this guardia: nothing about cost
  assert.ok(!panelText("hospital-oftalmologico-santa-lucia").toLowerCase().includes("gratuit"))
  const carrillo = view("hospital-odontologia-carrillo")
  assert.deepEqual(carrillo.highlights, ["24 h", "Gratuita"])
  assert.deepEqual(carrillo.contacts.map(({ display }) => display).sort(), ["4805-5521", "4805-6407"])
})

test("a CeSAC lists its services compactly and only details the ones with specific information", () => {
  const cesac = view("cesac-41")
  assert.deepEqual(cesac.highlights, [])
  assert.equal(cesac.services.length, 6)
  const withDetails = cesac.services.filter(({ details }) => details.length > 0).map(({ id }) => id)
  assert.deepEqual(withDetails, ["atencion-primaria", "vacunacion"])
  // general hours go in "how to be attended"; the services with hours: null don't repeat them
  assert.equal(cesac.howTo[0].label, "Horario general")
  assert.equal(cesac.howTo[0].lines[0].times, "8:00 a 18:00 h")
  const text = panelText("cesac-41")
  assert.equal(text.split("8:00 a 18:00 h").length - 1, 1)
  assert.ok(text.includes("Los turnos se solicitan personalmente."))
  assert.ok(text.includes("Lunes, miércoles, jueves y viernes"))
  // CeSAC 47 has no hours at all, so no "how to be attended"; only the services approved in the first batch have details
  const cesac47 = view("cesac-47")
  assert.deepEqual(cesac47.howTo, [])
  assert.deepEqual(cesac47.services.filter(({ details }) => details.length > 0).map(({ id }) => id), ["atencion-primaria", "pediatria"])
})

test("conditions and common information are written once and only when verified", () => {
  const [base] = places.filter(({ id }) => id === "cesac-3")
  const entryWith = (change) => {
    const place = structuredClone(base)
    // the bare establishment: without the gratuity, requirements and appointment the first batch added
    for (const own of place.services) for (const key of ["cost", "costNote", "requirements", "appointment", "source"]) delete own[key]
    change(place)
    return util.getPlaceEntries([place], DAY, "all", { category: "salud-fisica" })[0]
  }
  // free with a condition: no plain highlight, the condition is shown
  const conditioned = util.buildPlaceView(entryWith((place) => { place.services[0].cost = "free"; place.services[0].costNote = "Con DNI argentino"; place.services[0].source = { organization: "Fuente de prueba", url: place.source.url, note: "La fuente dice que es gratuita con DNI argentino." } }))
  assert.deepEqual(conditioned.services[0].chips, ["Gratuita con condiciones"])
  assert.deepEqual(conditioned.services[0].details, [{ kind: "text", text: "Gratuita con condiciones. Con DNI argentino" }])
  // the same requirements for every service: said once, under "Antes de ir"
  const shared = util.buildPlaceView(entryWith((place) => { place.requirements = ["Llevar DNI"] }))
  assert.deepEqual(shared.beforeGoing, ["Llevar DNI"])
  assert.ok(shared.services.every(({ details }) => details.length === 0))
  // requirements of a single service stay with that service
  const own = util.buildPlaceView(entryWith((place) => { place.services[1].requirements = ["Carnet de vacunación"] }))
  assert.deepEqual(own.beforeGoing, [])
  assert.equal(own.services[1].details[0].label, "Qué llevar o tener en cuenta")
  // an appointment that every service shares goes in "how to be attended"
  const appointment = util.buildPlaceView(entryWith((place) => { place.services.forEach((service) => { service.appointment = { mode: "required", howTo: "Por teléfono" } }) }))
  assert.deepEqual(appointment.howTo.map(({ text }) => text), ["Con turno previo", "Por teléfono"])
})

test("the clinical wording of the dataset stays out of the panel; it speaks in everyday words", () => {
  // the dataset's description of Santa Lucía's guardia is written in clinical words: the panel doesn't show it
  // (SHOW_SERVICE_DESCRIPTIONS in placeView.ts) and says the same with structured data
  const lucia = panelText("hospital-oftalmologico-santa-lucia")
  for (const jargon of ["demanda espontánea", "patología", "clínica y quirúrgica"]) assert.ok(!lucia.includes(jargon), jargon)
  assert.ok(lucia.includes("Podés ir sin turno") && lucia.includes("24 h"))
  assert.ok(lucia.includes("Funciona las 24 hs, los 365 días del año."))
  assert.ok(lucia.includes("Para: Personas adultas, Niñas y niños"))
})
