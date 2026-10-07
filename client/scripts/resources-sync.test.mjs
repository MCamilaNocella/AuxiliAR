/*
 * Tests of the resources dataset tooling:  npm run resources:test  (Node's built-in runner, no dependencies).
 * They use the real schema and taxonomy, with fixtures only for the data: nothing here is a real help line.
 */
import assert from "node:assert/strict"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"
import { assertSchemaSupported, dialKey, isCalendarDate, validateDataset } from "./resources-validate.mjs"
import { DEFAULT_PATHS, buildServerCopy, run } from "./resources-sync.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const fixtureLines = join(here, "__fixtures__/resources/lines")
// The server's own tests read this same file: this test keeps it equal to what the sync generates from the fixtures
const serverFixture = resolve(here, "../../server/src/test/resources/data/resources-fixture.json")

const readJson = async (file) => JSON.parse(await readFile(file, "utf8"))
const schema = await readJson(join(DEFAULT_PATHS.sourceDir, "resource.schema.json"))
const taxonomy = await readJson(join(DEFAULT_PATHS.sourceDir, "taxonomy.json"))
const fixture = await readJson(join(fixtureLines, "fixture.json"))

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
  assert.equal(result.resources.length, 4)
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
  assertProblem(validateChanged((resources) => delete resources[0].name), 'falta "name"')
  assertProblem(validateChanged((resources) => (resources[0].extra = true)), '"extra" no existe')
  assertProblem(validateChanged((resources) => (resources[0].kind = "hospital")), "taxonomy.kinds")
  assertProblem(validateChanged((resources) => (resources[0].id = "Con Espacios")), "formato esperado")
  assertProblem(validateChanged((resources) => (resources[0].contacts[0].dial = "0800-333-0160")), "formato esperado")
  assertProblem(validateChanged((resources) => (resources[0].contacts = [])), "al menos 1")
  assertProblem(validateChanged((resources) => (resources[0].categories = ["inventada"])), "taxonomy.categories")
  assertProblem(validateChanged((resources) => (resources[3].coordinates.lat = 120)), "mayor que 90")
  assertProblem(validateChanged((resources) => (resources[0].hours = { open24h: "si" })), "boolean")
  assertProblem(validateChanged((resources) => (resources[0].source.url = "ftp://example.org")), "formato esperado")
})

test("a verified resource needs its proof; the others don't", () => {
  assertProblem(validateChanged((resources) => delete resources[0].verification.nextReviewDue), "necesita nextReviewDue")
  assertProblem(validateChanged((resources) => (resources[0].verification.verifiedAt = null)), "necesita verifiedAt")
  assertProblem(validateChanged((resources) => delete resources[0].verification.verifiedBy), "necesita verifiedBy")
  assertProblem(validateChanged((resources) => delete resources[0].source), "necesita source.url")
  assertProblem(validateChanged((resources) => (resources[0].verification.nextReviewDue = "2026-01-10")), "posterior a verifiedAt")
  assertProblem(validateChanged((resources) => (resources[0].verification.nextReviewDue = "2026-02-30")), "no es una fecha real")
  // An unverified one can be loaded without source or dates
  assert.deepEqual(validateChanged(() => {}).errors, [])
})

test("ids and numbers are unique, however the number is written", () => {
  assertProblem(validateChanged((resources) => (resources[1].id = resources[0].id)), "el id ya está")
  assertProblem(validateChanged((resources) => (resources[1].contacts[0].dial = "+000")), "ya está en")
  assertProblem(validateChanged((resources) => (resources[1].contacts[0].dial = "5550200")), "ya está en")
})

test("coverage, hours and sections make sense", () => {
  assertProblem(validateChanged((resources) => (resources[0].coverage = { level: "national", provinces: ["AR-C"] })), "no lleva provincias")
  assertProblem(validateChanged((resources) => (resources[1].coverage = { level: "province" })), "necesita al menos una provincia")
  assertProblem(validateChanged((resources) => (resources[2].coverage = { level: "region" })), "necesita provincias o áreas")
  assertProblem(validateChanged((resources) => (resources[0].hours = { open24h: true, schedule: [{ days: [1], from: "09:00", to: "10:00" }] })), "no lleva schedule")
  assertProblem(validateChanged((resources) => (resources[2].hours.schedule[0].to = "08:00")), "anterior a")
  assertProblem(validateChanged((resources) => (resources[3].sections[0].category = "esi")), "tiene que estar también en categories")
})

test("taxonomy.categories has to match the app's categories when they are given", () => {
  const data = structuredClone(fixture)
  const real = taxonomy.categories.map(({ id }) => id)
  assert.deepEqual(validateDataset({ files: [{ name: "f", data }], schema, taxonomy, categoryIds: real }).errors, [])
  assertProblem(validateDataset({ files: [{ name: "f", data }], schema, taxonomy, categoryIds: [...real, "nueva"] }), 'falta la categoría "nueva"')
  assertProblem(validateDataset({ files: [{ name: "f", data }], schema, taxonomy, categoryIds: real.slice(1) }), "no existe como categoría")
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
    delete broken.resources[0].name
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
