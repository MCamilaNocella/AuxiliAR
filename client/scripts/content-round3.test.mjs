/*
 * Tests of the content round of 9/10/2026: the vaccination calendar by stage of life, the explanation of the eight empty map
 * buttons, "Más recursos" (rights, procedures, FAQ, glossary) and the links that stay inside AuxiliAR. Loaded through Vite like
 * the app does.
 *   npm run round3:test
 */
import assert from "node:assert/strict"
import { readFileSync, readdirSync, statSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const evidence = (name) => readFileSync(resolve(root, "../docs/investigacion/evidencia", name), "utf8")
const { createServer } = await import("vite")
const vite = await createServer({ root, logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())

const { createElement } = await import("react")
const { renderToStaticMarkup } = await import("react-dom/server")
const { MemoryRouter } = await import("react-router")
const render = (component, url = "/") => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(component)))
const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const hrefs = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1].replace(/&amp;/g, "&"))
const load = async (path) => vite.ssrLoadModule(`/src/content/categories/${path}`)

const calendar = await load("PhysicalHealth/sections/Section5/Section5.constants.ts")
const CalendarPage = (await load("PhysicalHealth/sections/Section5/Section5.content.tsx")).default
const controls = (await load("PhysicalHealth/sections/Section2/Section2.content.tsx")).default
const { PHYSICAL_HEALTH } = await load("PhysicalHealth/PhysicalHealth.ts")
const { RESOURCES } = await load("Resources/Resources.ts")
const { emptyGuideOf } = await vite.ssrLoadModule("/src/utils/places/emptyGuides.ts")
const { PLACE_FILTERS } = await vite.ssrLoadModule("/src/utils/places/filters.ts")

const norm = (value) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

/* ── Calendario de vacunación ── */

test("the vaccination calendar is the section-5 of Salud general (section-3 redirects to Primeros auxilios and is never reused)", () => {
  assert.ok(PHYSICAL_HEALTH.sections.some(({ id, title }) => id === "section-5" && title === "Calendario de vacunación"))
  assert.ok(!PHYSICAL_HEALTH.sections.some(({ id }) => id === "section-3"))
  assert.equal(calendar.CHECKED_AT, "2026-10-09")
})

test("the calendar has the eight stages of the Ministerio, each with its own official page, and nothing is there that its text does not say", () => {
  const stages = calendar.VACCINATION_STAGES
  assert.deepEqual(stages.map(({ id }) => id), ["embarazo", "recien-nacidos", "hasta-un-ano", "hasta-2-anios", "5-anios", "11-anios", "15-a-64", "65-o-mas"])
  const official = norm(evidence("calendario-vacunacion-2026-por-etapas.txt"))
  for (const stage of stages) {
    assert.match(stage.source.url, /^https:\/\/www\.argentina\.gob\.ar\/salud\/vacunas\/[a-z-]+$/, stage.id)
    assert.ok(official.includes(stage.source.url.replace("https://", "")), `${stage.id}: its page is in the saved evidence`)
    for (const { items } of stage.groups) {
      for (const { vaccine } of items) {
        // the vaccine is named in the saved text of the Ministerio (accents and case aside)
        const name = norm(vaccine).replace(/ \(.*\)/, "")
        assert.ok(official.includes(name), `${stage.id}: ${vaccine}`)
      }
    }
  }
  // the doses and ages that matter most, as the pages say them
  const everything = norm(JSON.stringify(stages))
  for (const piece of ["12 horas de vida", "semana 20 de gestacion", "entre las semanas 32 y 36,6", "a los 2 meses", "a los 12 meses", "a los 15 meses", "refuerzo cada 10 anos", "vcn20", "nacieron en 2021", "nacieron en 2015", "nacidas antes de 1965"]) {
    assert.ok(everything.includes(piece), piece)
  }
})

