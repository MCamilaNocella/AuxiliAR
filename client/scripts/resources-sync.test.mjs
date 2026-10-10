/*
 * Tests of the resources dataset tooling:  npm run resources:test  (Node's built-in runner, no dependencies).
 * They use the real schema and taxonomy, with fixtures only for the data: nothing here is a real help line or place.
 */
import assert from "node:assert/strict"
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import test, { after } from "node:test"
import { fileURLToPath } from "node:url"
import { derivedCategories, resolveResource, resolveService } from "./resources-resolve.mjs"
import { assertSchemaSupported, dialKey, isCalendarDate, validateDataset, validateTaxonomy } from "./resources-validate.mjs"
import { DEFAULT_PATHS, buildCoverage, buildServerCopy, run, writeAllOrNothing } from "./resources-sync.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const fixtureLines = join(here, "__fixtures__/resources/lines")
const fixturePlaces = join(here, "__fixtures__/resources/places")
// The server's own tests read this same file: this test keeps it equal to what the sync generates from the fixtures
const serverFixture = resolve(here, "../../server/src/test/resources/data/resources-fixture.json")

const readJson = async (file) => JSON.parse(await readFile(file, "utf8"))
const schema = await readJson(join(DEFAULT_PATHS.sourceDir, "resource.schema.json"))
const taxonomy = await readJson(join(DEFAULT_PATHS.sourceDir, "taxonomy.json"))
// The fixture is split like the real dataset: lines/ and one places/ file per province
const fixtureFiles = [
  { name: "lines/fixture.json", data: await readJson(join(fixtureLines, "fixture.json")) },
  { name: "places/ar-c.json", data: await readJson(join(fixturePlaces, "ar-c.json")) },
  { name: "places/ar-b.json", data: await readJson(join(fixturePlaces, "ar-b.json")) },
]
const fixture = { resources: fixtureFiles.flatMap(({ data }) => data.resources) }

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
  const result = validateDataset({ files: fixtureFiles, schema, taxonomy })
  assert.deepEqual(result.errors, [])
  assert.equal(result.resources.length, 7)
})

test("service types: the new ones are there, counseling was renamed, and a type can belong to several categories", () => {
  const types = Object.fromEntries(taxonomy.serviceTypes.map((entry) => [entry.id, entry.categories]))
  for (const id of ["laboratory", "diagnostic-imaging", "specialty-care", "pharmacy"]) assert.deepEqual(types[id], ["salud-fisica"], id)
  for (const id of ["pregnancy-care", "sti-testing-care", "emergency-contraception", "ive-ile-care", "sexual-health-counseling"]) assert.deepEqual(types[id], ["esi"], id)
  assert.equal(types.counseling, undefined)
  assert.equal(taxonomy.serviceTypes.length, 27)

  // food, nutrition and physical activity are subsections of Salud general, not categories of their own
  for (const id of ["nutrition-care", "food-assistance", "food-program-enrollment", "physical-activity"]) assert.deepEqual(types[id], ["salud-fisica"], id)
  assert.equal(taxonomy.categories.length, 8)

  // facility types are concrete places: programs and procedures are not established as places
  const facilityIds = taxonomy.facilityTypes.map(({ id }) => id)
  for (const id of ["health-promotion-station", "sports-center", "day-center", "family-action-center", "social-assistance-office", "community-organization"]) assert.ok(facilityIds.includes(id), id)
  for (const id of ["program", "public-space-activity"]) assert.ok(!facilityIds.includes(id), id)

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
  const result = validateDataset({ files: fixtureFiles, schema, taxonomy })
  const expected = buildServerCopy(result.resources, taxonomy)
  if (process.env.UPDATE_FIXTURE) await writeFile(serverFixture, expected)
  const actual = (await readFile(serverFixture, "utf8")).replace(/\r\n/g, "\n")
  assert.equal(actual, expected, "Regenerala con: UPDATE_FIXTURE=1 npm run resources:test")
})

