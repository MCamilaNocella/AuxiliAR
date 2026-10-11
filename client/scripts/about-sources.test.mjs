/*
 * Tests of "Sobre AuxiliAR · Fuentes y referencias": every source and documentary reference of AuxiliAR is listed there, by topic and in
 * disclosures at the END of the page that already existed (its own content is intact), and the pages of the topics keep only the links
 * that take a person to a service, a procedure, a resource or a video. Nothing is lost: every source defined in the code is in the page.
 *   npm run structure:test
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
const { createElement } = await import("react")
const { renderToStaticMarkup } = await import("react-dom/server")
const { MemoryRouter } = await import("react-router")
const load = (path) => vite.ssrLoadModule(`/src/content/${path}`)
const about = await load("categories/About/About.sources.ts")
const AboutPage = (await load("categories/About/sections/Section1/Section1.content.tsx")).default
const { ABOUT } = await load("categories/About/About.ts")
const modules = {
  animals: await load("categories/Animals/Animals.sources.ts"),
  animalPlaces: await load("categories/Animals/Animals.places.ts"),
  mental: await load("categories/MentalHealth/MentalHealth.sources.ts"),
  sexual: await load("categories/SexEducation/SexEducation.sources.ts"),
  resources: await load("categories/Resources/Resources.sources.ts"),
  firstAid: await load("firstAid/sources.ts"),
  calendar: await load("categories/PhysicalHealth/sections/Section5/Section5.constants.ts"),
}
const { FIRST_AID_GUIDE_CONTENT } = await load("firstAid/index.ts")
after(() => vite.close())

const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ["/sobre-auxiliar"] }, createElement(AboutPage)))
const text = (markup) => markup.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const hrefsIn = (markup) => [...markup.matchAll(/href="([^"]+)"/g)].map((match) => match[1].replace(/&amp;/g, "&"))
const allReferences = about.REFERENCE_GROUPS.flatMap(({ blocks }) => blocks.flatMap(({ references }) => references))
const urlsInAbout = new Set(allReferences.map(({ url }) => url).filter(Boolean))

test("Sobre AuxiliAR keeps its own content, in its place, and has no new section, route or button", () => {
  const content = text(html)
  // what it said before: what the site is, the sources, that it does not replace professional care, and the link to the page about the data
  assert.ok(content.includes("AuxiliAR reúne información y recursos de salud para Argentina, en lenguaje simple y con fuentes oficiales."))
  assert.ok(content.includes("Cada centro del mapa nombra de dónde sale su información y cuándo se verificó; lo que todavía no verificamos, no lo mostramos."))
  assert.ok(content.includes("AuxiliAR no reemplaza la atención médica ni psicológica profesional."))
  assert.deepEqual(hrefsIn(html).filter((href) => href.startsWith("/")), [], "no route of its own or of another page")
  // the button «Cómo verificamos los datos» was removed: it repeated the first point of the text that follows and led to nothing new
  assert.ok(!hrefsIn(html).includes("#about-datos") && !text(html).includes("Cómo verificamos los datos") && !/<a [^>]*href="#/.test(html))
  // the sources come after all of it
  assert.ok(content.indexOf("Sobre los datos del mapa") < content.indexOf("Fuentes y referencias"))
  // the text about the data keeps its place and its margins under the sticky bars (the page's scroll-padding covers the header, scroll-mt-14 the category bar of small screens)
  const target = html.slice(html.indexOf('id="about-datos"'), html.indexOf('aria-labelledby="about-sources"'))
  assert.ok(target.includes('tabindex="-1"') && target.includes("scroll-mt-14") && target.includes("lg:scroll-mt-0"))
  assert.ok(!/scroll-mt-(24|20|16)/.test(html), "no margin on top of the page's own scroll-padding")
  const pageSource = readFileSync(join(root, "src/content/categories/About/sections/Section1/Section1.content.tsx"), "utf8")
  assert.ok(!pageSource.includes("goToData") && !pageSource.includes("Cómo verificamos los datos"), "no button and no handler left")
  // the category is the same one: one section, same id and title, same summary for Auxi, no new path
  assert.deepEqual(ABOUT.sections.map(({ id, title }) => [id, title]), [["section-1", "Sobre AuxiliAR"]])
  assert.ok(ABOUT.sections[0].summary.startsWith("Qué es AuxiliAR, de dónde sale la información, que no reemplaza la atención profesional"))
  assert.ok(/cómo verifica los centros/.test(ABOUT.sections[0].summary), "Auxi finds here what the second section of Centros explained")
  assert.equal(ABOUT.to, "/sobre-auxiliar")
})

test("the sources are by topic, each topic in a disclosure that starts closed", () => {
  assert.deepEqual(about.REFERENCE_GROUPS.map(({ title }) => title), ["Salud general", "Salud mental", "Salud sexual y ESI", "Atención veterinaria", "Centros de atención (mapa)", "Primeros auxilios", "Más recursos"])
  const section = html.slice(html.indexOf('aria-labelledby="about-sources"'))
  assert.equal([...section.matchAll(/<details/g)].length, about.REFERENCE_GROUPS.length)
  assert.ok(!/<details[^>]* open/.test(section), "all closed")
  // all the text is in the page even when closed (native details), with the day each text was compared
  for (const { title, blocks } of about.REFERENCE_GROUPS) {
    assert.ok(text(section).includes(title), title)
    for (const block of blocks) assert.ok(text(section).includes(block.title), block.title)
  }
  assert.ok(text(section).includes("Texto comparado con estas fuentes el 8 de octubre de 2026"))
  assert.ok(text(section).includes("Texto comparado con estas fuentes el 10 de octubre de 2026"))
  // every link is external and opens in a new tab; a source named but not linked yet is said so
  for (const href of hrefsIn(section)) assert.match(href, /^https:\/\//, href)
  assert.ok(section.includes('rel="noopener noreferrer"') && text(section).includes("se abre en una pestaña nueva"))
  assert.ok(text(section).includes("Fuente a validar: todavía sin enlace"))
  // no form, no new button
  assert.ok(!/<(form|input|textarea|select)\b/.test(html))
})

test("nothing is lost: every source defined in the code is in Sobre AuxiliAR", () => {
  // the sources the pages show as references (not the pointers to services, which have their own pages: they carry a "by")
  const isSource = (value) => value && typeof value === "object" && typeof value.label === "string" && typeof value.url === "string" && !("by" in value)
  const missing = []
  for (const [moduleName, exported] of Object.entries(modules)) {
    for (const [name, value] of Object.entries(exported)) if (isSource(value) && !urlsInAbout.has(value.url)) missing.push(`${moduleName}.${name}`)
  }
  // Sources that back no page today and are kept in their module: FRACTURAS (its page answered an error on 9/10/2026, so no guide cites it,
  // see content/firstAid/sources.ts) and METODOS (defined, never shown). Named here so that a new source that is forgotten is not taken for one of these
  const knownUnused = ["firstAid.FRACTURAS", "sexual.METODOS"]
  const unexpected = missing.filter((name) => !knownUnused.includes(name))
  assert.deepEqual(unexpected, [], `sources of the code that are not in Sobre AuxiliAR: ${unexpected.join(", ")}`)
  // the municipal services of Atención veterinaria and the guides of Primeros auxilios
  for (const guide of FIRST_AID_GUIDE_CONTENT) for (const { url } of guide.sources) assert.ok(urlsInAbout.has(url), `${guide.slug}: ${url}`)
  for (const service of [modules.animalPlaces.CABA, modules.animalPlaces.PASTEUR, modules.animalPlaces.ROSARIO, modules.animalPlaces.CORDOBA, modules.animalPlaces.SALTA, modules.animalPlaces.NEUQUEN, modules.animalPlaces.PROTENENCIA, ...modules.animalPlaces.UNIVERSITY_HOSPITALS]) assert.ok(urlsInAbout.has(service.url), service.by)
  // the calendar: every source of every stage
  for (const stage of modules.calendar.VACCINATION_STAGES) for (const { url } of stage.sources) assert.ok(urlsInAbout.has(url), `${stage.id}: ${url}`)
  // the FAQ and the glossary: every answer and term keeps its source
  const resourcesBlocks = about.REFERENCE_GROUPS.find(({ id }) => id === "mas-recursos").blocks
  const faq = resourcesBlocks.find(({ id }) => id === "faq").references
  const glossary = resourcesBlocks.find(({ id }) => id === "glosario").references
  assert.equal(faq.length, 8)
  assert.equal(glossary.length, 14)
  for (const reference of [...faq, ...glossary]) assert.ok(reference.label && reference.detail.startsWith("Respalda: "))
})

test("Primeros auxilios: each source of the guides is listed once, with the guides it backs and every day of comparison", () => {
  const block = about.REFERENCE_GROUPS.find(({ id }) => id === "primeros-auxilios").blocks[0]
  const urls = block.references.map(({ url }) => url)
  assert.equal(new Set(urls).size, urls.length, "no source twice")
  for (const guide of FIRST_AID_GUIDE_CONTENT) {
    for (const { url } of guide.sources) assert.ok(block.references.find((reference) => reference.url === url).detail.includes(guide.title), `${guide.slug} is named under ${url}`)
  }
  assert.deepEqual(block.checkedAt, [...new Set(FIRST_AID_GUIDE_CONTENT.map(({ checkedAt }) => checkedAt))].sort())
})

test("the pages of the topics have no block of sources, no note of verification and no link «Cómo verificamos los datos»", () => {
  const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]))
  const files = walk(resolve(root, "src/content/categories")).filter((file) => /\.(ts|tsx)$/.test(file) && !file.includes(`${join("categories", "About")}`))
  assert.ok(files.length > 30)
  for (const file of files) {
    const source = readFileSync(file, "utf8")
    assert.ok(!/<SourceList|components\/health\/SourceList"\n?/.test(source.replace(/import type \{ Source \} from "@\/components\/health\/SourceList"/g, "")), `${file}: no block of sources`)
    assert.ok(!source.includes("Texto comparado con estas fuentes") && !source.includes("Cómo verificamos los datos"), `${file}: no verification note or link`)
    if (/sections\/Section[34]\/Section[34]\.content\.tsx$/.test(file) && file.includes("Resources")) assert.ok(!source.includes("Fuente: {"), `${file}: sources of FAQ and glossary live in their references`)
  }
})

test("the sources of the map's establishments and of the first aid guides are here, with their dates, and the panels only point here", () => {
  const places = about.REFERENCE_GROUPS.find(({ id }) => id === "centros-mapa")
  // the places the map shows (those with a service of documented gratuity): the hidden one is not listed
  assert.deepEqual(places.blocks.map(({ id }) => id).sort(), ["centro-centro-fijo-veterinario-costanera-sur", "centro-cesac-3", "centro-cesac-41", "centro-cesac-47", "centro-hospital-odontologia-carrillo", "centro-hospital-odontologia-duenas"])
  for (const block of places.blocks) {
    assert.equal(block.checkedKind, "place")
    assert.equal(block.checkedAt.length, 1, block.id)
    assert.ok(block.references.length > 0 && block.references.every(({ url }) => url.startsWith("https://")), block.id)
    assert.ok(block.notes.some((note) => note.startsWith("Se vuelve a revisar antes del")), block.id)
  }
  assert.ok(text(html).includes("Información verificada por AuxiliAR el"), "the day of verification is visible")
  assert.ok(text(html).includes("Respalda la gratuidad de:") && text(html).includes("No confirma que haya turnos disponibles"), "what each source backs is kept")
  // the first aid block keeps every source of every guide, with the guides it backs
  const guides = about.REFERENCE_GROUPS.find(({ id }) => id === "primeros-auxilios").blocks[0]
  for (const guide of FIRST_AID_GUIDE_CONTENT) for (const { url } of guide.sources) assert.ok(guides.references.some((reference) => reference.url === url), `${guide.slug}: ${url}`)
})