test("the page shows one stage at a time, opens a stage from ?etapa=, and ends with its sources and the day they were compared", () => {
  const first = render(CalendarPage, "/temas/salud-general?seccion=section-5")
  assert.ok(text(first).includes("Antigripal") && text(first).includes("Triple bacteriana acelular"))
  const elders = text(render(CalendarPage, "/temas/salud-general?seccion=section-5&etapa=65-o-mas"))
  assert.ok(elders.includes("VCN20") && !elders.includes("Hepatitis B"))
  const html = render(CalendarPage, "/temas/salud-general?seccion=section-5&etapa=hasta-un-ano")
  const content = text(html)
  assert.ok(content.includes("A los 2 meses") && content.includes("Fuentes oficiales") && content.includes("Texto comparado con estas fuentes el 9 de octubre de 2026"))
  assert.equal([...html.matchAll(/aria-pressed="true"/g)].length, 1)
  // official sources only, and no phone number or personal advice
  for (const href of hrefs(html).filter((link) => link.startsWith("https://"))) assert.match(href, /^https:\/\/www\.argentina\.gob\.ar\/(salud\/vacunas|sites\/default\/files\/2026-03-10_calendario_nacional_vacunacion_70x50_web\.pdf$)/)
  assert.ok(!/\b0800\b|\b\d{2}[- ]?\d{4}[- ]?\d{4}\b/.test(content))
  assert.ok(content.includes("no reemplaza la consulta con un equipo de salud"))
  assert.ok(hrefs(html).includes("/centros?filtro=vaccination"))
})

test("the vaccination topic of Controles leads to the calendar", () => {
  const html = render(controls, "/temas/salud-general?seccion=section-2&tema=vacunacion")
  assert.ok(hrefs(html).includes("/temas/salud-general?seccion=section-5"))
})

/* ── The eight buttons to empty maps ── */

test("a quick filter with no place with documented gratuity gets an explanation inside AuxiliAR, never a promise", () => {
  const query = (filterId, text = "") => ({ text, filterId, province: null, zone: null, category: null, type: null, free: false })
  for (const filterId of ["mental-health", "sexual-health", "dentistry"]) {
    const guide = emptyGuideOf(query(filterId), [])
    assert.ok(guide, filterId)
    assert.ok(guide.headline.includes("Todavía no tenemos") && guide.headline.includes("Eso no significa que no existan"), filterId)
    // no phone number, no hour, no address, no emergency line
    const all = [guide.headline, ...guide.steps, ...guide.links.map(({ label }) => label)].join(" ")
    assert.ok(!/\d/.test(all.replace(/25\.673/g, "")), `${filterId}: no digits (numbers, hours)`)
    assert.ok(!/911|107|0800|135/.test(all), filterId)
    for (const { to } of guide.links) assert.ok(to.startsWith("/"), `${filterId}: ${to} stays inside AuxiliAR`)
  }
  const eyes = emptyGuideOf(query("emergency", "oftalm"), [])
  assert.ok(eyes.headline.includes("Hoy no tenemos una guardia oftalmológica con gratuidad documentada"))
  assert.ok(!/santa lucia/i.test(JSON.stringify(eyes)), "no hospital is named while its gratuity is not documented")
  // other searches keep the generic message
  assert.equal(emptyGuideOf(query("emergency", "odontol"), []), null)
  assert.equal(emptyGuideOf(query("all"), []), null)
  // a filter that has a place does not get the empty explanation
  for (const filterId of ["mental-health", "sexual-health", "dentistry"]) {
    const types = PLACE_FILTERS.find(({ id }) => id === filterId).types
    assert.equal(emptyGuideOf(query(filterId), [{ place: {}, services: [{ type: types[0] }] }]), null, filterId)
  }
})

test("the buttons that led to empty maps say 'Ver el mapa' (they do not promise results)", () => {
  const read = (path) => readFileSync(resolve(root, "src/content/categories", path), "utf8")
  for (const file of ["MentalHealth/sections/Section1/Section1.content.tsx", "MentalHealth/sections/Section2/Section2.content.tsx", "SexEducation/sections/Section1/Section1.content.tsx", "SexEducation/sections/Section2/Section2.content.tsx"]) {
    assert.ok(read(file).includes("Ver el mapa") && !read(file).includes("Explorar centros de salud en el mapa"), file)
  }
  for (const file of ["PhysicalHealth/sections/Section2/Section2.constants.ts", "PhysicalHealth/sections/Section4/Section4.constants.ts"]) {
    assert.ok(!/Buscar atención odontológica|Urgencia oftalmológica|Ver guardias oftalmológicas/.test(read(file)), file)
  }
})

/* ── Más recursos ── */

test("Más recursos has its four sections, opens on the rights, and is no longer 'en preparación'", () => {
  assert.equal(RESOURCES.preparing, undefined)
  assert.deepEqual(RESOURCES.sections.map(({ title }) => title), ["Tus derechos en salud", "Trámites", "Preguntas frecuentes", "Glosario"])
  assert.equal(RESOURCES.defaultSectionId, "section-1")
})

