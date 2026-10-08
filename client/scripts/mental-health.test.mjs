/*
 * Tests of Salud mental: three sections with real content, each one with its official sources, no phone number copied
 * (the help numbers belong to the Emergencias work), no promise about gratuity or hours, and none of the mockup data.
 * Loaded through Vite like the app does.
 *   npm run mental:test
 */
import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"
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
const { MENTAL_HEALTH } = await vite.ssrLoadModule("/src/content/categories/MentalHealth/MentalHealth.ts")
const sources = await vite.ssrLoadModule("/src/content/categories/MentalHealth/MentalHealth.sources.ts")
const sectionDir = "/src/content/categories/MentalHealth/sections"
const CONTENT = {
  "section-1": (await vite.ssrLoadModule(`${sectionDir}/Section1/Section1.content.tsx`)).default,
  "section-2": (await vite.ssrLoadModule(`${sectionDir}/Section2/Section2.content.tsx`)).default,
  "section-3": (await vite.ssrLoadModule(`${sectionDir}/Section3/Section3.content.tsx`)).default,
}

const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const render = (component) => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ["/temas/salud-mental"] }, createElement(component)))
const hrefs = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1].replace(/&amp;/g, "&"))
const pages = Object.fromEntries(Object.entries(CONTENT).map(([id, component]) => [id, render(component)]))

test("salud mental has three sections that open straight on the first, and it is no longer 'próximamente'", () => {
  assert.deepEqual(MENTAL_HEALTH.sections.map(({ id, title }) => [id, title]), [
    ["section-1", "Dónde buscar ayuda"],
    ["section-2", "Cómo acceder a atención"],
    ["section-3", "Cuidarte día a día"],
  ])
  assert.equal(MENTAL_HEALTH.defaultSectionId, "section-1")
  assert.equal(MENTAL_HEALTH.preparing, undefined)
  assert.equal(MENTAL_HEALTH.to, "/temas/salud-mental")
  // Auxi's chat can send people to each section: they have a summary
  for (const { summary } of MENTAL_HEALTH.sections) assert.ok(summary && summary.length > 60)
})

