/*
 * Tests of the two informative subsections of Salud general: "Alimentación y nutrición" and "Actividad física y bienestar", and of their
 * entry cards on top of "Controles de salud". They check what the pages say and, as much, what they do not: no content is shown as
 * approved, no place, program, day or hour is promised, no link to the official sources is invented, the way to the map never switches on
 * a filter with nothing to show, and there is no second emergency button.
 *   npm run health:test
 */
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
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
const { PHYSICAL_HEALTH } = await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/PhysicalHealth.ts")
const { FOOD_NUTRITION } = await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/sections/Section6/Section6.constants.ts")
const { PHYSICAL_ACTIVITY } = await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/sections/Section7/Section7.constants.ts")
const Section2 = (await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/sections/Section2/Section2.content.tsx")).default
const Section6 = (await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/sections/Section6/Section6.content.tsx")).default
const Section7 = (await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/sections/Section7/Section7.content.tsx")).default
const { PLACE_FILTERS } = await vite.ssrLoadModule("/src/utils/places/filters.ts")
const { centersLink } = await vite.ssrLoadModule("/src/router/centersLink.ts")
const about = await vite.ssrLoadModule("/src/content/categories/About/About.sources.ts")
const aboutBlock = (blockId) => about.REFERENCE_GROUPS.find(({ id }) => id === "salud-general").blocks.find(({ id }) => id === blockId)

const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const render = (component, url = "/temas/salud-general") => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(component)))
const hrefsIn = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1].replace(/&amp;/g, "&"))
const pages = [
  { name: "Alimentación y nutrición", Section: Section6, data: FOOD_NUTRITION, id: "section-6", filter: "nutrition-food" },
  { name: "Actividad física y bienestar", Section: Section7, data: PHYSICAL_ACTIVITY, id: "section-7", filter: "physical-activity" },
]

test("the sections are in Salud general, with their own ids and no summary (Auxi does not send people to unvalidated content)", () => {
  for (const { name, id } of pages) {
    const section = PHYSICAL_HEALTH.sections.find((entry) => entry.id === id)
    assert.equal(section?.title, name)
    assert.equal(section.summary, undefined, `${name}: no summary until it is validated`)
  }
  // food and activity stay inside salud-fisica: no new category
  assert.equal(PHYSICAL_HEALTH.id, "salud-fisica")
  // section-3 stays out: its address redirects to Primeros auxilios
  assert.ok(!PHYSICAL_HEALTH.sections.some(({ id }) => id === "section-3"))
})

test("Controles de salud has no entry cards or buttons: Alimentación and Actividad are reached from the section menu", () => {
  const html = render(Section2)
  assert.ok(!html.includes("Más temas de salud general") && !html.includes("seccion=section-6") && !html.includes("seccion=section-7"))
  assert.ok(!/<button/.test(html) && !/<a/.test(html))
  // the two sections exist in the menu of Salud general, in this order, after the calendar
  const ids = PHYSICAL_HEALTH.sections.map(({ id }) => id)
  assert.ok(ids.indexOf("section-5") < ids.indexOf("section-6") && ids.indexOf("section-6") < ids.indexOf("section-7"))
})

test("every page says that it is pending professional and documental validation, and is not an approval", () => {
  for (const { name, Section, data } of pages) {
    const page = text(render(Section))
    assert.ok(page.includes("Pendiente de validación profesional y documental"), name)
    assert.match(data.notice, /no fue revisad|no fueron revisad/, `${name}: says that nothing was reviewed`)
    assert.match(data.notice, /no es (asesoramiento médico|una indicación médica)/i, name)
    assert.ok(!page.includes("Fuentes a validar") && !page.includes("Fuentes oficiales"), `${name}: no block of sources in the page`)
    assert.ok(page.includes("Esta información es orientativa y no reemplaza la consulta con un equipo de salud."), name)
    assert.ok(!/validado por|aprobado|revisado por profesionales\b(?! de la salud ni)/i.test(page.replace(data.notice, "")), `${name}: no claim of approval`)
  }
})

