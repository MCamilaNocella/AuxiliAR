/*
 * Tests of the Salud general sections (Dónde atenderme, Controles, Quiz) and of the Primeros auxilios category that used to be one of them:
 * the quiz (logic and content), the controls topics, the first aid page, the old address of that section and the links that lead to the places explorer. Loaded through Vite like the app does.
 *   npm run health:test
 */
import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const { createServer } = await import("vite")
const vite = await createServer({ root: resolve(here, ".."), logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())

const { createElement } = await import("react")
const { renderToStaticMarkup } = await import("react-dom/server")
const { MemoryRouter } = await import("react-router")
const { centersLink } = await vite.ssrLoadModule("/src/router/centersLink.ts")
const quiz = await vite.ssrLoadModule("/src/utils/quiz/quiz.ts")
const { PHYSICAL_HEALTH_QUIZ: QUESTIONS } = await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/sections/Section4/Section4.constants.ts")
const { FREQUENCY_BLOCKS, CONTROLS_SOURCES } = await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/sections/Section2/Section2.constants.ts")
const Section1 = (await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/sections/Section1/Section1.content.tsx")).default
const { PHYSICAL_HEALTH } = await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/PhysicalHealth.ts")
const { ALL_CATEGORIES } = await vite.ssrLoadModule("/src/content/categories/index.ts")
const { PATHS, HEALTH_GENERAL_SLUG, LEGACY_PHYSICAL_HEALTH_SLUG } = await vite.ssrLoadModule("/src/router/paths.ts")
const Section2 = (await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/sections/Section2/Section2.content.tsx")).default
const FirstAidPage = (await vite.ssrLoadModule("/src/content/categories/FirstAid/sections/Section1/Section1.content.tsx")).default
const { FIRST_AID } = await vite.ssrLoadModule("/src/content/categories/FirstAid/FirstAid.ts")
const { CategorySidebar } = await vite.ssrLoadModule("/src/components/category/CategorySidebar/index.ts")
const { legacyFirstAidTarget } = await vite.ssrLoadModule("/src/router/legacyFirstAid.ts")
const Section4 = (await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/sections/Section4/Section4.content.tsx")).default
const Section6 = (await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/sections/Section6/Section6.content.tsx")).default
const Section7 = (await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/sections/Section7/Section7.content.tsx")).default
const { FIRST_AID_GUIDE_CONTENT } = await vite.ssrLoadModule("/src/content/firstAid/index.ts")

const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const render = (component, url = "/temas/salud-general") => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(component)))
// The filters of the Centros de atención map that these sections link to (the map lives in its own category/branch)
const FILTER_IDS = ["medical", "vaccination", "dentistry", "emergency", "nutrition-food", "physical-activity"]

/** An internal link or an emergency action, pointing at a filter that exists */
const assertGoodAction = (action, where) => {
  assert.ok(action.label, where)
  if (action.emergency) return
  assert.ok(action.to?.startsWith("/"), `${where}: ${action.to}`)
  const params = new URL(action.to, "http://x").searchParams
  const filter = params.get("filtro")
  if (filter) assert.ok(FILTER_IDS.includes(filter), `${where}: filtro ${filter}`)
}

/* ── Quiz: logic ── */

test("quiz: one situation at a time, immediate answer, a second answer is ignored", () => {
  let state = quiz.startQuiz(QUESTIONS)
  assert.equal(quiz.currentQuestion(state).id, QUESTIONS[0].id)
  assert.equal(quiz.progressPercent(state), 0)
  const options = quiz.currentQuestion(state).options
  const right = options.find(({ correct }) => correct)
  const wrong = options.find(({ correct }) => !correct)
  state = quiz.pickOption(state, wrong.id)
  assert.equal(quiz.progressPercent(state), Math.round(100 / QUESTIONS.length))
  // changing the answer after seeing the feedback isn't possible
  assert.equal(quiz.pickOption(state, right.id), state)
  assert.deepEqual(state.results, [{ questionId: QUESTIONS[0].id, optionId: wrong.id, correct: false }])
  // can't move on without answering
  assert.equal(quiz.advance(quiz.startQuiz(QUESTIONS)).index, 0)
  state = quiz.advance(state)
  assert.equal(state.index, 1)
  assert.equal(state.picked, null)
  // an option that doesn't exist does nothing
  assert.equal(quiz.pickOption(state, "no-existe"), state)
})

test("quiz: the end shows what was learned, and going over only brings back what was missed", () => {
  let state = quiz.startQuiz(QUESTIONS)
  QUESTIONS.forEach((question, index) => {
    // miss the 2nd and the 5th, get the rest right
    const option = question.options.find(({ correct }) => correct === !(index === 1 || index === 4))
    state = quiz.advance(quiz.pickOption(state, option.id))
  })
  assert.equal(state.finished, true)
  assert.equal(quiz.progressPercent(state), 100)
  assert.equal(quiz.correctCount(state), QUESTIONS.length - 2)
  const missed = quiz.missedQuestions(state)
  assert.deepEqual(missed.map(({ id }) => id), [QUESTIONS[1].id, QUESTIONS[4].id])
  const review = quiz.startQuiz(missed)
  assert.equal(review.round.length, 2)
  assert.equal(review.results.length, 0)
  assert.equal(review.finished, false)
  // nothing missed: nothing to go over
  let perfect = quiz.startQuiz(QUESTIONS)
  for (const question of QUESTIONS) perfect = quiz.advance(quiz.pickOption(perfect, question.options.find(({ correct }) => correct).id))
  assert.deepEqual(quiz.missedQuestions(perfect), [])
})

/* ── Quiz: content ── */

test("quiz content: 8 varied situations, each with a reason, no diagnosing and no scolding", () => {
  assert.equal(QUESTIONS.length, 8)
  assert.equal(new Set(QUESTIONS.map(({ id }) => id)).size, 8)
  assert.ok(new Set(QUESTIONS.map(({ format }) => format)).size >= 4, "varied formats")
  for (const topic of ["Atención primaria", "Vacunación", "Emergencias", "Salud bucal", "Controles preventivos", "Salud visual", "Usar AuxiliAR"]) {
    assert.ok(QUESTIONS.some((question) => question.topic === topic), topic)
  }
  for (const question of QUESTIONS) {
    assert.ok(question.options.length >= 2 && question.options.length <= 4, question.id)
    assert.equal(question.options.filter(({ correct }) => correct).length, 1, question.id)
    for (const option of question.options) assert.ok(option.feedback.length > 20, `${question.id}/${option.id}`)
    assert.ok(question.why && question.learning, question.id)
    // an action is optional (the "Encontrar atención primaria" button was removed from the whole web); when there is one, it must be real
    if (question.action) assertGoodAction(question.action, question.id)
  }
  // the right answer isn't always in the same place
  const positions = new Set(QUESTIONS.map(({ options }) => options.findIndex(({ correct }) => correct)))
  assert.ok(positions.size >= 2)
  // tone: never punishing, never diagnosing
  const all = QUESTIONS.flatMap((question) => [question.prompt, question.why, question.learning, ...question.options.map(({ feedback }) => feedback)]).join(" ").toLowerCase()
  for (const word of ["incorrect", "equivoc", "fallaste", "mal hecho", "diagnóstic", "tenés cáncer", "seguro es"]) assert.ok(!all.includes(word), word)
})

test("the quiz screen starts on the first situation with a progress bar", () => {
  const html = render(Section4)
  const content = text(html)
  assert.ok(content.includes("Situación 1 de 8"))
  assert.match(html, /role="progressbar"[^>]*aria-valuenow="0"/)
  assert.ok(content.includes(QUESTIONS[0].prompt))
  for (const { text: option } of QUESTIONS[0].options) assert.ok(content.includes(option))
})

/* ── Controles de salud ── */

test("controles de salud: information only - no button, no link - with how often to do each control, from official pages", () => {
  const html = render(Section2)
  const content = text(html)
  // the five controls the person asked for, in this order
  assert.deepEqual(FREQUENCY_BLOCKS.map(({ title }) => title), ["Salud bucal", "Salud visual", "Corazón: presión arterial y azúcar en sangre", "Vacunas", "Chequeos generales"])
  const order = FREQUENCY_BLOCKS.map(({ title }) => content.indexOf(title))
  assert.ok(order.every((at) => at > 0) && [...order].sort((a, b) => a - b).join() === order.join())
  // nothing to press and nowhere to go: no button, no link, no topic chooser
  assert.ok(!/<button/.test(html) && !/<a/.test(html), "no button and no link in the section")
  assert.ok(!content.includes("Tu próximo paso") && !content.includes("Elegí un tema") && !content.includes("Ver números de emergencia"))
  // the frequencies, as the official pages say them
  for (const piece of [
    "cada 6 meses", "al menos 2 veces por año", "desde los 3 años, al menos una vez por año", "cada 3 meses durante toda la gestación",
    "a los 3 años, antes de empezar la escuela primaria y a los 13 años", "Después de los 40 años: una revisión por año",
    "al menos cada 3 a 5 años", "al menos una vez por año", "a todas las personas desde los 45 años", "repetirla cada 3 años o más seguido según criterio médico",
    "un refuerzo cada 10 años", "en cada campaña estacional",
    "Papanicolaou a partir de los 25 años", "una mamografía cada uno o dos años", "«de forma bianual»",
  ]) assert.ok(content.includes(piece), piece)
  // what no official page says is said, not filled in; and the review is pending
  assert.ok(content.includes("No encontramos una frecuencia oficial de la Nación para el colesterol ni para un electrocardiograma"))
  assert.ok(content.includes("No encontramos una página oficial de la Nación con un «chequeo anual» general"))
  assert.ok(content.includes("Pendiente de revisión profesional") && content.includes("no una indicación para tu caso"))
  assert.ok(content.includes("no reemplaza la consulta con un equipo de salud") && content.includes("Las fuentes están en Sobre AuxiliAR"))
  // a numerical frequency is only written if it comes from a listed source: every block of the page has its sources in Sobre AuxiliAR
  assert.equal(CONTROLS_SOURCES.length, 8)
  assert.ok(CONTROLS_SOURCES.every(({ url }) => url.startsWith("https://")))
  // no personal indication: nothing says "you must" or names a medicine or dose
  assert.ok(!/(tenés que hacerte|debés hacerte|dosis|mg|antibi[oó]tico)/i.test(content.replace("repetirla cada 3 años", "")))
})

/* ── Primeros auxilios ── */

test("primeros auxilios: the page of the category, whose every card opens a real guide", () => {
  const html = render(FirstAidPage, "/primeros-auxilios")
  const content = text(html)
  assert.ok(!content.includes("¿Necesitás actuar ahora?") && !content.includes("Si hay riesgo inmediato para la vida"), "the emergency numbers are in the bar at the top")
  for (const group of ["Necesito actuar ahora", "Accidentes y lesiones frecuentes", "Prepararte también ayuda"]) assert.ok(content.includes(group), group)
  assert.ok(!content.includes("en preparación"))
  assert.ok(!html.includes("tel:107"), "no emergency number is presented as universal")
  assert.ok(!content.includes("Ver números de emergencia"))
  for (const guide of FIRST_AID_GUIDE_CONTENT) {
    assert.ok(html.includes(`href="/primeros-auxilios/${guide.slug}"`), guide.slug)
    assert.ok(content.includes(guide.title), guide.title)
  }
  assert.equal([...html.matchAll(/href="\/primeros-auxilios\/[a-z-]+"/g)].length, FIRST_AID_GUIDE_CONTENT.length + 1, "one card more than guides: the quiz, next to the botiquín")
  assert.ok(html.includes('href="/primeros-auxilios/quiz"'))
  // it is the category itself: no link back to it
  assert.ok(!html.includes('href="/primeros-auxilios"'))
  assert.ok(!content.includes("Ver todas las guías"))
})

/* ── Links audit: no dead buttons in the four sections, the guides and the quiz ── */

test("every internal link of Salud física points somewhere real", () => {
  // Salud general: section-3 (Primeros auxilios) moved out (its address redirects: never reuse it); the ids of the others are kept, and the vaccination calendar is section-5
  const sectionIds = ["section-1", "section-2", "section-5", "section-6", "section-7", "section-4"]
  const guideSlugs = FIRST_AID_GUIDE_CONTENT.map(({ slug }) => slug)
  const filterIds = FILTER_IDS

  // every href of what the four sections and the guides render, plus the actions the quiz and the topics carry
  const hrefsIn = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1].replace(/&amp;/g, "&"))
  const rendered = [Section1, Section2, Section4, Section6, Section7].flatMap((section) => hrefsIn(render(section)))
  rendered.push(...hrefsIn(render(FirstAidPage, "/primeros-auxilios")))
  const fromData = QUESTIONS.map(({ action }) => action?.to).filter(Boolean)
  const links = [...new Set([...rendered, ...fromData])].filter((href) => href.startsWith("/"))
  assert.ok(links.length >= 15, "the audit found the links")

  for (const href of links) {
    const url = new URL(href, "http://x")
    // "/centros" is the Centros de atención category: it has its own route
    const known = ["/temas/salud-general", PATHS.centers, ...guideSlugs.map((slug) => `/primeros-auxilios/${slug}`), PATHS.firstAidQuiz]
    assert.ok(known.includes(url.pathname), `${href}: no route`)
    const section = url.searchParams.get("seccion")
    if (section) assert.ok(sectionIds.includes(section), `${href}: section`)
    const filter = url.searchParams.get("filtro")
    if (filter) assert.ok(filterIds.includes(filter), `${href}: filter`)
    if (url.searchParams.has("buscar")) assert.ok(url.searchParams.get("buscar").length > 2, `${href}: search`)
  }
  // no button of the quiz or the topics is left without a destination or an action
  for (const { action } of QUESTIONS) if (action) assert.ok(action.to || action.emergency, "quiz action")
  // phone links are real numbers
  for (const html of [render(FirstAidPage, "/primeros-auxilios")]) for (const [, tel] of html.matchAll(/href="tel:([^"]+)"/g)) assert.match(tel, /^\+?\d{3,}$/)
})

/* ── Salud general: the new name, the old address, Dónde atenderme ── */

const srcDir = resolve(here, "../src")
const sourcesIn = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const path = join(dir, entry.name)
  return entry.isDirectory() ? sourcesIn(path) : /\.(ts|tsx)$/.test(entry.name) ? [path] : []
})

