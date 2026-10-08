/*
 * The help lines and emergency numbers: one structured source (src/data/resources/lines/nacional.json) and what is derived from it.
 * These tests check what the dataset claims against the evidence it records, so a number or a condition cannot be published without it.
 *   npm run emergency:test
 */
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, "..")
const lines = JSON.parse(await readFile(join(root, "src/data/resources/lines/nacional.json"), "utf8")).resources
const byId = (id) => lines.find((line) => line.id === id)
const digits = (text) => String(text).replace(/\D/g, "")
const allContacts = lines.flatMap((line) => line.contacts.map((contact) => ({ line, contact })))

test("every line carries its evidence: official source with URL and date, who verified it, and until when", () => {
  assert.ok(lines.length >= 14)
  for (const line of lines) {
    assert.equal(line.verification.status, "verified", line.id)
    assert.match(line.source.url, /^https:\/\//, line.id)
    assert.match(line.source.retrievedAt, /^\d{4}-\d{2}-\d{2}$/, line.id + " has no consultation date")
    assert.ok(line.source.note.trim().length > 20, line.id + " does not quote what the source says")
    assert.ok(line.verification.verifiedBy && line.verification.nextReviewDue > line.verification.verifiedAt, line.id)
  }
})

test("numbers: unique, digits only to dial, written as people dial them", () => {
  const dials = new Map()
  for (const { line, contact } of allContacts) {
    assert.match(contact.dial, /^[0-9]+$/, line.id + " dial")
    assert.equal(digits(contact.display), contact.dial, line.id + " shows a different number than it dials")
    // the same number twice only inside one resource (107, which is listed by jurisdiction)
    assert.ok(!dials.has(contact.dial) || dials.get(contact.dial) === line.id, contact.dial + " belongs to two lines")
    dials.set(contact.dial, line.id)
  }
})

test("no hours are claimed that the source does not say: 24 h only where the source quotes it, and not for the Centro de Asistencia al Suicida", () => {
  for (const line of lines) {
    if (line.hours?.open24h) assert.match(line.source.note, /24 horas|24 hs|las 24/i, line.id + " says 24 h but its source note does not")
    for (const { contact } of line.contacts.map((contact) => ({ contact }))) if (contact.hours?.open24h) assert.match(line.source.note, /24/, line.id)
  }
  // no hours known: said as unknown, never filled in
  for (const id of ["emergencias-107", "emergencias-911", "linea-102", "trata-145", "pami-emergencias-139", "salud-responde-0800", "salud-sexual-reproductiva-0800"]) assert.equal(byId(id).hours, null, id)
  assert.equal(byId("prevencion-suicidio-cas").hours.open24h, false)
})

test("the 0800-999-0091: national, free, 24 h, with the Ministerio de Salud source of 10/09/2026", () => {
  const line = byId("urgencias-salud-mental-0800")
  assert.equal(line.contacts[0].dial, "08009990091")
  assert.equal(line.coverage.level, "national")
  assert.equal(line.cost, "free")
  assert.equal(line.hours.open24h, true)
  assert.match(line.source.organization, /Ministerio de Salud/)
  assert.match(line.source.url, /^https:\/\/www\.argentina\.gob\.ar\//)
  assert.ok(line.source.note.includes("10-09-2026"))
})

test("the 135 is for CABA and Gran Buenos Aires, the 0800-345-1435 is the national alternative, from 8:00 to 0:00, with source and date", () => {
  const line = byId("prevencion-suicidio-cas")
  const c135 = line.contacts.find((contact) => contact.dial === "135")
  const c0800 = line.contacts.find((contact) => contact.dial === "08003451435")
  assert.deepEqual(c135.scope.areas, ["amba"])
  assert.equal(c135.scope.level, "region")
  assert.equal(c135.scope.note, "Solo CABA y Gran Buenos Aires")
  assert.equal(c0800.scope.level, "national")
  assert.ok(line.hours.note.includes("8:00 a 0:00") && line.hours.open24h === false)
  assert.match(line.source.organization, /Centro de Asistencia al Suicida/)
  assert.ok(line.source.url.includes("asistenciaalsuicida.org.ar") && line.source.retrievedAt === "2026-10-08")
})

test("the 107 is registered by jurisdiction: never national, never only CABA and Buenos Aires, the contradiction recorded, 911 as the general alternative", () => {
  const line = byId("emergencias-107")
  assert.notEqual(line.coverage.level, "national")
  assert.ok(line.coverage.note.includes("no es una lista completa") && line.coverage.note.includes("Confirmá el número local") && line.coverage.note.includes("911"))
  assert.ok(!/todo el país/i.test(line.coverage.note.replace("ni quiere decir que funcione en todo el país", "").replace("En cualquier lugar del país", "")), "claims the whole country")
  const labels = line.contacts.map((contact) => contact.label)
  assert.deepEqual(labels, ["Ciudad de Buenos Aires", "Provincia de Buenos Aires", "Ciudad de Córdoba", "Jujuy"])
  assert.ok(line.contacts.every((contact) => contact.dial === "107" && contact.scope.note.length > 20))
  // a locality-level availability is not written as a whole province
  assert.equal(line.contacts.find((contact) => contact.label === "Provincia de Buenos Aires").scope.level, "municipal")
  assert.equal(line.contacts.find((contact) => contact.label === "Ciudad de Córdoba").scope.level, "municipal")
  assert.match(line.verification.notes, /Contradicción entre fuentes oficiales/)
  // the sources of each jurisdiction are quoted
  for (const host of ["argentina.gob.ar", "buenosaires.gob.ar", "cordoba.gob.ar", "salud.jujuy.gob.ar"]) assert.ok((line.source.url + line.source.note).includes(host), host)
  // the 911 is the general alternative and is national
  assert.equal(byId("emergencias-911").coverage.level, "national")
})

test("contradictions between official pages are recorded where they matter: 102 and the PAMI emergencies", () => {
  assert.match(byId("linea-102").verification.notes, /Contradicción entre fuentes oficiales/)
  assert.ok(byId("linea-102").verification.notes.includes("16 provincias"))
  const pami = byId("pami-emergencias-139")
  assert.deepEqual(pami.coverage.areas, ["amba", "ugl-rosario"])
  assert.ok(pami.coverage.note.includes("prestador asignado") && pami.coverage.note.includes("911"))
  assert.ok(!/107/.test(JSON.stringify({ coverage: pami.coverage, whenToUse: pami.whenToUse, contacts: pami.contacts })), "the PAMI emergencies are not sent to the 107")
})

test("the emergency bar keeps its five numbers, in its order and with its labels", () => {
  const bar = lines
    .filter((line) => line.display?.emergencyBarOrder !== undefined)
    .sort((a, b) => a.display.emergencyBarOrder - b.display.emergencyBarOrder)
  assert.deepEqual(bar.map((line) => line.contacts[0].dial), ["107", "911", "144", "135", "102"])
  assert.deepEqual(bar.map((line) => line.shortName), ["Ambulancia", "Policía", "Violencia", "Crisis", "Niñez"])
  assert.deepEqual(bar.map((line) => line.display.emergencyBarOrder), [1, 2, 3, 4, 5])
})
