/*
 * Tests of the first aid guides (src/content/firstAid): one copy of the content, backed by official sources,
 * everyday language, no emergency number presented as universal, and every card of the hub opens a real guide.
 *   npm run places:test
 */
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const { createServer } = await import("vite")
const vite = await createServer({ root: resolve(here, ".."), logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())

const { createElement } = await import("react")
const { renderToStaticMarkup } = await import("react-dom/server")
const { MemoryRouter, Route, Routes } = await import("react-router")
const content = await vite.ssrLoadModule("/src/content/firstAid/index.ts")
const { FirstAidGuide } = await vite.ssrLoadModule("/src/components/firstAid/FirstAidGuide/index.ts")
const { GuideCards } = await vite.ssrLoadModule("/src/components/firstAid/GuideCards/index.ts")
const { FirstAidGuideScreen } = await vite.ssrLoadModule("/src/screens/FirstAidGuide/index.ts")
const emergency = await vite.ssrLoadModule("/src/data/emergency.ts")

const GUIDES = content.FIRST_AID_GUIDE_CONTENT
const bySlug = Object.fromEntries(GUIDES.map((guide) => [guide.slug, guide]))
const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const renderGuide = (guide) => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(FirstAidGuide, { guide })))
/** Every string a guide shows */
const allText = (guide) => JSON.stringify(guide)

const WANTED = {
  now: ["rcp", "atragantamiento", "acv", "hemorragia-grave", "convulsiones", "quemaduras", "reacciones-alergicas"],
  injuries: ["heridas", "golpes-y-caidas", "golpe-en-la-cabeza", "fracturas", "accidentes-de-transito", "electrocucion", "intoxicaciones"],
  prepare: ["botiquin", "vacuna-antitetanica"],
}

test("the three groups cover emergencies, everyday injuries and getting ready", () => {
  assert.deepEqual(
    content.GUIDE_GROUPS.map(({ title }) => title),
    ["Necesito actuar ahora", "Accidentes y lesiones frecuentes", "Prepararte también ayuda"],
  )
  for (const [group, slugs] of Object.entries(WANTED)) assert.deepEqual(content.getGuidesOfGroup(group).map(({ slug }) => slug), slugs, group)
  assert.equal(GUIDES.length, 16)
  assert.equal(new Set(GUIDES.map(({ slug }) => slug)).size, 16)
})

test("one copy of the content: whoever links a guide finds it", () => {
  // the guides the emergency bar already links
  for (const { slug } of emergency.FIRST_AID_GUIDES) assert.ok(bySlug[slug], `emergency bar → ${slug}`)
  for (const guide of GUIDES) for (const slug of guide.related ?? []) assert.ok(bySlug[slug], `${guide.slug} → related ${slug}`)
  assert.equal(content.getFirstAidGuide("no-existe"), undefined)
})

