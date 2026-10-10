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
const about = await vite.ssrLoadModule("/src/content/categories/About/About.sources.ts")
// The sources of the pages are all in "Sobre AuxiliAR": the references of the group of Salud mental, by block
const referencesOf = (blockId) => about.REFERENCE_GROUPS.find(({ id }) => id === "salud-mental").blocks.find(({ id }) => id === blockId)
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
    ["section-2", "Conocé tus derechos"],
    ["section-3", "Herramientas para cuidarte"],
  ])
  assert.equal(MENTAL_HEALTH.defaultSectionId, "section-1")
  assert.equal(MENTAL_HEALTH.preparing, undefined)
  assert.equal(MENTAL_HEALTH.to, "/temas/salud-mental")
  // Auxi's chat can send people to each section: they have a summary
  for (const { summary } of MENTAL_HEALTH.sections) assert.ok(summary && summary.length > 60)
})

test("every section has content and no placeholder; its sources and the day they were compared are in Sobre AuxiliAR, not in the page", () => {
  assert.equal(sources.CHECKED_AT, "2026-10-08")
  for (const [id, html] of Object.entries(pages)) {
    const content = text(html)
    assert.ok(!/en construcci[oó]n|Sección \d/i.test(content), id)
    assert.ok(!content.includes("Fuentes oficiales") && !content.includes("Texto comparado con estas fuentes"), `${id}: no block of sources`)
    assert.ok(!hrefs(html).some((href) => href.startsWith("https://")), `${id}: no link to a source`)
  }
  for (const blockId of ["mental-donde", "mental-derechos", "mental-autocuidado"]) {
    const block = referencesOf(blockId)
    assert.deepEqual(block.checkedAt, ["2026-10-08"], blockId)
    for (const { url } of block.references) assert.match(url, /^https:\/\/(www\.argentina\.gob\.ar|www\.who\.int)\//, `${blockId}: ${url} is an official source`)
  }
})

test("each source is kept, in Sobre AuxiliAR, under the section its content comes from: the law, the plain-words law, the ministry pages and the OMS", () => {
  const urls = (blockId) => referencesOf(blockId).references.map(({ url }) => url)
  assert.deepEqual(urls("mental-donde"), [sources.ORIENTACION.url, sources.LEY_SIMPLE.url, sources.LEY_26657.url])
  assert.deepEqual(urls("mental-derechos"), [sources.LEY_26657.url, sources.LEY_SIMPLE.url])
  assert.deepEqual(urls("mental-autocuidado"), [sources.OMS_ESTRES.url])
  assert.match(sources.LEY_26657.url, /ley-26657-175977\/texto$/)
  // the notes that said what each page is not stay on the page
  assert.ok(text(pages["section-2"]).includes("Es una explicación simple de la ley: no reemplaza el asesoramiento de un equipo de salud ni el de un abogado."))
  assert.ok(text(pages["section-3"]).includes("Es una guía general de bienestar: no es un tratamiento ni un diagnóstico."))
})

test("dónde buscar ayuda: the approved introduction, no repeated emergency notice, and a map that only explores", () => {
  const html = pages["section-1"]
  const content = text(html)
  assert.ok(content.includes("Estamos para ayudarte a encontrar orientación y recursos de salud mental. Acá vas a conocer tus derechos y descubrir dónde buscar atención. AuxiliAR no otorga turnos ni realiza consultas médicas directamente."))
  // the category no longer repeats the permanent access to the emergencies (emergency bar and bottom navigation)
  assert.ok(!content.includes("Ver números de emergencia") && !content.includes("Si hay riesgo inmediato, o necesitás hablar con alguien ahora"), "no repeated emergency notice")
  // the map is for exploring, not for recommending: the button says so and the page says what the map's file marks
  assert.ok(content.includes("Ver el mapa"))
  assert.ok(!/Buscar en el mapa|centros verificados con salud mental/.test(content), "the old label is gone")
  assert.ok(hrefs(html).includes("/centros?filtro=mental-health"), "map")
  assert.ok(content.includes("Consultá cada ficha para saber qué servicios gratuitos están confirmados."))
  assert.ok(!content.includes("Explorar no es recomendar"), "the technical sentence is gone")
  assert.ok(!content.includes("Explorar centros de salud cercanos"), "the old button label is gone")
  assert.ok(!hrefs(html).includes("/centros?seccion=section-2") && !content.includes("Cómo verificamos"), "no link to a verification page: the sources are in Sobre AuxiliAR")
  assert.ok(hrefs(html).includes("/temas/salud-mental?seccion=section-2"), "rights")
  assert.ok(content.includes("Conocé tus derechos"))
  // the way to access varies: said next to the resource (before the map button), not as a barrier before any information
  const access = "La forma de acceder a la atención puede variar según el centro. Algunos servicios requieren admisión, turno o derivación."
  assert.ok(content.includes(access))
  assert.ok(content.indexOf(access) > content.indexOf("Estamos para ayudarte") && content.indexOf(access) < content.indexOf("Ver el mapa"))
  assert.equal([...html.matchAll(/admisión, turno o derivación/g)].length, 1, "once, not repeated")
  assert.ok(content.includes("Si no tenés cobertura de salud, podés acercarte a un hospital o centro de salud cercano a tu domicilio"))
  assert.ok(content.includes("Todavía no cubrimos todo el país"))
})

test("cómo acceder a atención: the rights of the law, and nothing that is not in it", () => {
  const html = pages["section-2"]
  const content = text(html)
  const body = html.slice(0, html.indexOf('aria-label="Fuentes"'))
  assert.equal([...body.matchAll(/<li>/g)].length, 6)
  for (const piece of ["tratamiento más conveniente", "acompañen", "historia clínica", "discriminada", "hospital general", "medicación"]) assert.ok(content.includes(piece), piece)
  assert.ok(content.includes("Ley Nacional de Salud Mental (26.657)"))
  // the same sentence about how to access care, next to the only resource of this section
  assert.ok(content.includes("La forma de acceder a la atención puede variar según el centro. Algunos servicios requieren admisión, turno o derivación."))
  assert.ok(content.includes("Ver el mapa") && !content.includes("Buscar en el mapa"))
  // hospitalization and complaints are left out until a health professional reviews them
  assert.ok(!/involuntaria|juez|denunci|reclamo|internaci[oó]n voluntaria/i.test(content))
})

test("herramientas para cuidarte: habits from the OMS without numbers or doses, and when to ask for professional help", () => {
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
    // "gratuidad" appears only to say that the map marks it when confirmed; nothing is called free, and nothing is promised
    // (the only sentence allowed to name it sends the reader to each center's file to see what is confirmed)
    const withoutAllowed = content.replace("Consultá cada ficha para saber qué servicios gratuitos están confirmados.", "")
    assert.ok(!/gratuit[oa]s?|gratis|24 horas|las 24|confidencial|garantiz|sin costo/i.test(withoutAllowed), id)
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