test("no external link is invented: the sources are named, not linked, in Sobre AuxiliAR until they are checked", () => {
  for (const [{ name, Section, data }, blockId] of [[pages[0], "alimentacion"], [pages[1], "actividad-fisica"]]) {
    const html = render(Section)
    assert.ok(!/href="https?:/.test(html), `${name}: no external link`)
    assert.ok(data.sources.length >= 1 && data.sources.every(({ organization, title }) => organization && title), name)
    const block = aboutBlock(blockId)
    assert.equal(block.references.length, data.sources.length, name)
    for (const reference of block.references) assert.ok(reference.url === undefined && reference.detail.includes("Fuente a validar"), `${name}: named, not linked`)
    assert.ok(block.notes.includes("Pendiente de validación profesional y documental."), name)
  }
})

test("Alimentación y nutrición tells three things apart: food education, professional guidance and food assistance", () => {
  assert.deepEqual(FOOD_NUTRITION.blocks.map(({ id }) => id), ["education", "professional", "assistance"])
  assert.deepEqual(FOOD_NUTRITION.blocks.map(({ title }) => title), ["Educación alimentaria", "Orientación profesional", "Asistencia alimentaria"])
  const page = text(render(Section6))
  for (const { title } of FOOD_NUTRITION.blocks) assert.ok(page.includes(title), title)
  // food assistance is not health care and says where it is asked
  assert.match(FOOD_NUTRITION.blocks[2].lead, /No son atención de salud/)
  // nothing is promised: no program, place or phone of any region, and the map is said to have none
  assert.ok(page.includes("Todavía no hay comedores ni programas alimentarios verificados en el mapa."))
  assert.ok(!/\d{4}[-\s]\d{4}|tel:/.test(render(Section6)), "no phone number")
  assert.ok(!/Tarjeta|Ticket|Plazas Activas|Estaciones? Saludables?|CeSAC|CAF\b/.test(page), "names no program or place")
})

test("Actividad física y bienestar explains the free options without promising places, days, hours or activities", () => {
  const free = PHYSICAL_ACTIVITY.blocks.find(({ id }) => id === "free-options")
  assert.ok(free, "has the free options block")
  const page = text(render(Section7))
  assert.ok(page.includes("Opciones que no cuestan nada"))
  assert.ok(page.includes("todavía no los tenemos verificados"), "says the local offer is not verified")
  assert.ok(!/Plazas Activas|Estaciones? Saludables?|polideportivo|\b\d{1,2}[:.]\d{2}\s?(h|hs)?\b|lunes|martes|miércoles|jueves|viernes/i.test(page), "no named program, place, day or hour")
  // the figures are marked as references to validate, not as an indication
  assert.ok(page.includes("a validar") && page.includes("no una indicación para tu caso"))
})

test("there is no second emergency button: the pages point to the bar with text, and add no button", () => {
  for (const { name, Section } of pages) {
    const html = render(Section)
    assert.ok(!/tel:|revealEmergencies|Ver números de emergencia/.test(html), name)
    assert.ok(!/<button/.test(html), `${name}: no button at all (only links)`)
  }
  assert.ok(text(render(Section7)).includes("usá la barra de emergencias de AuxiliAR"))
  const sources = ["content/categories/PhysicalHealth/SubsectionPage/SubsectionPage.tsx", "components/health/MapAccess/MapAccess.tsx", "components/health/PendingNotice/PendingNotice.tsx"]
  for (const file of sources) assert.ok(!/revealEmergencies|EmergencyBar/.test(readFileSync(join(root, "src", file), "utf8")), file)
})

test("the way to the map: with nothing to show it says so and opens the general map; the filter is never switched on empty", () => {
  for (const { name, Section, filter } of pages) {
    const html = render(Section)
    // the real data has no service of these types
    assert.ok(text(html).includes("Todavía no hay lugares verificados en el mapa para este tema"), name)
    assert.ok(text(html).includes("Ver el mapa general"), name)
    assert.ok(hrefsIn(html).includes("/centros"), `${name}: the link is the general map`)
    assert.ok(!hrefsIn(html).some((href) => href.includes(`filtro=${filter}`)), `${name}: no filter in the links`)
  }
  // the three states of the button, against made-up indexes, are in places-coverage-index.test.mjs
  assert.equal(centersLink({ filter: "nutrition-food" }), "/centros?filtro=nutrition-food")
  assert.equal(centersLink({ filter: "physical-activity" }), "/centros?filtro=physical-activity")
})

test("each page opens a quick filter of the map that is offered only while it has data", () => {
  for (const { name, data, filter } of pages) {
    assert.equal(data.mapFilter, filter, name)
    assert.ok(PLACE_FILTERS.find(({ id }) => id === filter)?.onlyWithData, `${name}: the filter exists and is offered only with data`)
  }
})

test("Salud general still loads no explorer, map or places in these pages", () => {
  const files = [
    "content/categories/PhysicalHealth/SubsectionPage/SubsectionPage.tsx",
    "content/categories/PhysicalHealth/sections/Section6/Section6.content.tsx",
    "content/categories/PhysicalHealth/sections/Section7/Section7.content.tsx",
    "components/health/MapAccess/MapAccess.tsx",
    "components/health/MapAccess/quickFilterAvailability.ts",
  ]
  for (const file of files) assert.ok(!/components\/places|utils\/places|usePlaces|mapTiles|leaflet/i.test(readFileSync(join(root, "src", file), "utf8")), file)
})
