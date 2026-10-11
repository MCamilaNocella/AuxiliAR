/*
 * Tests of the two guides of Más recursos · Trámites: «Cómo tramitar el CUD» and «Servicios y trámites en tu barrio». They check what the
 * pages say and what they leave out: official sources visible with the day they were read, the notice of review pending, no claim about
 * what the CUD covers, no date, place or requirement copied from the neighbourhood schedule, no gratuity or automatic suspension stated
 * for the itinerant operations, and nothing of it in the map or in Auxi.
 *   npm run round3:test
 */
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const { createServer } = await import("vite")
const vite = await createServer({ root, logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
const { createElement } = await import("react")
const { renderToStaticMarkup } = await import("react-dom/server")
const { MemoryRouter } = await import("react-router")
const Section2 = (await vite.ssrLoadModule("/src/content/categories/Resources/sections/Section2/Section2.content.tsx")).default
const guides = await vite.ssrLoadModule("/src/content/categories/Resources/sections/Section2/Section2.constants.ts")
const sources = await vite.ssrLoadModule("/src/content/categories/Resources/Resources.sources.ts")
const { NeighborhoodAgenda } = await vite.ssrLoadModule("/src/content/categories/Resources/sections/Section2/NeighborhoodAgenda.tsx")
const { RESOURCES } = await vite.ssrLoadModule("/src/content/categories/Resources/Resources.ts")
const about = await vite.ssrLoadModule("/src/content/categories/About/About.sources.ts")
const AboutPage = (await vite.ssrLoadModule("/src/content/categories/About/sections/Section1/Section1.content.tsx")).default
const aboutHtml = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ["/sobre-auxiliar"] }, createElement(AboutPage)))
const aboutBlock = (blockId) => about.REFERENCE_GROUPS.find(({ id }) => id === "mas-recursos").blocks.find(({ id }) => id === blockId)
after(() => vite.close())

const CUD_URL = "https://www.argentina.gob.ar/servicio/como-obtener-el-certificado-unico-de-discapacidad-cud"
const CRONOGRAMA_URL = "https://buenosaires.gob.ar/gcaba_historico/cronograma-de-mas-servicios-en-tu-barrio"

const page = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ["/recursos"] }, createElement(Section2)))
const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const hrefsIn = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1].replace(/&amp;/g, "&"))
/** One card of the page: from its heading to the next card's (the source list inside is a section too, so the sections cannot be matched) */
const card = (id, next) => page.slice(page.indexOf(`aria-labelledby="${id}"`), page.indexOf(`aria-labelledby="${next}"`))
const cud = card("tr-cud", "tr-neighborhood")
const neighborhood = card("tr-neighborhood", "tr-refused")

test("both guides are cards of Trámites, between the vaccines and the rights, and the section is the same one", () => {
  assert.ok(text(cud).includes("Cómo tramitar el CUD"))
  assert.ok(text(neighborhood).includes("Servicios y trámites en tu barrio"))
  const order = ["tr-cesac", "tr-vaccines", "tr-cud", "tr-neighborhood", "tr-refused"].map((id) => page.indexOf(`aria-labelledby="${id}"`))
  assert.ok(order.every((position) => position > 0) && [...order].sort((a, b) => a - b).join() === order.join(), "in this order")
  // no new section and no new navigation: the four sections of Más recursos are the ones there were
  assert.deepEqual(RESOURCES.sections.map(({ title }) => title), ["Tus derechos en salud", "Trámites", "Preguntas frecuentes", "Glosario"])
  // Auxi sends people to a section only when it has a summary: none has, and this one does not get one
  assert.ok(RESOURCES.sections.every((section) => section.summary === undefined))
})

