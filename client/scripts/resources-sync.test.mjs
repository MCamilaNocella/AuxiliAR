/*
 * Tests of the resources dataset tooling:  npm run resources:test  (Node's built-in runner, no dependencies).
 * They use the real schema and taxonomy, with fixtures only for the data: nothing here is a real help line or place.
 */
import assert from "node:assert/strict"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"
import { derivedCategories, resolveResource, resolveService } from "./resources-resolve.mjs"
import { assertSchemaSupported, dialKey, isCalendarDate, validateDataset, validateTaxonomy } from "./resources-validate.mjs"
import { DEFAULT_PATHS, buildServerCopy, run } from "./resources-sync.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const fixtureLines = join(here, "__fixtures__/resources/lines")
// The server's own tests read this same file: this test keeps it equal to what the sync generates from the fixtures
const serverFixture = resolve(here, "../../server/src/test/resources/data/resources-fixture.json")

const readJson = async (file) => JSON.parse(await readFile(file, "utf8"))
const schema = await readJson(join(DEFAULT_PATHS.sourceDir, "resource.schema.json"))
const taxonomy = await readJson(join(DEFAULT_PATHS.sourceDir, "taxonomy.json"))
const fixture = await readJson(join(fixtureLines, "fixture.json"))

// Positions in the fixture (see fixture.json)
const [EMERGENCY, UNVERIFIED, EXPIRED, CENTER, CESAC, HOSPITAL, VET] = [0, 1, 2, 3, 4, 5, 6]
const byId = Object.fromEntries(fixture.resources.map((resource) => [resource.id, resource]))

/** Validates a copy of the fixture after `change` edited its resources */
const validateChanged = (change) => {
  const data = structuredClone(fixture)
  change(data.resources)
  return validateDataset({ files: [{ name: "test.json", data }], schema, taxonomy })
}

const assertProblem = (result, text) => {
  assert.ok(result.errors.some((error) => error.includes(text)), `se esperaba un problema con "${text}", hubo:\n${result.errors.join("\n")}`)
  assert.deepEqual(result.resources, [])
}

