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
const { BottomNav: NavigationProbe } = await vite.ssrLoadModule("/src/components/layout/BottomNav/index.ts")
const { MyHealth } = await vite.ssrLoadModule("/src/screens/MyHealth/index.ts")
const { ABOUT } = await vite.ssrLoadModule("/src/content/categories/About/About.ts")

const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const render = (component, url = "/", props = null) => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(component, props)))
const hrefs = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1].replace(/&amp;/g, "&"))

// The six cards of the home, in order: title, the line under it and where each one goes (the categories' own addresses)
const HOME = [
  ["Centros de atención", "Mapa de hospitales y centros de salud", "/centros"],
  ["Salud general", "Controles, cuidados y calendario de vacunación", "/temas/salud-general"],
  ["Salud sexual - ESI", "Anticonceptivos, prevención y derechos sexuales", "/temas/esi"],
  ["Atención veterinaria", "Prevención, chequeos, castración gratuita y más", "/temas/animales"],
  ["Salud mental", "Herramientas de autocuidado, y orientación: cómo pedir ayuda", "/temas/salud-mental"],
  ["Más recursos", "Derechos, leyes, FAQ, y trámites", "/recursos"],
]

test("the home has the six approved cards, exactly these and in this order, each one going where it says", () => {
  const html = render(Categories)
  const cards = [...html.matchAll(/<li><a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a><\/li>/g)]
  assert.equal(cards.length, 6)
  cards.forEach(([, href, inner], index) => {
    const [title, description, to] = HOME[index]
    assert.equal(href, to, title)
    const content = text(inner)
    assert.ok(content.includes(title) && content.includes(description), title)
  })
  assert.ok(text(html).includes("¿Qué necesitás hoy?"))
  // Centros de atención is the same map as Encontrar atención, and the categories' own data did not change
  assert.equal(HOME[0][2], NAV_ITEMS.find(({ label }) => label === "Encontrar atención").to)
  assert.deepEqual(CATEGORIES.map(({ title, to }) => [title, to]), [
    ["Encontrar atención", "/centros"],
    ["Cuidar mi salud", "/temas/salud-general"],
    ["Salud mental", "/temas/salud-mental"],
    ["Salud sexual y ESI", "/temas/esi"],
    ["Salud animal", "/temas/animales"],
    ["Primeros auxilios", "/primeros-auxilios"],
  ])
})

test("no home card says Próximamente: the six categories have published content (Más recursos has its first version)", () => {
  const html = render(Categories)
  assert.deepEqual(ALL_CATEGORIES.filter(({ preparing }) => preparing).map(({ id }) => id), [])
  assert.equal([...html.matchAll(/Próximamente/g)].length, 0)
  const resources = ALL_CATEGORIES.find(({ id }) => id === "recursos")
  assert.deepEqual(resources.sections.map(({ title }) => title), ["Tus derechos en salud", "Trámites", "Preguntas frecuentes", "Glosario"])
})