test("the category is Cuidar mi salud, at /temas/salud-general (the address keeps its name), with no trace of the old name on screen", () => {
  assert.equal(PHYSICAL_HEALTH.title, "Cuidar mi salud")
  // it opens straight on the controls, the main content
  assert.equal(PHYSICAL_HEALTH.defaultSectionId, "section-2")
  assert.equal(PHYSICAL_HEALTH.to, "/temas/salud-general")
  assert.equal(PATHS.topic(HEALTH_GENERAL_SLUG), PHYSICAL_HEALTH.to)
  assert.deepEqual(PHYSICAL_HEALTH.sections.map(({ title }) => title), ["Dónde atenderme", "Controles de salud", "Calendario de vacunación", "Alimentación y nutrición", "Actividad física y bienestar", "Quiz"])
  assert.deepEqual(PHYSICAL_HEALTH.sections.map(({ id }) => id), ["section-1", "section-2", "section-5", "section-6", "section-7", "section-4"])
  // internal id kept on purpose: the places taxonomy and the category styles use it
  assert.equal(PHYSICAL_HEALTH.id, "salud-fisica")
  const visible = [PHYSICAL_HEALTH.title, PHYSICAL_HEALTH.description, PHYSICAL_HEALTH.subtitle, ...PHYSICAL_HEALTH.sections.map(({ title }) => title)]
  for (const Section of [Section1, Section2, FirstAidPage, Section4, Section6, Section7]) visible.push(text(render(Section)))
  for (const guide of FIRST_AID_GUIDE_CONTENT) visible.push(JSON.stringify(guide))
  assert.ok(!/salud f[ií]sica/i.test(visible.join(" ")), "no 'Salud física' left on screen")
})

