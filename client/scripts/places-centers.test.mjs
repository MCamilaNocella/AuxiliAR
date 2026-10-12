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
const About = (await vite.ssrLoadModule("/src/content/categories/About/sections/Section1/Section1.content.tsx")).default

const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const render = (component, url = "/centros") => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(component)))

test("centros de atención: one section, the Mapa AuxiliAR, and it opens by default (the explanation of the data is in Sobre AuxiliAR)", () => {
  assert.equal(HEALTH_CENTERS.to, PATHS.centers)
  assert.deepEqual(HEALTH_CENTERS.sections.map(({ title }) => title), ["Mapa AuxiliAR"])
  assert.equal(HEALTH_CENTERS.defaultSectionId, "section-1")
  assert.ok(HEALTH_CENTERS.sections.some(({ id }) => id === HEALTH_CENTERS.defaultSectionId))
  // only these open straight on a section: the map, Cuidar mi salud (its controls), Salud mental (where to ask for help), Salud sexual y ESI (where to look for care), Atención veterinaria (campaigns), Primeros auxilios (the guides), Sobre AuxiliAR (one page) and Más recursos (its rights)
  assert.deepEqual(ALL_CATEGORIES.filter((category) => category.defaultSectionId).map(({ id }) => id), ["centros", "salud-fisica", "salud-mental", "esi", "animales", "primeros-auxilios", "sobre-auxiliar", "recursos"])
})

test("the category screen opens the default section without a portada, and still honors ?seccion=", async () => {
  const source = await readFile(join(root, "src/screens/RenderCategory/Category.tsx"), "utf8")
  assert.match(source, /\?\? sections\.find\(\(\{ id \}\) => id === defaultSectionId\)/)
  assert.match(source, /const defaultSectionId = category\.preparing \? PREPARING_SECTION\.id : category\.defaultSectionId/)
})

test("mapa auxiliar: one emergency line that points to the emergency numbers, no alert block", () => {
  const html = render(Map)
  const content = text(html)
  assert.ok(content.includes("Si hay riesgo inmediato, no busques un centro"))
  assert.equal([...html.matchAll(/mirá los números de emergencia/g)].length, 1)
  assert.ok(!html.includes("bg-alert-soft"))
  // no transparency line under the heading and no link to a verification page: the sources of the whole site are in Sobre AuxiliAR
  assert.ok(!content.includes("Centros verificados por AuxiliAR, incorporados de a poco."))
  assert.ok(!content.includes("Cómo verificamos los datos"))
  assert.ok(!html.includes('href="/centros?seccion=section-2"'))
  // the kinds of care and services come from the data (category chips, service select); the quick chips of before are gone
  // the filters live in a panel (always open on large screens, folded on phones: the server renders the phone's): the search, the view and the button are in sight
  assert.ok(content.includes("¿Qué necesitás?") && /<button[^>]*aria-expanded="false"[^>]*aria-controls=[^>]*>/.test(html) && content.includes("Filtros"))
  assert.ok(!html.includes("<select"), "folded: no selects until the panel is opened")
  assert.ok(!content.includes("Todos Atención médica"))
  // list and map are both offered
  assert.ok(content.includes("Lista") && content.includes("Mapa"))
})

test("mapa auxiliar: the map is on and no category is left out of it", async () => {
  const section = await readFile(join(root, "src/content/categories/HealthCenters/sections/Section1/Section1.content.tsx"), "utf8")
  assert.match(section, /<PlacesExplorer[^>]*\smap\b/)
  assert.ok(!/scope=/.test(section), "no scope: every category is shown")
})

