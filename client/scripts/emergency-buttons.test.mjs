/*
 * The call buttons say where each number works and when it answers, a line past its review date is not presented as checked
 * (and does not vanish), and the assumptions of SafetyRules about the table are checked where the table is made.
 *   npm run emergency:test
 */
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
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
const helpLines = await vite.ssrLoadModule("/src/utils/helpLines.ts")
const { EmergencyBar } = await vite.ssrLoadModule("/src/components/layout/EmergencyBar/index.ts")
const { ChatEmergencyCalls } = await vite.ssrLoadModule("/src/components/help/ChatEmergencyCalls/index.ts")
const { UrgentHelp } = await vite.ssrLoadModule("/src/components/places/UrgentHelp/index.ts")
const { checkSafetyRules, DEFAULT_PATHS } = await import("./resources-sync.mjs")

const lines = JSON.parse(await readFile(join(root, "src/data/resources/lines/nacional.json"), "utf8")).resources
const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const render = (element) => renderToStaticMarkup(createElement(MemoryRouter, null, element))
const calls = (html) => [...html.matchAll(/href="tel:([0-9]+)"/g)].map((match) => match[1])

/** Runs `fn` with "today" being `day`: the page decides whether a review is past from the clock */
const onDay = (day, fn) => {
  const RealDate = globalThis.Date
  const [year, month, date] = day.split("-").map(Number)
  globalThis.Date = class extends RealDate {
    constructor(...args) {
      super(...(args.length ? args : [Date.UTC(year, month - 1, date, 15)]))
    }
  }
  try {
    return fn()
  } finally {
    globalThis.Date = RealDate
  }
}

test("the dataset has exactly these 14 lines and 15 numbers", () => {
  assert.deepEqual(lines.map((line) => line.id), [
    "emergencias-107",
    "emergencias-911",
    "linea-144",
    "prevencion-suicidio-cas",
    "linea-102",
    "urgencias-salud-mental-0800",
    "violencia-familiar-sexual-137",
    "consumos-problematicos-141",
    "trata-145",
    "intoxicaciones-cni-posadas",
    "salud-responde-0800",
    "salud-sexual-reproductiva-0800",
    "pami-escucha-138",
    "pami-emergencias-139",
  ])
  const numbers = new Set(lines.flatMap((line) => line.contacts.map((contact) => contact.dial)))
  assert.deepEqual([...numbers].sort(), ["102", "107", "135", "137", "138", "139", "141", "144", "145", "911", "08002221002", "08002223444", "08003330160", "08003451435", "08009990091"].sort())
})

test("the buttons: 107 'Ambulancias · según localidad', 911 'Emergencias', 135 'Asistencia en crisis · CABA y GBA' with its hours", () => {
  const b = (number) => helpLines.callButton(number)
  assert.deepEqual([b("107").label, b("107").scope], ["Ambulancias", "según localidad"])
  assert.deepEqual([b("911").label, b("911").scope, b("911").hours], ["Emergencias", undefined, undefined])
  assert.deepEqual([b("135").label, b("135").scope, b("135").hours], ["Asistencia en crisis", "CABA y GBA", "8:00 a 0:00"])
  // the national alternative is not "CABA y GBA"
  assert.deepEqual([b("0800-345-1435").label, b("0800-345-1435").scope, b("0800 345 1435").hours], ["Asistencia en crisis", "todo el país", "8:00 a 0:00"])
  // 24 h lines carry no hours on the button; the PAMI emergencies say where they are
  assert.equal(b("0800-999-0091").hours, undefined)
  assert.deepEqual([b("139").label, b("139").scope], ["PAMI emergencias", "AMBA y Rosario"])
  // never national, never exclusive of CABA/PBA
  assert.ok(!/todo el pa[ií]s|CABA|Buenos Aires/i.test(b("107").scope))
  // a number that is not in the lines is shown as it comes, with no scope that nobody verified
  assert.deepEqual(helpLines.callButton("100", "Bomberos (sin verificar)"), { number: "100", dial: "100", label: "Bomberos", free: false, unverified: true, stale: false })
  // what the server calls a number does not change what the button says about it
  assert.equal(helpLines.callButton("107", "Ambulancia (SAME)").label, "Ambulancias")
})