test("nothing on the cards or in the headings claims gratuity, availability or confidentiality that is not verified", () => {
  const words = /gratuit|24 horas|24 h|confidencial|las 24/i
  for (const { title, description, subtitle, preparing } of ALL_CATEGORIES.filter(({ preparing }) => preparing)) {
    assert.ok(!words.test(`${description} ${subtitle} ${preparing.will}`), title)
  }
  // The home's wording is the team's, as written: the only claim of gratuity is the veterinary card's "castración gratuita", nothing about 24 h or confidentiality
  const home = text(render(Categories))
  assert.ok(!/24 horas|24 h|confidencial|las 24/i.test(home), "the home")
  assert.deepEqual([...home.matchAll(/gratuit\w*/gi)].map(([word]) => word), ["gratuita"])
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

test("the navigation: Inicio, Encontrar atención, Mi salud (under construction) and the emergency button; Primeros auxilios is not in it", () => {
  assert.deepEqual(NAV_ITEMS.map(({ label, to }) => [label, to]), [
    ["Inicio", "/"],
    ["Encontrar atención", "/centros"],
    ["Mi salud", "/mi-salud"],
  ])
  assert.ok(!NAV_ITEMS.some(({ to, label }) => to === PATHS.firstAid || /primeros auxilios/i.test(label)))
  const html = render(NavigationProbe)
  assert.ok(text(html).includes("Emergencia"), "the emergency button is still the fourth item")
  // Primeros auxilios keeps its section and its address; it is reached from the highlighted band of the home
  assert.ok(text(render(Category, "/primeros-auxilios")).includes("Guías de primeros auxilios"))
  // Mi salud says it is under construction and promises nothing
  const mine = text(render(MyHealth, "/mi-salud"))
  assert.ok(mine.includes("En construcción") && mine.includes("todavía no está disponible"))
  assert.ok(!/cuenta|historia cl[ií]nica|guardar|registr|iniciar sesi[oó]n|tus datos/i.test(mine), "no promise of accounts, records or saved data")
  // the other one leads to a page with content
  for (const { to } of NAV_ITEMS.filter(({ to }) => to !== "/" && to !== PATHS.myHealth)) assert.ok(ALL_CATEGORIES.some((category) => category.to === to && !category.preparing), to)
  // the emergency button is not part of this list (it is not a link) and its component was not touched by this work
  const bar = readFileSync(join(src, "components/layout/BottomNav/BottomNav.tsx"), "utf8")
  assert.match(bar, /revealEmergencies/)
})

test("a category without published information shows one honest page, with no section menu", () => {
  for (const category of ALL_CATEGORIES.filter(({ preparing }) => preparing)) {
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
  // no category is in preparation any more: the page is checked with a fixture, because the component stays for the next category
  const fixture = { will: "Va a reunir información de ejemplo.", meanwhile: [{ label: "Ejemplo", to: "/centros" }] }
  assert.deepEqual(hrefs(render(CategoryPreparing, "/", { preparing: fixture })), ["/centros"])
  assert.ok(!text(render(CategoryPreparing, "/", { preparing: { ...fixture, meanwhile: [] } })).includes("Mientras tanto"))
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

test("Sobre AuxiliAR keeps what it said (what the site is, the official sources, the link to the page about the data) and ends with the sources of the whole site", async () => {
  const Content = (await vite.ssrLoadModule("/src/content/categories/About/sections/Section1/Section1.content.tsx")).default
  const html = render(Content)
  const content = text(html)
  assert.ok(content.includes("fuentes oficiales") && content.includes("no reemplaza la atención médica ni psicológica profesional"))
  // its own content is intact: the one internal link is the one it had; the rest of the links are the external sources at the end
  // the button that used to go to the second section of Centros leads to its text, moved to this same page: no internal route is left
  assert.deepEqual(hrefs(html).filter((href) => href.startsWith("/")), [])
  assert.ok(!html.includes('href="#about-datos"') && html.includes('id="about-datos"'), "no button to the text about the data: the text itself is right below")
  assert.ok(content.indexOf("Sobre los datos del mapa") < content.indexOf("Fuentes y referencias"), "the sources come after the existing content, at the end")
  assert.equal([...content.matchAll(/Fuentes y alcance/g)].length, 1, "the explanation of the data lives in one place: here")
  // the footer links here
  const footer = readFileSync(join(src, "components/layout/Footer/Footer.tsx"), "utf8")
  assert.match(footer, /PATHS\.about/)
})

test("/temas redirects to the home; /recursos and /mi-salud have their own page; no address was lost", () => {
  const router = readFileSync(join(src, "router/index.tsx"), "utf8")
  assert.ok(router.includes("path: PATHS.topics, element: <Navigate to={PATHS.home} replace/>"))
  assert.ok(router.includes("path: PATHS.resources, element: <Category/>"))
  assert.ok(router.includes("path: PATHS.myHealth, element: <MyHealth/>"))
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
