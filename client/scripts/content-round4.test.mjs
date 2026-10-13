/*
 * Tests of the content and UX round 4: the home/categories without repeated emergency notices, the free contraception section,
 * the IVE/ILE section (pending professional validation), the reusable video component and the corrected README of the data.
 * Loaded through Vite like the app does.
 *   npm run round4:test
 */
import assert from "node:assert/strict"
import { execSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"
import { withoutBatches } from "./places-batches.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const { createServer } = await import("vite")
const vite = await createServer({ root, logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())

const { createElement } = await import("react")
const { renderToStaticMarkup } = await import("react-dom/server")
const { MemoryRouter } = await import("react-router")
const render = (component, props = {}, url = "/") => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(component, props)))
const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const hrefs = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1].replace(/&amp;/g, "&"))
const read = (path) => readFileSync(resolve(root, path), "utf8")
const load = async (path) => vite.ssrLoadModule(`/src/content/categories/${path}`)

const { SEX_EDUCATION } = await load("SexEducation/SexEducation.ts")
const FreeAccessPage = (await load("SexEducation/sections/Section2/Section2.content.tsx")).default
const IvePage = (await load("SexEducation/sections/Section4/Section4.content.tsx")).default
const MentalPage = (await load("MentalHealth/sections/Section1/Section1.content.tsx")).default
const SexualWherePage = (await load("SexEducation/sections/Section1/Section1.content.tsx")).default
const { VideoEmbed } = await vite.ssrLoadModule("/src/components/health/VideoEmbed/index.ts")
const { FirstAidGuide } = await vite.ssrLoadModule("/src/components/firstAid/FirstAidGuide/FirstAidGuide.tsx")
const firstAid = await vite.ssrLoadModule("/src/content/firstAid/index.ts")

/* ── 1. Repeated emergency notices ── */