test("the bar and the chat show those words on the call buttons, and the links still dial", () => {
  const bar = render(createElement(EmergencyBar))
  assert.deepEqual(calls(bar), ["107", "911", "144", "135", "102"])
  const content = text(bar)
  for (const piece of ["107 Ambulancias según localidad", "911 Emergencias", "135 Asistencia en crisis CABA y GBA · de 8:00 a 0:00"]) assert.ok(content.includes(piece), piece)
  assert.ok(bar.includes('aria-label="Llamar al 107, Ambulancias, según localidad"'))
  assert.ok(bar.includes('aria-label="Llamar al 135, Asistencia en crisis, CABA y GBA, de 8:00 a 0:00"'))
  const chat = render(createElement(ChatEmergencyCalls, { numbers: [{ number: "107", label: "Ambulancia (SAME)" }, { number: "135", label: "Prevención del suicidio" }, { number: "0800-345-1435", label: "Prevención del suicidio" }, { number: "100", label: "Bomberos (sin verificar)" }] }))
  assert.deepEqual(calls(chat), ["107", "135", "08003451435", "100"])
  const said = text(chat)
  assert.ok(said.includes("Ambulancias según localidad") && said.includes("Asistencia en crisis CABA y GBA · de 8:00 a 0:00") && said.includes("Asistencia en crisis todo el país · de 8:00 a 0:00") && said.includes("Bomberos sin verificar"))
})

test("a line past its review date keeps its button, but is not presented as checked: said once, not on every button", () => {
  const today = render(createElement(EmergencyBar))
  assert.ok(!today.includes("no se volvió a comprobar") && !today.includes("no se volvieron a comprobar") && !today.includes("*"))
  const past = onDay("2027-02-01", () => ({
    bar: render(createElement(EmergencyBar)),
    chat: render(createElement(ChatEmergencyCalls, { numbers: [{ number: "911", label: "Emergencias" }, { number: "144", label: "Violencia" }] })),
    card: render(createElement(UrgentHelp, { context: "crisis" })),
  }))
  // nothing vanishes
  assert.deepEqual(calls(past.bar), ["107", "911", "144", "135", "102"])
  assert.deepEqual(calls(past.chat), ["911", "144"])
  assert.deepEqual(calls(past.card), ["911", "08009990091", "135", "08003451435", "107"])
  // the bar says it once, with the date, and marks each number with an asterisk that screen readers skip
  const sentence = "Ninguno de estos números se volvió a comprobar desde su fecha de revisión (6 de enero de 2027). Si no responde, llamá al 911."
  assert.equal(text(past.bar).split(sentence).length - 1, 1, "the notice is there once")
  assert.equal([...past.bar.matchAll(/sin nueva comprobación/g)].length, 0, "no per-button repetition")
  assert.equal([...past.bar.matchAll(/<b[^>]*>[0-9]+<span aria-hidden="true">\*<\/span><\/b>/g)].length, 5)
  assert.ok(past.bar.indexOf("Ninguno de estos números") < past.bar.indexOf('href="tel:107"'), "the notice comes before the buttons, so it is read first")
  // the chat: once, under its buttons ("este número" / "ninguno" depending on how many are shown)
  assert.equal(text(past.chat).split("Ninguno de estos números se volvió a comprobar").length - 1, 1)
  assert.equal(text(render(createElement(ChatEmergencyCalls, { numbers: [{ number: "911", label: "Emergencias" }] }))).includes("Este número no se volvió"), false)
  // the card: once, at the top, and the lines say nothing about it
  assert.equal(text(past.card).split("Ninguno de estos números se volvió a comprobar desde su fecha de revisión (6 de enero de 2027). Si no responde, llamá al 911.").length - 1, 1)
  assert.equal(text(past.card).split("comprobar").length - 1, 1, "and nothing else in the card says it")
  assert.ok(!text(past.card).includes("Sin nueva comprobación desde"))
  // the day before the review date, they are current; the day of the date, they are not
  assert.ok(!onDay("2027-01-05", () => render(createElement(EmergencyBar))).includes("comprobar"))
  assert.ok(onDay("2027-01-06", () => render(createElement(EmergencyBar))).includes("comprobar"))
})

test("the notice names which numbers when only some are unchecked, and says 'este número' for one", () => {
  const button = (number, stale, reviewDue = "2027-01-06") => ({ number, dial: number, label: "x", free: false, unverified: false, stale, reviewDue })
  assert.equal(helpLines.uncheckedNotice([button("107", false), button("911", false)], "911"), undefined)
  assert.equal(helpLines.uncheckedNotice([button("107", true), button("911", false), button("144", true, "2027-03-01")], "911"), "Algunos números no se volvieron a comprobar desde su fecha de revisión (6 de enero de 2027): 107, 144. Si no responde, llamá al 911.")
  assert.equal(helpLines.uncheckedNotice([button("107", true), button("911", false)], "911"), "Un número no se volvió a comprobar desde su fecha de revisión (6 de enero de 2027): 107. Si no responde, llamá al 911.")
  assert.equal(helpLines.uncheckedNotice([button("107", true)], "911"), "Este número no se volvió a comprobar desde su fecha de revisión (6 de enero de 2027). Si no responde, llamá al 911.")
  // a line with no date: still said
  assert.ok(helpLines.uncheckedNotice([{ ...button("107", true), reviewDue: undefined }], "911").includes("desde su fecha de revisión."))
})

