/*
 * Tests of the structure and navigation: the six accesses of the home, the bottom navigation, what a category without
 * published information shows, the addresses that redirect and the absence of empty or provisional pages in what people see.
 * Loaded through Vite like the app does.
 *   npm run structure:test
 */
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const src = resolve(here, "../src")
const { createServer } = await import("vite")
const vite = await createServer({ root: resolve(here, ".."), logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())

const { createElement } = await import("react")
const { renderToStaticMarkup } = await import("react-dom/server")
const { MemoryRouter } = await import("react-router")
const { CATEGORIES, ALL_CATEGORIES } = await vite.ssrLoadModule("/src/content/categories/index.ts")
const { Categories } = await vite.ssrLoadModule("/src/components/home/Categories/index.ts")
const { Category } = await vite.ssrLoadModule("/src/screens/RenderCategory/index.ts")
const { CategoryPreparing } = await vite.ssrLoadModule("/src/components/category/CategoryPreparing/index.ts")
const { NAV_ITEMS } = await vite.ssrLoadModule("/src/components/layout/BottomNav/BottomNav.constants.ts")
const { PATHS } = await vite.ssrLoadModule("/src/router/paths.ts")
const { ABOUT } = await vite.ssrLoadModule("/src/content/categories/About/About.ts")

const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const render = (component, url = "/", props = null) => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(component, props)))
const hrefs = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1].replace(/&amp;/g, "&"))

const HOME = [
  ["Encontrar atención", "/centros"],
  ["Cuidar mi salud", "/temas/salud-general"],
  ["Salud mental", "/temas/salud-mental"],
  ["Salud sexual y ESI", "/temas/esi"],
  ["Salud animal", "/temas/animales"],
  ["Primeros auxilios", "/primeros-auxilios"],
]

test("the home has the six approved accesses, in order, each one going where it says", () => {
  assert.deepEqual(CATEGORIES.map(({ title, to }) => [title, to]), HOME)
  const html = render(Categories)
  const cards = [...html.matchAll(/<li><a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a><\/li>/g)]
  assert.equal(cards.length, 6)
  cards.forEach(([, href, inner], index) => {
    assert.equal(href, HOME[index][1])
    assert.ok(text(inner).includes(HOME[index][0]), HOME[index][0])
  })
  assert.ok(text(html).includes("¿Qué necesitás hoy?"))
})

test("every card has a clear description, and the ones without published information say 'Próximamente'", () => {
  for (const category of CATEGORIES) assert.ok(category.description.length > 15, category.title)
  const html = render(Categories)
  const soon = CATEGORIES.filter(({ preparing }) => preparing).map(({ title }) => title)
  assert.deepEqual(soon, ["Salud mental", "Salud sexual y ESI", "Salud animal"])
  assert.equal([...html.matchAll(/Próximamente/g)].length, soon.length)
  // the others have content: Encontrar atención, Cuidar mi salud and Primeros auxilios are not marked
  for (const [title] of HOME.filter(([name]) => !soon.includes(name))) assert.ok(!CATEGORIES.find((category) => category.title === title).preparing, title)
})

test("nothing on the cards or in the headings claims gratuity, availability or confidentiality that is not verified", () => {
  const words = /gratuit|24 horas|24 h|confidencial|las 24/i
  for (const { title, description, subtitle, preparing } of CATEGORIES.filter(({ preparing }) => preparing)) {
    assert.ok(!words.test(`${description} ${subtitle} ${preparing.will}`), title)
  }
  assert.ok(!words.test(render(Categories)), "the home")
})

test("no empty or provisional page is visible: no 'Sección N', no 'en construcción'", () => {
  const visible = CATEGORIES.concat([ABOUT])
  for (const category of visible) {
    if (category.preparing) continue // its sections are never shown: the screen shows CategoryPreparing
    for (const { title } of category.sections) assert.ok(!/^Sección \d/.test(title), `${category.title}: ${title}`)
  }
  const home = text(render(Categories))
  assert.ok(!/en construcci[oó]n/i.test(home) && !/Sección \d/.test(home))
  for (const url of ["/temas/salud-mental", "/temas/esi", "/temas/animales", "/sobre-auxiliar"]) {
    const page = text(render(Category, url))
    assert.ok(!/en construcci[oó]n/i.test(page) && !/Sección \d/.test(page), url)
  }
})

test("the bottom navigation: Inicio, Encontrar atención and Primeros auxilios; Mi Salud is not there", () => {
  assert.deepEqual(NAV_ITEMS.map(({ label, to }) => [label, to]), [
    ["Inicio", "/"],
    ["Encontrar atención", "/centros"],
    ["Primeros auxilios", "/primeros-auxilios"],
  ])
  assert.ok(!NAV_ITEMS.some(({ to, label }) => to === PATHS.myHealth || /mi salud/i.test(label)))
  // all lead to a page with content
  for (const { to } of NAV_ITEMS) assert.ok(to === "/" || ALL_CATEGORIES.some((category) => category.to === to && !category.preparing), to)
  // the emergency button is not part of this list (it is not a link) and its component was not touched by this work
  const bar = readFileSync(join(src, "components/layout/BottomNav/BottomNav.tsx"), "utf8")
  assert.match(bar, /revealEmergencies/)
})