test("the categories no longer repeat the permanent access to the emergencies: the two boxes of mental health and sexual health are gone", () => {
  for (const html of [render(MentalPage), render(SexualWherePage)]) {
    const content = text(html)
    assert.ok(!content.includes("Ver números de emergencia"))
    assert.ok(!content.includes("Si hay riesgo inmediato, o necesitás hablar con alguien ahora"))
    assert.ok(!content.includes("Si estás en peligro ahora o sufriste una agresión"))
    // the only phone link is the call button of the national sexual-health line, described in «Dónde buscar atención»
    assert.ok([...html.matchAll(/href="(tel:[^"]+)"/g)].every((m) => m[1] === "tel:08002223444"))
  }
})

test("what stays on purpose: the specific warnings and the permanent accesses were not touched", () => {
  // the warning about an animal bite (a specific one), the map line and the empty-map help keep their button (the first aid page lost its on purpose: the numbers are in the bar at the top)
  for (const file of ["content/categories/Animals/sections/Section2/Section2.content.tsx", "content/categories/HealthCenters/sections/Section1/Section1.content.tsx", "components/places/NoCoverageHelp/NoCoverageHelp.tsx"]) {
    assert.ok(read(`src/${file}`).includes("revealEmergencies"), file)
  }
  // the numbers of the emergency bar are still the ones of the data
  const bar = read("src/components/layout/EmergencyBar/EmergencyBar.tsx")
  assert.ok(bar.includes("EMERGENCY_NUMBERS") && bar.includes("callButton"))
})

/* ── 2. Free contraception ── */

test("«Anticonceptivos gratuitos: cuáles son y cómo conseguirlos» replaces the old box, and keeps gratuity, legal coverage, access conditions and concrete availability apart", () => {
  const full = text(render(FreeAccessPage))
  // the official lists of the Ciudad (centers with their phones) come after the explanation: the checks below are about the explanation
  const content = full.slice(0, full.indexOf("Centros de testeo de VIH y sífilis de la Ciudad ("))
  assert.ok(content.includes("Anticonceptivos gratuitos: cuáles son y cómo conseguirlos"))
  assert.ok(!content.includes("Qué dicen las fuentes oficiales sobre el acceso y el costo"), "the old approach is gone")
  for (const title of ["Gratuidad", "Cobertura legal", "Condiciones de acceso", "Disponibilidad concreta", "Cómo conseguirlos", "Cómo funciona cada método"]) assert.ok(content.includes(title), title)
  // gratuity is said as the Ciudad's statement; the legal coverage names the laws
  assert.ok(content.includes("«La atención y los métodos son gratuitos en el sistema público y deben ser entregados sin costo adicional en obras sociales y prepagas»"))
  assert.ok(content.includes("Ley 25.673") && content.includes("Ley 26.130"))
  // what AuxiliAR does not know is said, and nothing is invented
  assert.ok(content.includes("no asegura que haya turno, stock o un profesional disponible"))
  assert.ok(content.includes("AuxiliAR no confirma turnos ni disponibilidad de cada método"))
  assert.ok(!/rivadavia|hay stock|siempre hay|turnos? disponibles? (en|hoy)/i.test(content.replace("no asegura que haya turno, stock o un profesional disponible", "")))
  assert.ok(!/\b(0800|100|102|107|135|144|911)\b/.test(content), "no phone number")
})

/* ── 3. IVE/ILE ── */

test("IVE/ILE is its own visible section of Salud sexual y ESI, with the official information and the notice that it is pending validation", () => {
  const section = SEX_EDUCATION.sections.find(({ id }) => id === "section-4")
  assert.equal(section.title, "Interrupción voluntaria y legal del embarazo (IVE/ILE)")
  assert.deepEqual(SEX_EDUCATION.sections.map(({ id }) => id), ["section-1", "section-2", "section-4", "section-3"])
  const html = render(IvePage)
  const content = text(html)
  assert.ok(content.includes("Pendiente de validación legal y profesional") && content.includes("No es asesoramiento legal ni médico"))
  for (const piece of ["Ley 27.610", "hasta la semana 14, inclusive", "cobertura integral y gratuita", "10 días corridos", "Privacidad y confidencialidad", "secreto médico", "objeción de conciencia", "impedir el acceso a la IVE es violencia contra la libertad reproductiva", "Lo que esta página no dice"]) {
    assert.ok(content.includes(piece), piece)
  }
  // official sources only
  for (const href of hrefs(html).filter((link) => link.startsWith("http"))) assert.match(href, /^https?:\/\/(www\.argentina\.gob\.ar|buenosaires\.gob\.ar)\//, href)
  assert.ok(hrefs(html).includes("https://www.argentina.gob.ar/generos/acceso-la-interrupcion-voluntaria-del-embarazo-ive"))
})

test("IVE/ILE: no center is presented as a confirmed provider, no phone number is copied, and no procedure or medication is explained", () => {
  const content = text(render(IvePage))
  assert.ok(!/cesac|hospital [a-záéíóú]|rivadavia|argerich|fern[aá]ndez|pi[ñn]ero|santa luc[ií]a|carrillo|due[ñn]as|pasteur/i.test(content), "no center is named")
  assert.ok(content.includes("AuxiliAR no verificó cada centro de la lista ni confirma que ofrezca el servicio"))
  assert.ok(!/\b0800\b|\b144\b|\b\d{2,4}[- ]\d{3,4}[- ]?\d{3,4}\b/.test(content), "no phone number")
  assert.ok(!/misoprostol|mifepristona|pastilla|aspiraci[oó]n|legrado|dosis|medicaci[oó]n|procedimiento quir/i.test(content.replace("No explica procedimientos, métodos ni medicación, y no recomienda ningún centro", "")), "no procedure or medication")
  assert.ok(content.includes("No explica procedimientos, métodos ni medicación, y no recomienda ningún centro"))
})

test("the map has no IVE/ILE service shown as free: the services added since are the Garrahan's and the Elizalde's pediatric ones", () => {
  const data = { resources: withoutBatches(JSON.parse(read("src/data/resources/places/ar-c.json")).resources) }
  assert.equal(data.resources.length, 9)
  assert.equal(data.resources.reduce((total, place) => total + place.services.length, 0), 35)
  const ive = data.resources.flatMap((place) => place.services.filter((service) => service.type === "ive-ile-care"))
  assert.ok(ive.length > 0 && ive.every((service) => service.cost !== "free"), "the IVE/ILE services that exist are not documented as free")
})

/* ── 4. VideoEmbed ── */

const video = { videoId: "wbp_AdGkWPM", title: "Ejemplo de video institucional", originalUrl: "https://www.youtube.com/watch?v=wbp_AdGkWPM", publisher: "Institución de prueba", publishedAt: "2023-08-21", duration: "2:14" }

test("VideoEmbed: it loads only when asked (nothing is sent to the video service before), is responsive, and always offers the original video", () => {
  const html = render(VideoEmbed, video)
  assert.ok(!html.includes("<iframe") && !html.includes("youtube-nocookie"), "no player and no request before pressing play")
  assert.ok(html.includes("aspect-video"), "16:9, responsive")
  assert.match(html, /<button[^>]*aria-label="Reproducir el video: Ejemplo de video institucional"/)
  const content = text(html)
  assert.ok(content.includes("El video se carga cuando lo reproducís") && content.includes("Institución de prueba") && content.includes("21 de agosto de 2023") && content.includes("Duración: 2:14"))
  // the alternative to the video: the original, in a new tab and said to screen readers
  assert.ok(hrefs(html).includes(video.originalUrl))
  assert.ok(html.includes('rel="noopener noreferrer"') && content.includes("se abre en una pestaña nueva"))
  assert.ok(content.includes("Si el video tiene subtítulos, se activan solos. Si no, leé la transcripción."))
})

test("VideoEmbed: the transcript is offered closed, the captions are said only when someone checked them, and a bad address shows no player", () => {
  const withText = render(VideoEmbed, { ...video, hasCheckedCaptions: true, transcript: createElement("p", null, "Texto del video.") })
  assert.ok(text(withText).includes("Tiene subtítulos: se activan solos al reproducirlo."))
  assert.ok(withText.includes("<details") && !withText.includes("<details open") && text(withText).includes("Leer la transcripción del video") && text(withText).includes("Texto del video."))
  // an id that is not a YouTube id (or an address instead of an id) never becomes a player; the original link is still there
  for (const bad of ["https://evil.example/x", "short", "wbp_AdGkWPM'><script>"]) {
    const html = render(VideoEmbed, { ...video, videoId: bad })
    assert.ok(!html.includes("<button") && !html.includes("<iframe") && !html.includes("aspect-video"), bad)
    assert.ok(hrefs(html).includes(video.originalUrl))
  }
  // an original address that is not https is not offered
  assert.ok(!hrefs(render(VideoEmbed, { ...video, originalUrl: "javascript:alert(1)" })).some((link) => link.startsWith("javascript")))
})


// A fixture guide, never data of the app: the real guides carry no video until each one has its whole approval record
const fixtureGuide = {
  slug: "ejemplo", title: "Guía de ejemplo", group: "now", summary: "Resumen.", callFirst: true,
  stepSets: [{ steps: ["Primer paso escrito."] }], note: "Una nota.", sources: [{ label: "Fuente de ejemplo", url: "https://www.argentina.gob.ar/ejemplo" }], checkedAt: "2026-10-01",
}
const approval = {
  clinicalReview: { by: "Profesional de ejemplo", date: "2026-10-05", version: "2023-08-21" },
  currentWith: { reference: "Guía de RCP de ejemplo", date: "2026-10-05" },
  permission: { basis: "Licencia de ejemplo" },
  transcriptReviewed: true,
}
const withVideo = (patch) => ({ ...fixtureGuide, video: { ...video, transcript: ["Texto del video."], hasCheckedCaptions: true, approval, ...patch } })
const renderGuide = (guide) => render(FirstAidGuide, { guide }, "/primeros-auxilios/ejemplo")

test("a guide shows its video only with the whole approval record, after the written steps and the call block, with the steps never depending on it", () => {
  const html = renderGuide(withVideo({}))
  const content = text(html)
  // it is there, as a facade (no player, nothing sent to the video service), with its transcript and the original
  assert.ok(content.includes("Video de apoyo") && content.includes("Complementa los pasos escritos, no los reemplaza"))
  assert.ok(content.includes("Revisado por Profesional de ejemplo el 5 de octubre de 2026"))
  assert.ok(!html.includes("<iframe") && html.includes("Reproducir el video: Ejemplo de video institucional"))
  assert.ok(content.includes("Texto del video.") && hrefs(html).includes(video.originalUrl))
  // order: written steps and the call block come first; the video comes before the note and the sources
  const at = (piece) => content.indexOf(piece)
  assert.ok(at("Primer paso escrito.") < at("Video de apoyo") && at("Ver números de emergencia") < at("Video de apoyo") && at("Qué decir cuando llamás") < at("Video de apoyo"))
  assert.ok(at("Video de apoyo") < at("Una nota.") && at("Video de apoyo") < at("Fuente oficial y revisión"))
  // without the video the guide is exactly the same text, minus that block
  assert.equal(text(renderGuide(fixtureGuide)).includes("Video de apoyo"), false)
})

test("each part of the record is needed: without any of them the video is not shown", () => {
  const missing = [
    { approval: undefined },
    { approval: { ...approval, clinicalReview: { ...approval.clinicalReview, by: " " } } },
    { approval: { ...approval, clinicalReview: { ...approval.clinicalReview, date: "" } } },
    { approval: { ...approval, currentWith: { ...approval.currentWith, reference: "" } } },
    { approval: { ...approval, permission: { basis: "" } } },
    { approval: { ...approval, transcriptReviewed: false } },
    { transcript: undefined },
    { transcript: [] },
    { originalUrl: "http://example.org/video" },
  ]
  for (const patch of missing) assert.ok(!text(renderGuide(withVideo(patch))).includes("Video de apoyo"), JSON.stringify(patch).slice(0, 80))
  assert.equal(firstAid.isVideoShown(undefined), false)
  assert.equal(firstAid.isVideoShown(withVideo({}).video), true)
})

test("no real guide carries a video: the RCP candidates stay pending clinical review, and nothing is presented as approved", () => {
  for (const guide of firstAid.FIRST_AID_GUIDE_CONTENT) assert.equal(guide.video, undefined, guide.slug)
  const doc = read("../docs/investigacion/videos-rcp-pendientes-validacion.md")
  assert.ok(doc.includes("wbp_AdGkWPM") && doc.includes("Ningún video está incorporado a la aplicación ni aprobado"))
})

test("VideoEmbed is used only by the first aid guide (and only with an approved video), and the component takes nothing from third parties", () => {
  const users = execSync('git grep -l "VideoEmbed" -- src', { cwd: root, encoding: "utf8" }).split("\n").filter(Boolean)
  assert.deepEqual(users.sort(), ["src/components/firstAid/FirstAidGuide/FirstAidGuide.tsx", "src/components/health/VideoEmbed/VideoEmbed.tsx", "src/components/health/VideoEmbed/index.ts"])
  const source = read("src/components/health/VideoEmbed/VideoEmbed.tsx")
  assert.ok(source.includes("youtube-nocookie.com/embed/") && !/<video\b|\.mp4|\.webm|\bdownload=/.test(source), "only the embed of the original player; no download and no copy")
})

/* ── 5. README of the data ── */

test("the README of the data says what there is today: 133 establishments, 339 services, 315 visible, and no longer says there is no data", () => {
  const readme = read("src/data/resources/README.md")
  assert.ok(readme.includes("133 establecimientos con 339 servicios registrados"))
  assert.ok(readme.includes("315 de esos 339 servicios están visibles"))
  assert.ok(!/todavía no hay datos cargados\*\* y/.test(readme))
  assert.ok(!readme.includes("(hoy no hay ninguno)") && !readme.includes("nacional.json, vacío"))
  assert.ok(readme.includes("14 líneas"))
})