test("sobre los datos: how it is verified, what free means, what the date means, why no result is not no service, sources and scope", async () => {
  const page = render(About, "/sobre-auxiliar")
  // the section starts at its heading and ends where the sources begin
  const html = page.slice(page.indexOf('id="about-datos"'), page.indexOf('aria-labelledby="about-sources"'))
  const content = text(html)
  // "Cómo verificamos" is plain text under the introduction (no disclosure); the other five points (four rules and "Fuentes y alcance", with the coverage) are disclosures that start closed
  const headings = [...html.matchAll(/<summary[^>]*>([^<]+)</g)].map((match) => match[1].trim())
  assert.equal([...html.matchAll(/<details/g)].length, 5)
  assert.ok(!/<details[^>]* open/.test(html), "all closed")
  assert.ok(content.includes("Sobre los datos del mapa"))
  assert.ok(!headings.includes("Cómo verificamos") && !text(page).includes("Cómo verificamos los datos"), "no tab or button called «Cómo verificamos»")
  assert.ok(content.indexOf("Estas son las reglas") < content.indexOf("una persona de AuxiliAR comprueba") && content.indexOf("una persona de AuxiliAR comprueba") < content.indexOf("Qué significa gratuito"), "its text is right under the introduction")
  assert.deepEqual(headings, ["Qué significa gratuito", "La fecha de verificación", "Si no aparece, no quiere decir que no exista", "En el mapa y en la lista", "Fuentes y alcance"])
  // verification: who, against what, when, and what happens when it is doubtful
  for (const piece of ["una persona de AuxiliAR comprueba sus datos contra una fuente oficial", "quién lo verificó, cuándo y de qué fuente", "La gratuidad, en cambio, siempre necesita la fuente propia de esa prestación", "deja de mostrarse hasta que se vuelva a revisar"]) assert.ok(content.includes(piece), piece)
  // free: per service, only when the source says so, conditions next to the service, and silence is not an answer
  for (const piece of ["solo cuando la fuente oficial lo dice para esa prestación en particular", "prestación por prestación, nunca por centro entero", "Con DNI argentino", "el mapa muestra solo las prestaciones cuya gratuidad una fuente oficial confirma", "no quiere decir que sea paga", "no asegura que haya turnos, vacunas o insumos disponibles"]) assert.ok(content.includes(piece), piece)
  assert.ok(!/todos? (los|sus) (servicios|prestaciones) (son|es) gratuit/i.test(content), "never says that everything in a center is free")
  // the date: the same words the panel of a place uses
  for (const piece of ["Verificada el…", "Se vuelve a revisar antes del…", "no asegura que nada haya cambiado"]) assert.ok(content.includes(piece), piece)
  // no result is not no service
  for (const piece of ["todavía no tenga su gratuidad confirmada por una fuente oficial", "No significa que el servicio no exista"]) assert.ok(content.includes(piece), piece)
  assert.ok(content.includes("Un lugar sin ubicación verificada aparece solo en la lista"))
  // sources and the real scope: the provinces named are the ones that have verified places today (names, never counts)
  const day = (await vite.ssrLoadModule("/src/data/resources/index.ts")).todayInArgentina()
  const { planLoad, provinceLabel } = await vite.ssrLoadModule("/src/utils/places/index.ts")
  const covered = planLoad({ day, province: null }).covered.map(provinceLabel)
  assert.ok(covered.length > 0 && content.includes("Hoy solo hay centros verificados en " + covered[0]) === (covered.length === 1))
  assert.ok(content.includes("datos abiertos del Gobierno de la Ciudad de Buenos Aires") && content.includes("En el resto del país todavía no tenemos cobertura"))
  assert.ok(!/[0-9]+ (lugares|centros|establecimientos)/.test(content), "no numbers of the index")
  // moved as it was, with nothing new: no link, no button and no emergency line (the emergency bar is always in sight); the button of Sobre AuxiliAR leads here
  assert.ok(content.includes("Mapa AuxiliAR") && !html.includes("<a ") && !html.includes("<button") && !content.includes("mirá los números de emergencia"))
  assert.ok(!page.includes('href="#about-datos"') && text(page).includes("Sobre los datos del mapa"), "the text is on the page; the button that led to it was removed")
})

test("the chat finds Encontrar atención and its sections: they have a summary and the generated index is up to date", async () => {
  const index = JSON.parse(await readFile(join(root, "../server/src/main/resources/content/content-index.json"), "utf8"))
  const byPath = (path) => index.find((page) => page.path === path)
  assert.ok(HEALTH_CENTERS.sections.every(({ summary }) => summary && summary.length > 40), "every section of the category has a summary")
  for (const section of HEALTH_CENTERS.sections) {
    const page = byPath(PATHS.centers + "?seccion=" + section.id)
    assert.ok(page, section.id + " is in the index")
    assert.equal(page.hasInfo, true)
    assert.equal(page.summary, section.summary, "the index is stale: run npm run content:index")
    assert.equal(page.title, "Encontrar atención › " + section.title)
  }
  const category = byPath(PATHS.centers)
  assert.equal(category.hasInfo, true)
  for (const section of HEALTH_CENTERS.sections) assert.ok(category.summary.includes(section.summary))
  // the summary of the map says where there is coverage today: when another province is added, it has to change
  assert.deepEqual(Object.keys((await vite.ssrLoadModule("/src/data/resources/index.ts")).COVERAGE), ["AR-B", "AR-C", "AR-F", "AR-T", "AR-X"], "the summary of the map names these provinces: update it when another is added")
})

test("the sections drawer of a category: closed it is invisible (out of the tab order and the reading order), open it is the menu", async () => {
  const drawer = await readFile(join(root, "src/components/category/CategorySectionsDrawer/CategorySectionsDrawer.tsx"), "utf8")
  // closed: visibility hidden after the slide, so its buttons can't be reached by keyboard or screen reader
  assert.ok(drawer.includes("open ? \"visible translate-x-0") && drawer.includes(": \"invisible -translate-x-full"))
  assert.ok(drawer.includes("<nav") && drawer.includes("aria-label={label}"))
  const sidebar = await readFile(join(root, "src/components/category/CategorySidebar/CategorySidebar.tsx"), "utf8")
  for (const piece of ["aria-label=\"Secciones\"", "aria-expanded={showDrawer}", "aria-controls={drawerId}"]) assert.ok(sidebar.includes(piece), piece)
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
  assert.ok(text(html).includes("Tipo: Guardias") && text(html).includes("Búsqueda: «oftalm»") && text(html).includes("Borrar filtros"))
  // a filter this context doesn't have is ignored
  const other = render(() => createElement(PlacesExplorer, { filters: ["medical"] }), "/x?filtro=dentistry")
  assert.ok(!text(other).includes("Tipo:") && !text(other).includes("Borrar filtros"))
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

test("the category of Salud general is named so in the taxonomy, with the same id", async () => {
  const taxonomy = JSON.parse(await readFile(join(root, "src/data/resources/taxonomy.json"), "utf8"))
  assert.deepEqual(taxonomy.categories.find(({ id }) => id === "salud-fisica"), { id: "salud-fisica", label: "Salud general" })
  assert.ok(!taxonomy.categories.some(({ label }) => /salud f[ií]sica/i.test(label)))
})