test("the bar says 'Pedí ayuda ahora', and a call is called free only on the lines where that is recorded", () => {
  const bar = render(createElement(EmergencyBar))
  const content = text(bar)
  assert.ok(content.includes("¿Es una emergencia? Pedí ayuda ahora") && !/llamá gratis/i.test(content))
  // free: only what the dataset records as free (144, 102); never the 107, the 911 or the 135
  for (const number of ["144", "102"]) assert.ok(helpLines.callButton(number).free, number)
  for (const number of ["107", "911", "135", "0800-345-1435"]) assert.equal(helpLines.callButton(number).free, false, number)
  assert.ok(content.includes("144 Violencia gratuita") && content.includes("102 Niñez gratuita"))
  assert.ok(!/107 Ambulancias según localidad[^0-9]*gratuita/.test(content) && !/911 Emergencias gratuita/.test(content) && !/135 Asistencia en crisis CABA y GBA · de 8:00 a 0:00 gratuita/.test(content))
  assert.ok(bar.includes('aria-label="Llamar al 144, Violencia, gratuita"'))
  // the national mental health line is free, in the chat
  assert.ok(text(render(createElement(ChatEmergencyCalls, { numbers: [{ number: "0800-999-0091", label: "Urgencias de salud mental" }] }))).includes("gratuita"))
  // and the header of the card says nothing global either
  const source = text(render(createElement(UrgentHelp, { context: "crisis" })))
  assert.ok(!/llam[aá] gratis|todos? (los )?n[uú]meros? (son )?gratu/i.test(source))
})

test("the rows the server still keeps by hand are never presented as verified: in the table, in the buttons, in the chat", async () => {
  const table = (await readFile(DEFAULT_PATHS.numbersFile, "utf8")).split("\n").filter((row) => /^\|\s*[0-9]/.test(row)).map((row) => row.split("|").slice(1, -1).map((cell) => cell.trim()))
  const verified = new Set(lines.flatMap((line) => line.contacts.map((contact) => contact.dial)))
  const manual = table.filter((row) => !verified.has(row[0].replace(/\D/g, "")))
  assert.equal(manual.length, 8)
  for (const [number, name] of manual) {
    // the table says it
    assert.ok(name.endsWith("(sin verificar)"), number + " is in the table as verified")
    // the button says it, whatever name the server sends, and says nothing that nobody verified
    for (const sent of [name, name.replace(" (sin verificar)", "")]) {
      const button = helpLines.callButton(number, sent)
      assert.deepEqual([button.unverified, button.free, button.stale, button.scope, button.hours], [true, false, false, undefined, undefined], number)
      assert.ok(!button.label.includes("sin verificar"), "the tag moves to the detail: " + button.label)
      assert.equal(helpLines.callButtonDetail(button), "sin verificar")
      assert.ok(helpLines.callButtonLabel(button).endsWith("sin verificar"))
    }
  }
  const chat = text(render(createElement(ChatEmergencyCalls, { numbers: manual.map(([number, name]) => ({ number, label: name })) })))
  assert.equal(chat.split("sin verificar").length - 1, 8, "each of the eight says it")
  // none of them is in the emergency bar nor in the crisis card
  const surfaces = [render(createElement(EmergencyBar)), render(createElement(UrgentHelp, { context: "crisis" }))].join(" ")
  for (const [number] of manual) assert.ok(!surfaces.includes(`tel:${number.replace(/\D/g, "")}"`), number + " is on a surface for verified numbers")
  // and the verified ones never carry the tag
  for (const [number] of table.filter((row) => verified.has(row[0].replace(/\D/g, "")))) assert.equal(helpLines.callButton(number).unverified, false, number)
})

test("SafetyRules' assumptions about PAMI are checked against the lines, where the table is made (resources:check), not when the server starts", async () => {
  const java = await readFile(DEFAULT_PATHS.safetyRulesFile, "utf8")
  assert.deepEqual(checkSafetyRules(lines, java), [])
  // the 139 loses a zone, or is not verified, or the constants change: the check says so
  const narrower = structuredClone(lines)
  narrower.find((line) => line.id === "pami-emergencias-139").coverage.areas = ["amba"]
  assert.match(checkSafetyRules(narrower, java)[0], /AMBA y de Rosario/)
  const unverified = structuredClone(lines)
  unverified.find((line) => line.id === "pami-escucha-138").verification.status = "needs-review"
  assert.match(checkSafetyRules(unverified, java)[0], /138/)
  assert.match(checkSafetyRules(lines, java.replace("PAMI_EMERGENCIES = \"139\"", "PAMI_EMERGENCIES = \"999\""))[0], /999/)
  assert.match(checkSafetyRules(lines, "nada")[0], /no se encontraron las constantes/)
  // and the server no longer stops for it
  const config = await readFile(join(root, "../server/src/main/java/com/auxiliar/server/chat/AuxiGraphConfig.java"), "utf8")
  assert.ok(config.includes("log.warn(rowsProblem)") && !config.includes("requireNumbers"))
})
