/*
 * Tests of the places map (Salud física → Centros de atención → "Lista | Mapa"), loaded through Vite like the app.
 * The map itself is Leaflet in the browser; here we test what decides what it shows and how the explorer behaves.
 *   npm run places:test
 */
import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const readJson = async (file) => JSON.parse(await readFile(file, "utf8"))
const realPlaces = (await readJson(join(root, "src/data/resources/places/ar-c.json"))).resources
// These tests are about HOW the map treats a place with and without a verified point. The first batch had three hospitals without
// coordinates; the data now has them (reprojected by the curation pipeline), so that case is built here explicitly instead of
// depending on the state of the dataset. The test "with the real data" below checks what is published today.
const WITHOUT_POINT = new Set(["hospital-oftalmologico-santa-lucia", "hospital-odontologia-carrillo", "hospital-odontologia-duenas"])
const places = realPlaces.map((place) => {
  if (!WITHOUT_POINT.has(place.id)) return place
  const { coordinates: _coordinates, ...rest } = place
  return rest
})

const { createServer } = await import("vite")
const vite = await createServer({ root, logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())
const { createElement } = await import("react")
const { renderToStaticMarkup } = await import("react-dom/server")
const { MemoryRouter } = await import("react-router")
const util = await vite.ssrLoadModule("/src/utils/places/index.ts")
const { PlacesExplorer } = await vite.ssrLoadModule("/src/components/places/PlacesExplorer/index.ts")
const { PlacesMapView } = await vite.ssrLoadModule("/src/components/places/PlacesMapView/index.ts")
const { PlaceCard } = await vite.ssrLoadModule("/src/components/places/PlaceCard/index.ts")
const { MAP_TILES, LEAFLET_PREFIX } = await vite.ssrLoadModule("/src/data/mapTiles.ts")

const DAY = "2026-10-08"
const SCOPE = { category: "salud-fisica" }
const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const entries = (filterId = "all", query = "") => util.filterPlaces(places, DAY, { query, filterId, scope: SCOPE })
const pinIds = (list) => util.getMapPins(list).map(({ id }) => id).sort()
const renderAt = (url, element) => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, element))
const explorer = (props) => createElement(PlacesExplorer, { scope: SCOPE, filters: ["medical", "vaccination", "dentistry", "emergency"], ...props })

/* ── Data: what gets a pin ── */

test("only places with verified coordinates get a pin; the rest stay in the list", () => {
  const all = entries()
  assert.equal(all.length, 6)
  // the three CeSACs have verified coordinates from the official dataset; the three hospitals have none yet
  assert.deepEqual(pinIds(all), ["cesac-3", "cesac-41", "cesac-47"])
  assert.equal(util.countUnmapped(all), 3)
  for (const pin of util.getMapPins(all)) {
    const place = places.find(({ id }) => id === pin.id)
    assert.equal(place.coordinates.status, "verified")
    assert.equal(pin.lat, place.coordinates.lat)
    assert.equal(pin.lng, place.coordinates.lng)
  }
  for (const id of ["hospital-oftalmologico-santa-lucia", "hospital-odontologia-carrillo", "hospital-odontologia-duenas"]) {
    assert.equal(places.find((place) => place.id === id).coordinates, undefined, `${id} has no coordinates: it gets no pin and none is guessed`)
    assert.ok(all.some(({ place }) => place.id === id), `${id} stays in the list`)
  }
})

test("a candidate (unverified) point is never drawn, and a place without one never gets one", () => {
  const candidate = structuredClone(places.find(({ id }) => id === "cesac-3"))
  candidate.coordinates.status = "unverified"
  const none = structuredClone(places.find(({ id }) => id === "cesac-41"))
  delete none.coordinates
  const broken = structuredClone(places.find(({ id }) => id === "cesac-47"))
  broken.coordinates.lat = Number.NaN
  const list = util.getPlaceEntries([candidate, none, broken], DAY, "all", SCOPE)
  assert.equal(list.length, 3, "all three are still in the list")
  assert.deepEqual(util.getMapPins(list), [])
  assert.equal(util.countUnmapped(list), 3)
})