test("the old address /temas/salud-fisica redirects to the new one and keeps the query", () => {
  const router = readFileSync(join(srcDir, "router/index.tsx"), "utf8")
  const redirect = readFileSync(join(srcDir, "router/RedirectToHealthGeneral.tsx"), "utf8")
  assert.equal(LEGACY_PHYSICAL_HEALTH_SLUG, "salud-fisica")
  // the legacy route exists and comes before the generic /temas/:slug one
  const legacy = router.indexOf("PATHS.topic(LEGACY_PHYSICAL_HEALTH_SLUG)")
  const generic = router.indexOf("PATHS.topic(\":slug\")")
  assert.ok(legacy > 0 && generic > legacy, "legacy route first")
  // it goes to Salud general carrying the section, topic, filter and hash, replacing the history entry
  assert.match(redirect, /pathname: PATHS\.topic\(HEALTH_GENERAL_SLUG\), search, hash/)
  assert.match(redirect, /replace/)
})

test("dónde atenderme: a short explanation, no emergency block, and one door to Centros de atención", () => {
  const html = render(Section1)
  const content = text(html)
  for (const piece of ["¿Dónde me conviene atenderme?", "Centro de salud (CeSAC)", "Hospital", "Guardia", "atención primaria", "especialidades", "atención en el momento"]) {
    assert.ok(content.includes(piece), piece)
  }
  // the pink Emergencia block is gone, and with it the emergency numbers button of this section
  assert.ok(!html.includes("bg-alert-soft"), "no alert block")
  assert.ok(!content.includes("Ver números de emergencia"))
  assert.ok(!content.includes("riesgo inmediato"))
  // one door to the Centros de atención category, which exists
  const links = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1])
  assert.deepEqual(links, [PATHS.centers])
  assert.ok(ALL_CATEGORIES.some(({ to, title }) => to === PATHS.centers && title === "Encontrar atención"), "the category exists")
  // no places list or map inside Salud general
  assert.ok(!content.includes("Encontrá un centro") && !/leaflet|Mapa/.test(html))
})