test("every guide has the same shape and an official source", () => {
  for (const guide of GUIDES) {
    assert.ok(guide.title && guide.summary, guide.slug)
    assert.ok((guide.stepSets ?? []).some(({ steps }) => steps.length > 0), `${guide.slug} has steps`)
    assert.ok(guide.sources.length > 0, `${guide.slug} has sources`)
    for (const { url, label } of guide.sources) {
      assert.match(url, /^https:\/\/(www\.argentina\.gob\.ar|iah\.msal\.gov\.ar|medlineplus\.gov|buenosaires\.gob\.ar)\//, `${guide.slug}: official domain`)
      assert.ok(label.length > 10)
    }
    assert.match(guide.checkedAt, /^\d{4}-\d{2}-\d{2}$/)
    for (const { steps } of guide.stepSets ?? []) for (const step of steps) assert.ok(step.length > 15 && step.length < 420, `${guide.slug}: short, clear step`)
  }
  // the guides that tell what NOT to do
  for (const slug of ["rcp", "atragantamiento", "hemorragia-grave", "convulsiones", "quemaduras", "heridas", "accidentes-de-transito", "electrocucion", "intoxicaciones", "fracturas", "reacciones-alergicas"]) {
    assert.ok(bySlug[slug].dont?.length > 0, `${slug} has "Qué NO hacer"`)
  }
})

test("no emergency number is presented as universal: guides send people to the numbers of their place", () => {
  for (const guide of GUIDES) {
    // numbers that depend on the place (107, 911, 106…) are never written; the poison line is a national free line
    assert.ok(!/\b(107|911|106|112)\b/.test(allText(guide)), `${guide.slug} writes an emergency number`)
  }
  for (const guide of GUIDES.filter(({ callFirst }) => callFirst)) {
    const html = renderGuide(guide)
    assert.ok(!text(html).includes("Si es una emergencia, llamá o pedí que llamen"), `${guide.slug}: the numbers are always in the top menu`)
    assert.ok(!text(html).includes("Ver números de emergencia"), `${guide.slug}: no button, the numbers are in the top menu`)
    assert.ok(text(html).includes("Qué decir cuando llamás"), guide.slug)
    assert.ok(!html.includes("tel:107"), guide.slug)
  }
  for (const slug of ["rcp", "atragantamiento", "acv", "hemorragia-grave", "golpes-y-caidas", "golpe-en-la-cabeza", "accidentes-de-transito", "electrocucion", "reacciones-alergicas"]) {
    assert.ok(bySlug[slug].callFirst, `${slug} puts asking for help first`)
  }
})

test("accidentes de tránsito: safety, asking for help, what to say, not moving people, staying with them", () => {
  const guide = bySlug["accidentes-de-transito"]
  const steps = guide.stepSets[0].steps.join(" ")
  assert.match(steps, /No te expongas/)
  assert.match(steps, /Llamá al número de emergencias/)
  assert.match(steps, /No muevas a las víctimas/)
  assert.match(steps, /Quedate con la víctima/)
  assert.match(steps, /hemorragia importante/)
  assert.ok(guide.sources.some(({ url }) => url.includes("/dinesa/recomendaciones/emergencias-via-publica")))
  const info = content.CALL_INFO.join(" ")
  for (const piece of ["Dónde estás", "Qué pasó", "Cuántas personas", "peligros", "teléfono"]) assert.ok(info.includes(piece), piece)
})

test("intoxicaciones: goes to the Centro Nacional de Intoxicaciones and suggests no home remedy", () => {
  const guide = bySlug["intoxicaciones"]
  assert.deepEqual(guide.actions, [{ label: "Llamar al Centro Nacional de Intoxicaciones · 0800-333-0160", tel: "08003330160" }])
  assert.ok(allText(guide).includes("Hospital Posadas"))
  assert.ok(renderGuide(guide).includes('href="tel:08003330160"'))
  assert.ok(guide.dont.some((item) => item.includes("No hagas vomitar")))
  assert.ok(guide.dont.some((item) => item.includes("No le des nada por la boca")))
  // no home treatments are given as steps
  assert.ok(!/leche|limón|vinagre|aceite de oliva|carbón/i.test(guide.stepSets[0].steps.join(" ")))
})

test("the fractures guide doesn't promise what the sources don't have", () => {
  const guide = bySlug["fracturas"]
  assert.equal(guide.title, "Posibles fracturas")
  // no title, summary or step claims to teach sprains: only the note says they aren't covered
  assert.ok(!/esguince/i.test(guide.title + guide.summary + guide.stepSets.flatMap(({ steps }) => steps).join(" ")))
  assert.match(guide.note, /solo sobre posibles fracturas/)
  assert.ok(!/esguince/i.test(bySlug["golpes-y-caidas"].stepSets[0].steps.join(" ")))
})

test("what the official sources don't cover is said, not invented", () => {
  assert.match(bySlug["fracturas"].note, /no tienen una guía específica de esguinces/)
  assert.match(bySlug["golpe-en-la-cabeza"].note, /no detallan/)
  // the Manual explains the baby technique with images only: the guide doesn't improvise it
  assert.match(bySlug["atragantamiento"].note, /págs\. 17 y 18/)
  const babies = bySlug["atragantamiento"].stepSets.find(({ label }) => label === "Niños y bebés")
  assert.ok(!babies.steps.join(" ").includes("compresiones"))
  // botiquín: lists taken from the Manual
  const names = bySlug["botiquin"].checklists.flatMap(({ items }) => items.map(({ name }) => name)).join(" ")
  for (const item of ["Guantes", "Gasas", "Antiséptico", "Tijera", "Cinta adhesiva", "Jabón neutro", "Férulas"]) assert.ok(names.includes(item), item)
})

test("each guide renders its sections in the same order, in everyday language", () => {
  for (const guide of GUIDES) {
    const html = renderGuide(guide)
    const page = text(html)
    const stepsTitle = guide.stepsTitle ?? "¿Qué hago ahora?"
    assert.ok(page.includes(guide.title), guide.slug)
    assert.ok(page.includes(stepsTitle), guide.slug)
    assert.ok(page.includes("Fuente oficial y revisión") && page.includes(new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(guide.checkedAt))), guide.slug)
    assert.ok(html.includes('href="/sobre-auxiliar"') && !html.includes('target="_blank"') && page.includes("están en Sobre AuxiliAR"), `${guide.slug}: its sources are in Sobre AuxiliAR, no external link in the guide`)
    for (const empty of ["undefined", "null", "NaN"]) assert.ok(!page.includes(empty), `${guide.slug}: ${empty}`)
    // order: what it is → signs → steps → what NOT to do → when to ask for help
    const order = [stepsTitle, "Qué NO hacer", "Cuándo pedir ayuda", "Mientras llega la ayuda"].filter((title) => page.includes(title)).map((title) => page.indexOf(title))
    assert.deepEqual(order, [...order].sort((a, b) => a - b), guide.slug)
    if (guide.signs) assert.ok(page.indexOf("Señales importantes") < page.indexOf(stepsTitle), guide.slug)
  }
  // numbered steps for people using a screen reader too
  const rcp = text(renderGuide(bySlug["rcp"]))
  assert.ok(rcp.includes("Paso 1:"))
  assert.ok(rcp.includes("Bebés (hasta el año de vida)"))
})

