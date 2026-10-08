/*
 * Tests of Salud sexual y ESI: three sections with real content and the official source of each statement; the educational
 * material is kept apart from care (nothing is called free care unless the sentence says whose statement it is); no phone
 * number is copied; no center, hour or appointment is invented; the map is only linked, never changed.
 * Loaded through Vite like the app does.
 *   npm run sexual:test
 */
import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
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
const { SEX_EDUCATION } = await vite.ssrLoadModule("/src/content/categories/SexEducation/SexEducation.ts")
const sources = await vite.ssrLoadModule("/src/content/categories/SexEducation/SexEducation.sources.ts")
const sectionDir = "/src/content/categories/SexEducation/sections"
const CONTENT = {
  "section-1": (await vite.ssrLoadModule(`${sectionDir}/Section1/Section1.content.tsx`)).default,
  "section-2": (await vite.ssrLoadModule(`${sectionDir}/Section2/Section2.content.tsx`)).default,
  "section-3": (await vite.ssrLoadModule(`${sectionDir}/Section3/Section3.content.tsx`)).default,
}

const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const render = (component) => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ["/temas/esi"] }, createElement(component)))
const hrefs = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1].replace(/&amp;/g, "&"))
const external = (html) => hrefs(html).filter((href) => href.startsWith("https://"))
const pages = Object.fromEntries(Object.entries(CONTENT).map(([id, component]) => [id, render(component)]))

test("salud sexual y ESI has three sections that open straight on the first, and it is no longer 'próximamente'", () => {
  assert.deepEqual(SEX_EDUCATION.sections.map(({ id, title }) => [id, title]), [
    ["section-1", "Dónde buscar atención"],
    ["section-2", "Anticoncepción y prevención"],
    ["section-3", "Derechos y ESI"],
  ])
  assert.equal(SEX_EDUCATION.defaultSectionId, "section-1")
  assert.equal(SEX_EDUCATION.preparing, undefined)
  assert.equal(SEX_EDUCATION.to, "/temas/esi")
  for (const { summary } of SEX_EDUCATION.sections) assert.ok(summary && summary.length > 60)
})

