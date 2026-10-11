/*
 * What the map shows: only prestaciones whose gratuity is documented (free, or free with conditions). The others stay in the
 * data for future research, but they are in no result, card, pin, search, panel or count. A place with some documented and some
 * not shows only the documented ones; a place with none is not shown.
 *   npm run places:test
 */
import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const raw = JSON.parse(await readFile(join(root, "src/data/resources/places/ar-c.json"), "utf8")).resources

const { createServer } = await import("vite")
const vite = await createServer({ root, logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())
const { createElement } = await import("react")
const { renderToStaticMarkup } = await import("react-dom/server")
const { MemoryRouter } = await import("react-router")
const places = await vite.ssrLoadModule("/src/utils/places/index.ts")
const data = await vite.ssrLoadModule("/src/data/resources/index.ts")
await vite.ssrLoadModule("/src/components/places/PlacesExplorer/index.ts")
const { PlaceCard } = await vite.ssrLoadModule("/src/components/places/PlaceCard/index.ts")
const { PlaceDetail } = await vite.ssrLoadModule("/src/components/places/PlaceDetail/index.ts")

const DAY = data.todayInArgentina()
const real = await data.loadPlaces("AR-C")
const { EMPTY_PLACE_QUERY: EMPTY, selectPlaces, getPlaceFacets, isVerifiedFree } = places
const VISIBLE = { confirmedOnly: true }
const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const shown = (query = {}) => selectPlaces(real, DAY, { ...EMPTY, ...query }, VISIBLE)
const idsOf = (entries) => entries.map(({ place }) => place.id)
const serviceIds = (entries, id) => entries.find(({ place }) => place.id === id)?.services.map(({ id: serviceId }) => serviceId)

test("the data keeps every record: nothing pending was deleted", () => {
  assert.equal(raw.length, 8)
  assert.equal(raw.flatMap(({ services }) => services).length, 35, "the 35 prestaciones are still in the dataset")
  const withoutGratuity = raw.flatMap((place) => place.services.filter((service) => !(service.cost === "free" && service.source?.note)).map((service) => `${place.id}/${service.id}`))
  assert.equal(withoutGratuity.length, 25, "the 25 with no documented gratuity are kept for research")
})

test("only documented gratuity is visible: 7 places and 10 prestaciones, the place with none is out", () => {
  const entries = shown()
  assert.deepEqual(idsOf(entries).sort(), ["centro-fijo-veterinario-costanera-sur", "cesac-3", "cesac-41", "cesac-47", "hospital-de-pediatria-dr-j-garrahan", "hospital-odontologia-carrillo", "hospital-odontologia-duenas"])
  assert.ok(!idsOf(entries).includes("hospital-oftalmologico-santa-lucia"), "no prestación of the Santa Lucía hospital has documented gratuity")
  for (const { place, services } of entries) for (const service of services) assert.ok(isVerifiedFree(place, service), `${place.id}/${service.id}`)
  assert.equal(entries.flatMap(({ services }) => services).length, 10)
  // a place with documented and not documented prestaciones shows only the documented ones
  assert.deepEqual(serviceIds(entries, "cesac-3"), ["atencion-primaria", "vacunacion"])
  assert.deepEqual(serviceIds(entries, "cesac-41"), ["atencion-primaria", "vacunacion"])
  assert.deepEqual(serviceIds(entries, "cesac-47"), ["atencion-primaria", "pediatria"])
  // without the policy the data has more (the explorer is the one that applies it)
  assert.equal(selectPlaces(real, DAY, EMPTY).length, 8)
})

test("searches, filters and facets never reveal an unverified prestación", () => {
  const hidden = ["odontologia", "psicologia", "psiquiatria", "salud mental", "anticonceptivos", "anticoncepcion", "interrupcion", "vih", "sifilis", "ecografia", "laboratorio", "farmacia", "preservativos", "obstetricia", "oftalmologica", "salud sexual"]
  // the odontología of the CeSAC is not documented; the two hospitals' guardia odontológica is
  assert.deepEqual(idsOf(shown({ text: "odontologia" })).sort(), ["hospital-odontologia-carrillo", "hospital-odontologia-duenas"])
  for (const word of hidden.filter((word) => word !== "odontologia")) assert.deepEqual(idsOf(shown({ text: word })), [], word)
  // the quick filters and the categories have nothing for what is not documented
  for (const filterId of ["mental-health", "sexual-health"]) assert.deepEqual(shown({ filterId }), [], filterId)
  assert.deepEqual(shown({ category: "salud-mental" }), [])
  assert.deepEqual(shown({ category: "esi" }), [])
  assert.deepEqual(shown({ filterId: "dentistry" }), [], "the Odontología filter is the CeSAC odontología, which is not documented: the hospitals guardia is under Guardias")
  assert.deepEqual(idsOf(shown({ filterId: "emergency" })).sort(), ["hospital-odontologia-carrillo", "hospital-odontologia-duenas"])
  assert.deepEqual(idsOf(shown({ filterId: "vaccination" })).sort(), ["cesac-3", "cesac-41"], "CeSAC 47 vaccination is not documented")
  // the options offered and their counts come from what is visible
  const facets = getPlaceFacets(real, DAY, EMPTY, VISIBLE)
  const types = facets.types.map(({ value }) => value)
  for (const type of ["mental-health-care", "contraception", "ive-ile-care", "sti-testing-care", "ophthalmology", "pharmacy", "laboratory", "diagnostic-imaging"]) assert.ok(!types.includes(type), type)
  assert.deepEqual(facets.categories.map(({ value }) => value).sort(), ["animales", "salud-fisica"])
  const count = (list, value) => list.find((facet) => facet.value === value)?.count
  assert.equal(count(facets.types, "primary-care"), 3)
  assert.equal(count(facets.types, "vaccination"), 2)
  assert.equal(count(facets.types, "emergency-room"), 2)
  assert.equal(count(facets.types, "spaying-neutering"), 1)
  assert.equal(count(facets.provinces, "AR-C"), 7, "the places counted are the visible ones")
  assert.equal(places.quickFilterHasData("mental-health", shown()), false)
  assert.equal(places.quickFilterHasData("animal-health", shown()), true)
  // every combination of one word and one quick filter shows only documented services
  for (const word of ["", ...hidden, "cesac", "gratis", "vacunacion", "castracion", "guardia"]) {
    for (const filterId of ["all", "medical", "mental-health", "sexual-health", "vaccination", "dentistry", "emergency", "animal-health"]) {
      for (const { place, services } of shown({ text: word, filterId })) for (const service of services) assert.ok(isVerifiedFree(place, service), `${word}/${filterId}: ${place.id}/${service.id}`)
    }
  }
})

test("cards and panel show only documented prestaciones, with their conditions, sources and the approximate-location note", () => {
  const entries = shown()
  const card = (id) => text(renderToStaticMarkup(createElement(MemoryRouter, null, createElement(PlaceCard, { entry: entries.find(({ place }) => place.id === id), onOpen() {} }))))
  const panel = (id) => text(renderToStaticMarkup(createElement(PlaceDetail, { entry: entries.find(({ place }) => place.id === id), onClose() {} })))
  for (const id of idsOf(entries)) {
    for (const html of [card(id), panel(id)]) {
      assert.ok(!/no confirmada|sin confirmar|La fuente no informa el costo|más con gratuidad/i.test(html), `${id}: no mention of unconfirmed prestaciones`)
    }
  }
  const cesac47 = card("cesac-47")
  assert.ok(/Medicina general/.test(cesac47) && /Pediatría/.test(cesac47))
  assert.ok(!/Psicología|Psiquiatría|Obstetricia|Odontología|Vacunación|Farmacia|VIH|Anticonce/i.test(cesac47), "CeSAC 47 shows only primary care and pediatrics")
  const cesac3 = panel("cesac-3")
  assert.ok(!/Odontolog|Salud mental|Anticonce|Ecograf|Farmacia|bVIHb|bIVEb/i.test(cesac3), cesac3.match(/Odontolog|Salud mental|Anticonce|Ecograf|Farmacia|bVIHb|bIVEb/i)?.[0])
  assert.ok(cesac3.includes("Gratuita con condiciones") && cesac3.includes("La gratuidad alcanza a las vacunas del Calendario Nacional"), "the condition stays")
  assert.ok(!cesac3.includes("Fuentes oficiales") && cesac3.includes("están en Sobre AuxiliAR"), "the sources are in Sobre AuxiliAR")
  const vet = panel("centro-fijo-veterinario-costanera-sur")
  assert.ok(vet.includes("Ubicación aproximada en el mapa") && vet.includes("cuenta miBA") && vet.includes("están en Sobre AuxiliAR"))
  // gratuity is not a promise of turns, stock or availability
  assert.ok(!/siempre hay turno|turnos garantizados/i.test(vet), "gratuity does not promise turns (the page that explains the turn, saying it does not confirm availability, is in Sobre AuxiliAR)")
  assert.ok(/Todavía no tenemos|consultá antes de ir|llamá antes de ir/.test(cesac3), "hours and availability are not promised")
})

test("the explorer applies the policy in one place, and nothing else reads the places without it", async () => {
  const explorer = await readFile(join(root, "src/components/places/PlacesExplorer/PlacesExplorer.tsx"), "utf8")
  assert.match(explorer, /\{ \.\.\.embeddedScope, confirmedOnly: true \}/)
  assert.ok(!explorer.includes("FreeFilter"), "no 'solo gratuidad' filter: everything shown already is")
  // no other component or screen builds results from the places: a new one has to go through the explorer or be reviewed
  const callers = []
  const walk = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) await walk(path)
      else if (/\.(ts|tsx)$/.test(entry.name) && /\b(selectPlaces|getPlaceEntries|filterPlaces|getCurrentPlaces)\(/.test(await readFile(path, "utf8"))) callers.push(path.slice(root.length + 5).replace(/\\/g, "/"))
    }
  }
  await walk(join(root, "src"))
  assert.deepEqual(callers.sort(), ["components/places/PlacesExplorer/PlacesExplorer.tsx", "content/categories/About/About.sources.ts", "data/resources/index.ts", "utils/places/filters.ts"])
})

test("the transparency: no header line under the map, one secondary link at the end, and the texts say the new policy", async () => {
  const section = await readFile(join(root, "src/content/categories/HealthCenters/sections/Section1/Section1.content.tsx"), "utf8")
  assert.ok(!section.includes("incorporados de a poco"))
  assert.match(section, /intro=\{null\}/)
  const about = await readFile(join(root, "src/content/categories/About/About.points.ts"), "utf8")
  for (const piece of ["solo las prestaciones cuya gratuidad una fuente oficial confirma", "no podemos confirmar que es gratuita", "no asegura que haya turnos"]) assert.ok(about.includes(piece), piece)
  assert.ok(!/no escribimos ni «gratuito» ni «arancelado»/.test(about), "the old text about prestaciones with no cost said is gone: they are not shown")
})
