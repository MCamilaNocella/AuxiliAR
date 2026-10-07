/*
 * Tests of the "Centros de atención" section of Salud física: the text that comes before the explorer, the way in
 * with a filter and a search from other pages, and its links. Loaded through Vite like the app does.
 *   npm run places:test
 */
import assert from "node:assert/strict"
import { dirname, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const { createServer } = await import("vite")
const vite = await createServer({ root: resolve(here, ".."), logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())

const { createElement } = await import("react")
const { renderToStaticMarkup } = await import("react-dom/server")
const { MemoryRouter } = await import("react-router")
const { PLACE_FILTERS, physicalCentersLink } = await vite.ssrLoadModule("/src/utils/places/index.ts")
const Section1 = (await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/sections/Section1/Section1.content.tsx")).default
const { PlacesExplorer } = await vite.ssrLoadModule("/src/components/places/PlacesExplorer/index.ts")

const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const render = (component, url = "/temas/salud-fisica") => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(component)))

test("centros de atención: explains where to go before the explorer, with the transparency note", () => {
  const content = text(render(Section1))
  assert.ok(content.indexOf("¿Dónde me conviene atenderme?") < content.indexOf("Encontrá un centro"))
  for (const piece of ["Centro de salud (CeSAC)", "Hospital", "Guardia", "Emergencia", "controles", "especialidades", "atención en el momento", "riesgo inmediato", "número de emergencias de tu localidad", "Ver números de emergencia"]) {
    assert.ok(content.includes(piece), piece)
  }
  // the emergency number depends on where you are: it isn't written here
  assert.ok(!render(Section1).includes("tel:107"))
  assert.ok(content.includes("Centros verificados por AuxiliAR. Estamos incorporando establecimientos progresivamente."))
  // the chips of this context only
  assert.match(content, /Todos Atención médica Vacunación Odontología Guardias/)
  assert.ok(!content.includes("Salud mental"))
})

test("the explorer opens with the search and filter a link asks for", () => {
  const url = physicalCentersLink({ filter: "emergency", query: "oftalm" })
  assert.equal(url, "/temas/salud-fisica?seccion=section-1&filtro=emergency&buscar=oftalm")
  const html = render(() => createElement(PlacesExplorer, { scope: { category: "salud-fisica" }, filters: ["medical", "emergency"] }), url)
  assert.match(html, /value="oftalm"/)
  assert.match(html, /aria-pressed="true"[^>]*>Guardias</)
  assert.match(html, /aria-pressed="false"[^>]*>Todos</)
  // a filter this context doesn't have is ignored
  const other = render(() => createElement(PlacesExplorer, { filters: ["medical"] }), "/x?filtro=dentistry")
  assert.match(other, /aria-pressed="true"[^>]*>Todos</)
})

test("the filters that the other sections of Salud física link to exist", () => {
  // Controles de salud and the Quiz send people here with these filters (see feature/salud-general-content)
  const ids = PLACE_FILTERS.map(({ id }) => id)
  for (const id of ["medical", "vaccination", "dentistry", "emergency"]) assert.ok(ids.includes(id), id)
})

test("every internal link of Centros de atención points somewhere real", () => {
  const filterIds = PLACE_FILTERS.map(({ id }) => id)
  const hrefsIn = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1].replace(/&amp;/g, "&"))
  const html = render(Section1)
  const links = [...new Set(hrefsIn(html))].filter((href) => href.startsWith("/"))
  for (const href of links) {
    const url = new URL(href, "http://x")
    assert.equal(url.pathname, "/temas/salud-fisica", `${href}: no route`)
    const section = url.searchParams.get("seccion")
    if (section) assert.ok(["section-1", "section-2", "section-3", "section-4"].includes(section), `${href}: section`)
    const filter = url.searchParams.get("filtro")
    if (filter) assert.ok(filterIds.includes(filter), `${href}: filter`)
    if (url.searchParams.has("buscar")) assert.ok(url.searchParams.get("buscar").length > 2, `${href}: search`)
  }
  // phone links are real numbers
  for (const [, tel] of html.matchAll(/href="tel:([^"]+)"/g)) assert.match(tel, /^\+?\d{3,}$/)
})