test("Salud general carries no map and no places explorer, and every link to centers goes to /centros", () => {
  const folders = ["content/categories/PhysicalHealth", "content/firstAid", "components/firstAid", "components/quiz", "components/health", "screens/FirstAidGuide"]
  for (const folder of folders) {
    for (const file of sourcesIn(join(srcDir, folder))) {
      const source = readFileSync(file, "utf8")
      assert.ok(!/components\/places|utils\/places|usePlaces|mapTiles|leaflet/i.test(source), `${file} imports the explorer or the map`)
    }
  }
  // the link to the vaccination calendar stays inside Salud general (it is not a link to the centers)
  const centers = QUESTIONS.map(({ action }) => action?.to).filter((to) => to && !to.startsWith(PHYSICAL_HEALTH.to))
  assert.ok(centers.length >= 1)
  for (const to of centers) assert.equal(new URL(to, "http://x").pathname, PATHS.centers, to)
  assert.equal(centersLink(), "/centros")
  assert.equal(centersLink({ filter: "emergency", query: "oftalm" }), "/centros?filtro=emergency&buscar=oftalm")
})

/* ── Primeros auxilios is its own page, and the old section of Salud general leads there ── */

test("primeros auxilios: one section, which opens straight on the guides", () => {
  assert.equal(FIRST_AID.to, "/primeros-auxilios")
  assert.deepEqual(FIRST_AID.sections.map(({ title }) => title), ["Guías de primeros auxilios"])
  assert.equal(FIRST_AID.defaultSectionId, FIRST_AID.sections[0].id)
  assert.ok(FIRST_AID.sections[0].summary, "Auxi can send people here")
  assert.ok(!text(render(FirstAidPage, "/primeros-auxilios")).includes("en construcción"))
  // Salud general no longer lists it, and there is still one Primeros auxilios (the category in the list, not a second one)
  assert.ok(!PHYSICAL_HEALTH.sections.some(({ title }) => /primeros auxilios/i.test(title)))
  assert.equal(ALL_CATEGORIES.filter(({ title }) => title === "Primeros auxilios").length, 1)
})

