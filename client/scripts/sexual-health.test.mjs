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
const about = await vite.ssrLoadModule("/src/content/categories/About/About.sources.ts")
// The sources of the pages are all in "Sobre AuxiliAR": the references of the group of Salud sexual y ESI, by block
const referencesOf = (blockId) => about.REFERENCE_GROUPS.find(({ id }) => id === "salud-sexual").blocks.find(({ id }) => id === blockId)
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

test("salud sexual y ESI has four sections (IVE/ILE is its own, visible one) that open straight on the first, and it is no longer 'próximamente'", () => {
  assert.deepEqual(SEX_EDUCATION.sections.map(({ id, title }) => [id, title]), [
    ["section-1", "Dónde buscar atención"],
    ["section-2", "Anticoncepción y prevención"],
    ["section-4", "Interrupción voluntaria y legal del embarazo (IVE/ILE)"],
    ["section-3", "Derechos y ESI"],
  ])
  assert.equal(SEX_EDUCATION.defaultSectionId, "section-1")
  assert.equal(SEX_EDUCATION.preparing, undefined)
  assert.equal(SEX_EDUCATION.to, "/temas/esi")
  // section-4 has no summary on purpose: Auxi's index (a server resource) is not regenerated in this round
  for (const { id, summary } of SEX_EDUCATION.sections.filter(({ id }) => id !== "section-4")) assert.ok(summary && summary.length > 60, id)
})