test("the official sources are in Sobre AuxiliAR with the day they were read; the pages keep only the link to the official page", () => {
  const barrioUrls = [CRONOGRAMA_URL, sources.BARRIO_TURNO_ODONTOLOGIA.url, sources.BARRIO_TURNO_OFTALMOLOGIA.url, sources.BARRIO_REDES.url]
  for (const [html, url, label, blockId, urls, days] of [[cud, CUD_URL, sources.CUD_PAGINA.label, "tramite-cud", [CUD_URL], ["2026-10-10"]], [neighborhood, CRONOGRAMA_URL, sources.MAS_SERVICIOS_PAGINA.label, "tramite-barrio", barrioUrls, ["2026-10-10", "2026-10-11"]]]) {
    // the page: the button to the official page (a functional link, in a new tab), and no block of sources
    assert.equal(hrefsIn(html).filter((href) => href === url).length, 1, `${url}: only the button`)
    assert.match(html, /target="_blank" rel="noopener noreferrer"/)
    assert.ok(!text(html).includes("Fuentes oficiales") && !text(html).includes("Texto comparado con estas fuentes") && !text(html).includes(label), "no block of sources in the page")
    // Sobre AuxiliAR: the source, the day it was read, and the pending review
    const block = aboutBlock(blockId)
    assert.deepEqual(block.references.map((reference) => reference.url), urls)
    assert.deepEqual(block.checkedAt, days)
    assert.ok(block.notes.includes("Pendiente de revisión legal y administrativa."))
    assert.ok(text(aboutHtml).includes(label) && text(aboutHtml).includes("Texto comparado con estas fuentes el 10 de octubre de 2026"), "visible in Sobre AuxiliAR")
    for (const extra of urls.slice(1)) assert.ok(aboutHtml.includes(extra), extra)
  }
  assert.equal(sources.CUD_PAGINA.url, CUD_URL)
  assert.equal(sources.MAS_SERVICIOS_PAGINA.url, CRONOGRAMA_URL)
  assert.equal(sources.CHECKED_AT_GUIDES, "2026-10-10")
  assert.ok(aboutBlock("tramite-barrio").notes.includes("La página no muestra fecha de actualización."))
})

test("each guide says, briefly, that its review is pending", () => {
  for (const html of [cud, neighborhood]) {
    assert.ok(text(html).includes("Pendiente de revisión legal y administrativa"))
    assert.ok(text(html).includes("No es asesoramiento legal ni administrativo"))
  }
  assert.ok(guides.PENDING_NOTICE_TEXT.length < 200, "a short notice")
})

test("CUD: the official steps, in order, with the documentation left to the consultation, and nothing said about what it covers", () => {
  assert.equal([...cud.matchAll(/<ol/g)].length, 1)
  const steps = [...cud.matchAll(/<li[^>]*>(.*?)<\/li>/g)].map((match) => text(match[1]))
  assert.deepEqual(steps.slice(0, 5), guides.CUD_GUIDE.steps)
  assert.match(steps[0], /consulta personalizada/)
  assert.match(steps[1], /depende de tu consulta/)
  assert.match(steps[2], /turno para la Junta Evaluadora/)
  assert.match(steps[4], /denegatoria/)
  const body = text(cud)
  assert.ok(body.includes("voluntario y gratuito"), "the page says the procedure is free")
  // nothing about what the certificate covers: no coverage, percentages, benefits promised or lists of documents of our own
  assert.ok(!/cobertura|\d+ ?%|100|reembolso|obra social|prepaga|rehabilitaci|transporte|asignaci|estacionamiento/i.test(body), "no claim about coverage or benefits")
  assert.ok(!/\bDNI\b|partida|historia cl[ií]nica|certificado m[eé]dico original/i.test(body.replace("certificados médicos, informes, planillas y estudios complementarios", "")), "no document invented")
  // the exemptions are said as the page says them, and the missing validity is said as missing
  assert.ok(body.includes("no son automáticas") && body.includes("no informa la vigencia"))
  assert.ok(body.includes("22.431") && body.includes("24.901"))
})