test("places/<province>.json: named after a province, only establishments of that province", () => {
  const centro = fixture.resources[CENTER]
  const validatePlaces = (name, resources) => validateDataset({ files: [{ name, data: { resources } }], schema, taxonomy })
  assert.deepEqual(validatePlaces("places/ar-c.json", [centro]).errors, [])
  assertProblem(validatePlaces("places/caba.json", [centro]), "tiene que llamarse como el código de una provincia")
  assertProblem(validatePlaces("places/AR-C.json", [centro]), "tiene que llamarse como el código de una provincia")
  assertProblem(validatePlaces("places/ar-b.json", [centro]), "solo si su address.province es \"AR-B\"")
  const noAddress = structuredClone(centro)
  delete noAddress.address
  assertProblem(validatePlaces("places/ar-c.json", [noAddress]), "(es \"ninguna\")")
  const line = fixture.resources[EMERGENCY]
  assertProblem(validatePlaces("places/ar-c.json", [line]), "solo van establecimientos")
  // The same rules don't apply to lines/
  assert.deepEqual(validatePlaces("lines/otro.json", [centro]).errors, [])
})

test("ids and external ids are unique across lines/ and every places/ file", () => {
  const [linesFile, arC, arB] = structuredClone(fixtureFiles)
  const copy = structuredClone(arC.data.resources[0])
  // Same id in another province's file
  copy.address.province = "AR-B"
  assertProblem(validateDataset({ files: [linesFile, arC, { name: arB.name, data: { resources: [...arB.data.resources, copy] } }], schema, taxonomy }), "el id ya está en places/ar-c.json")
  // Same external id
  arC.data.resources[0].externalIds = { refes: "1" }
  const other = { ...structuredClone(arB.data.resources[0]), externalIds: { refes: "1" } }
  assertProblem(validateDataset({ files: [arC, { name: arB.name, data: { resources: [other] } }], schema, taxonomy }), "ya está en")
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
  const options = { linesDir: fixtureLines, placesDir: fixturePlaces, outFile }
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
const app = await vite.ssrLoadModule("/src/data/resources/index.ts")
// The same pieces of the app the sync uses to say what the map can show (see resources-visibility.mjs)
const placesApp = await vite.ssrLoadModule("/src/utils/places/index.ts")
const visibility = { selectPlaces: placesApp.selectPlaces, PLACE_FILTERS: placesApp.PLACE_FILTERS, EMPTY_PLACE_QUERY: placesApp.EMPTY_PLACE_QUERY, isMappable: app.isMappable }
// Registered after every module is loaded: while the tests above run, a hook registered earlier could close the server in the middle of a load
after(() => vite.close())

const json = (value) => JSON.parse(JSON.stringify(value))
const realPlaces = (await readJson(join(DEFAULT_PATHS.sourceDir, "places/ar-c.json"))).resources

test("the app and the script resolve services the same way", () => {
  for (const resource of fixture.resources.filter((candidate) => candidate.services)) {
    resource.services.forEach((service) => {
      assert.deepEqual(json(app.resolveService(resource, service)), json(resolveService(resource, service, taxonomy)), `${resource.id}.${service.id}`)
    })
    assert.deepEqual(app.getDerivedCategories(resource), derivedCategories(resource, taxonomy), resource.id)
  }
})

test("the app: places are loaded by province, on demand", async () => {
  // A province loads its own file once and keeps the answer; a province with no file has none
  const first = app.loadPlaces("AR-C")
  assert.deepEqual((await first).map(({ id }) => id), realPlaces.map(({ id }) => id))
  assert.equal(app.loadPlaces("AR-C"), first)
  assert.deepEqual(await app.loadPlaces("AR-B"), [])
  // Nothing of places/ is in the bundled resources (emergency numbers don't wait for a request)
  assert.equal(app.RESOURCES.some((resource) => (resource.services ?? []).length > 0), false)

  // The queries work on the places that were loaded
  const arC = fixtureFiles[1].data.resources
  const ids = (list) => list.map(({ id }) => id)
  // (fixture-centro has no services: it is a resource, not a place with services)
  assert.deepEqual(ids(app.getCurrentPlaces("2026-03-01", arC)), ["fixture-cesac", "fixture-hospital"])
  assert.deepEqual(ids(app.getCurrentPlacesByCategory("esi", "2026-03-01", arC)), ["fixture-cesac"])
  assert.deepEqual(ids(app.getCurrentMappablePlaces("2026-03-01", arC)), ["fixture-cesac"])
  assert.deepEqual(app.getCurrentPlaces("2026-03-01"), [])
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

/* ── Coverage index (src/data/resources/coverage.json) ── */

const realPlaceFiles = async () => {
  const dir = join(DEFAULT_PATHS.sourceDir, "places")
  const { readdir } = await import("node:fs/promises")
  const names = (await readdir(dir)).filter((name) => name.endsWith(".json")).sort()
  return Promise.all(names.map(async (name) => ({ name: `places/${name}`, data: await readJson(join(dir, name)) })))
}

test("coverage index: the real file is exactly what the places generate, not a copy typed by hand", async () => {
  const files = await realPlaceFiles()
  const onDisk = (await readFile(join(DEFAULT_PATHS.sourceDir, "coverage.json"), "utf8")).replace(/\r\n/g, "\n")
  // with what the map can show per quick filter, computed with the app's own rules
  assert.equal(onDisk, buildCoverage(files, taxonomy, visibility))
  assert.match(JSON.parse(onDisk).notice, /No editar a mano/)
})

test("coverage index: quickFilters are only written when the app's rules are given, and every filter is covered", async () => {
  const files = await realPlaceFiles()
  for (const province of Object.values(JSON.parse(buildCoverage(files, taxonomy)).provinces)) assert.equal(province.quickFilters, undefined)
  const withRules = JSON.parse(buildCoverage(files, taxonomy, visibility)).provinces
  const filterIds = placesApp.PLACE_FILTERS.map(({ id }) => id)
  for (const province of Object.values(withRules)) {
    // an entry only for a filter that has something, in the order of the filters; the map date never goes past the list's
    const keys = Object.keys(province.quickFilters)
    assert.deepEqual(keys, filterIds.filter((id) => keys.includes(id)))
    for (const { list, map } of Object.values(province.quickFilters)) {
      assert.match(list, /^\d{4}-\d{2}-\d{2}$/)
      if (map !== undefined) assert.ok(map <= list)
    }
  }
})

test("coverage index: the command line loads the app's own code, and finds the real index up to date", async () => {
  // In its own process (as npm run resources:check does): two Vite servers do not share one process well
  const { execFile } = await import("node:child_process")
  const { promisify } = await import("node:util")
  const { stdout } = await promisify(execFile)(process.execPath, [join(here, "resources-sync.mjs"), "--check"], { cwd: resolve(here, "..") })
  assert.match(stdout, /resources:check — ok/)
})

test("check notices a hand-edited quickFilters date, and sync writes it back", async () => {
  const dir = await mkdtemp(join(tmpdir(), "resources-"))
  // The fixtures have no place with a documented gratuity (nothing for the map to show), so the real places of CABA are copied
  const placesDir = join(dir, "places")
  await mkdir(placesDir, { recursive: true })
  await writeFile(join(placesDir, "ar-c.json"), JSON.stringify(await readJson(join(DEFAULT_PATHS.sourceDir, "places/ar-c.json"))))
  const options = { linesDir: fixtureLines, placesDir, outFile: join(dir, "data/resources.json"), coverageFile: join(dir, "coverage.json"), app: visibility }
  try {
    assert.equal((await run({ ...options, mode: "sync" })).ok, true)
    assert.equal((await run({ ...options, mode: "check" })).ok, true)
    const text = await readFile(options.coverageFile, "utf8")
    assert.ok(text.includes('"quickFilters"') && text.includes('"list"'), "the index has the filters")
    // somebody makes the map promise one more year
    await writeFile(options.coverageFile, text.replace(/("list": ")(\d{4})/, (_, start, year) => `${start}${Number(year) + 1}`))
    const stale = await run({ ...options, mode: "check" })
    assert.equal(stale.ok, false)
    assert.match(stale.errors[0], /índice de cobertura.*resources:sync/)
    assert.equal((await run({ ...options, mode: "sync" })).ok, true)
    assert.equal((await run({ ...options, mode: "check" })).ok, true)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

/* ── Nothing is left half written ── */

const readOrNull = (file) => readFile(file, "utf8").catch(() => null)

test("if the visibility cannot be computed, no generated file is written or changed", async () => {
  const dir = await mkdtemp(join(tmpdir(), "resources-"))
  const options = { linesDir: fixtureLines, placesDir: fixturePlaces, outFile: join(dir, "data/resources.json"), coverageFile: join(dir, "coverage.json") }
  try {
    // an old index and server copy are there
    await mkdir(join(dir, "data"), { recursive: true })
    await writeFile(options.outFile, "SERVER COPY ANTERIOR")
    await writeFile(options.coverageFile, "ÍNDICE ANTERIOR")
    const broken = { ...visibility, selectPlaces: () => { throw new Error("las reglas fallaron") } }
    await assert.rejects(run({ ...options, mode: "sync", app: broken }), /las reglas fallaron/)
    assert.equal(await readOrNull(options.outFile), "SERVER COPY ANTERIOR")
    assert.equal(await readOrNull(options.coverageFile), "ÍNDICE ANTERIOR")
    // an invalid dataset is not written either (a place with a service type that does not exist)
    const badPlaces = join(dir, "places")
    await mkdir(badPlaces, { recursive: true })
    const bad = structuredClone(fixtureFiles[1].data)
    bad.resources[CESAC - 3].services[0].type = "tipo-inventado"
    await writeFile(join(badPlaces, "ar-c.json"), JSON.stringify(bad))
    const invalid = await run({ ...options, placesDir: badPlaces, mode: "sync", app: visibility })
    assert.equal(invalid.ok, false)
    assert.equal(await readOrNull(options.coverageFile), "ÍNDICE ANTERIOR")
    assert.equal(await readOrNull(options.outFile), "SERVER COPY ANTERIOR")
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test("writing several generated files is all or nothing: a file that cannot be prepared leaves every real one as it was", async () => {
  const dir = await mkdtemp(join(tmpdir(), "resources-"))
  try {
    const first = join(dir, "a/first.json")
    const second = join(dir, "b/second.json")
    await mkdir(join(dir, "a"), { recursive: true })
    await writeFile(first, "ANTES A")
    // the third path is inside a FILE, so its folder cannot be created
    const blocker = join(dir, "bloqueo")
    await writeFile(blocker, "soy un archivo")
    await assert.rejects(writeAllOrNothing([[first, "NUEVO A"], [second, "NUEVO B"], [join(blocker, "x/third.json"), "NUEVO C"]]))
    assert.equal(await readOrNull(first), "ANTES A")
    assert.equal(await readOrNull(second), null)
    const { readdir } = await import("node:fs/promises")
    assert.deepEqual((await readdir(join(dir, "a"))).sort(), ["first.json"], "no temporary file is left")
    assert.deepEqual(await readdir(join(dir, "b")), [], "no temporary file is left")
    // when everything can be prepared, everything is written
    await writeAllOrNothing([[first, "NUEVO A"], [second, "NUEVO B"]])
    assert.equal(await readOrNull(first), "NUEVO A")
    assert.equal(await readOrNull(second), "NUEVO B")
    assert.deepEqual((await readdir(join(dir, "a"))).sort(), ["first.json"])
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test("coverage index: each province agrees with its places - counts, categories, services, divisions and review dates", async () => {
  const index = JSON.parse(await readFile(join(DEFAULT_PATHS.sourceDir, "coverage.json"), "utf8")).provinces
  const files = await realPlaceFiles()
  // one entry per places file, named like the province, and nothing for a province without a file
  assert.deepEqual(Object.keys(index).sort(), files.map(({ name }) => /places\/(.+)\.json/.exec(name)[1].toUpperCase()).sort())
  for (const { name, data } of files) {
    const code = /places\/(.+)\.json/.exec(name)[1].toUpperCase()
    const places = data.resources.filter((resource) => (resource.services ?? []).length > 0)
    const entry = index[code]
    assert.equal(entry.places, places.length, `${code}: places`)
    assert.deepEqual(entry.categories, [...new Set(places.flatMap((place) => derivedCategories(place, taxonomy)))].sort(), `${code}: categories`)
    assert.deepEqual(entry.serviceTypes, [...new Set(places.flatMap((place) => place.services.map((service) => service.type)))].sort(), `${code}: services`)
    assert.deepEqual(entry.divisions, [...new Set(places.map((place) => place.address?.department).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es", { numeric: true })), `${code}: divisions`)
    // every value the index names exists in the taxonomy: nothing is invented
    for (const type of entry.serviceTypes) assert.ok(taxonomy.serviceTypes.some(({ id }) => id === type), type)
    for (const category of entry.categories) assert.ok(taxonomy.categories.some(({ id }) => id === category), category)
    // nothing in the province can be current after currentUntil: it is the latest review date there is
    for (const place of places) assert.ok(place.verification.nextReviewDue <= entry.currentUntil, `${place.id} expires after the index says`)
    assert.ok(places.some((place) => place.verification.nextReviewDue === entry.currentUntil), `${code}: currentUntil is a real review date`)
  }
})

test("coverage index: built from the fixtures - only places with services, the latest date that can still be current", () => {
  const index = JSON.parse(buildCoverage(fixtureFiles.filter(({ name }) => name.startsWith("places/")), taxonomy)).provinces
  assert.deepEqual(Object.keys(index), ["AR-B", "AR-C"], "sorted by province")
  const caba = fixtureFiles.find(({ name }) => name === "places/ar-c.json").data.resources
  assert.equal(index["AR-C"].places, caba.filter((resource) => (resource.services ?? []).length > 0).length)
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(index["AR-C"].currentUntil))
  // a province whose places were never verified has no date: it is never offered
  const unverified = buildCoverage([{ name: "places/ar-m.json", data: { resources: [{ id: "x", name: "x", services: [{ id: "s", type: "primary-care" }], verification: { status: "unverified" } }] } }], taxonomy)
  assert.equal(JSON.parse(unverified).provinces["AR-M"].currentUntil, null)
  // a service that expires earlier than its place bounds the date
  const bounded = buildCoverage(
    [{ name: "places/ar-m.json", data: { resources: [{ id: "x", name: "x", services: [{ id: "s", type: "primary-care", verification: { status: "verified", nextReviewDue: "2027-02-01" } }], verification: { status: "verified", nextReviewDue: "2027-06-01" } }] } }],
    taxonomy,
  )
  assert.equal(JSON.parse(bounded).provinces["AR-M"].currentUntil, "2027-02-01")
})

test("coverage index: sync writes it, check notices when it is out of date or missing", async () => {
  const dir = await mkdtemp(join(tmpdir(), "resources-"))
  const options = { linesDir: fixtureLines, placesDir: fixturePlaces, outFile: join(dir, "data/resources.json"), coverageFile: join(dir, "coverage.json") }
  try {
    assert.equal((await run({ ...options, mode: "sync" })).ok, true)
    assert.equal((await run({ ...options, mode: "check" })).ok, true)
    const text = await readFile(options.coverageFile, "utf8")
    // Windows checkouts may use CRLF: not a difference
    await writeFile(options.coverageFile, text.replace(/\n/g, "\r\n"))
    assert.equal((await run({ ...options, mode: "check" })).ok, true)
    // a hand-edited index
    await writeFile(options.coverageFile, text.replace('"places": 1', '"places": 999'))
    const stale = await run({ ...options, mode: "check" })
    assert.equal(stale.ok, false)
    assert.match(stale.errors[0], /índice de cobertura.*resources:sync/)
    // a missing index
    await rm(options.coverageFile)
    assert.equal((await run({ ...options, mode: "check" })).ok, false)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