test("the map and the list share the search and the filters", () => {
  // the same results feed both: what is on the map is a subset of what the list shows
  for (const [filterId, query, expectedPins, expectedList] of [
    ["all", "", 3, 6],
    ["vaccination", "", 3, 3],
    ["dentistry", "", 3, 3],
    ["medical", "", 3, 3],
    ["emergency", "", 0, 3],
    ["all", "la boca", 1, 1],
    ["all", "santa lucia", 0, 1],
    ["emergency", "odontol", 0, 2],
    ["all", "zzzz", 0, 0],
  ]) {
    const list = entries(filterId, query)
    assert.equal(list.length, expectedList, `${filterId}/${query} list`)
    assert.equal(util.getMapPins(list).length, expectedPins, `${filterId}/${query} pins`)
    for (const id of pinIds(list)) assert.ok(list.some(({ place }) => place.id === id), `${id} is in the list too`)
  }
  assert.deepEqual(pinIds(entries("all", "la boca")), ["cesac-41"])
})

test("with the real data: every current place has a verified point; the hospitals' are reprojected from the official dataset", () => {
  const all = util.filterPlaces(realPlaces, DAY, { query: "", filterId: "all", scope: SCOPE })
  assert.equal(all.length, 6)
  assert.deepEqual(pinIds(all), ["cesac-3", "cesac-41", "cesac-47", "hospital-odontologia-carrillo", "hospital-odontologia-duenas", "hospital-oftalmologico-santa-lucia"])
  assert.equal(util.countUnmapped(all), 0)
  for (const pin of util.getMapPins(all)) {
    const place = realPlaces.find(({ id }) => id === pin.id)
    assert.equal(place.coordinates.status, "verified")
    assert.ok(["official-dataset", "official-dataset-reprojected"].includes(place.coordinates.method))
    assert.equal(pin.lat, place.coordinates.lat)
    assert.equal(pin.lng, place.coordinates.lng)
  }
  const emergency = util.filterPlaces(realPlaces, DAY, { query: "", filterId: "emergency", scope: SCOPE })
  assert.equal(util.getMapPins(emergency).length, 3, "the guardias (3 hospitals) are now on the map")
})

/* ── Explorer: Lista | Mapa ── */

test("the explorer offers Lista | Mapa only when asked, and keeps search and filters when it changes", () => {
  const withMap = renderAt("/temas/salud-fisica?seccion=section-1", explorer({ map: true }))
  assert.match(withMap, /aria-pressed="true"[^>]*>(?:<svg[^>]*>.*?<\/svg>)?Lista</)
  assert.match(withMap, /aria-pressed="false"[^>]*>(?:<svg[^>]*>.*?<\/svg>)?Mapa</)
  assert.ok(text(withMap).includes("Lista Mapa"))
  // an explorer without the map has no switch, and ?vista=mapa does nothing
  const without = renderAt("/x?vista=mapa", explorer({}))
  assert.ok(!text(without).includes("Mapa"))
  // ?vista=mapa opens the map; the search and the filter of the URL are still there
  const map = renderAt("/x?vista=mapa&filtro=emergency&buscar=oftalm", explorer({ map: true }))
  assert.match(map, /aria-pressed="true"[^>]*>(?:<svg[^>]*>.*?<\/svg>)?Mapa</)
  assert.match(map, /value="oftalm"/)
  assert.ok(text(map).includes("Tipo: Guardias"), "the filter of the link shows as an active filter")
  const list = renderAt("/x?filtro=emergency&buscar=oftalm", explorer({ map: true }))
  assert.match(list, /value="oftalm"/)
  assert.ok(text(list).includes("Tipo: Guardias") && text(list).includes("Borrar filtros"))
})

/* ── Map view states ── */