test("every section has content, no placeholder, and ends with its official sources and the day they were compared", () => {
  assert.equal(sources.CHECKED_AT, "2026-10-08")
  for (const [id, html] of Object.entries(pages)) {
    const content = text(html)
    assert.ok(!/en construcci[oó]n|Sección \d/i.test(content), id)
    assert.ok(content.includes("Fuentes oficiales"), id)
    assert.ok(content.includes("Texto comparado con estas fuentes el 8 de octubre de 2026"), id)
    const external = hrefs(html).filter((href) => href.startsWith("https://"))
    assert.ok(external.length >= 1, id)
    for (const href of external) assert.match(href, /^https:\/\/(www\.argentina\.gob\.ar|www\.who\.int)\//, `${id}: ${href} is an official source`)
    // they open in a new tab with a note for screen readers
    assert.ok(html.includes('rel="noopener noreferrer"') && content.includes("se abre en una pestaña nueva"), id)
  }
})

test("each source is named where its content comes from: the law, the plain-words law, the ministry pages and the OMS", () => {
  const urls = (id) => hrefs(pages[id]).filter((href) => href.startsWith("https://"))
  assert.deepEqual(urls("section-1"), [sources.DIRECCION_NACIONAL.url, sources.ORIENTACION.url, sources.LEY_SIMPLE.url, sources.LEY_26657.url])
  assert.deepEqual(urls("section-2"), [sources.LEY_26657.url, sources.LEY_SIMPLE.url])
  assert.deepEqual(urls("section-3"), [sources.OMS_ESTRES.url])
  assert.match(sources.LEY_26657.url, /ley-26657-175977\/texto$/)
})

test("dónde buscar ayuda: the emergency button, the verified map filtered by mental health, and the way to read how it is verified", () => {
  const html = pages["section-1"]
  const content = text(html)
  assert.ok(content.includes("Ver números de emergencia"), "the existing button to the emergency numbers")
  assert.ok(hrefs(html).includes("/centros?filtro=mental-health"), "map")
  assert.ok(hrefs(html).includes("/centros?seccion=section-2"), "how the data is verified")
  assert.ok(hrefs(html).includes("/temas/salud-mental?seccion=section-2"), "rights")
  assert.ok(content.includes("Si no tenés cobertura de salud, podés acercarte a un hospital o centro de salud cercano a tu domicilio"))
  assert.ok(content.includes("todavía no cubrimos todo el país"))
})

test("cómo acceder a atención: the rights of the law, and nothing that is not in it", () => {
  const html = pages["section-2"]
  const content = text(html)
  const body = html.slice(0, html.indexOf('aria-label="Fuentes"'))
  assert.equal([...body.matchAll(/<li>/g)].length, 6)
  for (const piece of ["tratamiento más conveniente", "acompañen", "historia clínica", "discriminada", "hospital general", "medicación"]) assert.ok(content.includes(piece), piece)
  assert.ok(content.includes("Ley Nacional de Salud Mental (26.657)"))
  // hospitalization and complaints are left out until a health professional reviews them
  assert.ok(!/involuntaria|juez|denunci|reclamo|internaci[oó]n voluntaria/i.test(content))
})

test("cuidarte día a día: habits from the OMS without numbers or doses, and when to ask for professional help", () => {
  const html = pages["section-3"]
  const content = text(html)
  const body = html.slice(0, html.indexOf('aria-label="Fuentes"'))
  assert.equal([...body.matchAll(/<li>/g)].length, 7)
  const habits = content.slice(content.indexOf("Una rutina"), content.indexOf("Cuándo pedir ayuda profesional"))
  assert.ok(!/\d/.test(habits), "no hours, minutes or quantities written as numbers")
  assert.ok(content.includes("No reemplazan la atención profesional"))
  assert.ok(content.includes("Cuando te resulta difícil controlar el estrés, conviene acudir a un profesional de la salud"))
  assert.ok(hrefs(html).includes("/temas/salud-mental?seccion=section-1"))
  assert.ok(!/tratamiento|diagn[oó]stic(o|ar)|cura|terapia/i.test(habits), "no clinical claim in the habits")
})

test("no phone line is copied, and no promise of gratuity, hours or confidentiality is made", () => {
  for (const [id, html] of Object.entries(pages)) {
    const content = text(html)
    assert.ok(!html.includes("tel:"), id)
    assert.ok(!/0800|\b(100|102|107|135|137|141|144|145|911)\b/.test(content), `${id}: no number`)
    assert.ok(!/gratuit|24 horas|las 24|confidencial|garantiz/i.test(content), id)
  }
})

test("none of the mockup data of the old draft (fictitious people, numbers, WhatsApp) is in the category", () => {
  const dir = resolve(root, "src/content/categories/MentalHealth")
  const files = []
  const walk = (path) => readdirSync(path, { withFileTypes: true }).forEach((entry) => (entry.isDirectory() ? walk(join(path, entry.name)) : files.push(join(path, entry.name))))
  walk(dir)
  for (const file of files.filter((name) => /\.(ts|tsx)$/.test(name))) {
    const code = readFileSync(file, "utf8")
    assert.ok(!/5555|wa\.me|WhatsApp|PROFESSIONALS|MOCKUP/.test(code), file)
  }
})

test("the chat's index lists the three sections with their summary, up to date", async () => {
  const index = JSON.parse(readFileSync(resolve(root, "../server/src/main/resources/content/content-index.json"), "utf8"))
  for (const section of MENTAL_HEALTH.sections) {
    const page = index.find((entry) => entry.path === `/temas/salud-mental?seccion=${section.id}`)
    assert.ok(page, section.id)
    assert.equal(page.hasInfo, true)
    assert.equal(page.summary, section.summary, "stale: run npm run content:index")
    assert.equal(page.title, `Salud mental › ${section.title}`)
  }
})