test("the route opens the guide, or says it wasn't found", () => {
  const open = (path) =>
    renderToStaticMarkup(
      createElement(MemoryRouter, { initialEntries: [path] }, createElement(Routes, null, createElement(Route, { path: "/primeros-auxilios/:slug", element: createElement(FirstAidGuideScreen) }))),
    )
  assert.ok(text(open("/primeros-auxilios/convulsiones")).includes("Convulsiones"))
  assert.ok(text(open("/primeros-auxilios/convulsiones")).includes("Qué NO hacer"))
  assert.ok(text(open("/primeros-auxilios/inventada")).includes("No encontramos esta guía"))
})

test("every guide goes back to the Primeros auxilios category, where the guides are listed", () => {
  const hub = content.FIRST_AID_HUB_PATH
  assert.equal(hub, "/primeros-auxilios")
  for (const guide of GUIDES) {
    const hrefs = [...renderGuide(guide).matchAll(/href="([^"]+)"/g)].map((match) => match[1].replace(/&amp;/g, "&")).filter((href) => href.startsWith("/"))
    assert.ok(hrefs.includes(hub), `${guide.slug} → back to the guides`)
  }
  const missing = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ["/primeros-auxilios/x"] }, createElement(Routes, null, createElement(Route, { path: "/primeros-auxilios/:slug", element: createElement(FirstAidGuideScreen) }))))
  assert.ok(missing.includes(`href="${hub.replace("&", "&amp;")}"`))
})

test("the router no longer shows the placeholder for guides", async () => {
  const router = await readFile(resolve(here, "../src/router/index.tsx"), "utf8")
  assert.ok(!router.includes("Guía de primeros auxilios"))
  assert.match(router, /FirstAidGuideScreen/)
})

test("the cards of the hub: every group, every one a link to its guide", () => {
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(GuideCards)))
  for (const guide of GUIDES) assert.ok(html.includes(`href="/primeros-auxilios/${guide.slug}"`), guide.slug)
  assert.ok(!text(html).includes("en preparación"))
  // the page can show only some groups
  const only = text(renderToStaticMarkup(createElement(MemoryRouter, null, createElement(GuideCards, { groups: ["prepare"] }))))
  assert.ok(only.includes("Botiquín de primeros auxilios") && !only.includes("RCP"))
})

/* ── Reacciones alérgicas ── */