test("map view: pins for what has them, a clear note for what doesn't, a way back to the list", () => {
  const html = renderToStaticMarkup(createElement(PlacesMapView, { entries: entries(), onOpen() {}, onBackToList() {} }))
  const page = text(html)
  assert.ok(page.includes("Cargando mapa"), "the map is loaded on demand (lazy): a placeholder shows first")
  assert.ok(page.includes("3 lugares no tienen una ubicación verificada y no aparecen en el mapa."))
  assert.ok(page.includes("Verlos en la lista"))
  assert.ok(page.includes("Tocá un punto del mapa"))
  // all mapped: no note about missing places
  const mapped = text(renderToStaticMarkup(createElement(PlacesMapView, { entries: entries("all", "la boca"), onOpen() {}, onBackToList() {} })))
  assert.ok(!mapped.includes("no tienen una ubicación") && !mapped.includes("no tiene una ubicación"))
})

test("map view: when nothing can be mapped it says so and offers the list", () => {
  const html = renderToStaticMarkup(createElement(PlacesMapView, { entries: entries("emergency"), onOpen() {}, onBackToList() {} }))
  const page = text(html)
  assert.ok(page.includes("Ninguno de estos lugares se puede mostrar en el mapa."))
  assert.ok(page.includes("Estos 3 lugares todavía no tienen una ubicación verificada."))
  assert.ok(page.includes("Volver a la lista"))
  assert.ok(!page.includes("Cargando mapa"), "no map is loaded for nothing")
  const one = text(renderToStaticMarkup(createElement(PlacesMapView, { entries: entries("all", "santa lucia"), onOpen() {}, onBackToList() {} })))
  assert.ok(one.includes("Este lugar todavía no tiene una ubicación verificada."))
})

/* ── Opening the place from the map ── */

test("the summary of a pin is the same card as the list, and its button opens the full information", () => {
  const entry = entries("all", "la boca")[0]
  const opened = []
  // PlaceCard has no hooks: calling it gives its element tree, where we find the "Ver información" button
  const tree = PlaceCard({ entry, onOpen: (id) => opened.push(id) })
  const findButton = (node) => {
    if (!node || typeof node !== "object") return null
    if (node.type === "button" && node.props["data-place-trigger"]) return node
    const children = node.props?.children
    for (const child of Array.isArray(children) ? children : [children]) {
      const found = findButton(child)
      if (found) return found
    }
    return null
  }
  const button = findButton(tree)
  assert.ok(button, "the card has its button")
  assert.equal(button.props["data-place-trigger"], "cesac-41", "focus returns to it when the panel closes")
  button.props.onClick()
  assert.deepEqual(opened, ["cesac-41"])
  // and it shows the same summary as in the list
  const html = text(renderToStaticMarkup(createElement(PlaceCard, { entry, onOpen() {} })))
  assert.ok(html.includes("Ministro Brin 843, La Boca") && html.includes("Ver información"))
})

/* ── Map configuration and rules ── */

test("the tiles are configured apart (OpenStreetMap for the pilot) and the attribution is always on", async () => {
  assert.equal(MAP_TILES.name, "OpenStreetMap")
  assert.match(MAP_TILES.url, /\{z\}\/\{x\}\/\{y\}/)
  assert.ok(MAP_TILES.attribution.includes("OpenStreetMap") && MAP_TILES.attribution.includes("copyright"))
  assert.ok(LEAFLET_PREFIX.includes("Leaflet"))
  const map = await readFile(join(root, "src/components/places/PlacesMap/PlacesMap.tsx"), "utf8")
  // the component knows no provider: changing it is editing src/data/mapTiles.ts
  assert.ok(map.includes('from "@/data/mapTiles"'))
  assert.ok(!/openstreetmap|googleapis|mapbox|maptiler|carto/i.test(map.replace(/@\/data\/mapTiles/, "")))
  // attribution: own control, always there, at the bottom left (Auxi is at the bottom right)
  assert.match(map, /attributionControl:\s*false/)
  assert.match(map, /position:\s*"bottomleft"[^}]*prefix:\s*LEAFLET_PREFIX/)
  const css = await readFile(join(root, "src/components/places/PlacesMap/PlacesMap.css"), "utf8")
  assert.match(css, /\.places-map \.leaflet-control-attribution/)
  assert.match(css, /width:\s*44px/)
})

