/*
 * Tests of Atención veterinaria: real content told inside AuxiliAR, place by place and prestación by prestación (castración, vacunación,
 * consulta, urgencias), each with who, cost, where, when, how and contact as the official page says it; gratuity is told per
 * prestación and always as the page's statement; what a page does not say is marked pending; a free campaign is never called free
 * veterinary care; no guardia or urgencias is promised; the cronograma that changes is shown from today on; the only external links
 * are the ones that complete an action or show an updated schedule. Loaded through Vite like the app does.
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

const { createElement } = await import("react")
const { renderToStaticMarkup } = await import("react-dom/server")
const { MemoryRouter } = await import("react-router")
const { ANIMALS } = await vite.ssrLoadModule("/src/content/categories/Animals/Animals.ts")
const sources = await vite.ssrLoadModule("/src/content/categories/Animals/Animals.sources.ts")
const places = await vite.ssrLoadModule("/src/content/categories/Animals/Animals.places.ts")
const { CabaAgenda } = await vite.ssrLoadModule("/src/content/categories/Animals/CabaAgenda.tsx")
const about = await vite.ssrLoadModule("/src/content/categories/About/About.sources.ts")
// The sources of the pages are all in "Sobre AuxiliAR": the references of the group of Atención veterinaria, by block
const referencesOf = (blockId) => about.REFERENCE_GROUPS.find(({ id }) => id === "salud-animal").blocks.find(({ id }) => id === blockId)
const sectionDir = "/src/content/categories/Animals/sections"
const CONTENT = {
  "section-1": (await vite.ssrLoadModule(`${sectionDir}/Section1/Section1.content.tsx`)).default,
  "section-2": (await vite.ssrLoadModule(`${sectionDir}/Section2/Section2.content.tsx`)).default,
  "section-3": (await vite.ssrLoadModule(`${sectionDir}/Section3/Section3.content.tsx`)).default,
}
after(() => vite.close())

const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const render = (component, props) => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ["/temas/animales"] }, createElement(component, props)))
const hrefs = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1].replace(/&amp;/g, "&"))
const external = (html) => hrefs(html).filter((href) => href.startsWith("https://"))
const pages = Object.fromEntries(Object.entries(CONTENT).map(([id, component]) => [id, render(component)]))
const ALL_PLACES = [places.CABA, places.PASTEUR, places.ROSARIO, places.CORDOBA, places.SALTA, places.NEUQUEN, places.PROTENENCIA, ...places.UNIVERSITY_HOSPITALS]

test("atención veterinaria has three sections (the last one without a summary yet) that open straight on the first, and it is no longer 'próximamente'", () => {
  assert.deepEqual(ANIMALS.sections.map(({ id, title }) => [id, title]), [
    ["section-1", "Vacunación y castración"],
    ["section-2", "Cuidado y prevención"],
    ["section-3", "Recursos importantes"],
  ])
  assert.equal(ANIMALS.defaultSectionId, "section-1")
  assert.equal(ANIMALS.preparing, undefined)
  assert.equal(ANIMALS.to, "/temas/animales")
  for (const { summary } of ANIMALS.sections) assert.ok(summary && summary.length > 60)
})

test("every section has content and no placeholder; its sources and the day they were read are in Sobre AuxiliAR; the only external links complete an action", () => {
  assert.equal(sources.CHECKED_AT, "2026-10-08")
  assert.equal(places.READ_ON, "2026-10-11")
  const OFFICIAL = /^https:\/\/(buenosaires\.gob\.ar|www\.rosario\.gob\.ar|cordoba\.gob\.ar|municipalidadsalta\.gob\.ar|www\.neuquencapital\.gov\.ar|www\.argentina\.gob\.ar|www\.fvet\.uba\.ar|www\.fcv\.unlp\.edu\.ar)\//
  for (const [id, html] of Object.entries(pages)) {
    const content = text(html)
    assert.ok(!/en construcci[oó]n|Sección \d/i.test(content), id)
    assert.ok(!content.includes("Fuentes oficiales") && !content.includes("Texto comparado con estas fuentes"), `${id}: no block of sources`)
  }
  // the links that stay: turno/preturno, the cronograma that changes, the channel of the móvil, the page of Protenencia (referente) - one per place
  assert.deepEqual(external(pages["section-1"]), [places.CABA, places.ROSARIO, places.SALTA, places.NEUQUEN, places.PROTENENCIA].map(({ action }) => action.url))
  assert.ok(pages["section-1"].includes('rel="noopener noreferrer"') && text(pages["section-1"]).includes("se abre en una pestaña nueva"))
  assert.deepEqual(external(pages["section-2"]), [])
  assert.deepEqual(external(pages["section-3"]), [], "no 'visit this page' link: the universities' and the places' data are inside, and so is the cremation")
  const days = { "animales-campanas": ["2026-10-11"], "animales-rabia": ["2026-10-08"], "animales-atencion": ["2026-10-11"], "animales-pasteur": ["2026-10-09"] }
  for (const [blockId, checkedAt] of Object.entries(days)) {
    const block = referencesOf(blockId)
    assert.deepEqual(block.checkedAt, checkedAt, blockId)
    assert.ok(block.references.length >= 2, blockId)
    for (const { url } of block.references) assert.match(url, OFFICIAL, `${blockId}: ${url}`)
  }
  // every place the pages tell has its page among the references, so each text is traceable
  const referenced = new Set([...referencesOf("animales-campanas").references, ...referencesOf("animales-atencion").references].map(({ url }) => url))
  for (const place of ALL_PLACES) assert.ok(referenced.has(place.url), `${place.id}: its page is in Sobre AuxiliAR`)
  assert.ok(referencesOf("animales-campanas").notes.join(" ").includes("11 de octubre de 2026"))
  assert.ok(text(pages["section-1"]).includes("Cada dato es de la página de un organismo oficial: AuxiliAR no responde por cambios posteriores."))
  assert.ok(text(pages["section-2"]).includes("Es información general: no es una indicación veterinaria ni médica."))
})

test("every prestación says who, cost, how; gratuity is the page's statement, never a whole institution's; what a page leaves open is pending", () => {
  const kinds = new Set()
  for (const place of ALL_PLACES) {
    assert.ok(place.place && place.by && place.url, place.id)
    assert.ok(place.prestaciones.length > 0, place.id)
    for (const item of place.prestaciones) {
      kinds.add(item.kind)
      for (const field of ["title", "who"]) assert.ok(item[field], `${place.id}.${item.title}.${field}`)
      assert.ok(item.cost?.status && item.cost.text, `${place.id}.${item.title}.cost`)
      assert.ok(item.how.length > 0, `${place.id}.${item.title}.how`)
      assert.ok(["gratuita", "condicionada", "no-informada", "arancelada", "no-aplica"].includes(item.cost.status), item.title)
      // "gratuita" is only said as what the page says (a quote or "la página")
      if (item.cost.status === "gratuita") assert.ok(/página|«/.test(item.cost.text), `${place.id}.${item.title}: gratuity attributed`)
      // nothing says a whole institution is free
      assert.ok(!/(toda|todo) el (hospital|instituto|municipio)|todos los servicios son gratuitos/i.test(JSON.stringify(item)), item.title)
    }
  }
  assert.deepEqual([...kinds].sort(), ["castracion", "consulta", "urgencias", "vacunacion"])
  // where the page gives no cost, the prestación says so instead of calling it free
  const costOf = (place, part) => place.prestaciones.find(({ title }) => title.includes(part)).cost
  assert.equal(costOf(places.SALTA, "cinco CIC").status, "no-informada")
  assert.equal(costOf(places.SALTA, "Hospital Municipal de Salud Animal y en el Centro de Adopciones").status, "no-informada")
  assert.equal(costOf(places.SALTA, "Móvil Quirúrgico").status, "gratuita")
  assert.equal(costOf(places.ROSARIO, "Hospital Municipal").status, "condicionada")
  assert.equal(costOf(places.NEUQUEN, "Esterilización").status, "condicionada")
  assert.equal(costOf(places.UNIVERSITY_HOSPITALS[0], "pequeños animales").status, "arancelada")
})

test("castración y vacunación: each place with its places, who, cost, how and contact; consulta and urgencias are told apart", () => {
  const html = pages["section-1"]
  const content = text(html)
  // the prestaciones of this section are castración and vacunación only
  assert.ok(content.includes("Castración de perros y gatos") && content.includes("Vacunación antirrábica de perros y gatos"))
  assert.ok(!content.includes("Consultorio clínico") && !content.includes("Guardia y urgencias") && !content.includes("Hospital de pequeños animales"))
  // Ciudad de Buenos Aires: the two fixed centers with address, the turno online, the age of the companion
  for (const piece of ["Parque Indoamericano", "Av. Dr. T. Achával Rodríguez 1550", "turno online con tu cuenta miBA", "mayor de 18 años", "se abren los viernes a las 10 h", "Sin turno previo no atienden"]) assert.ok(content.includes(piece), piece)
  // other provinces stay, each one with its places and contact
  for (const piece of ["Vecinal Parque Sur: Bolonia 5350", "WhatsApp 341 383-5121", "Francisco Muñiz 60", "Concepción del Bermejo 3129", "Maloca 8321", "351 860-6269", "CIC Constitución 387 226-6146", "Domingo Savio 3215", "dos animales por persona"]) assert.ok(content.includes(piece), piece)
  // conditions and doubts of each page, said plainly
  for (const piece of ["hay mucha demanda y pocos turnos", "razas braquicéfalas", "La página no informa el costo", "no explica para qué prestación", "no es una cirugía confirmada", "ni si hay operativos en este momento"]) assert.ok(content.includes(piece), piece)
  assert.ok(content.includes("Gratuita solo en algunos casos") && content.includes("Gratuita, según la página"))
  // each card closes with the short notice (the day, the page, not verified), not with the reading method
  assert.ok(content.includes("consultada el 11 de octubre de 2026") && content.includes("AuxiliAR no los verificó") && !/herramienta de lectura|resumen autom/.test(content))
})

test("the cronograma of the Ciudad is shown from today on, with its date, and says when it expired", () => {
  const during = text(render(CabaAgenda, { from: "2026-10-12" }))
  assert.ok(during.includes("Leído el 11 de octubre de 2026") && during.includes("hasta el 17 de octubre de 2026"))
  assert.ok(during.includes("Centro Fijo Costanera Sur") && during.includes("Parque Onega"))
  // days already past are not shown
  assert.ok(!during.includes("Parque Lezama") && !during.includes("Plaza Cañitas"))
  // no vaccination operativo is left in the published cronograma: it says so and sends to the official page
  assert.ok(during.includes("No quedan operativos de vacunación en el cronograma que leímos"))
  const first = text(render(CabaAgenda, { from: "2026-10-10" }))
  assert.ok(first.includes("Parque Lezama") && first.includes("de 9 a 12.30 h") && first.includes("Plaza Houssay"))
  const expired = text(render(CabaAgenda, { from: "2026-10-18" }))
  assert.ok(expired.includes("ya venció") && !expired.includes("Centro Fijo Costanera Sur"))
  // the card has its single official link
  assert.equal(external(pages["section-1"]).filter((href) => href === places.CABA.action.url).length, 1)
})

test("a free campaign is never called free veterinary care, and no guardia or urgencias is promised", () => {
  const content = text(pages["section-1"])
  assert.ok(content.includes("Una campaña gratuita no es atención veterinaria gratuita"))
  assert.ok(content.includes("Tampoco quiere decir que atiendan urgencias"))
  const c3 = text(pages["section-3"])
  assert.ok(c3.includes("no informa consulta clínica, guardia ni urgencias"), "the Ciudad's page tells no consulta or guardia")
  assert.ok(c3.includes("No existe guardia de atención médica ni urgencias"), "Pasteur, as the page says it")
  assert.ok(c3.includes("no es una guardia confirmada"), "the 'Guardia y urgencias' of Salta has no hours of its own")
  assert.ok(c3.includes("no hacen internaciones") || c3.includes("no se realizan internaciones ni métodos complementarios"))
  const allowed = ["recibe perros y gatos fallecidos todos los días, las 24 horas", "No confirmamos ninguna guardia ni atención de urgencia gratuita", "La página no dice que sea una guardia las 24 horas", "no es una guardia confirmada", "la página no informa guardia", "no informa consulta clínica, guardia ni urgencias"]
  for (const [id, html] of Object.entries(pages)) {
    let body = text(html)
    for (const phrase of allowed) body = body.replaceAll(phrase, "")
    assert.ok(!/guardia (veterinaria )?(gratuita|24)|24 horas|las 24|urgencias gratuitas|siempre hay|cupos? garantiza/i.test(body), id)
  }
})

test("consulta y urgencias: apart from the castración, with the cost conditions of each place and the universities shown as arancelados", () => {
  const html = pages["section-3"]
  const content = text(html)
  assert.ok(!content.includes("Esterilización de perros") && !content.includes("Castración de perros"))
  for (const piece of ["Francia 1940", "Sin costo para personas adscritas al sistema de salud pública municipal", "bono de 10 gavets", "1 gavet = $1.720", "Av. Díaz Vélez 4821", "4958-9900", "387 566-8872", "certificado de carente de recursos", "No es una clínica veterinaria general"]) assert.ok(content.includes(piece), piece)
  for (const piece of ["Todos los servicios son arancelados", "Los servicios son arancelados", "admision@fvet.uba.ar", "221 599-0158", "no atiende urgencias sin previa coordinación"]) assert.ok(content.includes(piece), piece)
  assert.ok(content.includes("publican en sus páginas que sus servicios son arancelados") && content.includes("No los incluimos como atención gratuita"))
  assert.ok(content.includes("No listamos clínicas veterinarias pagas"))
  // nothing announced or from an organization without a confirmed free access is offered as a resource
  const all = Object.values(pages).join(" ")
  assert.ok(!/proyecto4patas|autogestion-cpmv|passerini|hospital veterinario de urgencias/i.test(all))
  assert.ok(!/descuento|precio de lista|gratis/i.test(text(all)))
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

test("contacts are told as the pages give them, with no call or message button, no emergency number, and no personal data asked for", () => {
  for (const [id, html] of Object.entries(pages)) {
    const content = text(html)
    if (id !== "section-2") assert.ok(!html.includes("tel:") && !html.includes("wa.me"), id)
    assert.ok(!/<(form|input|textarea|select)\b/.test(html), id)
    assert.ok(!/0800|(llam\w*|n[uú]mero|l[ií]nea|tel[eé]fono|al)\s+(100|102|107|135|137|141|144|145|911)\b/i.test(content), `${id}: no emergency or 0800 number`)
    assert.ok(!/inici[aá] sesi[oó]n|cre[aá] una cuenta/i.test(content), id)
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
  for (const section of ANIMALS.sections.filter(({ summary }) => summary)) {
    const entry = list.find((page) => page.path === `/temas/animales?seccion=${section.id}`)
    assert.ok(entry, section.id)
    assert.equal(entry.title, `Atención veterinaria › ${section.title}`)
    assert.equal(entry.summary, section.summary, `${section.id}: run npm run content:index`)
  }
})

test("cremación gratuita: a block of Recursos importantes with Pasteur's free service and its conditions, no individual cremation or ashes promised, and no schedule of the vacunatorio", () => {
  const html = pages["section-3"]
  const block = html.slice(html.indexOf('aria-labelledby="an-cremation"'), html.indexOf('aria-labelledby="an-limits"'))
  const content = text(block)
  assert.ok(content.includes("Cremación gratuita"), "the title of the block")
  assert.ok(content.includes("sin costo, para su disposición final o cremación"))
  assert.ok(content.includes("mayor de edad y concurrir con DNI"))
  assert.ok(content.includes("No informa si la cremación es individual ni si se entregan las cenizas"))
  assert.ok(content.includes("solo existe riesgo si el animal mordió a una persona dentro de los 10 días previos a su fallecimiento"))
  assert.ok(content.includes("no tiene guardia de atención médica ni urgencias"))
  // nothing promises individual cremation or ashes, and the contradictory hours of the vacunatorio are not copied
  assert.ok(!/cenizas (se )?(entregan|devuelven)|cremación individual (gratuita|incluida)|9 a 12|14 a 17|8 a 18|8:00/i.test(content.replace("ni si se entregan las cenizas", "")))
  assert.ok(!content.includes("Texto comparado con estas fuentes") && content.includes("No traen fecha de publicación: confirmá con el Instituto antes de ir"))
  assert.deepEqual(external(block), [])
  assert.deepEqual(referencesOf("animales-pasteur").references.map(({ url }) => url), [sources.PASTEUR_INFO.url, sources.PASTEUR_SERVICIOS.url])
  assert.equal(referencesOf("animales-pasteur").title, "Recursos importantes: cremación gratuita")
  // the section "Si muere tu perro o gato" is gone: its text lives here, once
  assert.ok(!ANIMALS.sections.some(({ id }) => id === "section-4"))
  assert.equal([...text(html).matchAll(/Perder a un perro o a un gato es difícil/g)].length, 1)
  // the order inside Recursos importantes: the free, the unconfirmed and the paid first, then the cremation, then the limits
  assert.ok(html.indexOf('aria-labelledby="an-uni"') < html.indexOf('aria-labelledby="an-cremation"') && html.indexOf('aria-labelledby="an-cremation"') < html.indexOf('aria-labelledby="an-limits"'))
})

test("Recursos importantes: the vacuna antitetánica block points to the guide and gives no dose", () => {
  const html = pages["section-3"]
  const content = text(html)
  assert.ok(content.includes("Vacuna antitetánica") && content.includes("llevá tu carnet de vacunas") || content.includes("Llevá tu carnet de vacunas"))
  assert.ok(html.includes('href="/primeros-auxilios/vacuna-antitetanica"'))
  assert.ok(!/\b\d+\s?(UI|mg|ml)\b/i.test(content))
  assert.ok(!content.includes("Servicios importantes"))
})
