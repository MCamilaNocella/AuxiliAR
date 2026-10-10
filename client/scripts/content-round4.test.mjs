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

/* ── 1. Repeated emergency notices ── */

test("the categories no longer repeat the permanent access to the emergencies: the two boxes of mental health and sexual health are gone", () => {
  for (const html of [render(MentalPage), render(SexualWherePage)]) {
    const content = text(html)
    assert.ok(!content.includes("Ver números de emergencia"))
    assert.ok(!content.includes("Si hay riesgo inmediato, o necesitás hablar con alguien ahora"))
    assert.ok(!content.includes("Si estás en peligro ahora o sufriste una agresión"))
    assert.ok(!html.includes("tel:"))
  }
})

test("what stays on purpose: the specific warnings and the permanent accesses were not touched", () => {
  // the warning about an animal bite (a specific one), the map line, the first aid page and the empty-map help keep their button
  for (const file of ["content/categories/Animals/sections/Section2/Section2.content.tsx", "content/categories/HealthCenters/sections/Section1/Section1.content.tsx", "content/categories/FirstAid/sections/Section1/Section1.content.tsx", "components/places/NoCoverageHelp/NoCoverageHelp.tsx"]) {
    assert.ok(read(`src/${file}`).includes("revealEmergencies"), file)
  }
  // the numbers of the emergency bar are still the ones of the data
  const bar = read("src/components/layout/EmergencyBar/EmergencyBar.tsx")
  assert.ok(bar.includes("EMERGENCY_NUMBERS") && bar.includes("callButton"))
})

/* ── 2. Free contraception ── */

test("«Anticonceptivos gratuitos: cuáles son y cómo conseguirlos» replaces the old box, and keeps gratuity, legal coverage, access conditions and concrete availability apart", () => {
  const content = text(render(FreeAccessPage))
  assert.ok(content.includes("Anticonceptivos gratuitos: cuáles son y cómo conseguirlos"))
  assert.ok(!content.includes("Qué dicen las fuentes oficiales sobre el acceso y el costo"), "the old approach is gone")
  for (const title of ["Gratuidad", "Cobertura legal", "Condiciones de acceso", "Disponibilidad concreta", "Cómo conseguirlos", "Cómo funciona cada método"]) assert.ok(content.includes(title), title)
  // gratuity is said as the Ciudad's statement; the legal coverage names the laws
  assert.ok(content.includes("«La atención y los métodos son gratuitos en el sistema público y deben ser entregados sin costo adicional en obras sociales y prepagas»"))
  assert.ok(content.includes("Ley 25.673") && content.includes("Ley 26.130"))
  // what AuxiliAR does not know is said, and nothing is invented
  assert.ok(content.includes("no asegura que haya turno, stock o un profesional disponible"))
  assert.ok(content.includes("AuxiliAR no tiene confirmados turnos, stock ni centros concretos"))
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

test("the map has no IVE/ILE service shown as free: the data of the places is the same (no new service was added)", () => {
  const data = JSON.parse(read("src/data/resources/places/ar-c.json"))
  assert.equal(data.resources.length, 7)
  assert.equal(data.resources.reduce((total, place) => total + place.services.length, 0), 34)
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

test("VideoEmbed: it is used in no page yet (no health video was added), and the component takes nothing from third parties", () => {
  const users = execSync('git grep -l "VideoEmbed" -- src', { cwd: root, encoding: "utf8" }).split("\n").filter(Boolean)
  assert.deepEqual(users.sort(), ["src/components/health/VideoEmbed/VideoEmbed.tsx", "src/components/health/VideoEmbed/index.ts"])
  const source = read("src/components/health/VideoEmbed/VideoEmbed.tsx")
  assert.ok(source.includes("youtube-nocookie.com/embed/") && !/<video\b|\.mp4|\.webm|\bdownload=/.test(source), "only the embed of the original player; no download and no copy")
})

/* ── 5. README of the data ── */

test("the README of the data says what there is today: 7 establishments, 34 services, 9 visible, and no longer says there is no data", () => {
  const readme = read("src/data/resources/README.md")
  assert.ok(readme.includes("7 establecimientos con 34 servicios registrados"))
  assert.ok(readme.includes("9 de esos 34 servicios están visibles"))
  assert.ok(!/todavía no hay datos cargados\*\* y/.test(readme))
  assert.ok(!readme.includes("(hoy no hay ninguno)") && !readme.includes("nacional.json, vacío"))
  assert.ok(readme.includes("14 líneas"))
})