test("reacciones alérgicas: mild signs, anaphylaxis signs, safe steps, what to avoid and when to ask for help", () => {
  const guide = bySlug["reacciones-alergicas"]
  const html = renderGuide(guide)
  const content = text(html)
  for (const piece of ["Señales de una reacción leve", "Señales de una reacción grave (anafilaxia)", "¿Qué hago ahora?", "Si la reacción es leve", "Si hay señales de anafilaxia", "Qué NO hacer", "Cuándo pedir ayuda", "Mientras llega la ayuda"]) {
    assert.ok(content.includes(piece), piece)
  }
  // it asks for help first, without writing a number (they depend on the place)
  assert.ok(guide.callFirst && content.includes("número de emergencias de tu localidad") && !content.includes("Ver números de emergencia"))
  assert.equal(guide.group, "now")
  assert.ok(guide.extraSigns[0].items.some((item) => item.includes("Dificultad para respirar")))
  assert.ok(guide.extraSigns[0].items.some((item) => item.includes("Hinchazón de la cara")))
  assert.ok(guide.dont.length >= 4)
  // next steps that exist
  assert.ok(guide.related.every((slug) => bySlug[slug]))
  assert.deepEqual(guide.actions, [{ label: "Buscar un centro de atención", to: "/centros" }])
})

test("reacciones alérgicas: no doses, no brand or drug names, no treatment beyond what the sources say", () => {
  const guide = bySlug["reacciones-alergicas"]
  const all = allText(guide).toLowerCase()
  // no quantities of medicine, no named drugs: the only medicine the guide names is the person's own emergency epinephrine
  assert.ok(!/\b\d+([.,]\d+)?\s?(mg|ml|mcg|µg|gotas|comprimidos|pastillas)\b/.test(all), "no dose")
  for (const word of ["dosis de", "antihistam", "corticoid", "cortisona", "prednis", "difenhidramina", "loratadina", "hidrocortisona", "ibuprofeno", "adrenalina"]) {
    assert.ok(!all.includes(word), word)
  }
  assert.ok(all.includes("epinefrina"), "the emergency epinephrine of the person is named, without dose")
  // the 30 cm is the only measure, and it is the one the source gives for raising the legs
  assert.deepEqual([...all.matchAll(/\b\d+\s?cm\b/g)].map((match) => match[0]), ["30 cm"])
  assert.ok(!/\b(107|911|106|112)\b/.test(all))
  assert.ok(!/gratis|gratuit|sin turno/.test(all))
})

test("reacciones alérgicas: official sources, a date, and the pending clinical review is flagged", () => {
  const guide = bySlug["reacciones-alergicas"]
  assert.equal(guide.checkedAt, "2026-10-07")
  assert.deepEqual(
    guide.sources.map(({ url }) => new URL(url).hostname),
    ["medlineplus.gov", "medlineplus.gov", "www.argentina.gob.ar", "buenosaires.gob.ar"],
  )
  assert.equal(guide.clinicalReview.status, "pending")
  assert.ok(guide.clinicalReview.note.includes("Pendiente de revisión clínica"))
  // the reader knows too: it says that the review is still missing and that no medicine or dose is given
  const content = text(renderGuide(guide))
  assert.ok(content.includes("todavía falta que la revise un equipo de salud"))
  assert.ok(content.includes("no indica medicamentos ni dosis"))
  assert.ok(content.includes("Contenido comparado con las fuentes oficiales el 7 de octubre de 2026"))
  // only these two guides are waiting for a review; the others come straight from the national Manual
  assert.deepEqual(GUIDES.filter(({ clinicalReview }) => clinicalReview?.status === "pending").map(({ slug }) => slug), ["reacciones-alergicas", "vacuna-antitetanica"])
})

test("the first aid quiz covers every guide, sends back to it and adds no number", async () => {
  const { FIRST_AID_QUIZ } = await vite.ssrLoadModule("/src/content/firstAid/quiz.ts")
  const { startQuiz } = await vite.ssrLoadModule("/src/utils/quiz/quiz.ts")
  assert.ok(FIRST_AID_QUIZ.length >= 30 && FIRST_AID_QUIZ.length <= 40, "one sitting: between 30 and 40 situations")
  assert.equal(new Set(FIRST_AID_QUIZ.map(({ id }) => id)).size, FIRST_AID_QUIZ.length)
  for (const guide of GUIDES) {
    const own = FIRST_AID_QUIZ.filter(({ action }) => action?.to === `/primeros-auxilios/${guide.slug}`)
    assert.ok(own.length >= (guide.slug === "rcp" ? 5 : 1), `${guide.slug} is covered`)
  }
  for (const question of FIRST_AID_QUIZ) {
    assert.equal(question.options.filter(({ correct }) => correct).length, 1, `${question.id} has one right answer`)
    assert.ok(question.options.every(({ feedback }) => feedback.length > 10), `${question.id}: every option explains`)
    assert.ok(question.why && question.learning, `${question.id} has why and learning`)
    assert.ok(!/\b(10[2-7]|11[0-9]|13[0-9]|14[0-5]|911)\b/.test(JSON.stringify(question.options) + question.prompt), `${question.id} writes no emergency number`)
  }
  assert.ok(startQuiz(FIRST_AID_QUIZ))
})

