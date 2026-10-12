/*
 * Tests of Salud mental: five sections with real content, each one with its official sources in Sobre AuxiliAR, the national lines read from the
 * lines dataset (the Emergencias work) and never copied, the directory of the research of 12 October 2026 with no repeated place, no disputed address, no cost
 * the pages do not state, and none of the mockup data.
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
  "section-4": (await vite.ssrLoadModule(`${sectionDir}/Section4/Section4.content.tsx`)).default,
  "section-5": (await vite.ssrLoadModule(`${sectionDir}/Section5/Section5.content.tsx`)).default,
  "section-6": (await vite.ssrLoadModule(`${sectionDir}/Section6/Section6.content.tsx`)).default,
}
const directory = await vite.ssrLoadModule("/src/content/categories/MentalHealth/MentalHealth.directory.ts")
const places = JSON.parse(readFileSync(resolve(root, "src/data/resources/places/ar-c.json"), "utf8")).resources
const lines = JSON.parse(readFileSync(resolve(root, "src/data/resources/lines/nacional.json"), "utf8")).resources

const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const render = (component) => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ["/temas/salud-mental"] }, createElement(component)))
const hrefs = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1].replace(/&amp;/g, "&"))
const pages = Object.fromEntries(Object.entries(CONTENT).map(([id, component]) => [id, render(component)]))

test("salud mental has six sections that open straight on the first, and it is no longer 'próximamente'", () => {
  assert.deepEqual(MENTAL_HEALTH.sections.map(({ id, title }) => [id, title]), [
    ["section-1", "Dónde buscar ayuda"],
    ["section-6", "Atención en la Ciudad"],
    ["section-2", "Conocé tus derechos"],
    ["section-3", "Herramientas para cuidarte"],
    ["section-4", "Consumos y acompañamiento"],
    ["section-5", "Otras provincias"],
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
    // the only external links are those that take a person to the page of a place or line of the directory, or to an OMS material: all of them are in Sobre AuxiliAR
    const known = new Set(about.REFERENCE_GROUPS.flatMap(({ blocks }) => blocks).flatMap(({ references }) => references.map(({ url }) => url)))
    for (const href of hrefs(html).filter((link) => link.startsWith("https://"))) assert.ok(known.has(href), `${id}: ${href} is listed in Sobre AuxiliAR`)
  }
  assert.equal(sources.DIRECTORY_CHECKED_AT, "2026-10-12")
  for (const blockId of ["mental-donde", "mental-derechos", "mental-autocuidado"]) {
    const block = referencesOf(blockId)
    assert.deepEqual(block.checkedAt, ["2026-10-08"], blockId)
    for (const { url } of block.references) assert.match(url, /^https:\/\/(www\.argentina\.gob\.ar|www\.who\.int|cdn\.who\.int)\//, `${blockId}: ${url} is an official source`)
  }
  for (const blockId of ["mental-ciudad", "mental-yoga", "mental-consumos", "mental-provincias"]) {
    const block = referencesOf(blockId)
    assert.deepEqual(block.checkedAt, ["2026-10-12"], blockId)
    assert.ok(block.references.length > 0 && block.references.every(({ url }) => /^https:\/\//.test(url)), blockId)
  }
})

test("each source is kept, in Sobre AuxiliAR, under the section its content comes from: the law, the plain-words law, the ministry pages and the OMS", () => {
  const urls = (blockId) => referencesOf(blockId).references.map(({ url }) => url)
  assert.deepEqual(urls("mental-donde"), [sources.ORIENTACION.url, sources.LEY_SIMPLE.url, sources.LEY_26657.url])
  assert.deepEqual(urls("mental-derechos"), [sources.LEY_26657.url, sources.LEY_SIMPLE.url])
  assert.deepEqual(urls("mental-autocuidado"), [sources.OMS_ESTRES.url, sources.OMS_GUIA.url, sources.OMS_ANSIEDAD.url])
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
  assert.equal([...body.slice(0, body.indexOf("Cinco ideas para una pausa")).matchAll(/<li>/g)].length, 7)
  const habits = content.slice(content.indexOf("Una rutina"), content.indexOf("Cinco ideas para una pausa"))
  assert.ok(!/\d/.test(habits), "no hours, minutes or quantities written as numbers")
  assert.ok(content.includes("No reemplazan la atención profesional"))
  assert.ok(content.includes("Cuando te resulta difícil controlar el estrés, conviene acudir a un profesional de la salud"))
  assert.ok(hrefs(html).includes("/temas/salud-mental?seccion=section-1"))
  assert.ok(!/tratamiento|diagn[oó]stic(o|ar)|cura|terapia/i.test(habits), "no clinical claim in the habits")
})

test("the numbers: the national lines come from the lines dataset, nothing is called free that its page does not say, and no promise of a place or of confidentiality", () => {
  const dialsOf = (id) => lines.find((line) => line.id === id).contacts.map(({ display }) => display)
  for (const [id, html] of Object.entries(pages)) {
    const content = text(html)
    assert.ok(!html.includes("tel:"), id)
    assert.ok(!/confidencial|garantiz|sin costo|hay lugar|cupo asegurado/i.test(content.replace(/no asegura internación ni cupos|garantizan aliviar|no garantiza que queden cupos|no equivale a una cama ni a un tratamiento garantizado/gi, "")), id)
    // an emergency number that is not a line of the dataset or of the directory is never written
    for (const emergency of ["100", "102", "107", "137", "144", "145", "911"]) assert.ok(!new RegExp("(^|[^\\d-])" + emergency + "([^\\d-]|$)").test(content), id + ": " + emergency)
  }
  // section 1: the two national lines, read from data/resources/lines (not typed in the page)
  const s1 = text(pages["section-1"])
  for (const display of [...dialsOf("urgencias-salud-mental-0800"), ...dialsOf("prevencion-suicidio-cas")]) assert.ok(s1.includes(display), display)
  assert.ok(text(pages["section-4"]).includes(dialsOf("consumos-problematicos-141")[0]))
  // the national lines are not repeated in the directory
  const dirText = JSON.stringify(directory)
  for (const dial of ["0800-999-0091", "0800-345-1435", "08009990091"]) assert.ok(!dirText.includes(dial), "directory: " + dial + " is already in the lines")
  // the 135 is the CAS line for CABA and GBA; here it is written only for the two provincial lines that use the same digits, and says whose they are
  const with135 = directory.LINEAS_OTRAS.filter(({ phone }) => phone === "135").map(({ id }) => id)
  assert.deepEqual(with135, ["entre-rios-135", "tucuman-135"])
  // cost: said once, as what it is (a general norm), and the yoga page that does not say it is not called free
  assert.ok(text(pages["section-6"]).includes("Ley 153 (arts. 2 y 3.g). Es una norma general, no una frase de cada centro."))
  const s3 = text(pages["section-3"])
  assert.ok(s3.includes("La página oficial no informa si tienen costo: no las damos por gratuitas."))
  assert.ok(!/yoga[^.]*gratuit/i.test(s3.replace("no las damos por gratuitas", "")))
  assert.ok(directory.YOGA_CABA.every(({ note }) => note === "La página no informa el costo."))
})

test("the directory: no repeated place, nothing with a disputed address, and what is already on the map is marked, not copied with other data", () => {
  const ids = [...directory.GUARDIAS_CABA, ...directory.GUARDIAS_CABA_INFANTIL, ...directory.CSM_1, ...directory.BONAPARTE, ...directory.LINEAS_CABA, ...directory.LINEAS_OTRAS, ...directory.CONSUMOS_CABA, ...directory.CSM_3, ...directory.APOYO_MUTUO, ...directory.YOGA_CABA, ...directory.PROVINCIAS.flatMap(({ items }) => items)].map(({ id }) => id)
  assert.equal(new Set(ids).size, ids.length, "no entry twice")
  assert.equal(new Set(directory.CESAC_MENTAL.map(({ n }) => n)).size, directory.CESAC_MENTAL.length)
  // the research left these out until their address or identity is settled
  for (const n of [2, 8, 21, 24, 27, 29, 31, 47, 48]) assert.ok(!directory.CESAC_MENTAL.some((cesac) => cesac.n === n), "CeSAC " + n + " has a disputed address")
  for (const id of ["hospital-pinero", "hospital-tornu"]) assert.ok(![...directory.GUARDIAS_CABA, ...directory.GUARDIAS_CABA_INFANTIL].some((hospital) => hospital.id === id), id)
  assert.ok(!ids.some((id) => /^cemar-1|^cas-otras|^tucuman-guardia|^na-pendiente|evento|vencido|covid/.test(id)), "pending, historic or one-day entries stay out")
  // the places of the map (ar-c.json) are marked here and the other way round: CeSAC 3 and 41 are on both, never with different data
  const onMap = new Set(places.map(({ id }) => id))
  for (const cesac of directory.CESAC_MENTAL) assert.equal(Boolean(cesac.onMap), onMap.has("cesac-" + cesac.n), "CeSAC " + cesac.n)
  assert.equal(directory.BONAPARTE.length, 3)
  assert.equal(directory.CSM_3.length, 1)
  // the CeSAC 10 appears once in the list of care and once as the Biedak center of consumos (two services), never with the same text
  assert.ok(directory.CESAC_MENTAL.some(({ n }) => n === 10) && directory.CONSUMOS_CABA.some(({ id }) => id.startsWith("cesac-10")))
  for (const item of [...directory.CSM_1, ...directory.BONAPARTE, ...directory.LINEAS_CABA, ...directory.LINEAS_OTRAS, ...directory.CONSUMOS_CABA, ...directory.APOYO_MUTUO, ...directory.PROVINCIAS.flatMap(({ items }) => items)]) assert.match(item.url, /^https:\/\//, item.id)
  for (const cesac of directory.CESAC_MENTAL) {
    assert.match(cesac.url, /^https:\/\/buenosaires\.gob\.ar\/gcaba_historico\/salud\/cesac-\d+$/, cesac.title)
    assert.match(cesac.phone, /^(11 )?\d{4}-\d{4}/, cesac.title)
  }
  assert.equal(directory.GUARDIAS_CABA.length, 16)
  assert.equal(directory.GUARDIAS_CABA_INFANTIL.length, 3)
})

test("dónde buscar ayuda, consumos y otras provincias say what they are and what they are not", () => {
  const s1 = text(pages["section-1"])
  assert.ok(s1.includes("Estos hospitales de la Ciudad tienen guardia de salud mental las 24 horas, todos los días del año."))
  const s6 = text(pages["section-6"])
  assert.ok(s6.includes("nadie llamó ni fue a los lugares"))
  assert.ok(s1.includes("Los demás hospitales no se presentan como atención para niñas y niños."))
  assert.ok(s1.includes("Son líneas de escucha y orientación: no reemplazan una guardia ni la atención presencial."))
  assert.ok(s6.includes("También está en el mapa"))
  assert.ok(s6.includes("La Resolución 1066/2026"), "Bonaparte: the condition for people without permanent residence")
  assert.ok(s6.includes("Las páginas no publican los horarios de estos servicios"))
  assert.ok(s6.includes("Comuna 4") && s6.includes("CeSAC Nº 1 · Barracas 1"), "CeSAC by comuna")
  assert.ok(s1.length < 9000, "section 1 stays short: lines, guardias and the way to the rest")
  const s4 = text(pages["section-4"])
  assert.ok(s4.includes("No son atención profesional.") && s4.includes("no equivale a una cama ni a un tratamiento garantizado"))
  const s5 = text(pages["section-5"])
  assert.ok(s5.includes("Que una provincia no aparezca no quiere decir que no tenga servicios."))
  for (const province of ["Córdoba", "Entre Ríos", "Jujuy", "La Rioja"]) assert.ok(s5.includes(province), province)
  assert.ok(s5.includes("el número es un celular y puede tener condiciones de comunicación"), "Neuquén")
  assert.ok(s5.includes("La página no publica el horario."), "Formosa")
})

test("none of the mockup data of the old draft (fictitious people, numbers, WhatsApp) is in the category", () => {
  const dir = resolve(root, "src/content/categories/MentalHealth")
  const files = []
  const walk = (path) => readdirSync(path, { withFileTypes: true }).forEach((entry) => (entry.isDirectory() ? walk(join(path, entry.name)) : files.push(join(path, entry.name))))
  walk(dir)
  for (const file of files.filter((name) => /\.(ts|tsx)$/.test(name))) {
    const code = readFileSync(file, "utf8")
    assert.ok(!/wa\.me|PROFESSIONALS|MOCKUP/.test(code), file)
  }
})

test("the chat's index lists the six sections with their summary, up to date", async () => {
  const index = JSON.parse(readFileSync(resolve(root, "../server/src/main/resources/content/content-index.json"), "utf8"))
  for (const section of MENTAL_HEALTH.sections) {
    const page = index.find((entry) => entry.path === `/temas/salud-mental?seccion=${section.id}`)
    assert.ok(page, section.id)
    assert.equal(page.hasInfo, true)
    assert.equal(page.summary, section.summary, "stale: run npm run content:index")
    assert.equal(page.title, `Salud mental › ${section.title}`)
  }
})
