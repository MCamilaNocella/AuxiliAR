/*
 * Tests of Centros de atención (/centros): the category that opens on the Mapa AuxiliAR, the link other pages use to
 * get there with a filter and a search, and which view opens. Loaded through Vite like the app does.
 *   npm run places:test
 */
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const { createServer } = await import("vite")
const vite = await createServer({ root, logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())

const { createElement } = await import("react")
const { renderToStaticMarkup } = await import("react-dom/server")
const { MemoryRouter } = await import("react-router")
const { PLACE_FILTERS, resolveView } = await vite.ssrLoadModule("/src/utils/places/index.ts")
const { centersLink } = await vite.ssrLoadModule("/src/router/centersLink.ts")
const { PATHS } = await vite.ssrLoadModule("/src/router/paths.ts")
const { PlacesExplorer } = await vite.ssrLoadModule("/src/components/places/PlacesExplorer/index.ts")
const { HEALTH_CENTERS } = await vite.ssrLoadModule("/src/content/categories/HealthCenters/HealthCenters.ts")
const { ALL_CATEGORIES } = await vite.ssrLoadModule("/src/content/categories/index.ts")
const Map = (await vite.ssrLoadModule("/src/content/categories/HealthCenters/sections/Section1/Section1.content.tsx")).default
const Data = (await vite.ssrLoadModule("/src/content/categories/HealthCenters/sections/Section2/Section2.content.tsx")).default

const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const render = (component, url = "/centros") => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(component)))

test("centros de atención: two sections, the first one is the Mapa AuxiliAR and it opens by default", () => {
  assert.equal(HEALTH_CENTERS.to, PATHS.centers)
  assert.deepEqual(HEALTH_CENTERS.sections.map(({ title }) => title), ["Mapa AuxiliAR", "Sobre los datos"])
  assert.equal(HEALTH_CENTERS.defaultSectionId, "section-1")
  assert.ok(HEALTH_CENTERS.sections.some(({ id }) => id === HEALTH_CENTERS.defaultSectionId))
  // only this category opens on a section
  assert.deepEqual(ALL_CATEGORIES.filter((category) => category.defaultSectionId).map(({ id }) => id), ["centros"])
})

test("the category screen opens the default section without a portada, and still honors ?seccion=", async () => {
  const source = await readFile(join(root, "src/screens/RenderCategory/Category.tsx"), "utf8")
  assert.match(source, /\?\? category\?\.sections\.find\(\(\{ id \}\) => id === category\.defaultSectionId\)/)
})

test("mapa auxiliar: one emergency line that points to the emergency numbers, no alert block", () => {
  const html = render(Map)
  const content = text(html)
  assert.ok(content.includes("Si hay riesgo inmediato, no busques un centro"))
  assert.equal([...html.matchAll(/mirá los números de emergencia/g)].length, 1)
  assert.ok(!html.includes("bg-alert-soft"))
  // the explorer comes with the transparency note and every kind of care as a quick filter
  assert.ok(content.includes("Centros verificados por AuxiliAR. Estamos incorporando establecimientos progresivamente."))
  assert.match(content, /Todos Atención médica Salud mental Salud sexual Vacunación Odontología Guardias/)
  // list and map are both offered
  assert.ok(content.includes("Lista") && content.includes("Mapa"))
})

test("mapa auxiliar: the map is on and no category is left out of it", async () => {
  const section = await readFile(join(root, "src/content/categories/HealthCenters/sections/Section1/Section1.content.tsx"), "utf8")
  assert.match(section, /<PlacesExplorer[^>]*\smap\b/)
  assert.ok(!/scope=/.test(section), "no scope: every category is shown")
})

test("sobre los datos: says what is shown, where it comes from and what is never assumed", () => {
  const content = text(render(Data))
  for (const piece of ["Solo lo verificado", "De dónde sale", "no damos por hecho", "Un lugar sin ubicación verificada aparece solo en la lista", "Ciudad de Buenos Aires"]) {
    assert.ok(content.includes(piece), piece)
  }
})

test("which view opens: the URL first, then the map on large screens and the list on phones", () => {
  const cases = [
    [{ hasMap: true, requested: null, isDesktop: true }, "map"],
    [{ hasMap: true, requested: null, isDesktop: false }, "list"],
    [{ hasMap: true, requested: "lista", isDesktop: true }, "list"],
    [{ hasMap: true, requested: "mapa", isDesktop: false }, "map"],
    [{ hasMap: true, requested: "otra-cosa", isDesktop: true }, "map"],
    [{ hasMap: false, requested: "mapa", isDesktop: true }, "list"],
  ]
  for (const [input, expected] of cases) assert.equal(resolveView(input), expected, JSON.stringify(input))
})

test("the link other pages use opens the explorer with the search and filter it asks for", () => {
  const url = centersLink({ filter: "emergency", query: "oftalm" })
  assert.equal(url, "/centros?filtro=emergency&buscar=oftalm")
  assert.equal(centersLink(), "/centros")
  const html = render(() => createElement(PlacesExplorer, { filters: ["medical", "emergency"] }), url)
  assert.match(html, /value="oftalm"/)
  assert.match(html, /aria-pressed="true"[^>]*>Guardias</)
  assert.match(html, /aria-pressed="false"[^>]*>Todos</)
  // a filter this context doesn't have is ignored
  const other = render(() => createElement(PlacesExplorer, { filters: ["medical"] }), "/x?filtro=dentistry")
  assert.match(other, /aria-pressed="true"[^>]*>Todos</)
  // the view asked for in the URL is the one that opens (without a map there is only the list)
  const map = render(() => createElement(PlacesExplorer, { map: true }), "/centros?vista=mapa")
  assert.match(map, /aria-pressed="true"[^>]*>(?:<[^>]+>)*Mapa</)
  const list = render(() => createElement(PlacesExplorer, { map: true }), "/centros?vista=lista")
  assert.match(list, /aria-pressed="true"[^>]*>(?:<[^>]+>)*Lista</)
  // no ?vista= on a phone-sized render (a server has no wide screen): the list
  assert.match(render(() => createElement(PlacesExplorer, { map: true }), "/centros"), /aria-pressed="true"[^>]*>(?:<[^>]+>)*Lista</)
})

test("the filters that other pages link to exist in the explorer", () => {
  const ids = PLACE_FILTERS.map(({ id }) => id)
  for (const id of ["medical", "mental-health", "sexual-health", "vaccination", "dentistry", "emergency"]) assert.ok(ids.includes(id), id)
})