test("operativos: services and dates vary, and gratuity, suspension, dates, places and requirements are not stated in the guide text (the dated agenda is its own block)", () => {
  const agendaAt = neighborhood.indexOf("Próximos operativos del cronograma")
  const agendaEnd = neighborhood.indexOf("Lo que no se puede hacer desde acá")
  assert.ok(agendaAt > 0 && agendaEnd > agendaAt)
  const body = text(neighborhood.slice(0, agendaAt) + neighborhood.slice(agendaEnd))
  assert.match(body, /cambian según la semana y el operativo/)
  assert.ok(body.includes("no quiere decir que esté en el operativo de tu barrio"))
  // turns, limited places and the weather are warnings, as the schedule gives them
  assert.ok(/piden turno/.test(body) && /cupos limitados/.test(body))
  assert.match(body, /pueden suspenderse por las condiciones climáticas/)
  assert.ok(!/se suspenden|siempre se suspende|si llueve/i.test(body), "no automatic suspension")
  // gratuity is not claimed: the page does not say it; the text says so
  assert.ok(!/gratuit|gratis|sin costo|sin cargo|no cuesta/i.test(body.replace("La página no dice si cada servicio tiene costo", "")), "no gratuity")
  assert.ok(body.includes("La página no dice si cada servicio tiene costo"))
  // no date, hour, place or number of the schedule is copied
  assert.ok(!/\b(lunes|martes|miércoles|jueves|viernes|sábado|domingo)\b/i.test(body), "no weekdays")
  assert.ok(!/\b(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\b/i.test(body.replace("10 de octubre de 2026", "")), "no months")
  assert.ok(!/\b\d{1,2}[:.]\d{2}\b|\b\d{1,2} ?(h|hs)\b|comuna|plaza |parque |av\. |calle /i.test(body), "no hours or places")
  // the services are the list of the page, in a closed disclosure, as examples ("entre otros")
  assert.equal([...neighborhood.matchAll(/<details/g)].length, 1)
  assert.ok(!/<details[^>]* open/.test(neighborhood))
  assert.ok(body.includes("entre otros"))
  assert.equal(guides.NEIGHBORHOOD_GUIDE.services.length, 6)
})

test("the operations are not on the map and Auxi does not know them: no data, no prompt, no server file mentions them", () => {
  for (const file of ["src/data/resources/places/ar-c.json", "src/data/resources/coverage.json", "src/data/resources/lines/nacional.json"]) {
    assert.ok(!/más servicios en tu barrio|mas servicios en tu barrio|CUD\b/i.test(readFileSync(resolve(root, file), "utf8")), file)
  }
  const server = readFileSync(resolve(root, "../server/src/main/resources/data/resources.json"), "utf8")
  assert.ok(!/más servicios en tu barrio|certificado único de discapacidad/i.test(server))
  // the page says so to the person
  assert.ok(text(neighborhood).includes("no están en el mapa"))
})

test("the page keeps its rules: only official links, no forms, and the regex of the Ley 27.610 does not take 'vive' for an IVE", () => {
  for (const href of hrefsIn(page).filter((link) => link.startsWith("https://"))) assert.match(href, /^https:\/\/(www\.argentina\.gob\.ar|boletinoficial\.buenosaires\.gob\.ar|buenosaires\.gob\.ar|serviciosba\.buenosaires\.gob\.ar|www\.instagram\.com\/masserviciosentubarrio)\/?/, href)
  assert.ok(!/<(form|input|textarea|select)\b/.test(page))
  const leyRegex = /27\.610|27610|interrupci[oó]n voluntaria|aborto|\bIVE\b|\bILE\b/i
  assert.ok(!leyRegex.test("Quien vive en un barrio, una actividad inclusive, un servicio móvil, difícil, útil"))
  for (const real of ["el IVE", "la ILE", "Ley 27.610", "interrupción voluntaria del embarazo", "aborto"]) assert.ok(leyRegex.test(real), real)
  assert.ok(!leyRegex.test(text(page)), "the page has nothing of the Ley 27.610")
})

test("the cronograma of the operativos is shown from today on, with the day it was read, and says when it expired", () => {
  const show = (from) => text(renderToStaticMarkup(createElement(NeighborhoodAgenda, { from })))
  const during = show("2026-10-14")
  assert.ok(during.includes("Leído el 11 de octubre de 2026") && during.includes("hasta el 31 de octubre de 2026"))
  assert.ok(during.includes("Parque Chacabuco") && during.includes("La Rural") && during.includes("de 16 a 20 h: Parque José Martí"))
  // what passed is not shown
  assert.ok(!during.includes("Parque Lezama") && !during.includes("Plaza Manuel Belgrano") && !during.includes("Barrio Castex"))
  // the weather and the page: warnings, not promises
  assert.ok(during.includes("Los operativos pueden suspenderse") && during.includes("Odontología y oftalmología son con turno y cupos limitados"))
  assert.ok(!/gratuit|gratis|sin costo/i.test(during))
  assert.ok(show("2026-11-01").includes("ya venció") && !show("2026-11-01").includes("La Rural"))
  // the guide shows it between its text and the official pages, which stay as actions (turnos, cronograma, redes)
  assert.ok(neighborhood.indexOf("Próximos operativos") > neighborhood.indexOf("Antes de ir") && neighborhood.indexOf("Próximos operativos") < neighborhood.indexOf("Pedir turno de odontología"))
  assert.deepEqual(hrefsIn(neighborhood).filter((href) => href.startsWith("https://")), [CRONOGRAMA_URL, sources.BARRIO_TURNO_ODONTOLOGIA.url, sources.BARRIO_TURNO_OFTALMOLOGIA.url, sources.BARRIO_REDES.url])
})