test("every section has content and no placeholder; its sources and the day they were compared are in Sobre AuxiliAR, not in the page", () => {
  assert.equal(sources.CHECKED_AT, "2026-10-08")
  for (const [id, html] of Object.entries(pages)) {
    const content = text(html)
    assert.ok(!/en construcci[oó]n|Sección \d/i.test(content), id)
    assert.ok(!content.includes("Fuentes oficiales") && !content.includes("Texto comparado con estas fuentes"), `${id}: no block of sources`)
  }
  // the day each text was compared, and only official pages of the Nación, the laws and the Ciudad
  const days = { "sexual-donde": ["2026-10-08"], "sexual-anticoncepcion": ["2026-10-09"], "sexual-derechos": ["2026-10-08"], "sexual-ive": ["2026-10-09"] }
  for (const [blockId, checkedAt] of Object.entries(days)) {
    const block = referencesOf(blockId)
    assert.deepEqual(block.checkedAt, checkedAt, blockId)
    for (const { url } of block.references) assert.match(url, /^https:\/\/(www\.argentina\.gob\.ar|buenosaires\.gob\.ar)\//, `${blockId}: ${url}`)
  }
})

test("each section's sources are kept, in Sobre AuxiliAR, under the section its content comes from", () => {
  const listed = (blockId) => referencesOf(blockId).references.map(({ url }) => url)
  assert.deepEqual(listed("sexual-donde"), [sources.PREGUNTAS.url, sources.LINEA.url])
  assert.deepEqual(listed("sexual-anticoncepcion"), [sources.PRESERVATIVO_VAGINAL, sources.PRESERVATIVOS, sources.METODO_PASTILLAS_COMBINADAS, sources.METODO_PASTILLAS_UNA_HORMONA, sources.METODO_INYECTABLES, sources.METODO_IMPLANTE, sources.METODO_DIU, sources.METODO_AHE, sources.METODO_LIGADURA, sources.METODO_VASECTOMIA, sources.PREGUNTAS, sources.CABA_METODOS, sources.CABA_CONSEJERIAS, sources.CABA_TEST, sources.CABA_COORDINACION].map(({ url }) => url))
  assert.deepEqual(listed("sexual-derechos"), [sources.LEY_25673.url, sources.LEY_26150.url, sources.LEY_27610.url, sources.PORTAL.url, sources.ESI_MATERIALES.url])
  assert.deepEqual(listed("sexual-ive"), [sources.LEY_27610.url, sources.IVE_PAGINA.url, sources.CABA_CONSEJERIAS.url, sources.LINEA.url])
  assert.match(sources.LEY_27610.url, /ley-27610-346231\/texto$/)
  // what the cards of other provinces and of the organization say comes from these pages, with the day they were read
  assert.deepEqual(listed("sexual-cobertura"), [sources.PBA_SSR.url, sources.SANTA_FE_IVE.url, sources.TUCUMAN_ANTICONCEPCION.url, sources.HUESPED_DONDE.url, sources.ESI_PBA.url, sources.ESI_CHACO.url])
  assert.deepEqual(referencesOf("sexual-cobertura").checkedAt, ["2026-10-10"])
  // the notes that said what the pages are not stay on the page; the license notes are with the sources
  assert.ok(text(pages["section-1"]).includes("Las páginas de «Más recursos» son de otras organizaciones: AuxiliAR no responde por su contenido."))
  assert.ok(text(pages["section-2"]).includes("Es información general: no es un diagnóstico ni indicaciones de tratamiento."))
  assert.ok(text(pages["section-3"]).includes("Es información general: no es asesoramiento legal ni médico."))
  assert.ok(referencesOf("sexual-anticoncepcion").notes.some((note) => note.includes("Creative Commons")))
})

test("dónde buscar atención: no repeated emergency notice, the map only explores, and the access note sits next to the resource", () => {
  const html = pages["section-1"]
  const content = text(html)
  // the category no longer repeats the permanent access to the emergencies (emergency bar and bottom navigation)
  assert.ok(!content.includes("Ver números de emergencia") && !content.includes("Si estás en peligro ahora o sufriste una agresión") )
  assert.deepEqual([...html.matchAll(/href="(tel:[^"]+)"/g)].map((m) => m[1]), ["tel:08002223444"], "the only phone link is the national line's call button")
  assert.ok(content.includes("AuxiliAR no otorga turnos ni realiza consultas médicas, y no te pide datos personales ni de salud"))
  assert.ok(hrefs(html).includes("/centros?filtro=sexual-health"), "map, filtered, through the shared link")
  assert.ok(content.includes("Ver el mapa") && content.includes("Consultá cada ficha para saber qué servicios gratuitos están confirmados."))
  const access = "La forma de acceder a la atención puede variar según el centro. Algunos servicios requieren admisión, turno o derivación."
  assert.equal([...content.matchAll(/admisión, turno o derivación/g)].length, 1)
  assert.ok(content.indexOf(access) < content.indexOf("Ver el mapa"))
  assert.ok(content.indexOf("Estamos") === -1 && content.includes("Acá encontrás información"))
  assert.ok(!hrefs(html).includes("/centros?seccion=section-2") && !content.includes("Cómo verificamos"), "no link to a verification page: the sources are in Sobre AuxiliAR")
})

test("educational material, orientation and confirmed free care are told apart", () => {
  const content = text(pages["section-1"])
  assert.ok(content.includes("Información, orientación y atención no son lo mismo"))
  assert.ok(content.includes("Información gratuita: guías, leyes y materiales que podés leer sin pagar. No son una consulta."))
  assert.ok(content.includes("Orientación: una línea o un equipo que responde dudas. No reemplaza la atención médica."))
  assert.ok(content.includes("Gratuidad confirmada: una prestación de la que una fuente confiable confirma que no tiene costo"))
  assert.ok(content.includes("si no la marca, no está confirmada"))
})

test("other provinces and the civil organization are told inside AuxiliAR: what, for whom, cost, access, contact; never presented as centers verified by AuxiliAR", () => {
  const html = pages["section-1"]
  const content = text(html)
  assert.ok(content.includes("AuxiliAR no verificó estos servicios"))
  const provinces = html.slice(html.indexOf('aria-labelledby="ss-provinces"'), html.indexOf('aria-labelledby="ss-civil"'))
  // every card says what it offers, for whom, the cost and conditions, how to get it, the contact, and where its text comes from
  for (const title of ["Buenos Aires", "Santa Fe", "Tucumán"]) assert.ok(text(provinces).includes(title), title)
  assert.equal([...provinces.matchAll(/Qué ofrece/g)].length, 3)
  for (const label of ["Para quién", "Costo y condiciones", "Cómo acceder", "Contacto"]) assert.equal([...provinces.matchAll(new RegExp(label, "g"))].length, 3, label)
  assert.ok(/leída el 10 de octubre de 2026 con una herramienta de lectura automática/.test(content))
  // IVE/ILE summaries are pending validation, and the only external links are actions that cannot be done here
  assert.ok(content.includes("Pendiente de validación legal y profesional"))
  assert.deepEqual(external(html), [sources.PBA_SSR.url, sources.SANTA_FE_IVE.url, sources.HUESPED_DONDE.url])
  assert.ok(!content.includes("Otras páginas para completar"), "no 'visit this page' block")
  // nothing paid or commercial: Casa FUSA (SS08) and the university's program for its students (SS14) are not here
  for (const [id, page] of Object.entries(pages)) assert.ok(!/fusa|unlp|arancel|precio|descuento|obra social/i.test(text(page)) || /obras sociales y prepagas|obras sociales deben/.test(text(page)), id)
  for (const [id, page] of Object.entries(pages)) assert.ok(!/grupofusa|unlp\.edu/.test(page), id)
})

test("the national line is described inside the page, with a call button that is not an emergency number", () => {
  const html = pages["section-1"]
  const content = text(html)
  for (const phrase of ["0800-222-3444", "De lunes a viernes de 9 a 20 hs.", "saludsexual@msal.gov.ar", "No es una línea de emergencia"]) assert.ok(content.includes(phrase), phrase)
  assert.ok(content.includes("La página no aclara si la llamada es gratuita"), "what the page does not say is pending")
})

test("the official lists of the Ciudad are inside the page, as published, with their caution", () => {
  const html = pages["section-2"]
  const content = text(html)
  assert.ok(content.includes("Centros de testeo de VIH y sífilis de la Ciudad (69)") && content.includes("Consejerías en salud sexual de la Ciudad (62)"))
  assert.ok(content.includes("AuxiliAR no verificó estos centros"))
  assert.ok(content.includes("no es necesariamente el teléfono general del centro"))
  assert.deepEqual(external(html), [], "no link to the lists: they are here")
})

test("anticoncepción y prevención: the nine methods explained with the ministry's words, the vaginal condom, and the Ciudad's own words", () => {
  const html = pages["section-2"]
  const content = text(html)
  // one opening block per method (the condom and the eight others), each with its own page of the ministry as a source
  for (const method of ["Preservativos", "Pastillas combinadas", "Pastillas de una sola hormona", "Anticonceptivos inyectables", "Implante subdérmico", "Dispositivo intrauterino (DIU)", "Anticoncepción hormonal de emergencia", "Ligadura tubaria", "Vasectomía"]) {
    assert.ok(content.includes(method), method)
  }
  assert.equal([...html.matchAll(/<details/g)].length, 11, "nine methods and the two lists")
  assert.ok(content.includes("único método anticonceptivo que además ayuda a reducir el riesgo de infecciones de transmisión sexual (ITS), incluido el VIH. No elimina el riesgo por completo"))
  // the condom never reads as absolute protection, and no efficacy figure is given
  assert.ok(!/protege de las ITS|previene las infecciones|evita las ITS|100 ?%|totalmente|sin riesgo|%|efectividad|eficacia/i.test(content), "no absolute protection, no figures")
  // general information, with no personal indication
  assert.ok(content.includes("Esto es información general, no una indicación personal"))
  assert.ok(content.includes("No reemplaza la consulta con un profesional de la salud"))
  // the vaginal condom: the ministry's own explanation; the Hospital Rivadavia (or any center) is NOT named as a place to get it
  assert.ok(content.includes("¿Qué es el preservativo vaginal?") && content.includes("nitrilo") && content.includes("anillo interno"))
  const condom = content.slice(content.indexOf("¿Qué es el preservativo vaginal?"), content.indexOf("¿Qué es el preservativo vaginal?") + 900)
  assert.ok(!/rivadavia/i.test(condom), "no center is named for the vaginal condom")
  assert.ok(content.includes("AuxiliAR no tiene confirmado en qué centros concretos se entregan"))
  // the free statement is the Ciudad's and the national law's, said as theirs
  assert.ok(content.includes("La atención y los métodos son gratuitos en el sistema público"))
  assert.ok(content.includes("el Gobierno de la Ciudad informa que los test de VIH y sífilis son análisis de sangre sencillos, confidenciales y gratuitos en el sistema público"))
  assert.ok(!/minutos|resultado r[aá]pido|de lunes a/i.test(content), "no result times, no weekdays")
})

test("derechos y ESI: each right is one the law states, with its law named, and no procedure or deadline", () => {
  const content = text(pages["section-3"])
  assert.ok(content.includes("Ley 25.673") && content.includes("Ley 26.150") && content.includes("Ley 27.610"))
  assert.ok(content.includes("articula aspectos biológicos, psicológicos, sociales, afectivos y éticos"))
  assert.ok(content.includes("láminas, desplegables y cuadernillos"))
  assert.ok(content.includes("no significa que haya un turno inmediato"))
  assert.ok(!/d[ií]as corridos|misoprostol|medicaci[oó]n|pastilla/i.test(content), "no deadlines, drugs or procedures")
  assert.ok(hrefs(pages["section-3"]).includes("/temas/esi?seccion=section-1"))
})

test("contacts are told as each source gives them, with no emergency number, no wa.me button, and nothing promised", () => {
  for (const [id, html] of Object.entries(pages)) {
    const content = text(html)
    assert.ok(!html.includes("wa.me") && !html.includes("whatsapp"), id)
    // "garantiza" appears only as what Ley 25.673 says (art. 2)
    assert.ok(!/24 horas|las 24|garantiz|sin costo|gratis/i.test(content.replaceAll("preservativos gratis en bocas de distribución", "").replaceAll("se retiran preservativos gratis", "").replaceAll("sin costo adicional", "").replaceAll("La Ley 25.673 garantiza a toda la población", "").replaceAll("La Ley 25.673 garantiza el acceso a información, orientación, métodos y prestaciones de salud sexual y reproductiva", "").replaceAll("Así lo garantiza la ley 26.130", "").replaceAll("debe garantizarse en efectores públicos", "").replaceAll("trabaja para garantizar el acceso", "")), id)
    assert.ok(!/turno inmediato|sin turno|siempre hay|stock/i.test(content.replaceAll("no significa que haya un turno inmediato", "").replaceAll("no asegura que haya turno, stock o un profesional disponible", "").replaceAll("no tiene confirmados turnos, stock ni centros concretos", "")), id)
  }
})

test("'gratuit-' only appears where a sentence says whose statement it is, or what the term means", () => {
  const allowed = [
    "Consultá cada ficha para saber qué servicios gratuitos están confirmados.",
    "Información gratuita: guías, leyes y materiales que podés leer sin pagar.",
    "Gratuidad confirmada: una prestación de la que una fuente confiable confirma que no tiene costo.",
    "AuxiliAR no verificó cada lugar de sus listados ni su gratuidad",
    "confidencial y gratuito en el sistema público",
    "deben cubrirla de forma integral y gratuita",
    "preservativos gratis en bocas de distribución",
    "La atención y los métodos son gratuitos en el sistema público y deben ser entregados sin costo adicional en obras sociales y prepagas",
    "sencillos, confidenciales y gratuitos en el sistema público",
    "donde también se retiran preservativos gratis",
    "se retiran preservativos gratis",
    "Anticonceptivos gratuitos: cuáles son y cómo conseguirlos",
    "informa que son gratuitos en el sistema público",
    "la gratuidad de cada provincia",
    "Que un método sea gratuito y esté cubierto no asegura",
    "con la gratuidad documentada para esa prestación",
    // what the pages of other provinces and of the organization say, as theirs (the card says whose statement it is)
    "La página no aclara si la llamada es gratuita",
    "de forma gratuita y confidencial»",
    "«de manera integral y gratuita», y que los métodos anticonceptivos se entregan de manera gratuita",
    "trabaja para garantizar el acceso gratuito a métodos anticonceptivos»",
    "no forman parte de la canasta gratuita del programa",
    "todos nuestros servicios son gratuitos»",
    "Línea gratuita 0-800-222-HUESPED",
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
  for (const section of SEX_EDUCATION.sections.filter(({ summary }) => summary)) {
    const entry = pagesList.find((page) => page.path === `/temas/esi?seccion=${section.id}`)
    assert.ok(entry, section.id)
    assert.equal(entry.title, `Salud sexual y ESI › ${section.title}`)
    assert.equal(entry.summary, section.summary, `${section.id}: run npm run content:index`)
  }
})