test("the real dataset is valid", async () => {
  const dir = await mkdtemp(join(tmpdir(), "resources-"))
  try {
    const result = await run({ mode: "sync", outFile: join(dir, "out.json") })
    assert.deepEqual(result.errors, [])
    assert.equal(result.ok, true)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test("the fixtures are valid", () => {
  const result = validateDataset({ files: [{ name: "fixture.json", data: fixture }], schema, taxonomy })
  assert.deepEqual(result.errors, [])
  assert.equal(result.resources.length, 7)
})

test("service types: the new ones are there, counseling was renamed, and a type can belong to several categories", () => {
  const types = Object.fromEntries(taxonomy.serviceTypes.map((entry) => [entry.id, entry.categories]))
  for (const id of ["laboratory", "diagnostic-imaging", "specialty-care", "pharmacy"]) assert.deepEqual(types[id], ["salud-fisica"], id)
  for (const id of ["pregnancy-care", "sti-testing-care", "emergency-contraception", "ive-ile-care", "sexual-health-counseling"]) assert.deepEqual(types[id], ["esi"], id)
  assert.equal(types.counseling, undefined)
  assert.equal(taxonomy.serviceTypes.length, 23)

  // the derivation is a list per type: with two categories the service and its place show up under both
  const multi = structuredClone(taxonomy)
  multi.serviceTypes.find(({ id }) => id === "pregnancy-care").categories = ["esi", "salud-fisica"]
  assert.deepEqual(validateTaxonomy(multi), [])
  const place = { id: "x", kind: "service", services: [{ id: "a", type: "pregnancy-care" }, { id: "b", type: "pharmacy" }] }
  assert.deepEqual(resolveService(place, place.services[0], multi).categories, ["esi", "salud-fisica"])
  assert.deepEqual(derivedCategories(place, multi), ["esi", "salud-fisica"])
  assert.deepEqual(derivedCategories(place, taxonomy), ["esi", "salud-fisica"])

  multi.serviceTypes.find(({ id }) => id === "pregnancy-care").categories = ["esi", "esi"]
  assert.match(validateTaxonomy(multi)[0], /repite categorías/)
})

test("the taxonomy makes sense", () => {
  assert.deepEqual(validateTaxonomy(taxonomy), [])
  const broken = structuredClone(taxonomy)
  broken.serviceTypes[0].categories = ["inventada"]
  assert.match(validateTaxonomy(broken)[0], /no existe/)
  broken.serviceTypes[0].categories = []
  assert.match(validateTaxonomy(broken)[0], /al menos una categoría/)
  const repeated = structuredClone(taxonomy)
  repeated.facilityTypes.push({ id: "hospital", label: "Otra vez" })
  assert.match(validateTaxonomy(repeated)[0], /ids repetidos/)
})

test("the server's test fixture is what the sync generates from the client fixtures", async () => {
  const result = validateDataset({ files: [{ name: "fixture.json", data: fixture }], schema, taxonomy })
  const expected = buildServerCopy(result.resources, taxonomy)
  if (process.env.UPDATE_FIXTURE) await writeFile(serverFixture, expected)
  const actual = (await readFile(serverFixture, "utf8")).replace(/\r\n/g, "\n")
  assert.equal(actual, expected, "Regenerala con: UPDATE_FIXTURE=1 npm run resources:test")
})

test("the schema can only use keywords the validator enforces", () => {
  assert.doesNotThrow(() => assertSchemaSupported(schema))
  assert.throws(() => assertSchemaSupported({ type: "object", properties: { a: { format: "uri" } } }), /format/)
})

test("rejects what doesn't fit the schema", () => {
  assertProblem(validateChanged((resources) => delete resources[EMERGENCY].name), 'falta "name"')
  assertProblem(validateChanged((resources) => (resources[EMERGENCY].extra = true)), '"extra" no existe')
  assertProblem(validateChanged((resources) => (resources[EMERGENCY].kind = "hospital")), "taxonomy.kinds")
  assertProblem(validateChanged((resources) => (resources[EMERGENCY].id = "Con Espacios")), "formato esperado")
  assertProblem(validateChanged((resources) => (resources[EMERGENCY].id = "a".repeat(81))), "más de 80 caracteres")
  assertProblem(validateChanged((resources) => (resources[EMERGENCY].contacts[0].dial = "0800-333-0160")), "formato esperado")
  assertProblem(validateChanged((resources) => (resources[EMERGENCY].categories = ["inventada"])), "taxonomy.categories")
  assertProblem(validateChanged((resources) => (resources[CENTER].coordinates.lat = 120)), "mayor que 90")
  assertProblem(validateChanged((resources) => (resources[EMERGENCY].hours = { open24h: "si" })), "boolean")
  assertProblem(validateChanged((resources) => (resources[EMERGENCY].source.url = "ftp://example.org")), "formato esperado")
})

test("a verified resource needs its proof; the others don't", () => {
  assertProblem(validateChanged((resources) => delete resources[EMERGENCY].verification.nextReviewDue), "necesita nextReviewDue")
  assertProblem(validateChanged((resources) => (resources[EMERGENCY].verification.verifiedAt = null)), "necesita verifiedAt")
  assertProblem(validateChanged((resources) => delete resources[EMERGENCY].verification.verifiedBy), "necesita verifiedBy")
  assertProblem(validateChanged((resources) => delete resources[EMERGENCY].source), "necesita source.url")
  assertProblem(validateChanged((resources) => (resources[EMERGENCY].verification.nextReviewDue = "2026-01-10")), "posterior a verifiedAt")
  assertProblem(validateChanged((resources) => (resources[EMERGENCY].verification.nextReviewDue = "2026-02-30")), "no es una fecha real")
  // An unverified one can be loaded without source or dates
  assert.deepEqual(validateChanged(() => {}).errors, [])
})

test("ids are unique, and a number is shared only among places", () => {
  assertProblem(validateChanged((resources) => (resources[UNVERIFIED].id = resources[EMERGENCY].id)), "el id ya está")
  // Two lines can't share a number, however it is written
  assertProblem(validateChanged((resources) => (resources[UNVERIFIED].contacts[0].dial = "+000")), "solo los lugares pueden compartir")
  assertProblem(validateChanged((resources) => (resources[UNVERIFIED].contacts[0].dial = "5550200")), "solo los lugares pueden compartir")
  // A line can't share with a place either
  assertProblem(validateChanged((resources) => (resources[UNVERIFIED].contacts[0].dial = "5550300")), "solo los lugares pueden compartir")
  // Places do share (the fixture's CeSAC and hospital have the same central), and a place can have no contacts at all
  assert.equal(byId["fixture-cesac"].contacts[0].dial, byId["fixture-hospital"].contacts[0].dial)
  assert.equal(fixture.resources[VET].contacts, undefined)
  assert.deepEqual(validateChanged(() => {}).errors, [])
})

test("a line needs a contact; a place doesn't", () => {
  assertProblem(validateChanged((resources) => (resources[EMERGENCY].contacts = [])), 'necesita al menos un contacto')
  assertProblem(validateChanged((resources) => delete resources[EXPIRED].contacts), 'necesita al menos un contacto')
  assert.deepEqual(validateChanged((resources) => delete resources[CENTER].contacts).errors, [])
})

test("coverage, hours and sections make sense", () => {
  assertProblem(validateChanged((resources) => (resources[EMERGENCY].coverage = { level: "national", provinces: ["AR-C"] })), "no lleva provincias")
  assertProblem(validateChanged((resources) => (resources[UNVERIFIED].coverage = { level: "province" })), "necesita al menos una provincia")
  assertProblem(validateChanged((resources) => (resources[EXPIRED].coverage = { level: "region" })), "necesita provincias o áreas")
  assertProblem(validateChanged((resources) => (resources[EMERGENCY].hours = { open24h: true, schedule: [{ days: [1], from: "09:00", to: "10:00" }] })), "no lleva schedule")
  assertProblem(validateChanged((resources) => (resources[EXPIRED].hours.schedule[0].to = "08:00")), "anterior a")
  assertProblem(validateChanged((resources) => (resources[CENTER].sections[0].category = "esi")), "tiene que estar también en categories")
})

test("establishments: facility type, services and what goes with them", () => {
  assertProblem(validateChanged((resources) => (resources[EMERGENCY].services = [{ id: "x", type: "vaccination" }])), 'solo van en recursos "service"')
  assertProblem(validateChanged((resources) => delete resources[CESAC].facilityType), "necesita facilityType")
  assertProblem(validateChanged((resources) => (resources[EMERGENCY].facilityType = "hospital")), 'facilityType solo va en recursos "service"')
  assertProblem(validateChanged((resources) => (resources[CESAC].categories = ["centros"])), "se derivan de las prestaciones")
  assertProblem(validateChanged((resources) => (resources[CESAC].sections = [{ category: "centros", section: "section-1" }])), "no se escribe sections")
  assertProblem(validateChanged((resources) => (resources[CESAC].services[1].id = resources[CESAC].services[0].id)), "otra prestación")
  assertProblem(validateChanged((resources) => (resources[CESAC].services[0].type = "cirugia")), "taxonomy.serviceTypes")
  assertProblem(validateChanged((resources) => (resources[CESAC].services[0].appointment = { mode: "quizas" })), "taxonomy.appointmentModes")
  assertProblem(validateChanged((resources) => (resources[CESAC].services[1].hours.schedule[0].to = "08:00")), "anterior a")
  assertProblem(validateChanged((resources) => (resources[CESAC].services[1].contacts[0].dial = "abc")), "formato esperado")
  assertProblem(validateChanged((resources) => (resources[CESAC].services[0].extra = 1)), '"extra" no existe')
})

test("a service's own verification has to be complete, with the source that applies to it", () => {
  const verified = (resources) => resources[CESAC].services[3]
  assertProblem(validateChanged((resources) => delete verified(resources).verification.verifiedBy), "necesita verifiedBy")
  assertProblem(validateChanged((resources) => (verified(resources).verification.nextReviewDue = "2026-03-01")), "posterior a verifiedAt")
  // Its own source is enough, and so is the establishment's
  assert.deepEqual(validateChanged((resources) => delete verified(resources).source).errors, [])
  // But without any of the two, a verified service has no source
  assertProblem(
    validateChanged((resources) => {
      delete verified(resources).source
      delete resources[CESAC].source
      resources[CESAC].verification = { status: "unverified" }
    }),
    "services[3]",
  )
})

test("coordinates: a verified point says where it came from, and has to be in Argentina", () => {
  assertProblem(validateChanged((resources) => delete resources[CESAC].coordinates.status), 'falta "status"')
  assertProblem(validateChanged((resources) => delete resources[CESAC].coordinates.method), "necesitan method")
  assertProblem(validateChanged((resources) => delete resources[CESAC].coordinates.verifiedBy), "necesitan verifiedBy")
  assertProblem(validateChanged((resources) => delete resources[CESAC].coordinates.verifiedAt), "necesitan verifiedAt")
  assertProblem(validateChanged((resources) => (resources[CESAC].coordinates.method = "adivinado")), "taxonomy.coordinateMethods")
  // Latitude and longitude swapped
  assertProblem(validateChanged((resources) => Object.assign(resources[CESAC].coordinates, { lat: -58.38, lng: -34.61 })), "fuera de Argentina")
  // An unverified candidate needs none of that proof
  assert.deepEqual(validateChanged((resources) => (resources[CESAC].coordinates = { lat: -34.6, lng: -58.4, precision: "approximate", status: "unverified" })).errors, [])
})

test("the same establishment can't be loaded twice", () => {
  assertProblem(validateChanged((resources) => (resources[HOSPITAL].externalIds.refes = "FIXTURE-0001")), "ya está en")
  assertProblem(validateChanged((resources) => (resources[HOSPITAL].externalIds = { REFES: "x" })), "minúsculas y guiones")
  assertProblem(validateChanged((resources) => (resources[HOSPITAL].externalIds.otro = "")), "no puede estar vacío")
  assert.deepEqual(validateChanged((resources) => (resources[HOSPITAL].externalIds = { refes: "FIXTURE-0002", gcba: "FIXTURE-0001" })).errors, [])
})

test("taxonomy.categories has to match the app's categories when they are given", () => {
  const data = structuredClone(fixture)
  const real = taxonomy.categories.map(({ id }) => id)
  assert.deepEqual(validateDataset({ files: [{ name: "f", data }], schema, taxonomy, categoryIds: real }).errors, [])
  assertProblem(validateDataset({ files: [{ name: "f", data }], schema, taxonomy, categoryIds: [...real, "nueva"] }), 'falta la categoría "nueva"')
  assertProblem(validateDataset({ files: [{ name: "f", data }], schema, taxonomy, categoryIds: real.slice(1) }), "no existe como categoría")
})

test("a service inherits from its establishment what it doesn't say", () => {
  const cesac = byId["fixture-cesac"]
  const [vaccination, dentistry, mental, contraception] = cesac.services.map((service) => resolveService(cesac, service, taxonomy))

  // Says nothing: everything comes from the establishment
  assert.deepEqual(vaccination.hours, cesac.hours)
  assert.equal(vaccination.cost, "free")
  assert.deepEqual(vaccination.requirements, ["Documento de prueba"])
  assert.deepEqual(vaccination.audience, ["all"])
  assert.deepEqual(vaccination.appointment, { mode: "unknown" })
  assert.deepEqual(vaccination.contacts, [])
  assert.deepEqual(vaccination.source, cesac.source)
  assert.deepEqual(vaccination.verification, cesac.verification)
  assert.deepEqual(vaccination.categories, ["salud-fisica"])

  // Its own values win
  assert.equal(dentistry.hours.schedule[0].from, "09:00")
  assert.equal(dentistry.cost, "mixed")
  assert.equal(dentistry.costNote, "Solo para tests.")
  assert.deepEqual(dentistry.requirements, ["Documento de prueba", "Carnet de prueba"])
  assert.equal(dentistry.appointment.mode, "required")
  assert.equal(dentistry.contacts[0].dial, "5550301")
  assert.equal(mental.verification.status, "unverified")
  assert.equal(mental.source.url, cesac.source.url)
  assert.deepEqual(contraception.audience, ["adolescents", "adults"])
  assert.equal(contraception.source.url, "https://example.org/fixture-cesac-anticonceptivos")
  assert.equal(contraception.verification.nextReviewDue, "2026-06-01")

  // hours: null is "not known": it doesn't inherit the establishment's
  assert.equal(contraception.hours, null)
  const hospital = byId["fixture-hospital"]
  const [emergencyRoom, ophthalmology] = hospital.services.map((service) => resolveService(hospital, service, taxonomy))
  assert.deepEqual(emergencyRoom.hours, { open24h: true })
  assert.equal(ophthalmology.hours, null)
  // Cost nobody said is "unknown", never free
  assert.equal(emergencyRoom.cost, "unknown")
})

test("an establishment's categories come from its services, not from what is written", () => {
  assert.deepEqual(derivedCategories(byId["fixture-cesac"], taxonomy), ["esi", "salud-fisica", "salud-mental"])
  assert.deepEqual(derivedCategories(byId["fixture-hospital"], taxonomy), ["salud-fisica", "salud-mental"])
  assert.deepEqual(derivedCategories(byId["fixture-veterinaria"], taxonomy), ["animales"])
  assert.deepEqual(derivedCategories(byId["fixture-centro"], taxonomy), [])
})

test("the server copy is resolved for places and untouched for lines", () => {
  const resolved = JSON.parse(buildServerCopy(fixture.resources, taxonomy)).resources
  const copy = Object.fromEntries(resolved.map((resource) => [resource.id, resource]))
  assert.deepEqual(copy["fixture-emergencia"], JSON.parse(JSON.stringify(byId["fixture-emergencia"])))
  assert.equal(copy["fixture-emergencia"].derivedCategories, undefined)
  assert.equal(copy["fixture-centro"].derivedCategories, undefined)
  assert.deepEqual(copy["fixture-cesac"].derivedCategories, ["esi", "salud-fisica", "salud-mental"])
  assert.equal(copy["fixture-cesac"].services.length, 4)
  assert.equal(copy["fixture-cesac"].services[0].cost, "free")
  assert.equal(copy["fixture-cesac"].services[3].hours, null)
  // The same input, the same output
  assert.equal(buildServerCopy(fixture.resources, taxonomy), buildServerCopy([...fixture.resources].reverse(), taxonomy))
  assert.deepEqual(resolveResource(byId["fixture-emergencia"], taxonomy), byId["fixture-emergencia"])
})

test("helpers", () => {
  assert.equal(dialKey("0800-333-0160"), dialKey("08003330160"))
  assert.equal(isCalendarDate("2026-02-28"), true)
  assert.equal(isCalendarDate("2026-02-29"), false)
  assert.equal(isCalendarDate("2026-2-3"), false)
})

test("the server copy is sorted by id and has no dates", () => {
  const sorted = JSON.parse(buildServerCopy([{ id: "b" }, { id: "a" }], taxonomy))
  assert.deepEqual(sorted.resources.map(({ id }) => id), ["a", "b"])
  assert.equal(sorted.schemaVersion, taxonomy.schemaVersion)
  assert.match(sorted.notice, /No editar/)
})

test("sync writes the server copy; check notices when it is out of date", async () => {
  const dir = await mkdtemp(join(tmpdir(), "resources-"))
  const outFile = join(dir, "data/resources.json")
  const options = { linesDir: fixtureLines, outFile }
  try {
    // Missing copy
    assert.equal((await run({ ...options, mode: "check" })).ok, false)

    assert.equal((await run({ ...options, mode: "sync" })).ok, true)
    assert.equal((await run({ ...options, mode: "check" })).ok, true)

    // Windows checkouts may use CRLF: not a difference
    const text = await readFile(outFile, "utf8")
    await writeFile(outFile, text.replace(/\n/g, "\r\n"))
    assert.equal((await run({ ...options, mode: "check" })).ok, true)

    // Hand-edited copy
    await writeFile(outFile, text.replace("fixture-centro", "otro-id"))
    const stale = await run({ ...options, mode: "check" })
    assert.equal(stale.ok, false)
    assert.match(stale.errors[0], /resources:sync/)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test("sync doesn't write anything when the dataset is invalid", async () => {
  const dir = await mkdtemp(join(tmpdir(), "resources-"))
  const linesDir = join(dir, "lines")
  const outFile = join(dir, "out.json")
  try {
    const { mkdir } = await import("node:fs/promises")
    await mkdir(linesDir)
    const broken = structuredClone(fixture)
    delete broken.resources[EMERGENCY].name
    await writeFile(join(linesDir, "broken.json"), JSON.stringify(broken))
    const result = await run({ linesDir, outFile, mode: "sync" })
    assert.equal(result.ok, false)
    await assert.rejects(readFile(outFile, "utf8"), /ENOENT/)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test("the TypeScript types list exactly the values of the taxonomy", async () => {
  const source = await readFile(resolve(here, "../src/data/resources/resources.types.ts"), "utf8")
  const unions = {
    ResourceKind: "kinds",
    VerificationStatus: "verificationStatuses",
    ResourceCost: "costs",
    Audience: "audiences",
    ContactType: "contactTypes",
    CoverageLevel: "coverageLevels",
    AreaId: "areas",
    ProvinceCode: "provinces",
    CategoryId: "categories",
    FacilityType: "facilityTypes",
    ServiceType: "serviceTypes",
    AppointmentMode: "appointmentModes",
    CoordinateStatus: "coordinateStatuses",
    CoordinateMethod: "coordinateMethods",
    JurisdictionLevel: "jurisdictionLevels",
  }
  for (const [typeName, key] of Object.entries(unions)) {
    // Git on Windows may check files out with CRLF
    const block = new RegExp(`export type ${typeName} =([\\s\\S]*?)\\r?\\n\\r?\\n`).exec(source)
    assert.ok(block, `resources.types.ts: no encuentro el tipo ${typeName}`)
    const listed = [...block[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]).sort()
    const expected = taxonomy[key].map(({ id }) => id).sort()
    assert.deepEqual(listed, expected, `resources.types.ts: ${typeName} no coincide con taxonomy.${key}`)
  }
})

/*
 * The app's own functions (src/data/resources/index.ts, loaded through Vite like the app does) and the script's
 * must agree, since the app reads the authored data and the server reads what the script resolves.
 */
const { createServer } = await import("vite")
const vite = await createServer({ root: resolve(here, ".."), logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
after(() => vite.close())
const app = await vite.ssrLoadModule("/src/data/resources/index.ts")

const json = (value) => JSON.parse(JSON.stringify(value))

test("the app and the script resolve services the same way", () => {
  for (const resource of fixture.resources.filter((candidate) => candidate.services)) {
    resource.services.forEach((service) => {
      assert.deepEqual(json(app.resolveService(resource, service)), json(resolveService(resource, service, taxonomy)), `${resource.id}.${service.id}`)
    })
    assert.deepEqual(app.getDerivedCategories(resource), derivedCategories(resource, taxonomy), resource.id)
  }
})

test("the app: current services, categories and what can go on the map", () => {
  const ids = (list) => list.map(({ id }) => id)
  const cesac = byId["fixture-cesac"]
  const hospital = byId["fixture-hospital"]
  const vet = byId["fixture-veterinaria"]

  // The unverified service is out; the one with its own review date is in until it arrives
  assert.deepEqual(ids(app.getCurrentServices(cesac, "2026-03-01")), ["vacunacion", "odontologia", "anticonceptivos"])
  assert.deepEqual(ids(app.getCurrentServices(cesac, "2026-05-31")), ["vacunacion", "odontologia", "anticonceptivos"])
  assert.deepEqual(ids(app.getCurrentServices(cesac, "2026-06-01")), ["vacunacion", "odontologia"])
  // An establishment whose own verification expired shows none of its services
  assert.deepEqual(app.getCurrentServices(cesac, "2030-01-01"), [])

  assert.deepEqual(app.getCategories(cesac), ["esi", "salud-fisica", "salud-mental"])
  assert.deepEqual(app.getCategories(byId["fixture-centro"]), ["centros", "salud-fisica"])
  assert.deepEqual(app.getCategories(byId["fixture-emergencia"]), ["primeros-auxilios"])

  // Verified coordinates → on the map; a candidate or no coordinates → list only
  assert.equal(app.isMappable(cesac), true)
  assert.equal(app.isMappable(hospital), false)
  assert.equal(app.isMappable(vet), false)
  assert.equal(app.isMappable(byId["fixture-centro"]), true)
})