test("a category without published information shows one honest page, with no section menu", () => {
  for (const category of CATEGORIES.filter(({ preparing }) => preparing)) {
    const html = render(Category, category.to)
    const content = text(html)
    assert.ok(content.includes("Estamos preparando esta sección"), category.title)
    assert.ok(content.includes(category.preparing.will), category.title)
    assert.ok(content.includes("Todavía no la publicamos"), category.title)
    assert.ok(!html.includes('aria-label="Secciones"') && !html.includes("Secciones de"), `${category.title}: no menu`)
    // it still tells where the emergency numbers are
    assert.ok(content.includes("mirá los números de emergencia"), category.title)
  }
})

test("the page of a category without information links only to what exists", () => {
  const links = (category) => hrefs(render(CategoryPreparing, "/", { preparing: category.preparing }))
  const byTitle = (title) => CATEGORIES.find((category) => category.title === title)
  assert.deepEqual(links(byTitle("Salud mental")), ["/centros?filtro=mental-health"])
  assert.deepEqual(links(byTitle("Salud sexual y ESI")), ["/centros?filtro=sexual-health"])
  assert.deepEqual(links(byTitle("Salud animal")), [])
  assert.ok(!text(render(CategoryPreparing, "/", { preparing: byTitle("Salud animal").preparing })).includes("Mientras tanto"))
})

test("the filters those links open exist in the map", async () => {
  const { PLACE_FILTERS } = await vite.ssrLoadModule("/src/utils/places/filters.ts")
  const ids = PLACE_FILTERS.map(({ id }) => id)
  assert.ok(ids.includes("mental-health") && ids.includes("sexual-health"))
})

test("Cuidar mi salud opens straight on the controls; Primeros auxilios and Sobre AuxiliAR on their only page", () => {
  const care = text(render(Category, "/temas/salud-general"))
  assert.ok(care.includes("Controles de salud"))
  assert.ok(care.includes("Dónde atenderme") && care.includes("Quiz"), "its three sections are still there")
  assert.ok(!care.includes("Primeros auxilios"), "and Primeros auxilios is not one of them")
  assert.ok(text(render(Category, "/primeros-auxilios")).includes("Guías de primeros auxilios"))
  const about = text(render(Category, "/sobre-auxiliar"))
  assert.ok(about.includes("Sobre AuxiliAR"))
  assert.ok(!hrefs(render(Category, "/sobre-auxiliar")).some((href) => href.startsWith("/temas/") || href === "/mi-salud"))
})

test("Sobre AuxiliAR says what the site says elsewhere and points to the page about the data, without repeating it", async () => {
  const Content = (await vite.ssrLoadModule("/src/content/categories/About/sections/Section1/Section1.content.tsx")).default
  const html = render(Content)
  const content = text(html)
  assert.ok(content.includes("fuentes oficiales") && content.includes("no reemplaza la atención médica ni psicológica profesional"))
  assert.deepEqual(hrefs(html), ["/centros?seccion=section-2"])
  assert.ok(!content.includes("Fuentes y alcance"), "the explanation of the data lives in one place")
  // the footer links here
  const footer = readFileSync(join(src, "components/layout/Footer/Footer.tsx"), "utf8")
  assert.match(footer, /PATHS\.about/)
})

test("the addresses of pages that are empty (and out of the navigation) redirect to the home; no address was lost", () => {
  const router = readFileSync(join(src, "router/index.tsx"), "utf8")
  for (const key of ["topics", "resources", "myHealth"]) assert.match(router, new RegExp(`path: PATHS\\.${key}, element: <Navigate to=\\{PATHS\\.home\\} replace/>`), key)
  // every other address is still routed
  for (const key of Object.keys(PATHS)) {
    if (key === "topic" || key === "firstAidGuide") continue
    assert.ok(router.includes(`PATHS.${key}`), `${key} is still routed`)
  }
  // the code of what was taken out of the navigation is kept
  for (const file of ["screens/Placeholder/Placeholder.tsx", "content/categories/Resources/Resources.ts", "content/categories/Animals/Animals.ts", "content/categories/MentalHealth/MentalHealth.ts"]) {
    assert.ok(readFileSync(join(src, file), "utf8").length > 0, file)
  }
  // the old addresses of Salud física and of its Primeros auxilios section are still handled
  assert.match(router, /LEGACY_PHYSICAL_HEALTH_SLUG/)
  assert.match(router, /HealthGeneralRoute/)
})