test("a category with one section shows no section menu; two or three get tabs on phones; more than that keep the drawer", () => {
  const sidebar = (category) =>
    renderToStaticMarkup(
      createElement(MemoryRouter, null, createElement(CategorySidebar, { category, sections: category.sections, activeSectionId: category.sections[0].id, onSelectSection: () => {}, onShowIntro: () => {} })),
    )
  const single = sidebar(FIRST_AID)
  assert.ok(single.includes("Primeros auxilios"), "the title is still there")
  assert.ok(!single.includes('aria-label="Secciones"'), "no menu button")
  assert.ok(!single.includes("Secciones de"), "no drawer")
  assert.ok(!single.includes("Guías de primeros auxilios"), "no list with its only option")
  // three sections (Atención veterinaria): tabs in sight, no drawer to open first. Salud mental has six now, so it keeps the drawer
  const threeSections = ALL_CATEGORIES.find(({ id }) => id === "animales")
  assert.equal(threeSections.sections.length, 3)
  const tabs = sidebar(threeSections)
  assert.ok(!tabs.includes('aria-label="Secciones"') && !tabs.includes("Secciones de"), "no drawer")
  for (const { title } of threeSections.sections) assert.ok(tabs.includes(title), title)
  assert.equal([...tabs.matchAll(/lg:hidden/g)].length >= 1, true, "the tabs are for small screens")
  assert.equal(ALL_CATEGORIES.find(({ id }) => id === "salud-mental").sections.length, 6)
  // six sections (Cuidar mi salud, with the vaccination calendar, food and physical activity): the drawer
  assert.equal(PHYSICAL_HEALTH.sections.length, 6)
  const drawer = sidebar(PHYSICAL_HEALTH)
  assert.ok(drawer.includes('aria-label="Secciones"') && drawer.includes("Secciones de"))
  // large screens: a single section reserves no left column (the name heads the page); a category with a menu keeps its column
  assert.ok(!single.includes("lg:w-64") && !single.includes("lg:border-r") && single.includes("lg:px-(--page-inset)"), "no empty column for a single section")
  for (const html of [tabs, drawer]) assert.ok(html.includes("lg:w-64") && html.includes("lg:border-r"), "the column stays where there is a menu")
  const category = readFileSync(join(srcDir, "screens/RenderCategory/Category.tsx"), "utf8")
  assert.ok(category.includes('hasMenu ? "lg:flex-row" : ""') && category.includes("sections.length > 1"), "the page is a column of one, a row with a menu")
})

