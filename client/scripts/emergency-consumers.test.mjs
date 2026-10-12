/*
 * What reads the help lines: the emergency bar, the chat, the footer, the first aid guides and the urgent help card all show the
 * numbers of the verified lines (src/data/resources/lines/nacional.json), none writes one of its own.
 *   npm run emergency:test
 */
import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
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
const emergency = await vite.ssrLoadModule("/src/data/emergency.ts")
const data = await vite.ssrLoadModule("/src/data/resources/index.ts")
const { EmergencyBar } = await vite.ssrLoadModule("/src/components/layout/EmergencyBar/index.ts")
const { Footer } = await vite.ssrLoadModule("/src/components/layout/Footer/index.ts")
const chat = await vite.ssrLoadModule("/src/components/help/ChatConversation/ChatConversation.constants.ts")
const sources = await vite.ssrLoadModule("/src/content/firstAid/sources.ts")
const screens = await vite.ssrLoadModule("/src/screens/PeerChatSketch/PeerChatSketch.screens.tsx")
const helpLines = await vite.ssrLoadModule("/src/utils/helpLines.ts")

const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
const render = (component) => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(component)))

test("the emergency bar is what it always was - five numbers, their order, their labels - and now it is derived", () => {
  assert.deepEqual(emergency.EMERGENCY_NUMBERS, [
    { number: "107", label: "Ambulancias" },
    { number: "911", label: "Emergencias" },
    { number: "144", label: "Violencia" },
    { number: "135", label: "Asistencia en crisis" },
    { number: "102", label: "Niñez" },
  ])
  const html = render(EmergencyBar)
  assert.deepEqual([...html.matchAll(/href="tel:([0-9]+)"/g)].map((match) => match[1]), ["107", "911", "144", "135", "102"])
  for (const { number, label } of emergency.EMERGENCY_NUMBERS) assert.ok(text(html).includes(number) && text(html).includes(label), number)
})

test("the bar and the chat never lose their numbers because a review date passed", () => {
  const lines = data.getEmergencyBarResources()
  assert.equal(lines.length, 5)
  // far in the future every line is past its review date for the pages that hide what is expired...
  assert.ok(lines.every((line) => !data.isCurrent(line, "2099-01-01")))
  // ...and the bar still has all five: it does not depend on the day
  assert.deepEqual(data.getEmergencyBarResources().map((line) => line.contacts[0].dial), ["107", "911", "144", "135", "102"])
  // only verified lines are in it
  assert.ok(lines.every((line) => line.verification.status === "verified"))
})

test("a consumer that names a line the dataset does not have fails loudly, not in front of a person", () => {
  assert.throws(() => data.getHelpLine("no-existe"), /not in lines/)
  assert.equal(data.getHelpLine("emergencias-911").contacts[0].dial, "911")
  // numbers are compared by their digits, however they are written
  assert.equal(data.dialKey("0800-333-0160"), "08003330160")
  assert.equal(data.findResourceByDial("0800 999 0091")?.id, "urgencias-salud-mental-0800")
  assert.equal(data.findResourceByDial("0800-345-1435")?.id, "prevencion-suicidio-cas")
  assert.equal(data.lineContact(data.getHelpLine("prevencion-suicidio-cas"), "0800-345-1435").dial, "08003451435")
})

test("the chat and the footer say the 911, the number that works all over the country, and never present the 107 as universal", () => {
  assert.equal(emergency.GENERAL_EMERGENCY_NUMBER, "911")
  assert.equal(emergency.AMBULANCE_NUMBER, "107")
  assert.deepEqual(emergency.BASIC_EMERGENCY_NUMBERS.map(({ number }) => number), ["107", "911"])
  assert.ok(chat.EMERGENCY_REPLY.includes("911") && chat.EMERGENCY_REPLY.includes("depende de la zona") && chat.EMERGENCY_REPLY.includes("confirmá"))
  assert.ok(!/gratis|24 horas/i.test(chat.EMERGENCY_REPLY), "no hours or cost that no source gives")
  assert.ok(chat.CONNECTION_ERROR_REPLY.includes("llamá al 911") && !chat.CONNECTION_ERROR_REPLY.includes("107"))
  const footer = text(render(Footer))
  assert.ok(footer.includes("Ante una emergencia, llamá al 911") && !footer.includes("107"))
})

