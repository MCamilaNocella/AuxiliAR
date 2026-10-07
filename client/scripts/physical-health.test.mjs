/*
 * Tests of the Salud física sections (Controles, Primeros auxilios, Quiz): the quiz (logic and content), the controls topics,
 * the first aid door and the links that lead to the places explorer. Loaded through Vite like the app does.
 *   npm run health:test
 */
import assert from "node:assert/strict"
import { dirname, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const { createServer } = await import("vite")
const vite = await createServer({ root: resolve(here, ".."), logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())

const { createElement } = await import("react")
const { renderToStaticMarkup } = await import("react-dom/server")
const { MemoryRouter } = await import("react-router")
const { physicalCentersLink } = await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/centersLink.ts")
const quiz = await vite.ssrLoadModule("/src/utils/quiz/quiz.ts")
const { PHYSICAL_HEALTH_QUIZ: QUESTIONS } = await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/sections/Section4/Section4.constants.ts")
const { CONTROL_TOPICS } = await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/sections/Section2/Section2.constants.ts")
const Section2 = (await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/sections/Section2/Section2.content.tsx")).default
const Section3 = (await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/sections/Section3/Section3.content.tsx")).default
const Section4 = (await vite.ssrLoadModule("/src/content/categories/PhysicalHealth/sections/Section4/Section4.content.tsx")).default
const { FIRST_AID_GUIDE_CONTENT } = await vite.ssrLoadModule("/src/content/firstAid/index.ts")

const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const render = (component, url = "/temas/salud-fisica") => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(component)))
// The filters of the places explorer that these sections link to (the explorer lives in feature/places-explorer-map)
const FILTER_IDS = ["medical", "vaccination", "dentistry", "emergency"]

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
    assert.ok(question.action, `${question.id} connects to something real in AuxiliAR`)
    assertGoodAction(question.action, question.id)
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

test("controles de salud: the seven topics, each with what to know, orientation and a next step", () => {
  assert.deepEqual(
    CONTROL_TOPICS.map(({ title }) => title),
    ["No sé qué controles me corresponden", "Vacunación", "Controles generales", "Corazón y salud metabólica", "Prevención y detección temprana", "Salud bucal", "Salud visual"],
  )
  for (const topic of CONTROL_TOPICS) {
    assert.ok(topic.know && topic.guidance.length > 0 && topic.actions.length > 0, topic.id)
    topic.actions.forEach((action) => assertGoodAction(action, topic.id))
  }
  // the next steps the section prepares
  const links = CONTROL_TOPICS.flatMap(({ actions }) => actions.map(({ to }) => to)).filter(Boolean)
  assert.ok(links.includes(physicalCentersLink({ filter: "vaccination" })))
  assert.ok(links.includes(physicalCentersLink({ filter: "medical" })))
  assert.ok(links.includes(physicalCentersLink({ filter: "dentistry" })))
  assert.ok(links.includes(physicalCentersLink({ filter: "emergency", query: "odontol" })))
  assert.ok(links.includes(physicalCentersLink({ filter: "emergency", query: "oftalm" })))
})

test("controles de salud: the open topic comes from the URL and shows the three blocks", () => {
  const first = text(render(Section2))
  assert.ok(first.includes("Qué necesitás saber") && first.includes("Orientación") && first.includes("Tu próximo paso"))
  assert.ok(first.includes(CONTROL_TOPICS[0].know))
  const bucal = text(render(Section2, "/temas/salud-fisica?seccion=section-2&tema=bucal"))
  assert.ok(bucal.includes(CONTROL_TOPICS.find(({ id }) => id === "bucal").know))
  assert.ok(!bucal.includes(CONTROL_TOPICS[0].know))
  assert.ok(bucal.includes("Urgencia odontológica"))
  assert.ok(first.includes("no reemplaza la consulta"))
})

/* ── Primeros auxilios ── */

test("primeros auxilios: a door whose every card opens a real guide", () => {
  const html = render(Section3)
  const content = text(html)
  assert.ok(content.includes("¿Necesitás actuar ahora?"))
  for (const group of ["Necesito actuar ahora", "Accidentes y lesiones frecuentes", "Prepararte también ayuda"]) assert.ok(content.includes(group), group)
  assert.ok(!content.includes("en preparación"))
  assert.ok(!html.includes("tel:107"), "no emergency number is presented as universal")
  assert.ok(content.includes("Ver números de emergencia"))
  for (const guide of FIRST_AID_GUIDE_CONTENT) {
    assert.ok(html.includes(`href="/primeros-auxilios/${guide.slug}"`), guide.slug)
    assert.ok(content.includes(guide.title), guide.title)
  }
  assert.equal([...html.matchAll(/href="\/primeros-auxilios\/[a-z-]+"/g)].length, FIRST_AID_GUIDE_CONTENT.length)
  // the Primeros auxilios category has no content yet: nothing leads there (all the guides are listed here)
  assert.ok(!html.includes('href="/primeros-auxilios"'))
  assert.ok(!content.includes("Ver todas las guías"))
})

/* ── Links audit: no dead buttons in the four sections, the guides and the quiz ── */

test("every internal link of Salud física points somewhere real", () => {
  const topicIds = CONTROL_TOPICS.map(({ id }) => id)
  const sectionIds = ["section-1", "section-2", "section-3", "section-4"]
  const guideSlugs = FIRST_AID_GUIDE_CONTENT.map(({ slug }) => slug)
  const filterIds = FILTER_IDS

  // every href of what the four sections and the guides render, plus the actions the quiz and the topics carry
  const hrefsIn = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1].replace(/&amp;/g, "&"))
  const rendered = [Section2, Section3, Section4].flatMap((section) => hrefsIn(render(section)))
  for (const topic of CONTROL_TOPICS) rendered.push(...hrefsIn(render(Section2, `/temas/salud-fisica?seccion=section-2&tema=${topic.id}`)))
  const fromData = [...QUESTIONS.map(({ action }) => action?.to), ...CONTROL_TOPICS.flatMap(({ actions }) => actions.map(({ to }) => to))].filter(Boolean)
  const links = [...new Set([...rendered, ...fromData])].filter((href) => href.startsWith("/"))
  assert.ok(links.length >= 15, "the audit found the links")

  for (const href of links) {
    const url = new URL(href, "http://x")
    // "/primeros-auxilios" (the category) is not here on purpose: its sections are placeholders
    const known = ["/temas/salud-fisica", ...guideSlugs.map((slug) => `/primeros-auxilios/${slug}`)]
    assert.ok(known.includes(url.pathname), `${href}: no route`)
    const section = url.searchParams.get("seccion")
    if (section) assert.ok(sectionIds.includes(section), `${href}: section`)
    const filter = url.searchParams.get("filtro")
    if (filter) assert.ok(filterIds.includes(filter), `${href}: filter`)
    if (url.searchParams.has("buscar")) assert.ok(url.searchParams.get("buscar").length > 2, `${href}: search`)
    const topic = url.searchParams.get("tema")
    if (topic) assert.ok(topicIds.includes(topic), `${href}: topic`)
  }
  // no button of the quiz or the topics is left without a destination or an action
  for (const { action } of QUESTIONS) assert.ok(action.to || action.emergency, "quiz action")
  for (const { actions } of CONTROL_TOPICS) for (const action of actions) assert.ok(action.to || action.emergency, action.label)
  // phone links are real numbers
  for (const html of [render(Section3)]) for (const [, tel] of html.matchAll(/href="tel:([^"]+)"/g)) assert.match(tel, /^\+?\d{3,}$/)
})
