/*
 * Tests of Salud animal: three sections with real content; only what each municipality's own page says about a free service,
 * said as "la página informa"; the services not confirmed are listed apart; a free campaign is never called free veterinary care;
 * no paid clinic, no announced hospital, no guardia or urgencias promised; no phone, address or schedule copied; no second map.
 * Loaded through Vite like the app does.
 *   npm run animal:test
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
const { ANIMALS } = await vite.ssrLoadModule("/src/content/categories/Animals/Animals.ts")
const sources = await vite.ssrLoadModule("/src/content/categories/Animals/Animals.sources.ts")
const sectionDir = "/src/content/categories/Animals/sections"
const CONTENT = {
  "section-1": (await vite.ssrLoadModule(`${sectionDir}/Section1/Section1.content.tsx`)).default,
  "section-2": (await vite.ssrLoadModule(`${sectionDir}/Section2/Section2.content.tsx`)).default,
  "section-3": (await vite.ssrLoadModule(`${sectionDir}/Section3/Section3.content.tsx`)).default,
}

const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const render = (component) => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ["/temas/animales"] }, createElement(component)))
const hrefs = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1].replace(/&amp;/g, "&"))
const external = (html) => hrefs(html).filter((href) => href.startsWith("https://"))
const pages = Object.fromEntries(Object.entries(CONTENT).map(([id, component]) => [id, render(component)]))

test("salud animal has three sections that open straight on the first, and it is no longer 'próximamente'", () => {
  assert.deepEqual(ANIMALS.sections.map(({ id, title }) => [id, title]), [
    ["section-1", "Vacunación y castración gratuitas"],
    ["section-2", "Cuidado y prevención"],
    ["section-3", "Atención veterinaria gratuita"],
  ])
  assert.equal(ANIMALS.defaultSectionId, "section-1")
  assert.equal(ANIMALS.preparing, undefined)
  assert.equal(ANIMALS.to, "/temas/animales")
  for (const { summary } of ANIMALS.sections) assert.ok(summary && summary.length > 60)
})

test("every section has content, no placeholder, and ends with its official sources and the day they were compared", () => {
  assert.equal(sources.CHECKED_AT, "2026-10-08")
  for (const [id, html] of Object.entries(pages)) {
    const content = text(html)
    assert.ok(!/en construcci[oó]n|Sección \d/i.test(content), id)
    assert.ok(content.includes("Fuentes oficiales") && content.includes("Texto comparado con estas fuentes el 8 de octubre de 2026"), id)
    assert.ok(html.includes('rel="noopener noreferrer"') && content.includes("se abre en una pestaña nueva"), id)
    // every external link goes to an official site: a municipality, the Nación, Senasa or a public university
    for (const href of external(html)) assert.match(href, /^https:\/\/(buenosaires\.gob\.ar|www\.rosario\.gob\.ar|cordoba\.gob\.ar|municipalidadsalta\.gob\.ar|www\.neuquencapital\.gov\.ar|www\.argentina\.gob\.ar|www\.fvet\.uba\.ar|www\.fcv\.unlp\.edu\.ar)\//, `${id}: ${href}`)
  }
})

test("vacunación y castración: only what each municipality's page says, and each one with its place, who, how and its own page", () => {
  const html = pages["section-1"]
  const content = text(html)
  const free = html.slice(html.indexOf('aria-labelledby="an-free"'), html.indexOf('aria-labelledby="an-pending"'))
  const pending = html.slice(html.indexOf('aria-labelledby="an-pending"'), html.indexOf('aria-labelledby="an-other"'))
  assert.deepEqual(external(free), sources.CONFIRMED_BY_SOURCE.map(({ url }) => url))
  assert.deepEqual(external(pending), sources.NOT_CONFIRMED.map(({ url }) => url))
  assert.deepEqual(sources.CONFIRMED_BY_SOURCE.map(({ id }) => id), ["caba", "rosario", "cordoba", "salta"])
  assert.deepEqual(sources.NOT_CONFIRMED.map(({ id }) => id), ["pasteur", "neuquen", "protenencia"])
  for (const service of [...sources.CONFIRMED_BY_SOURCE, ...sources.NOT_CONFIRMED]) {
    for (const field of ["place", "by", "offers", "who", "how", "url"]) assert.ok(service[field], `${service.id}.${field}`)
  }
  assert.ok(content.includes("valen solo para ese lugar. AuxiliAR no los verificó en persona"))
  assert.ok(content.includes("Las páginas no muestran fecha de actualización"))
  // the conditions of each place, as its page states them
  assert.ok(content.includes("mayor de 18 años") && content.includes("turno online con cuenta miBA") && content.includes("sin turno previo"))
  assert.ok(content.includes("Vecinos de la ciudad de Córdoba"))
  assert.ok(content.includes("DNI con domicilio en la ciudad de Salta") && content.includes("No hacen internaciones ni estudios complementarios"))
  assert.ok(content.includes("sin costo para personas adscritas al sistema de salud pública municipal") && content.includes("La página no dice si otras vacunas son gratuitas"))
  assert.ok(content.includes("hay mucha demanda y pocos turnos") && content.includes("se contradice sobre las razas braquicéfalas"))
})

test("a free campaign is never called free veterinary care, and no guardia or urgencias is promised", () => {
  const content = text(pages["section-1"])
  assert.ok(content.includes("Una campaña gratuita no es atención veterinaria gratuita"))
  assert.ok(content.includes("Tampoco quiere decir que atiendan urgencias"))
  assert.ok(content.includes("La página no informa servicio de guardia ni de urgencias"))
  for (const [id, html] of Object.entries(pages)) {
    const body = text(html)
    assert.ok(!/guardia (veterinaria )?(gratuita|24)|24 horas|las 24|urgencias gratuitas|siempre hay|cupos? garantiza/i.test(body.replace("No confirmamos ninguna guardia ni atención de urgencia gratuita", "")), id)
  }
})

test("the services not confirmed are apart, and none of them is called free in AuxiliAR's voice", () => {
  const html = pages["section-1"]
  const pending = text(html.slice(html.indexOf('aria-labelledby="an-pending"'), html.indexOf('aria-labelledby="an-other"')))
  assert.ok(pending.includes("No los tomes como gratuitos hasta confirmarlo"))
  assert.ok(pending.includes("La página no informa el costo") && pending.includes("La página no deja claro el costo"))
  assert.ok(pending.includes("No informa fechas, localidades ni si el programa sigue vigente"))
  assert.ok(pending.includes("Un preturno no es una cirugía confirmada"))
})

test("nothing paid, announced or from an organization without a confirmed free access is offered as a resource", () => {
  const all = Object.values(pages).join(" ")
  // the announced hospital of Córdoba (SA13), the civil organization (SA11) and the registry (SA12) are not here
  assert.ok(!/proyecto4patas|autogestion-cpmv|passerini|hospital veterinario de urgencias/i.test(all))
  // the university hospitals only appear as arancelados, never as an option, and with no price
  const section3 = text(pages["section-3"])
  assert.ok(section3.includes("publican en sus páginas que sus servicios son arancelados. No los incluimos como atención gratuita"))
  assert.ok(!/\$\s?\d|\d+ pesos|precio|descuento|gratis/i.test(text(all)))
  assert.ok(section3.includes("No listamos clínicas veterinarias pagas"))
  const body3 = pages["section-3"].slice(0, pages["section-3"].indexOf('aria-label="Fuentes"'))
  assert.deepEqual(external(body3), [sources.UBA_HOSPITAL.url, sources.UNLP_HOSPITAL.url])
})

test("cuidado y prevención: general information with no veterinary instruction, and a bite sends to a health center", () => {
  const html = pages["section-2"]
  const content = text(html)
  assert.ok(content.includes("vacunar cada año a los perros y gatos contra la rabia, desde los 3 meses de edad y durante toda su vida"))
  assert.ok(content.includes("Acudí rápido a un centro de salud para que te evalúe un profesional"))
  assert.ok(content.includes("Ver números de emergencia") && !html.includes("tel:"))
  assert.ok(content.includes("Una zoonosis es una enfermedad o infección que se da en los animales"))
  assert.ok(content.includes("No reemplaza la consulta con un veterinario"))
  // no clinical instruction: no doses, treatments, wash steps or prophylaxis schemes
  assert.ok(!/dosis|mg\b|jab[oó]n|alcohol|profilaxis|esquema|inyecci[oó]n|tratamiento|antibi[oó]tic|medicaci[oó]n|desparasit|ayuno/i.test(content.replace("Es información general: no es una indicación veterinaria ni médica.", "")), "no clinical instruction")
})

test("atención veterinaria gratuita: orientation, with no promise and no second map", () => {
  const html = pages["section-3"]
  const content = text(html)
  assert.ok(content.includes("No confirmamos ninguna guardia ni atención de urgencia gratuita para animales"))
  assert.ok(content.includes("No prometemos guardias, turnos ni cupos"))
  assert.ok(content.includes("El mapa de AuxiliAR todavía no incluye servicios veterinarios"))
  assert.ok(!hrefs(html).some((href) => href.startsWith("/centros")), "no link to the map: it has no veterinary services")
  assert.ok(hrefs(html).includes("/temas/animales?seccion=section-1"))
})

test("no phone, address, schedule or contact is copied, and no personal data is asked for", () => {
  for (const [id, html] of Object.entries(pages)) {
    const content = text(html)
    assert.ok(!html.includes("tel:") && !html.includes("wa.me") && !/<(form|input|textarea|select)\b/.test(html), id)
    assert.ok(!/0800|\b(100|102|107|135|137|141|144|145|911)\b|\b\d{2,4}[- ]?\d{3,4}[- ]?\d{4}\b|@[a-z0-9-]+\.(gob|org|edu|com)/i.test(content), `${id}: no number or email`)
    assert.ok(!/\b(Av\.|Avenida|Díaz Vélez|Indoamericano|Costanera)\b/.test(content), `${id}: no address`)
    assert.ok(!/\b\d{1,2}(:\d{2})? ?(a|hs|h)(?![\p{L}])|lunes a|todos los días|viernes de cada/iu.test(content), `${id}: no schedule`)
    assert.ok(!/registr[aá]te|inici[aá] sesi[oó]n|cre[aá] una cuenta/i.test(content.replace("turno online con cuenta miBA", "")), id)
  }
})

test("the shared map, the emergency area and the other categories are not touched by this category", () => {
  const dir = resolve(root, "src/content/categories/Animals")
  const files = []
  const walk = (path) => { for (const entry of readdirSync(path, { withFileTypes: true })) { if (entry.isDirectory()) walk(join(path, entry.name)); else files.push(join(path, entry.name)) } }
  walk(dir)
  for (const file of files.filter((name) => /\.(ts|tsx)$/.test(name))) {
    const code = readFileSync(file, "utf8").replace(/^\s*(\/\/|\*|\/\*).*$/gm, "")
    assert.ok(!/utils\/places|data\/resources|emergency\.ts|EmergencyBar|nacional\.json|HelpBot|centersLink/.test(code), file)
  }
})

test("the index of Auxi's content lists the three sections, up to date with the summaries", () => {
  const index = JSON.parse(readFileSync(resolve(root, "../server/src/main/resources/content/content-index.json"), "utf8"))
  const list = Array.isArray(index) ? index : (index.pages ?? Object.values(index).find(Array.isArray))
  for (const section of ANIMALS.sections) {
    const entry = list.find((page) => page.path === `/temas/animales?seccion=${section.id}`)
    assert.ok(entry, section.id)
    assert.equal(entry.title, `Salud animal › ${section.title}`)
    assert.equal(entry.summary, section.summary, `${section.id}: run npm run content:index`)
  }
})