test("the first aid guides dial the poison center of the verified lines", () => {
  assert.deepEqual(sources.POISON_CENTER, { number: "0800-333-0160", tel: "08003330160" })
})

test("the help line told in words says only what the dataset records", () => {
  const nineOneOne = helpLines.describeHelpLine("emergencias-911")
  assert.equal(nineOneOne.where, "Funciona en todo el país")
  assert.equal(nineOneOne.hours, undefined, "the source gives no hours for the 911")
  assert.equal(nineOneOne.cost, undefined)
  const mental = helpLines.describeHelpLine("urgencias-salud-mental-0800")
  assert.deepEqual([mental.display, mental.hours, mental.cost], ["0800-999-0091", "Atiende las 24 horas, los 365 días del año.", "Atención gratuita y confidencial."])
  const [c135, c0800] = helpLines.describeHelpContacts("prevencion-suicidio-cas")
  assert.deepEqual([c135.display, c0800.display], ["135", "0800-345-1435"], "the first contact is the regional one, the second the national alternative")
  assert.deepEqual([c135.where, c135.hours], ["Solo CABA y Gran Buenos Aires", "Atiende de 8:00 a 0:00 (medianoche), no las 24 horas."])
  const same = helpLines.describeHelpLine("emergencias-107")
  assert.ok(same.where.startsWith("Depende de la jurisdicción") && same.hours === undefined)
  assert.equal(helpLines.telHref("0800-999-0091"), "tel:08009990091")
})

test("the sketch of the chat with a person names the verified numbers", () => {
  const html = text(renderToStaticMarkup(createElement(screens.AuxiOffers)))
  assert.ok(html.includes("llamá al 911 o al 0800-999-0091"))
})

test("no number is written by hand in the app: every mention of a help number goes through the verified lines", async () => {
  const NUMBERS = "(?:107|911|135|144|102|138|139|141|137|145|149)"
  const patterns = [
    new RegExp(String.raw`(?:llam[aáe]\w*|llamar|marcá|marcar|n[uú]mero|l[ií]nea|tel:)\s+(?:al\s+|el\s+|la\s+)?${NUMBERS}\b`, "i"),
    new RegExp(String.raw`(?<![=\w])["'\x60]${NUMBERS}["'\x60]`),
    /0800-?\d{3}-?\d{4}/,
  ]
  // Contacts of services (not emergency or help lines of the verified dataset) that a page of AuxiliAR tells as its official page publishes them:
  // the national sexual-health line, the Santa Fe line and the Fundación Huésped line. Each is exempt only in the file that tells it.
  const SERVICE_LINES = {
    "src/content/categories/SexEducation/SexEducation.coverage.ts": ["0800-222-3444", "08002223444", "0800-777-0801"],
    "src/content/categories/SexEducation/SexEducation.lists.ts": ["0800-222-4837"],
    // Salud mental: the lines of a province or of the Ciudad, as each official page publishes them (the national lines come from data/resources/lines). The 135 is exempt only
    // here, for the provincial lines of Entre Ríos and Tucumán, which are not the CAS 135 (mental-health.test.mjs checks that it appears only in those two entries)
    "src/content/categories/MentalHealth/MentalHealth.directory.ts": ["0800-333-1665", "0800-222-5462", "0800-888-5555", "0800-888-4767", "0800-888-3364", "135"],
  }
  const offenders = []
  const walk = async (dir) => {
    for (const entry of await readdir(join(root, dir), { withFileTypes: true })) {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) {
        if (path.replaceAll("\\", "/") === "src/data/resources") continue
        await walk(path)
      } else if (/\.(ts|tsx)$/.test(entry.name) && !/Auxi\.constants|\.test\./.test(entry.name)) {
        const source = await readFile(join(root, path), "utf8")
        // Only these data files may write a number, and only the exact 0800 lines of non-emergency services listed above: every other number
        // (an emergency or help line, or a new 0800) still fails here, in these files too
        const exempt = SERVICE_LINES[path.replaceAll("\\", "/")] ?? []
        source.split("\n").forEach((rawLine, index) => {
          const line = exempt.reduce((text, number) => text.replaceAll(number, ""), rawLine)
          if (patterns.some((pattern) => pattern.test(line)) && !/^\s*(\/\/|\*|\/\*)/.test(line)) offenders.push(`${path}:${index + 1}: ${line.trim().slice(0, 100)}`)
        })
      }
    }
  }
  await walk("src")
  assert.deepEqual(offenders, [])
})