test("the old address of the section (?seccion=section-3) goes to /primeros-auxilios; the other sections stay", () => {
  // only the section is dropped: any other param and the hash travel along
  assert.deepEqual(legacyFirstAidTarget("?seccion=section-3", ""), { pathname: "/primeros-auxilios", search: "", hash: "" })
  assert.deepEqual(legacyFirstAidTarget("?seccion=section-3&utm=x", "#guias"), { pathname: "/primeros-auxilios", search: "?utm=x", hash: "#guias" })
  for (const search of ["", "?seccion=section-1", "?seccion=section-2&tema=bucal", "?seccion=section-4", "?tema=bucal"]) assert.equal(legacyFirstAidTarget(search, ""), null, search)
  // the route is wired before the generic one,
  const router = readFileSync(join(srcDir, "router/index.tsx"), "utf8")
  assert.ok(router.indexOf("<HealthGeneralRoute/>") > 0 && router.indexOf("<HealthGeneralRoute/>") < router.indexOf('PATHS.topic(":slug")'))
})

test("no source points at the section that moved", () => {
  for (const file of sourcesIn(srcDir)) {
    const code = readFileSync(file, "utf8")
    if (file.endsWith("legacyFirstAid.ts")) continue
    assert.ok(!code.includes("salud-general?seccion=section-3"), file)
    assert.ok(!code.includes("Salud general → Primeros auxilios"), file)
  }
})

test("the button 'Encontrar atención primaria' is nowhere in the app: not in the quiz, the sections or the guides", () => {
  const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]))
  for (const file of walk(srcDir).filter((name) => /\.(ts|tsx)$/.test(name))) assert.ok(!readFileSync(file, "utf8").includes("Encontrar atención primaria"), file)
  assert.ok(!QUESTIONS.some(({ action }) => action?.label === "Encontrar atención primaria"))
})