test("Leaflet 1.9.4 in our own wrapper, no react-leaflet, no other map or location services", async () => {
  const pkg = await readJson(join(root, "package.json"))
  assert.equal(pkg.dependencies.leaflet, "1.9.4")
  assert.ok(!pkg.dependencies["react-leaflet"] && !pkg.devDependencies?.["react-leaflet"])
  const dir = join(root, "src/components/places")
  const files = []
  const walk = async (folder) => {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const path = join(folder, entry.name)
      if (entry.isDirectory()) await walk(path)
      else files.push(path)
    }
  }
  await walk(dir)
  for (const file of files) {
    const source = await readFile(file, "utf8")
    assert.ok(!/google\.com\/maps|maps\.google|goo\.gl\/maps|maps\.apple|geo:/i.test(source), `${file}: no external map links`)
    assert.ok(!/navigator\.geolocation|localStorage|sessionStorage/.test(source), `${file}: no location, nothing stored`)
    assert.ok(!/geocod|nominatim/i.test(source.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "")), `${file}: nothing is geocoded in the browser`)
  }
})

/* ── The pin says what it is and what it is for ── */

// what the explorer shows: only the services of documented gratuity (confirmedOnly), as in its cards
const shown = () => util.filterPlaces(places, DAY, { query: "", filterId: "all", scope: { ...SCOPE, confirmedOnly: true } })

test("each pin carries its short kind and what it is for (at most three services), and says nothing the card does not say", () => {
  const pins = util.getMapPins(shown())
  assert.ok(pins.length >= 3)
  for (const pin of pins) {
    assert.ok(pin.kind && pin.kind.length < 40 && !pin.kind.includes("("), `${pin.id}: short kind`)
    assert.ok(pin.purpose.length > 0, `${pin.id}: has a purpose`)
    assert.ok(pin.purpose.split(", ").length <= 3 + 1, `${pin.id}: at most three, then "y N más"`)
  }
  const cesac3 = pins.find(({ id }) => id === "cesac-3")
  assert.equal(cesac3.kind, "Centro de salud")
  // the purpose is made of the services of the card (the ones with documented gratuity), nothing else
  const entry = shown().find(({ place }) => place.id === "cesac-3")
  for (const service of entry.services) assert.ok(cesac3.purpose.includes(util.serviceName(service)) || /y \d+ más/.test(cesac3.purpose), service.id)
  assert.ok(!/Odontolog|Psicolog|Farmacia|IVE/i.test(cesac3.purpose), "services without documented gratuity are not announced")
  // more than three: "y N más"
  const many = util.getMapPins([{ place: entry.place, services: [1, 2, 3, 4, 5].map((n) => ({ ...entry.services[0], name: `Servicio ${n}` })) }])
  assert.equal(many[0].purpose, "Servicio 1, Servicio 2, Servicio 3 y 2 más")
})

test("the map shows that in a tooltip when a pin is hovered or focused, built with text (not HTML), kept inside the map, and no native title repeats the name", async () => {
  const code = await readFile(join(root, "src/components/places/PlacesMap/PlacesMap.tsx"), "utf8")
  assert.ok(code.includes("bindTooltip") && code.includes('className: "places-tooltip"'))
  assert.ok(code.includes("textContent") && !/innerHTML/.test(code.replace(/^\s*(\/\/|\*|\/\*).*$/gm, "")), "text nodes, never HTML")
  assert.ok(code.includes('addEventListener("focus"') && code.includes("openTooltip") && code.includes('addEventListener("blur"'), "the keyboard sees it too")
  assert.ok(code.includes('"tooltipopen"'), "moved sideways at the edges")
  assert.ok(!/title:\s*pin\.name/.test(code), "no native title next to the tooltip")
  assert.ok(code.includes("aria-label") && code.includes("pin.kind") && code.includes("pin.purpose"), "screen readers get the same words")
  const css = await readFile(join(root, "src/components/places/PlacesMap/PlacesMap.css"), "utf8")
  assert.ok(css.includes(".places-tooltip") && css.includes("max-content"))
})

/* ── The symbol of each pin, by category ── */