test("the hub offers the quiz in 'Prepararte también ayuda', next to the botiquín", () => {
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(GuideCards)))
  const prepare = html.slice(html.indexOf('id="guides-prepare"'))
  assert.ok(prepare.indexOf("Botiquín de primeros auxilios") < prepare.indexOf("Quiz de primeros auxilios"))
  assert.ok(prepare.includes('href="/primeros-auxilios/quiz"'))
})

test("vacuna antitetánica: official sources, no doses, with the 2008 national norm for wounds, and it sits in 'Prepararte también ayuda'", () => {
  const guide = bySlug["vacuna-antitetanica"]
  const content = text(renderGuide(guide))
  assert.equal(guide.group, "prepare")
  assert.ok(content.includes("cada 10 años") && content.includes("carnet de vacunas") && content.includes("3 dosis"))
  assert.ok(content.includes("Resolución 498/2008") && content.includes("más de 5 años") && content.includes("más de 10 años") && !content.includes("141/97"))
  assert.ok(!/\b\d+\s?(UI|mg|ml)\b/i.test(content), "no doses of medicines")
  assert.deepEqual(guide.sources.map(({ url }) => new URL(url).hostname), ["www.argentina.gob.ar", "www.argentina.gob.ar", "www.argentina.gob.ar", "www.argentina.gob.ar"])
  assert.ok(content.includes("No pongas alcohol") || content.includes("no pongas alcohol"), "bites: no alcohol")
  assert.equal(guide.clinicalReview.status, "pending")
  assert.ok(bySlug["heridas"].related.includes("vacuna-antitetanica"))
})

test("rcp: infarto y paro cardíaco se diferencian, con lo que dice la página oficial del Ministerio y sin medicamentos", () => {
  const guide = bySlug["rcp"]
  const page = text(renderGuide(guide))
  assert.equal(guide.title, "Infarto y paro cardíaco (RCP)")
  assert.equal(guide.checkedAt, "2026-10-12")
  // two situations, told apart: the signs, and the steps of each
  for (const piece of ["Paro cardíaco: cuándo hacer RCP", "Infarto (ataque cardíaco): señales", "Si tiene señales de infarto y responde", "Adultos y niños: no responde y no respira", "Bebés (hasta el año de vida)", "Si hay un DEA"]) assert.ok(page.includes(piece), piece)
  assert.ok(page.includes("Pedile que se siente o se acueste.") && page.includes("el tiempo lo es todo"))
  assert.ok(page.includes("jadea") && page.includes("es un paro cardíaco: empezá con la RCP"), "the infarto steps lead to RCP when it becomes a paro")
  assert.ok(page.includes("No hagas RCP a una persona que responde y respira con normalidad"))
  // what the page says about the breaths, the DEA and the course
  assert.ok(page.includes("Las compresiones son lo más importante") && page.includes("dentro de los 5 minutos") && page.includes("nadie esté tocando a la persona"))
  assert.ok(page.includes("40%") && page.includes("curso de RCP básico"))
  assert.deepEqual(guide.sources.slice(0, 3).map(({ url }) => url), [
    "https://www.argentina.gob.ar/salud/primerosauxilios/RCP",
    "https://www.argentina.gob.ar/salud/primerosauxilios/RCP/preguntas",
    "https://www.argentina.gob.ar/salud/glosario/enfermedadcardiovascular",
  ])
  assert.ok(!/\b\d+\s?(mg|ml)\b/i.test(page) && !/aspirina|nitroglicerina/i.test(page), "no medicine: the page does not give one")
  // the emergency number is never written
  assert.ok(!/\b(107|911|106|112)\b/.test(JSON.stringify(guide)))
})