test("Más recursos: the Ley 27.610 is left out, CeSAC appointments are explained, and nothing is written twice", async () => {
  const pages = await Promise.all([1, 2, 3, 4].map(async (n) => render((await load(`Resources/sections/Section${n}/Section${n}.content.tsx`)).default, "/recursos")))
  const all = text(pages.join(" "))
  assert.ok(!/27\.610|27610|interrupci[oó]n voluntaria|aborto|IVE\b|ILE\b/i.test(all), "no Ley 27.610")
  assert.ok(all.includes("Cómo pedir turno en un CeSAC") && all.includes("Empadronate en el Sistema de Salud (una sola vez)"))
  assert.ok(all.includes("no requieren una orden médica"))
  assert.ok(all.includes("Ley 153") && all.includes("Ley 27.491") && all.includes("26.657") && all.includes("25.673"))
  // one copy: the texts shared with the categories live in their modules, not in Resources
  const sources = readdirSync(resolve(root, "src/content/categories/Resources"), { recursive: true })
    .filter((file) => /\.(ts|tsx)$/.test(file))
    .map((file) => readFileSync(resolve(root, "src/content/categories/Resources", file), "utf8"))
    .join("\n")
  for (const copy of ["Acceder a tu historia clínica", "Rechazar la atención de una persona", "Que una vacunación o una castración sea gratuita", "método de barrera que se usa en prácticas sexuales"]) {
    assert.ok(!sources.includes(copy), `copied text: ${copy}`)
  }
  // every external link of the four pages is an official source or the place where the appointment is made
  for (const href of hrefs(pages.join(" ")).filter((link) => link.startsWith("https://"))) assert.match(href, /^https:\/\/(www\.argentina\.gob\.ar|boletinoficial\.buenosaires\.gob\.ar|buenosaires\.gob\.ar)\//, href)
  // the open sections of the FAQ and the glossary name their source
  assert.equal([...pages[2].matchAll(/<details/g)].length, 8)
  assert.ok(pages[3].includes("<dl") && (pages[3].match(/Fuente:/g) ?? []).length >= 10)
  assert.ok(!/<(form|input|textarea|select)\b/.test(pages.join(" ")))
})

/* ── Salud animal and Salud sexual ── */

test("Pasteur is not on the map yet: the new service is only proposed, and the datasets did not change", () => {
  const walk = (dir) => readdirSync(dir).flatMap((name) => (statSync(join(dir, name)).isDirectory() ? walk(join(dir, name)) : [join(dir, name)]))
  const data = walk(resolve(root, "src/data/resources")).filter((file) => file.endsWith(".json"))
  assert.ok(data.length > 0)
  for (const file of data) assert.ok(!/cadaver|disposici[oó]n de cad[aá]veres|animal-disposal/i.test(readFileSync(file, "utf8")), file)
})

test("every 'vaccine: dose' line of each official stage page is in the stage of the calendar, and every stage 'A los N meses' header too", () => {
  const blocks = evidence("calendario-vacunacion-2026-por-etapas.txt").split(/^=== /m).slice(1)
  assert.equal(blocks.length, 8)
  const squash = (value) => norm(value).replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim()
  const words = (value, count) => squash(value).replace(/(^| )2da( |$)/, "$1segunda$2").split(" ").slice(0, count).join(" ")
  let checked = 0
  for (const block of blocks) {
    const url = block.split(" ")[0]
    const stage = calendar.VACCINATION_STAGES.find(({ source }) => source.url === url)
    assert.ok(stage, url)
    const ours = squash(JSON.stringify(stage))
    const lines = block.split("\n").map((line) => line.trim())
    const body = lines.slice(lines.findIndex((line) => /^Calendario Nacional/.test(line)), lines.findIndex((line) => /^Recordá/.test(line)))
    for (const line of body) {
      const match = line.match(/^([A-Za-zÁÉÍÓÚáéíóúñ()/ .,+0-9-]{3,70}?) ?: ?(.{10,})$/)
      if (match && !/^(Control|Antigripal:$)/.test(line) && !/^Las vacunas|^Es importante|^Control/.test(line)) {
        assert.ok(ours.includes(squash(match[1]).replace(/ iniciar.*/, "")), `${url}: vaccine «${match[1]}»`)
        assert.ok(ours.includes(words(match[2], 2)), `${url}: dose «${words(match[2], 2)}» of ${match[1]}`)
        checked++
      }
      if (/^(A los \d+ meses|Entre los \d+ y los? \d+ meses|Entre los \d+ y \d+ meses)$/.test(line)) {
        assert.ok(ours.includes(squash(line)), `${url}: header «${line}»`)
        checked++
      }
    }
  }
  assert.ok(checked >= 45, `checked ${checked}`)
})