test("the pin takes its category from the services of the place: Salud general wins, otherwise the single category, otherwise a fixed order", () => {
  const svc = (...categories) => ({ categories })
  assert.equal(util.pinCategory([svc("salud-fisica"), svc("salud-mental"), svc("esi")]), "salud-fisica", "a centro de salud with mental and sexual health care is Salud general")
  assert.equal(util.pinCategory([svc("salud-mental")]), "salud-mental")
  assert.equal(util.pinCategory([svc("esi"), svc("salud-mental")]), "salud-mental", "no Salud general: the fixed order")
  assert.equal(util.pinCategory([svc("esi")]), "esi")
  assert.equal(util.pinCategory([svc("animales")]), "animales")
  assert.equal(util.pinCategory([]), "salud-fisica", "a pin never has an empty head")
  // the real pins: the three CeSAC and the guardias are Salud general, the veterinary centre is Animales
  const byId = Object.fromEntries(util.getMapPins(shown()).map((pin) => [pin.id, pin.category]))
  for (const id of ["cesac-3", "cesac-41", "cesac-47"]) assert.equal(byId[id], "salud-fisica", id)
  if (byId["centro-fijo-veterinario-costanera-sur"]) assert.equal(byId["centro-fijo-veterinario-costanera-sur"], "animales")
})

test("each category has its own drawing inside the pin, centered in its head, and the 'Prestación' selector is no longer shown", async () => {
  const glyphs = await vite.ssrLoadModule("/src/components/places/PlacesMap/PlacesMap.glyphs.ts")
  const drawn = ["salud-fisica", "salud-mental", "esi", "animales"].map((category) => JSON.stringify(glyphs.glyphOf(category)))
  assert.equal(new Set(drawn).size, 4, "four different symbols")
  assert.ok(glyphs.glyphOf("animales").circles.length === 3 && glyphs.glyphOf("animales").paths.length === 1, "the paw: a pad and three toes")
  assert.deepEqual(glyphs.glyphOf("recursos"), glyphs.glyphOf("salud-fisica"), "any other category falls back to the general symbol")
  const code = await readFile(join(root, "src/components/places/PlacesMap/PlacesMap.tsx"), "utf8")
  // the head of the pin is the circle of radius 8 at (12, 10): the symbol is scaled to 11 units and centered there
  assert.ok(code.includes("a8 8 0 0 1 16 0") && code.includes('translate(6.48 4.48) scale(0.46)'))
  assert.ok(code.includes("glyphOf(category)") && code.includes("pin.category") && code.includes("pinIcon(pin.category, false)"))
  // the selector of "Prestación" is hidden from the explorer, and the map explains its symbols
  const explorerSource = await readFile(join(root, "src/components/places/PlacesExplorer/PlacesExplorer.tsx"), "utf8")
  assert.ok(!/<ServiceTypeFilter/.test(explorerSource) && !explorerSource.includes('from "../ServiceTypeFilter"'))
  const html = renderAt("/centros", explorer({ map: true }))
  assert.ok(!text(html).includes("Prestación"), "no 'Prestación' selector")
  const view = await readFile(join(root, "src/components/places/PlacesMapView/PlacesMapView.tsx"), "utf8")
  assert.ok(view.includes("Qué significa el símbolo de cada punto") && view.includes("categoryLabel(category)"))
})

test("the zoom buttons (+ and -) are on the right of the map, 44px, and the attribution stays at the bottom left", async () => {
  const code = await readFile(join(root, "src/components/places/PlacesMap/PlacesMap.tsx"), "utf8")
  assert.ok(code.includes("zoomControl: false") && code.includes('L.control.zoom({ position: "topright" })'), "Leaflet's own top-left control is off; ours is top right")
  assert.ok(code.includes('L.control.attribution({ position: "bottomleft"'), "the attribution does not move")
  const css = await readFile(join(root, "src/components/places/PlacesMap/PlacesMap.css"), "utf8")
  assert.ok(/\.leaflet-bar a[^{]*\{[^}]*width: 44px;[^}]*height: 44px/.test(css), "still 44px")
})