test("every section has content, no placeholder, and ends with its official sources and the day they were compared", () => {
  assert.equal(sources.CHECKED_AT, "2026-10-08")
  for (const [id, html] of Object.entries(pages)) {
    const content = text(html)
    assert.ok(!/en construcci[oó]n|Sección \d/i.test(content), id)
    assert.ok(content.includes("Fuentes oficiales") && content.includes("Texto comparado con estas fuentes el 8 de octubre de 2026"), id)
    // the sources list: only the official pages of the Nación, the laws and the Ciudad
    const list = html.slice(html.indexOf('aria-label="Fuentes"'))
    for (const href of external(list)) assert.match(href, /^https:\/\/(www\.argentina\.gob\.ar|buenosaires\.gob\.ar)\//, `${id}: ${href}`)
    assert.ok(html.includes('rel="noopener noreferrer"') && content.includes("se abre en una pestaña nueva"), id)
  }
})

test("each section names the sources of what it says", () => {
  const listed = (id) => external(pages[id].slice(pages[id].indexOf('aria-label="Fuentes"')))
  assert.deepEqual(listed("section-1"), [sources.PREGUNTAS.url, sources.LINEA.url])
  assert.deepEqual(listed("section-2"), [sources.METODOS.url, sources.PREGUNTAS.url, sources.LEY_25673.url, sources.CABA_TEST.url, sources.CABA_COORDINACION.url])
  assert.deepEqual(listed("section-3"), [sources.LEY_25673.url, sources.LEY_26150.url, sources.LEY_27610.url, sources.PORTAL.url, sources.ESI_MATERIALES.url])
  assert.match(sources.LEY_27610.url, /ley-27610-346231\/texto$/)
})

test("dónde buscar atención: the emergency button, the map only explores, and the access note sits next to the resource", () => {
  const html = pages["section-1"]
  const content = text(html)
  assert.ok(content.includes("Ver números de emergencia") && !html.includes("tel:"))
  assert.ok(content.includes("AuxiliAR no otorga turnos ni realiza consultas médicas, y no te pide datos personales ni de salud"))
  assert.ok(hrefs(html).includes("/centros?filtro=sexual-health"), "map, filtered, through the shared link")
  assert.ok(content.includes("Explorar centros de salud en el mapa") && content.includes("Consultá cada ficha para saber qué servicios gratuitos están confirmados."))
  const access = "La forma de acceder a la atención puede variar según el centro. Algunos servicios requieren admisión, turno o derivación."
  assert.equal([...content.matchAll(/admisión, turno o derivación/g)].length, 1)
  assert.ok(content.indexOf(access) < content.indexOf("Explorar centros de salud en el mapa"))
  assert.ok(content.indexOf("Estamos") === -1 && content.indexOf("Acá encontrás información") < content.indexOf("Ver números de emergencia"))
  assert.ok(hrefs(html).includes("/centros?seccion=section-2"))
})

test("educational material, orientation and confirmed free care are told apart", () => {
  const content = text(pages["section-1"])
  assert.ok(content.includes("Información, orientación y atención no son lo mismo"))
  assert.ok(content.includes("Información gratuita: guías, leyes y materiales que podés leer sin pagar. No son una consulta."))
  assert.ok(content.includes("Orientación: una línea o un equipo que responde dudas. No reemplaza la atención médica."))
  assert.ok(content.includes("Atención gratuita confirmada: una prestación de la que una fuente confiable confirma que no tiene costo"))
  assert.ok(content.includes("si no la marca, no está confirmada"))
})

test("the other pages are pointers: named, with who runs them, and never presented as centers verified by AuxiliAR", () => {
  const html = pages["section-1"]
  const content = text(html)
  assert.ok(content.includes("AuxiliAR no verificó cada lugar de sus listados ni su gratuidad"))
  const more = html.slice(html.indexOf('aria-labelledby="ss-more"'), html.indexOf('aria-label="Fuentes"'))
  const urls = external(more)
  assert.deepEqual(urls, [sources.HUESPED_DONDE.url, sources.HUESPED_SERVICIOS.url, sources.PBA_SSR.url, sources.SANTA_FE_IVE.url, sources.TUCUMAN_ANTICONCEPCION.url])
  for (const href of urls) assert.match(href, /^https:\/\/(donde\.huesped\.org\.ar|new\.huesped\.org\.ar|www\.ms\.gba\.gov\.ar|www\.santafe\.gob\.ar|msptucuman\.gov\.ar)\//, href)
  // each provincial page says that it is only for its province, and that it is not a service verified by AuxiliAR
  for (const phrase of ["Solo para la provincia de Buenos Aires", "Solo para la provincia de Santa Fe", "Solo para la provincia de Tucumán", "Cada página vale solo para su provincia. No son servicios verificados por AuxiliAR."]) assert.ok(content.includes(phrase), phrase)
  // nothing paid or commercial: Casa FUSA (SS08) and the university's program for its students (SS14) are not here
  for (const [id, page] of Object.entries(pages)) assert.ok(!/fusa|unlp|arancel|precio|descuento|obra social/i.test(text(page)) || /obras sociales y prepagas|obras sociales deben/.test(text(page)), id)
  for (const [id, page] of Object.entries(pages)) assert.ok(!/grupofusa|unlp\.edu/.test(page), id)
})

test("anticoncepción y prevención: the nine methods of the ministry as names, the condom, and the Ciudad's own words", () => {
  const html = pages["section-2"]
  const content = text(html)
  for (const method of ["Preservativos", "Pastillas combinadas", "Pastillas de una sola hormona", "Anticonceptivos inyectables", "Implante subdérmico", "Dispositivo intrauterino (DIU)", "Anticoncepción de emergencia", "Ligadura tubaria", "Vasectomía"]) {
    assert.ok(content.includes(method), method)
  }
  assert.equal([...html.slice(0, html.indexOf('aria-labelledby="ss-condom"')).matchAll(/<li>/g)].length, 9)
  assert.ok(content.includes("único método anticonceptivo que además ayuda a reducir el riesgo de infecciones de transmisión sexual (ITS), incluido el VIH. No elimina el riesgo por completo"))
  // the condom never reads as absolute protection
  assert.ok(!/protege de las ITS|previene las infecciones|evita las ITS|100 ?%|totalmente|sin riesgo/i.test(content), "no absolute protection")
  // the intro to the methods is general, with no personal indication
  assert.ok(content.includes("Esto es información general, no una indicación personal"))
  assert.ok(content.indexOf("Los métodos anticonceptivos permiten evitar un embarazo") < content.indexOf("El Ministerio de Salud nombra estos métodos"))
  // the testing is said as the Ciudad's statement, not as AuxiliAR's, and no center, hour, age rule or result time is made up
  assert.ok(content.includes("el Gobierno de la Ciudad informa que el test de VIH y sífilis es sencillo, confidencial y gratuito en el sistema público"))
  assert.ok(content.includes("AuxiliAR no verificó cada centro de la lista oficial"))
  assert.ok(!/minutos|resultado r[aá]pido|de lunes a|\d{1,2} ?(a|hs|h)\b/i.test(content.replace(/Ley 25\.673|26\.150|27\.610/g, "")), "no hours, no result times")
  // no medical advice: no doses, efficacy figures or side effects
  assert.ok(!/eficacia|%|dosis|efectos secundarios|contraindica|mg\b|horas después/i.test(content))
  assert.ok(content.includes("No reemplaza la consulta con un profesional de la salud"))
})

test("derechos y ESI: each right is one the law states, with its law named, and no procedure or deadline", () => {
  const content = text(pages["section-3"])
  assert.ok(content.includes("Ley 25.673") && content.includes("Ley 26.150") && content.includes("Ley 27.610"))
  assert.ok(content.includes("articula aspectos biológicos, psicológicos, sociales, afectivos y éticos"))
  assert.ok(content.includes("láminas, desplegables y cuadernillos"))
  assert.ok(content.includes("no significa que haya un turno inmediato"))
  assert.ok(!/semana|d[ií]as corridos|plazo|misoprostol|medicaci[oó]n|procedimiento|pastilla/i.test(content), "no weeks, deadlines, drugs or procedures")
  assert.ok(hrefs(pages["section-3"]).includes("/temas/esi?seccion=section-1"))
})

test("no phone line is copied and nothing is promised: no number, no hours, no appointments", () => {
  for (const [id, html] of Object.entries(pages)) {
    const content = text(html)
    assert.ok(!html.includes("tel:") && !html.includes("wa.me") && !html.includes("whatsapp"), id)
    assert.ok(!/0800|\b(100|102|107|135|137|141|144|145|148|911)\b|\b\d{2}[- ]?\d{4}[- ]?\d{4}\b|\b381\b/.test(content), `${id}: no number`)
    // "garantiza" appears only as what Ley 25.673 says (art. 2)
    assert.ok(!/24 horas|las 24|garantiz|sin costo|gratis/i.test(content.replace("preservativos gratis en bocas de distribución", "").replace("La Ley 25.673 garantiza a toda la población", "")), id)
    assert.ok(!/turno inmediato|sin turno|siempre hay|stock/i.test(content.replace("no significa que haya un turno inmediato", "")), id)
  }
})

test("'gratuit-' only appears where a sentence says whose statement it is, or what the term means", () => {
  const allowed = [
    "Consultá cada ficha para saber qué servicios gratuitos están confirmados.",
    "Información gratuita: guías, leyes y materiales que podés leer sin pagar.",
    "Atención gratuita confirmada: una prestación de la que una fuente confiable confirma que no tiene costo.",
    "AuxiliAR no verificó cada lugar de sus listados ni su gratuidad",
    "confidencial y gratuito en el sistema público",
    "deben cubrirla de forma integral y gratuita",
    "preservativos gratis en bocas de distribución",
  ]
  for (const [id, html] of Object.entries(pages)) {
    let content = text(html)
    for (const phrase of allowed) content = content.replaceAll(phrase, "")
    // the source titles and the section titles carry no claim either
    assert.ok(!/gratuit|gratis/i.test(content), `${id}: ${content.match(/.{40}(gratuit|gratis).{40}/i)?.[0]}`)
  }
})

test("a person is never asked for sensitive data to read the content: no form, field or registration", () => {
  for (const [id, html] of Object.entries(pages)) {
    assert.ok(!/<(form|input|textarea|select)\b/.test(html), id)
    assert.ok(!/registr|inici[aá] sesi[oó]n|cre[aá] una cuenta/i.test(text(html)), id)
  }
})

test("the shared map and the emergency area are not touched by this category", () => {
  const dir = resolve(root, "src/content/categories/SexEducation")
  const files = []
  const walk = (path) => { for (const entry of readdirSync(path, { withFileTypes: true })) { if (entry.isDirectory()) walk(join(path, entry.name)); else files.push(join(path, entry.name)) } }
  walk(dir)
  for (const file of files.filter((name) => /\.(ts|tsx)$/.test(name))) {
    const code = readFileSync(file, "utf8")
    assert.ok(!/utils\/places|data\/resources|emergency\.ts|EmergencyBar|nacional\.json|HelpBot|Auxi\b/.test(code.replace(/^\s*(\/\/|\*|\/\*).*$/gm, "")), file)
  }
})

test("the index of Auxi's content lists the three sections, up to date with the summaries", () => {
  const index = JSON.parse(readFileSync(resolve(root, "../server/src/main/resources/content/content-index.json"), "utf8"))
  const pagesList = Array.isArray(index) ? index : (index.pages ?? Object.values(index).find(Array.isArray))
  for (const section of SEX_EDUCATION.sections) {
    const entry = pagesList.find((page) => page.path === `/temas/esi?seccion=${section.id}`)
    assert.ok(entry, section.id)
    assert.equal(entry.title, `Salud sexual y ESI › ${section.title}`)
    assert.equal(entry.summary, section.summary, `${section.id}: run npm run content:index`)
  }
})
