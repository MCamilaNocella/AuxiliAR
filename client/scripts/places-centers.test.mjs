/*
 * Tests of the way into the places explorer from a link: the filter and the search a link asks for, and the filters
 * that the other sections of AuxiliAR send people to. Loaded through Vite like the app does.
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
const { PlacesExplorer } = await vite.ssrLoadModule("/src/components/places/PlacesExplorer/index.ts")

const render = (component, url) => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(component)))

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

test("the filters that the other sections of AuxiliAR link to exist", () => {
  // Controles de salud and the Quiz send people to the places with these filters
  const ids = PLACE_FILTERS.map(({ id }) => id)
  for (const id of ["medical", "vaccination", "dentistry", "emergency"]) assert.ok(ids.includes(id), id)
})
