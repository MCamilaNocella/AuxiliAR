/*
 * Tests of the curation pipeline (v0). Run: npm run curation:test
 *
 * Real data used (committed, with attribution): scripts/__fixtures__/curation/ has rows of the official datasets of Buenos Aires Data
 * (CC-BY-2.5-AR) and control points from USIG. The reprojection tests also read curation/normalized (the 36 hospitals).
 * Nothing here publishes anything: the "publish" tests work on copies in a temp folder.
 */
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, relative } from "node:path"
import { test } from "node:test"
import { addressFor, buildCandidates, corroboration, servicesFor } from "./curation/candidates.mjs"
import { diffSnapshots, distanceMeters, proposalsFor } from "./curation/diff.mjs"
import { loadCrs, fromWgs84, toWgs84 } from "./curation/lib/crs.mjs"
import { cleanText, parseAddressCaba, parsePhonesCaba } from "./curation/lib/normalize.mjs"
import { clientRoot, readJson, slugify } from "./curation/lib/util.mjs"
import { parsePoint } from "./curation/lib/wkt.mjs"
import { checkCuration, DATASET_DIR, loadDataset, runPublish } from "./curation/pipeline.mjs"
import { planPublish, serializePlacesPreserving, validateBatch } from "./curation/publish.mjs"
import { formatProfile, profileText } from "./curation/profile.mjs"
import { PATHS, ingest, listManifests, loadManifest, looksLikeDataset, normalizeText, validateManifest } from "./curation/sources.mjs"

const FIXTURES = join(clientRoot, "scripts/__fixtures__/curation")
const fixture = (name) => readFile(join(FIXTURES, name), "utf8")
const placesPath = join(DATASET_DIR, "places/ar-c.json")

const crs = await loadCrs("EPSG:9498")
const cesacManifest = await loadManifest("caba-cesac")
const hospManifest = await loadManifest("caba-hospitales")
const cesacRecords = await normalizeText({ manifest: cesacManifest, text: await fixture("cesac.sample.csv") })
const hospRecords = await normalizeText({ manifest: hospManifest, text: await fixture("hospitales.sample.csv") })
const cesacMapping = await readJson(join(PATHS.mappings, "caba-cesac.json"))
const hospMapping = await readJson(join(PATHS.mappings, "caba-hospitales.json"))
const published = (await readJson(placesPath)).resources
const byKey = (records, key) => records.find((record) => record.key === key)

const snapshot = (records) => ({ source: "x", retrievedAt: "2026-10-07", records })
const candidatesOf = (manifest, records, mapping, resources = published) =>
  buildCandidates({ manifest, snapshot: snapshot(records), mapping, published: resources }).candidates

// ─── Reprojection EPSG:9498 → 4326 ───────────────────────────────────────────────────────────────

/** Inverse Transverse Mercator by Snyder's series (USGS PP 1395, eq. 8-17…8-21): independent of proj4, used as a cross-check */
const snyderInverse = ({ x, y }) => {
  const a = 6378137
  const f = 1 / 298.257223563
  const e2 = f * (2 - f)
  const ep2 = e2 / (1 - e2)
  const rad = Math.PI / 180
  const lat0 = -34.6292666666667 * rad
  const lon0 = -58.4633083333333 * rad
  const meridian = (phi) =>
    a * ((1 - e2 / 4 - (3 * e2 ** 2) / 64 - (5 * e2 ** 3) / 256) * phi - ((3 * e2) / 8 + (3 * e2 ** 2) / 32 + (45 * e2 ** 3) / 1024) * Math.sin(2 * phi) + ((15 * e2 ** 2) / 256 + (45 * e2 ** 3) / 1024) * Math.sin(4 * phi) - ((35 * e2 ** 3) / 3072) * Math.sin(6 * phi))
  const M = meridian(lat0) + (y - 70000)
  const mu = M / (a * (1 - e2 / 4 - (3 * e2 ** 2) / 64 - (5 * e2 ** 3) / 256))
  const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2))
  const phi1 = mu + ((3 * e1) / 2 - (27 * e1 ** 3) / 32) * Math.sin(2 * mu) + ((21 * e1 ** 2) / 16 - (55 * e1 ** 4) / 32) * Math.sin(4 * mu) + ((151 * e1 ** 3) / 96) * Math.sin(6 * mu) + ((1097 * e1 ** 4) / 512) * Math.sin(8 * mu)
  const C1 = ep2 * Math.cos(phi1) ** 2
  const T1 = Math.tan(phi1) ** 2
  const N1 = a / Math.sqrt(1 - e2 * Math.sin(phi1) ** 2)
  const R1 = (a * (1 - e2)) / (1 - e2 * Math.sin(phi1) ** 2) ** 1.5
  const D = (x - 20000) / N1
  const phi = phi1 - ((N1 * Math.tan(phi1)) / R1) * (D ** 2 / 2 - ((5 + 3 * T1 + 10 * C1 - 4 * C1 ** 2 - 9 * ep2) * D ** 4) / 24 + ((61 + 90 * T1 + 298 * C1 + 45 * T1 ** 2 - 252 * ep2 - 3 * C1 ** 2) * D ** 6) / 720)
  const lambda = lon0 + (D - ((1 + 2 * T1 + C1) * D ** 3) / 6 + ((5 - 2 * C1 + 28 * T1 - 3 * C1 ** 2 + 8 * ep2 + 24 * T1 ** 2) * D ** 5) / 120) / Math.cos(phi1)
  return { lat: phi / rad, lng: lambda / rad }
}

test("reprojection: the origin of the CRS is exactly where the registry says", () => {
  const { origin } = crs
  const point = toWgs84(crs, origin.x, origin.y)
  assert.ok(distanceMeters(point, origin) < 0.001, "el origen (20000, 70000) tiene que dar (lat_0, lon_0)")
  const back = fromWgs84(crs, origin.lat, origin.lng)
  assert.ok(Math.abs(back.x - origin.x) < 0.001 && Math.abs(back.y - origin.y) < 0.001)
})

test("reprojection: the 36 hospitals agree with an independent implementation (Snyder) to under 1 cm", async () => {
  const snapshotFile = await readJson(join(PATHS.normalized, "caba-hospitales.json"))
  assert.equal(snapshotFile.records.length, 36)
  let worst = 0
  for (const { coordinates } of snapshotFile.records) {
    const { x, y } = coordinates.raw
    const ours = toWgs84(crs, x, y)
    const reference = snyderInverse({ x, y })
    worst = Math.max(worst, distanceMeters(ours, reference))
  }
  assert.ok(worst < 0.01, `la mayor diferencia fue ${worst.toFixed(4)} m`)
})

test("reprojection: round trip WGS84 → EPSG:9498 → WGS84 loses less than a millimeter (CeSAC points)", async () => {
  const records = (await readJson(join(PATHS.normalized, "caba-cesac.json"))).records
  for (const { coordinates } of records) {
    const { x, y } = fromWgs84(crs, coordinates.lat, coordinates.lng)
    const back = toWgs84(crs, x, y)
    assert.ok(distanceMeters(back, coordinates) < 0.001)
  }
})

test("reprojection: points of control — USIG (independent geocoder) is within the tolerance of each reprojected hospital", async () => {
  const control = await readJson(join(FIXTURES, "hospital-control-points.json"))
  assert.equal(control.points.length, 6)
  const distances = []
  for (const { key, usig } of control.points) {
    const record = byKey(hospRecords, key)
    assert.ok(record, `el fixture de hospitales no trae ${key}`)
    assert.equal(record.coordinates.method, "official-dataset-reprojected")
    const meters = distanceMeters(record.coordinates, usig)
    distances.push(`${key.slice(-18)}: ${Math.round(meters)} m`)
    assert.ok(meters <= control.toleranceMeters, `${key} queda a ${Math.round(meters)} m de USIG`)
  }
  assert.equal(distances.length, 6)
})

test("reprojection: frozen values for three hospitals of the first batch (a change here is a change of the transformation)", () => {
  const expected = {
    "hospital-especializado-de-oftalmologia-santa-lucia": [-34.622781, -58.39446],
    "hospital-especializado-odontologico-dr-r-carrillo-ex-nacional": [-34.58446, -58.40265],
    "hospital-especializado-de-odontologia-j-duenas": [-34.614634, -58.427662],
  }
  for (const [key, [lat, lng]] of Object.entries(expected)) {
    const { coordinates } = byKey(hospRecords, key)
    assert.ok(Math.abs(coordinates.lat - lat) < 1e-6 && Math.abs(coordinates.lng - lng) < 1e-6, `${key}: ${coordinates.lat}, ${coordinates.lng}`)
    assert.equal(coordinates.precision, "approximate")
    assert.deepEqual(coordinates.transform, { from: "EPSG:9498", to: "EPSG:4326", tool: coordinates.transform.tool })
    assert.match(coordinates.transform.tool, /^proj4@/)
  }
})

test("reprojection: swapped axes, a point outside the area, or garbage never become coordinates", () => {
  const { x, y } = byKey(hospRecords, "hospital-especializado-de-oftalmologia-santa-lucia").coordinates.raw
  assert.throws(() => toWgs84(crs, y, x), /fuera del área del CRS/)
  assert.throws(() => toWgs84(crs, 500000, 6000000), /fuera del área del CRS/)
  assert.throws(() => toWgs84(crs, Number.NaN, y), /no es numérico/)
  assert.throws(() => toWgs84({ id: "EPSG:4326", kind: "geographic" }, x, y), /no es un CRS proyectado/)
  assert.deepEqual(parsePoint("POINT (26313.7 70717.3)"), [26313.7, 70717.3])
  assert.equal(parsePoint("LINESTRING (1 2, 3 4)"), null)
  assert.equal(parsePoint(""), null)
})

test("reprojection: a record with swapped coordinates is flagged (not published with a wrong point)", async () => {
  const swapped = (await fixture("hospitales.sample.csv")).replace("POINT (26313.717770774994 70717.35309565664)", "POINT (70717.35309565664 26313.717770774994)")
  const records = await normalizeText({ manifest: hospManifest, text: swapped })
  const santaLucia = byKey(records, "hospital-especializado-de-oftalmologia-santa-lucia")
  assert.equal(santaLucia.coordinates, undefined)
  assert.equal(santaLucia.problems[0].code, "coordinates-rejected")
  const candidate = candidatesOf(hospManifest, records, hospMapping, []).find((c) => c.key === santaLucia.key)
  assert.equal(candidate.tier, "T2")
  assert.ok(candidate.gates.some((g) => g.code === "coordinates-rejected"))
})

test("reprojection: normalizing twice gives the same bytes (reproducible)", async () => {
  const again = await normalizeText({ manifest: hospManifest, text: await fixture("hospitales.sample.csv") })
  assert.equal(JSON.stringify(again), JSON.stringify(hospRecords))
})

// ─── Normalization ───────────────────────────────────────────────────────────────────────────────

test("phones: only complete 8-digit numbers; abbreviations are fragments, never guessed", () => {
  assert.deepEqual(parsePhonesCaba("2821-3601 / 4302-0059 / 4303-2634/5005"), {
    phones: [
      { dial: "+541128213601", display: "2821-3601" },
      { dial: "+541143020059", display: "4302-0059" },
      { dial: "+541143032634", display: "4303-2634" },
    ],
    fragments: ["5005"],
  })
  const guardia = parsePhonesCaba("4127-3100 / 4941-5555 | Guardia: 4941- 8081")
  assert.deepEqual(guardia.phones.map((p) => [p.display, p.label ?? null]), [["4127-3100", null], ["4941-5555", null], ["4941-8081", "Guardia"]])
  assert.deepEqual(guardia.fragments, [])
  assert.deepEqual(parsePhonesCaba(""), { phones: [], fragments: [] })
  assert.deepEqual(parsePhonesCaba("2821-3603 / 2821-3603").phones.length, 1)
})

test("addresses: what is clear is parsed; inverted or ambiguous ones are flagged for a person", () => {
  assert.deepEqual(parseAddressCaba("Soldado De La Frontera Av. 5144, Barrio Gral. Savio (ex Lugano I y II)"), {
    raw: "Soldado De La Frontera Av. 5144, Barrio Gral. Savio (ex Lugano I y II)",
    street: "Soldado de la Frontera Av.",
    number: "5144",
    reference: "Barrio Gral. Savio (ex Lugano I y II)",
    confidence: "high",
    problems: [],
  })
  assert.deepEqual(parseAddressCaba("Brin, Ministro 843").problems, ["address-street-inverted"])
  assert.deepEqual(parseAddressCaba("Gendarmeria Nacional Av. y Ulla Ulla, Barrio Padre Mugica").problems, ["address-unparsed"])
  assert.equal(parseAddressCaba("").confidence, "low")
  assert.equal(cleanText("  Odontologia   J.  Dueñas "), "Odontologia J. Dueñas")
})

test("CESAC: the dataset id is not the CeSAC number, and the BOM does not break the header", () => {
  const record = byKey(cesacRecords, "46")
  assert.equal(record.officialNumber, "47")
  assert.equal(record.shortName, "CeSAC Nº 47")
  assert.equal(record.idHint, "cesac-47")
  assert.equal(record.address.number, "620")
  assert.ok(cesacRecords.every((r) => r.keyStrategy === "official-id"))
})

test("CESAC: a specialty list cut by the publisher (254 bytes) is detected and its last item dropped, never interpreted", () => {
  const cut = byKey(cesacRecords, "1")
  assert.equal(cut.specialtiesTruncated, true)
  assert.ok(cut.signals.includes("specialties-truncated"))
  assert.ok(!cut.specialtiesRaw.includes("T") && !cut.specialtiesRaw.some((item) => /^T\w{0,3}$/.test(item)), "el fragmento cortado no puede quedar como especialidad")
  const whole = byKey(cesacRecords, "3")
  assert.equal(whole.specialtiesTruncated, undefined)
  assert.ok(whole.specialtiesRaw.includes("Odontología"))
})

test("hospitals: no id in the dataset → the key is the slug of the name (extra spaces included); guardia is only a signal", () => {
  const duenas = byKey(hospRecords, "hospital-especializado-de-odontologia-j-duenas")
  assert.equal(duenas.name, "Hospital Especializado de Odontologia J. Dueñas")
  assert.equal(duenas.keyStrategy, "name-slug")
  assert.equal(slugify("Hospital Especializado de Odontologia J. Dueñas"), duenas.key)
  assert.ok(duenas.signals.includes("guardia-phone"))
  assert.deepEqual(duenas.specialtiesRaw, ["Odontologia"])
  const santaLucia = byKey(hospRecords, "hospital-especializado-de-oftalmologia-santa-lucia")
  assert.deepEqual(santaLucia.phoneFragments, [], '"4941- 8081" (con espacio) se lee como un teléfono completo')
})

test("normalizing refuses a file that lost a column the adapter needs", async () => {
  const text = (await fixture("cesac.sample.csv")).replace("especialid,", "especialidades,")
  await assert.rejects(() => normalizeText({ manifest: cesacManifest, text }), /faltan columnas.*especialid/)
})

// ─── Sources: license, attribution, downloads ─────────────────────────────────────────────────────

test("every source needs license and attribution (and the attribution names the license)", async () => {
  for (const manifest of await listManifests()) {
    assert.deepEqual(validateManifest(manifest), [], manifest.id)
    assert.match(manifest.attribution, new RegExp(manifest.license))
    const { license: _license, ...withoutLicense } = manifest
    assert.ok(validateManifest(withoutLicense).some((e) => e.includes('"license"')))
    const { attribution: _attribution, ...withoutAttribution } = manifest
    assert.ok(validateManifest(withoutAttribution).some((e) => e.includes('"attribution"')))
  }
})

test("ingest refuses the portal's 'Request Rejected' page (a 200 that is not a dataset)", async () => {
  const dir = await mkdtemp(join(tmpdir(), "curation-ingest-"))
  try {
    const page = join(dir, "rejected.csv")
    await writeFile(page, "<html><head><title>Request Rejected</title></head><body>The requested URL was rejected.</body></html>")
    assert.equal(looksLikeDataset(Buffer.from(await readFile(page))), false)
    await assert.rejects(() => ingest({ manifest: cesacManifest, file: page, retrievedAt: "2026-10-07", sourcesDir: dir, rawDir: dir }), /no es un dataset/)
    const good = join(dir, "ok.csv")
    await writeFile(good, await fixture("cesac.sample.csv"))
    const next = await ingest({ manifest: { ...cesacManifest, current: null }, file: good, retrievedAt: "2026-10-07", officialUpdatedAt: "2026-10-02", sourcesDir: dir, rawDir: dir })
    assert.equal(next.current.rows, 5)
    assert.match(next.current.sha256, /^[0-9a-f]{64}$/)
    assert.equal((await readJson(join(dir, "caba-cesac.source.json"))).current.officialUpdatedAt, "2026-10-02")
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test("the committed snapshots match the manifests (the raw files are not in git, but their hash is)", async () => {
  for (const manifest of await listManifests()) {
    const snap = await readJson(join(PATHS.normalized, `${manifest.id}.json`))
    assert.equal(snap.sha256, manifest.current.sha256)
    assert.equal(snap.retrievedAt, manifest.current.retrievedAt)
    assert.equal(snap.count, manifest.current.rows)
  }
  assert.match(await readFile(join(clientRoot, ".gitignore"), "utf8"), /^curation\/raw\/$/m)
})

test("profile: reports columns, key duplicates, geometry coherence and the vocabulary to map", async () => {
  const profile = profileText({ manifest: hospManifest, text: await fixture("hospitales.sample.csv") })
  assert.equal(profile.rows, 6)
  assert.deepEqual(profile.missingColumns, [])
  assert.equal(profile.geometry.looksGeographic, false)
  assert.equal(profile.geometry.consistentWithDeclared, true)
  assert.equal(profile.keys.duplicates.length, 0)
  assert.equal(profile.encodingProblems, 0)
  assert.ok(profile.vocabulary.Odontologia >= 2)
  assert.match(formatProfile(profile), /Vocabulario de especialidades/)
  const cesac = profileText({ manifest: cesacManifest, text: await fixture("cesac.sample.csv") })
  assert.equal(cesac.geometry.consistentWithDeclared, true)
  assert.ok(cesac.stats.find((s) => s.name === "especialid").maxLength > 200)
})

// ─── Candidates ───────────────────────────────────────────────────────────────────────────────────

test("candidates: tiers, gates and nothing publishable while the mappings are drafts", () => {
  const candidates = candidatesOf(cesacManifest, cesacRecords, cesacMapping)
  assert.equal(candidates.length, 5)
  for (const candidate of candidates) assert.equal(candidate.publishable.ready, false, "con el mapeo en borrador no se publica nada")
  const cut = candidates.find((c) => c.key === "1")
  assert.equal(cut.tier, "T2")
  assert.ok(cut.gates.some((g) => g.code === "specialties-truncated"))
  // The dataset abbreviates a second number ("4303-2634/5005"): the complete numbers are kept, the fragment is only reported
  assert.ok(cut.gates.some((g) => g.level === "info" && g.code === "phone-fragments-not-published"))
  assert.ok(!cut.gates.some((g) => g.code === "phone-fragment"))
  assert.deepEqual(cut.publishable.blockers.sort(), ["facility-type-not-approved", "no-approved-service"])
  assert.equal(cut.link.status, "new")
  const unparsed = candidates.find((c) => c.key === "4")
  assert.ok(unparsed.gates.some((g) => g.code === "address-unparsed"))
})

test("candidates: a duplicate key or a missing name blocks (T3)", () => {
  const dup = [{ ...cesacRecords[0] }, { ...cesacRecords[1], key: cesacRecords[0].key }]
  const candidates = candidatesOf(cesacManifest, dup, cesacMapping, [])
  assert.ok(candidates.every((c) => c.tier === "T3" && c.gates.some((g) => g.code === "key-duplicate")))
  const nameless = candidatesOf(cesacManifest, [{ ...cesacRecords[0], name: "" }], cesacMapping, [])
  assert.equal(nameless[0].tier, "T3")
})

test("candidates: two records with the same point are flagged (a repeated or placeholder coordinate)", () => {
  const twin = { ...cesacRecords[1], key: "999", name: "Otro (CeSAC N° 99)", shortName: "CeSAC Nº 99", idHint: "cesac-99" }
  const candidates = candidatesOf(cesacManifest, [cesacRecords[1], twin], cesacMapping, [])
  assert.ok(candidates.every((c) => c.gates.some((g) => g.code === "shared-coordinates")))
})

test("candidates: a specialty the mapping has never seen is a warning; one it leaves undecided is only information", () => {
  const record = { ...cesacRecords[1], specialtiesRaw: ["Odontología", "Nutrición", "Especialidad Nueva"] }
  const [candidate] = candidatesOf(cesacManifest, [record], cesacMapping, [])
  assert.ok(candidate.gates.some((g) => g.code === "specialty-unmapped" && g.detail === "Especialidad Nueva"))
  assert.ok(candidate.gates.some((g) => g.level === "info" && g.code === "specialty-undecided"))
  const services = servicesFor(record, cesacMapping)
  assert.deepEqual(services.proposed.map((s) => [s.type, s.approved]), [["dentistry", false]])
  assert.equal(services.publishable.length, 0)
})

test("candidates: the guardia phone is information only — it never creates an emergency-room service or hours", () => {
  const [candidate] = candidatesOf(hospManifest, [byKey(hospRecords, "hospital-especializado-de-oftalmologia-santa-lucia")], hospMapping, [])
  assert.ok(candidate.gates.some((g) => g.level === "info" && g.code === "guardia-phone"))
  assert.ok(!candidate.services.proposed.some((s) => s.type === "emergency-room"))
})

// ─── GOLDEN: CeSAC 3, 41 and 47 against what we curated by hand ───────────────────────────────────

test("GOLDEN CeSAC 3/41/47: each dataset row is the place we already have, with the same point and nothing contradicting it", () => {
  const expected = { 3: "cesac-3", 41: "cesac-41", 46: "cesac-47" }
  // What the dataset lists at a published CeSAC and we have not published, split by the mapping proposal:
  // clear equivalences (Tocoginecología, Ginecología, Geriatría → specialty-care) and doubtful ones (Obstetricia → pregnancy-care?)
  const expectedDatasetOnly = { "cesac-3": ["specialty-care"], "cesac-41": ["specialty-care"], "cesac-47": [] }
  const expectedDoubtful = { "cesac-3": ["pregnancy-care"], "cesac-41": ["pregnancy-care"], "cesac-47": [] }
  const candidates = candidatesOf(cesacManifest, cesacRecords, cesacMapping)
  for (const [key, id] of Object.entries(expected)) {
    const candidate = candidates.find((c) => c.key === key)
    const place = published.find((resource) => resource.id === id)
    assert.ok(place, `${id} no está publicado`)
    assert.equal(place.externalIds["caba-cesac"], key, "el lugar tiene que estar enlazado por externalIds")
    assert.deepEqual(candidate.link, { status: "linked", resourceId: id, via: "externalIds" })
    assert.equal(candidate.id, id)
    assert.notEqual(candidate.tier, "T3", `${id}: ${candidate.gates.filter((g) => g.level === "fail").map((g) => g.code)}`)

    // The point: identical to what we verified from the same dataset
    assert.equal(candidate.record.coordinates.lat, place.coordinates.lat, `${id} lat`)
    assert.equal(candidate.record.coordinates.lng, place.coordinates.lng, `${id} lng`)
    assert.equal(candidate.record.coordinates.method, place.coordinates.method)
    assert.equal(place.coordinates.status, "verified")

    // Identity: number and shortName
    assert.equal(candidate.record.shortName, place.shortName)
    assert.ok(place.name.includes(`Nº ${candidate.record.officialNumber}`))
    assert.equal(candidate.record.address.number, place.address.number)

    // Phones: the first number of the dataset is a published one
    const publishedDials = new Set(place.contacts.map((c) => c.dial))
    assert.ok(publishedDials.has(candidate.record.phones[0].dial), `${id}: el primer teléfono del dataset no está publicado`)

    // Services: what the dataset lists (types proposed by the DRAFT mapping) against what we curated by hand.
    // The differences are frozen below: they are proposals for a person, never changes.
    const curatedTypes = new Set(place.services.map((s) => s.type))
    const proposed = [...new Set(candidate.services.proposed.map((s) => s.type))]
    const clear = [...new Set(candidate.services.proposed.filter((s) => s.proposal === "approvable").map((s) => s.type))]
    const doubtful = [...new Set(candidate.services.proposed.filter((s) => s.proposal === "doubtful").map((s) => s.type))]
    assert.deepEqual(clear.filter((type) => !curatedTypes.has(type)), expectedDatasetOnly[id], `${id}: equivalencias claras del dataset que no están publicadas`)
    assert.deepEqual(doubtful.filter((type) => !curatedTypes.has(type)), expectedDoubtful[id], `${id}: equivalencias dudosas del dataset que no están publicadas`)
    assert.deepEqual(proposed.length > 0, id !== "cesac-47", `${id}: el dataset ${id === "cesac-47" ? "no lista especialidades" : "lista especialidades"}`)
    // Protection: it is a published place, so there is no proposal to publish anything about it
    assert.equal(candidate.proposal, null)
    assert.equal(candidate.publishable.ready, false)
  }
})

test("GOLDEN CeSAC: before linking, the same rows are flagged as the published places (suggested + id collision), never duplicated", () => {
  const unlinked = structuredClone(published).map(({ externalIds: _externalIds, ...rest }) => rest)
  const candidates = candidatesOf(cesacManifest, cesacRecords, cesacMapping, unlinked)
  for (const [key, id] of Object.entries({ 3: "cesac-3", 41: "cesac-41", 46: "cesac-47" })) {
    const candidate = candidates.find((c) => c.key === key)
    assert.equal(candidate.link.status, "suggested")
    assert.equal(candidate.link.suggestions[0].resourceId, id)
    assert.ok(candidate.link.suggestions[0].evidence.length > 0)
    assert.equal(candidate.tier, "T3", "no se puede aceptar como nuevo un lugar que ya existe")
    assert.ok(candidate.gates.some((g) => g.code === "id-collision"))
  }
})

test("GOLDEN hospitals: the three hospitals of the first batch are linked and their published points are exactly what the pipeline reprojects", () => {
  const candidates = candidatesOf(hospManifest, hospRecords, hospMapping)
  const expected = {
    "hospital-especializado-de-oftalmologia-santa-lucia": "hospital-oftalmologico-santa-lucia",
    "hospital-especializado-odontologico-dr-r-carrillo-ex-nacional": "hospital-odontologia-carrillo",
    "hospital-especializado-de-odontologia-j-duenas": "hospital-odontologia-duenas",
  }
  for (const [key, id] of Object.entries(expected)) {
    const candidate = candidates.find((c) => c.key === key)
    assert.deepEqual(candidate.link, { status: "linked", resourceId: id, via: "externalIds" })
    const place = published.find((resource) => resource.id === id)
    assert.equal(place.coordinates.lat, candidate.record.coordinates.lat, `${id} lat`)
    assert.equal(place.coordinates.lng, candidate.record.coordinates.lng, `${id} lng`)
    assert.equal(place.coordinates.method, "official-dataset-reprojected")
    assert.equal(candidate.record.coordinates.method, "official-dataset-reprojected")
    assert.ok(!proposalsFor(candidate, place).some((p) => p.field === "coordinates"), `${id}: ya no hay una propuesta de coordenadas pendiente`)
  }
})

test("the 6 places still published are exactly the 6 of the first batch; nothing new was imported", () => {
  assert.deepEqual(published.map((r) => r.id), ["cesac-3", "cesac-41", "cesac-47", "hospital-oftalmologico-santa-lucia", "hospital-odontologia-carrillo", "hospital-odontologia-duenas"])
  for (const place of published) assert.equal(Object.keys(place.externalIds).length, 1)
  const server = JSON.parse(readFileSync(join(clientRoot, "../server/src/main/resources/data/resources.json"), "utf8"))
  // the server copy also carries the help lines (lines/): what is counted here are the places
  assert.equal(server.resources.filter((resource) => resource.kind === "service").length, 6)
})

// ─── Publish: protection of manual curation ───────────────────────────────────────────────────────

const { schema, taxonomy, otherFiles } = await loadDataset({ province: "AR-C" })
const batch = { id: "caba-test", province: "AR-C", verifiedAt: "2026-10-07", verifiedBy: "equipo-auxiliar", nextReviewDue: "2027-01-05" }
const approvedMapping = (mapping, { types = ["Odontología", "Ecografía"] } = {}) => ({
  ...mapping,
  facilityTypes: Object.fromEntries(Object.entries(mapping.facilityTypes).map(([name, entry]) => [name, { ...entry, approved: true }])),
  specialties: Object.fromEntries(Object.entries(mapping.specialties).map(([name, entry]) => [name, types.includes(name) ? { ...entry, approved: true } : entry])),
})
const plan = ({ decisions, candidates, resources = published, manifests = { "caba-cesac": cesacManifest, "caba-hospitales": hospManifest } }) =>
  planPublish({ province: "AR-C", placesData: { $schema: "../resource.schema.json", resources: structuredClone(resources) }, candidates, decisions, batches: { [batch.id]: batch }, manifests, otherFiles, schema, taxonomy })
const base = { reviewer: "equipo-auxiliar", decidedAt: "2026-10-07" }
const acceptDecision = (key, extra = {}) => ({ ...base, source: "caba-cesac", key, action: "accept", batch: batch.id, ...extra })

test("publish: a new place needs a person to acknowledge every warning of its candidate", () => {
  const candidates = candidatesOf(cesacManifest, cesacRecords, approvedMapping(cesacMapping))
  const none = plan({ decisions: [acceptDecision("1")], candidates })
  assert.match(none.errors.join("\n"), /faltan reconocer avisos.*specialties-truncated/)
  assert.equal(none.applied.length, 0)
})

test("publish: an accepted place is built ONLY from the source — no hours, cost, appointment, requirements or audience — and validates", () => {
  const candidates = candidatesOf(cesacManifest, cesacRecords, approvedMapping(cesacMapping))
  const candidate = candidates.find((c) => c.key === "1")
  const acknowledged = candidate.gates.filter((g) => g.level === "warn").map((g) => g.code)
  const overrides = acknowledged.some((code) => code.startsWith("address-")) ? { address: { street: "Vélez Sarsfield" } } : undefined
  const result = plan({ decisions: [acceptDecision("1", { acknowledged, ...(overrides ? { overrides } : {}) })], candidates })
  assert.deepEqual(result.errors, [])
  assert.equal(result.data.resources.length, 7)
  const place = result.data.resources.at(-1)
  assert.equal(place.id, "cesac-1")
  assert.equal(place.kind, "service")
  assert.equal(place.facilityType, "health-center")
  assert.deepEqual(place.externalIds, { "caba-cesac": "1" })
  for (const forbidden of ["hours", "cost", "costNote", "requirements", "audience", "appointment", "coverage"]) assert.equal(place[forbidden], undefined, `no se completa ${forbidden}`)
  assert.ok(place.services.length > 0)
  for (const service of place.services) {
    assert.deepEqual(Object.keys(service).sort(), ["hours", "id", "name", "type"])
    assert.equal(service.hours, null, "las prestaciones no heredan ni inventan horarios")
    assert.ok(["dentistry", "diagnostic-imaging"].includes(service.type), "solo prestaciones con mapeo aprobado")
  }
  assert.equal(place.coordinates.status, "verified")
  assert.equal(place.coordinates.method, "official-dataset")
  assert.equal(place.coordinates.verifiedAt, batch.verifiedAt)
  assert.deepEqual(place.verification, { status: "verified", verifiedAt: "2026-10-07", verifiedBy: "equipo-auxiliar", nextReviewDue: "2027-01-05", notes: place.verification.notes })
  assert.match(place.verification.notes, /datos objetivos/)
  assert.equal(place.source.license, "CC-BY-2.5-AR")
  assert.equal(place.source.retrievedAt, "2026-10-07")
  assert.match(place.source.note, /CC-BY-2.5-AR/)
  assert.ok(result.data.resources.slice(0, 6).every((resource, index) => JSON.stringify(resource) === JSON.stringify(published[index])), "los 6 anteriores no cambian")
})

test("publish: without an approved service (or facility type) a place stays a candidate and is not published", () => {
  const draft = candidatesOf(cesacManifest, cesacRecords, cesacMapping)
  const draftResult = plan({ decisions: [acceptDecision("1", { acknowledged: ["phone-fragment", "specialties-truncated"] })], candidates: draft })
  assert.match(draftResult.errors.join("\n"), /no se puede publicar todavía \(facility-type-not-approved, no-approved-service\)/)
  const noService = candidatesOf(cesacManifest, cesacRecords, approvedMapping(cesacMapping, { types: [] }))
  const result = plan({ decisions: [acceptDecision("1", { acknowledged: ["phone-fragment", "specialties-truncated"] })], candidates: noService })
  assert.match(result.errors.join("\n"), /no-approved-service/)
  assert.equal(result.applied.length, 0)
})

test("publish: no decision, no change — a different point or phone in the source never touches a published place", () => {
  const moved = cesacRecords.map((record) => (record.key === "3" ? { ...record, coordinates: { ...record.coordinates, lat: -34.6, lng: -58.4 }, phones: [{ dial: "+541100000000", display: "0000-0000" }] } : record))
  const candidates = candidatesOf(cesacManifest, moved, approvedMapping(cesacMapping))
  const result = plan({ decisions: [], candidates })
  assert.deepEqual(result.errors, [])
  assert.deepEqual(result.data.resources, published)
  const proposals = proposalsFor(candidates.find((c) => c.key === "3"), published[0])
  assert.ok(proposals.find((p) => p.field === "coordinates").distanceMeters > 1000)
  assert.ok(proposals.some((p) => p.field === "contacts"))
})

test("publish: the fields that are manual curation (hours, services, contacts, verification, source…) can't be applied from a dataset", () => {
  const candidates = candidatesOf(cesacManifest, cesacRecords, cesacMapping)
  for (const field of ["hours", "services", "contacts", "verification", "source", "name", "cost", "externalIds"]) {
    const result = plan({ decisions: [{ ...base, source: "caba-cesac", key: "3", action: "apply", fields: [field], batch: batch.id, reason: "x" }], candidates })
    assert.match(result.errors.join("\n"), /no se puede aplicar desde un dataset/, field)
    assert.deepEqual(result.data.resources, published)
  }
})

test("publish: apply changes only the field it names, stamped by the batch; the invariant holds", () => {
  const candidates = candidatesOf(cesacManifest, cesacRecords, cesacMapping)
  const coordinatesBefore = published[0].coordinates
  const moved = candidates.map((c) => (c.key === "3" ? { ...c, record: { ...c.record, coordinates: { ...c.record.coordinates, lat: -34.6846, lng: -58.4643 } } } : c))
  const result = plan({ decisions: [{ ...base, source: "caba-cesac", key: "3", action: "apply", fields: ["coordinates"], batch: batch.id, reason: "El dataset corrigió el punto." }], candidates: moved })
  assert.deepEqual(result.errors, [])
  const [after] = result.data.resources
  assert.notDeepEqual(after.coordinates, coordinatesBefore)
  assert.equal(after.coordinates.lat, -34.6846)
  assert.equal(after.coordinates.verifiedBy, "equipo-auxiliar")
  const { coordinates: _a, ...restAfter } = after
  const { coordinates: _b, ...restBefore } = published[0]
  assert.deepEqual(restAfter, restBefore, "nada más cambió")
  assert.deepEqual(result.data.resources.slice(1), published.slice(1))
})

test("publish: apply on a place that isn't linked, or without reason, is refused", () => {
  const candidates = candidatesOf(cesacManifest, cesacRecords, cesacMapping)
  const nolink = plan({ decisions: [{ ...base, source: "caba-cesac", key: "1", action: "apply", fields: ["coordinates"], batch: batch.id, reason: "x" }], candidates })
  assert.match(nolink.errors.join("\n"), /solo se aplican cambios a un lugar ya enlazado/)
  const noReason = plan({ decisions: [{ ...base, source: "caba-cesac", key: "3", action: "apply", fields: ["coordinates"], batch: batch.id }], candidates })
  assert.match(noReason.errors.join("\n"), /falta "reason"/)
})

test("publish: link needs evidence that it is the same place, and never overwrites another external id", () => {
  const unlinked = structuredClone(published).map(({ externalIds: _externalIds, ...rest }) => rest)
  const candidates = candidatesOf(cesacManifest, cesacRecords, cesacMapping, unlinked)
  const good = plan({ resources: unlinked, candidates, decisions: [{ ...base, source: "caba-cesac", key: "3", action: "link", resourceId: "cesac-3", reason: "mismo lugar" }] })
  assert.deepEqual(good.errors, [])
  assert.deepEqual(good.data.resources[0].externalIds, { "caba-cesac": "3" })
  assert.match(good.applied[0].evidence.join(" "), /teléfono en común/)
  const wrong = plan({ resources: unlinked, candidates, decisions: [{ ...base, source: "caba-cesac", key: "3", action: "link", resourceId: "cesac-41", reason: "x" }] })
  assert.match(wrong.errors.join("\n"), /no hay evidencia de que "cesac-41" sea el mismo lugar/)
  const different = plan({ candidates: candidatesOf(cesacManifest, cesacRecords, cesacMapping), decisions: [{ ...base, source: "caba-cesac", key: "3", action: "link", resourceId: "cesac-41", reason: "x" }] })
  assert.match(different.errors.join("\n"), /no hay evidencia|ya tiene externalIds/)
})

test("publish: malformed decisions are refused (who, when, which action, which row)", () => {
  const candidates = candidatesOf(cesacManifest, cesacRecords, cesacMapping)
  const cases = [
    [{ source: "caba-cesac", key: "3", action: "link", resourceId: "cesac-3", decidedAt: "2026-10-07", reason: "x" }, /falta "reviewer"/],
    [{ ...base, source: "caba-cesac", key: "3", action: "borrar" }, /acción desconocida/],
    [{ ...base, decidedAt: "2026-02-30", source: "caba-cesac", key: "3", action: "reject" }, /fecha real/],
    [{ ...base, source: "caba-cesac", key: "777", action: "reject" }, /no hay un candidato/],
    [{ ...base, source: "nadie", key: "3", action: "reject" }, /no hay un candidato/],
    [{ ...base, source: "caba-cesac", key: "3", action: "reject", rowHash: "0000" }, /la fila del dataset cambió/],
  ]
  for (const [decision, pattern] of cases) assert.match(plan({ decisions: [decision], candidates }).errors.join("\n"), pattern)
  assert.deepEqual(plan({ decisions: [{ ...base, source: "caba-cesac", key: "1", action: "reject", reason: "no es un CeSAC" }], candidates }).errors, [])
})

test("publish: an inverted or unparsed address must be written by a person (overrides.address), acknowledging is not enough", () => {
  const candidates = candidatesOf(cesacManifest, cesacRecords, approvedMapping(cesacMapping))
  const target = candidates.find((c) => c.gates.some((g) => g.code === "address-unparsed" && c.key === "4"))
  const acknowledged = target.gates.filter((g) => g.level === "warn").map((g) => g.code)
  const result = plan({ decisions: [acceptDecision("4", { acknowledged })], candidates })
  assert.match(result.errors.join("\n"), /overrides\.address/)
})

test("publish: only name, shortName and address parts can be overridden", () => {
  const candidates = candidatesOf(cesacManifest, cesacRecords, approvedMapping(cesacMapping))
  const candidate = candidates.find((c) => c.key === "1")
  const acknowledged = candidate.gates.filter((g) => g.level === "warn").map((g) => g.code)
  const result = plan({ decisions: [acceptDecision("1", { acknowledged, overrides: { hours: { open24h: true } } })], candidates })
  assert.match(result.errors.join("\n"), /overrides\.hours no está permitido/)
  const addr = plan({ decisions: [acceptDecision("1", { acknowledged, overrides: { address: { province: "AR-B" } } })], candidates })
  assert.match(addr.errors.join("\n"), /overrides\.address\.province no está permitido/)
})

test("publish: the result is validated with the real validator BEFORE writing (an invalid place aborts everything)", () => {
  const bad = approvedMapping(cesacMapping)
  bad.specialties.Odontología = { serviceType: "teletransportacion", approved: true }
  const candidates = candidatesOf(cesacManifest, cesacRecords, bad)
  const candidate = candidates.find((c) => c.key === "1")
  const acknowledged = candidate.gates.filter((g) => g.level === "warn").map((g) => g.code)
  const overrides = acknowledged.some((code) => code.startsWith("address-")) ? { address: { street: "Vélez Sarsfield" } } : undefined
  const result = plan({ decisions: [acceptDecision("1", { acknowledged, ...(overrides ? { overrides } : {}) })], candidates })
  assert.match(result.errors.join("\n"), /validación:.*teletransportacion/)
})

test("publish: batches need real dates and a later review", () => {
  assert.deepEqual(validateBatch(batch), [])
  assert.ok(validateBatch({ ...batch, nextReviewDue: "2026-10-07" }).some((e) => e.includes("posterior")))
  assert.ok(validateBatch({ ...batch, verifiedAt: "2026-13-01" }).some((e) => e.includes("fecha real")))
  assert.ok(validateBatch({ ...batch, verifiedBy: "" }).some((e) => e.includes("verifiedBy")))
})

// ─── Writing keeps the hand-made file as it is ───────────────────────────────────────────────────

test("serialization: untouched places keep their exact text; a link adds one line; a new place is appended whole", async () => {
  const text = await readFile(placesPath, "utf8")
  const same = serializePlacesPreserving(text, published, published)
  assert.equal(same, text.replace(/\r\n/g, "\n"))
  const unlinked = structuredClone(published).map(({ externalIds: _externalIds, ...rest }) => rest)
  const originalWithout = text.replace(/\r\n/g, "\n").split("\n").filter((line) => !line.startsWith('      "externalIds"')).join("\n")
  const relinked = serializePlacesPreserving(originalWithout, unlinked, published)
  assert.equal(relinked, text.replace(/\r\n/g, "\n"), "volver a enlazar reproduce el archivo línea por línea")
  const added = serializePlacesPreserving(text, published, [...published, { ...structuredClone(published[0]), id: "cesac-999", externalIds: { "caba-cesac": "999" } }])
  assert.equal(JSON.parse(added).resources.length, 7)
  assert.ok(added.startsWith(text.replace(/\r\n/g, "\n").slice(0, text.replace(/\r\n/g, "\n").indexOf('      "aliases": ["CeSAC 47", "Retiro 3"') )))
})

test("runPublish on a copy: validates, writes only with --write, and a failed validation leaves the file untouched", async () => {
  const dir = await mkdtemp(join(tmpdir(), "curation-publish-"))
  try {
    const paths = Object.fromEntries(Object.entries(PATHS).map(([name, path]) => [name, join(dir, "curation", relative(join(clientRoot, "curation"), path))]))
    paths.places = join(dir, "dataset/places")
    await cp(join(clientRoot, "curation"), join(dir, "curation"), { recursive: true, filter: (source) => !source.includes(`${join("curation", "raw")}`) })
    await cp(DATASET_DIR, join(dir, "dataset"), { recursive: true })
    const placesCopy = join(dir, "dataset/places/ar-c.json")
    // Applying the pending decisions (if any) and running again changes nothing: publish is idempotent
    const first = await runPublish({ province: "AR-C", write: true, paths, datasetDir: join(dir, "dataset") })
    assert.deepEqual(first.errors, [])
    const dry = await runPublish({ province: "AR-C", paths, datasetDir: join(dir, "dataset") })
    assert.deepEqual(dry.errors, [])
    assert.equal(dry.changed, false, "ya está todo aplicado: no hay nada que escribir")
    const original = await readFile(placesCopy, "utf8")
    // A decision that can't be applied: nothing is written
    const decisionsFile = join(paths.decisions, "ar-c.decisions.json")
    const decisions = JSON.parse(await readFile(decisionsFile, "utf8"))
    decisions.decisions.push({ ...base, source: "caba-cesac", key: "3", action: "apply", fields: ["hours"], batch: "x", reason: "x" })
    await writeFile(decisionsFile, JSON.stringify(decisions))
    const failed = await runPublish({ province: "AR-C", write: true, paths, datasetDir: join(dir, "dataset") })
    assert.ok(failed.errors.length > 0)
    assert.equal(failed.written, false)
    assert.equal(await readFile(placesCopy, "utf8"), original)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test("runPublish removes nothing: the invariant protects against a place disappearing or changing without a decision", () => {
  const candidates = candidatesOf(cesacManifest, cesacRecords, cesacMapping)
  const result = plan({ decisions: [], candidates })
  assert.equal(result.data.resources.length, published.length)
  assert.deepEqual(result.errors, [])
})

// ─── Diffs between downloads ──────────────────────────────────────────────────────────────────────

test("diff between downloads: new, removed (possible closure) and changed rows", () => {
  const before = snapshot(cesacRecords)
  const edited = cesacRecords
    .filter((record) => record.key !== "4")
    .map((record) => (record.key === "3" ? { ...record, rowHash: "changed", phones: [...record.phones, { dial: "+541100000000", display: "0000-0000" }] } : record))
  edited.push({ ...cesacRecords[0], key: "500", rowHash: "new" })
  const diff = diffSnapshots(before, snapshot(edited))
  assert.deepEqual(diff.added, ["500"])
  assert.deepEqual(diff.removed, ["4"])
  assert.deepEqual(diff.changed, [{ key: "3", fields: ["phones"] }])
  assert.equal(diffSnapshots(null, before).added.length, 5)
})

test("corroboration: a shared phone or the same number in a similar street; a different place gives none", () => {
  const record = byKey(cesacRecords, "41")
  assert.ok(corroboration(record, published.find((r) => r.id === "cesac-41")).length > 0)
  assert.deepEqual(corroboration(record, published.find((r) => r.id === "cesac-3")), [])
})

// ─── The curation files themselves ────────────────────────────────────────────────────────────────

test("curation:check passes on the real files, and catches a mapping that points at a service type that doesn't exist", async () => {
  assert.deepEqual(await checkCuration(), [])
  const dir = await mkdtemp(join(tmpdir(), "curation-check-"))
  try {
    await cp(join(clientRoot, "curation"), join(dir, "curation"), { recursive: true, filter: (source) => !source.includes(`${join("curation", "raw")}`) })
    const paths = Object.fromEntries(Object.entries(PATHS).map(([name, path]) => [name, join(dir, "curation", relative(join(clientRoot, "curation"), path))]))
    const file = join(paths.mappings, "caba-cesac.json")
    const mapping = JSON.parse(await readFile(file, "utf8"))
    mapping.specialties["Odontología"].serviceType = "inexistente"
    mapping.specialties["Nutrición"].approved = true
    await writeFile(file, JSON.stringify(mapping))
    const errors = await checkCuration({ paths })
    assert.ok(errors.some((e) => e.includes("inexistente")))
    assert.ok(errors.some((e) => e.includes("aprobada sin serviceType")))
    assert.ok(errors.some((e) => e.includes("approvedBy")))
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

// ─── Nothing of this reaches the app ──────────────────────────────────────────────────────────────

const walk = async (dir) => {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(path)))
    else out.push(path)
  }
  return out
}

test("bundle: nothing under src/ imports the pipeline, proj4 or csv-parse, and they are devDependencies", async () => {
  const sources = (await walk(join(clientRoot, "src"))).filter((file) => /\.(ts|tsx|js|jsx|mjs)$/.test(file))
  for (const file of sources) {
    const code = await readFile(file, "utf8")
    assert.doesNotMatch(code, /from\s+["'][^"']*(curation|proj4|csv-parse)/, relative(clientRoot, file))
    assert.doesNotMatch(code, /import\(["'][^"']*(curation|proj4|csv-parse)/, relative(clientRoot, file))
  }
  const pkg = await readJson(join(clientRoot, "package.json"))
  for (const name of ["proj4", "csv-parse"]) {
    assert.ok(pkg.devDependencies[name], `${name} tiene que ser devDependency`)
    assert.equal(pkg.dependencies[name], undefined, `${name} no puede ser dependency`)
  }
  assert.ok(!(await walk(join(clientRoot, "src/data"))).some((file) => file.includes("candidates")), "los candidatos no viven en src/")
})

// ─── address.department: the administrative division, from the source's own field ───────────────

const noDivision = (resources) => resources.map((resource) => ({ ...resource, address: Object.fromEntries(Object.entries(resource.address).filter(([key]) => key !== "department")) }))
const departmentDecision = (key, resourceId, value, extra = {}) => ({
  ...base,
  source: "caba-cesac",
  key,
  action: "apply",
  resourceId,
  fields: ["address.department"],
  values: { "address.department": value },
  batch: batch.id,
  rowHash: byKey(cesacRecords, key).rowHash,
  reason: "test",
  ...extra,
})
const LINKED = [["3", "cesac-3", "Comuna 8"], ["41", "cesac-41", "Comuna 4"], ["46", "cesac-47", "Comuna 1"]]

test("department: the adapters take the division from the dataset's comuna column, never from the neighborhood", async () => {
  assert.equal(byKey(cesacRecords, "3").address.department, "Comuna 8")
  assert.equal(byKey(cesacRecords, "3").address.neighborhood, "Villa Lugano", "the neighborhood stays a neighborhood")
  assert.equal(byKey(hospRecords, "hospital-especializado-de-oftalmologia-santa-lucia").address.department, "Comuna 3")
  // a row whose comuna is empty has no division, even if its neighborhood would tell
  const text = (await fixture("cesac.sample.csv")).replace("Villa Lugano,Comuna 8,", "Villa Lugano,,")
  const records = await normalizeText({ manifest: cesacManifest, text })
  assert.equal(byKey(records, "3").address.neighborhood, "Villa Lugano")
  assert.equal(byKey(records, "3").address.department, undefined)
  assert.equal(byKey(records, "3").address.comuna, undefined)
})

test("department: a new place gets the division after its locality; without it from the source, none", () => {
  const candidate = candidatesOf(cesacManifest, cesacRecords, cesacMapping, []).find((c) => c.key === "3")
  const address = addressFor(candidate.record, cesacManifest, candidate.resolved?.address ?? candidate.record.address)
  assert.deepEqual(Object.keys(address).slice(0, 5), ["street", "number", "neighborhood", "locality", "department"])
  assert.equal(address.department, "Comuna 8")
  const noComuna = { ...candidate.record, address: { ...candidate.record.address, department: undefined, comuna: undefined } }
  assert.ok(!("department" in addressFor(noComuna, cesacManifest, noComuna.address)))
})

test("department: apply adds only that key to the address and leaves every other datum as it was", () => {
  const candidates = candidatesOf(cesacManifest, cesacRecords, cesacMapping)
  const before = noDivision(published)
  const result = plan({ decisions: LINKED.map(([key, id, value]) => departmentDecision(key, id, value)), candidates, resources: before })
  assert.deepEqual(result.errors, [])
  for (const [, id, value] of LINKED) {
    const was = before.find((r) => r.id === id)
    const now = result.data.resources.find((r) => r.id === id)
    assert.equal(now.address.department, value)
    assert.deepEqual({ ...now, address: { ...now.address, department: undefined } }, { ...was, address: { ...was.address, department: undefined } })
    assert.equal(now.address.locality, "Ciudad Autónoma de Buenos Aires", "the locality is not replaced")
    assert.ok(now.address.neighborhood, "the neighborhood is not replaced")
  }
  // the places that were not decided are untouched
  for (const resource of result.data.resources.filter((r) => !LINKED.some(([, id]) => id === r.id))) assert.deepEqual(resource, before.find((r) => r.id === resource.id))
  const applied = result.applied.find((item) => item.resourceId === "cesac-3")
  assert.deepEqual(applied.division, { resourceId: "cesac-3", value: "Comuna 8", source: "caba-cesac", key: "3", rowHash: byKey(cesacRecords, "3").rowHash })
})

test("department: the text of the file changes by one line per place", () => {
  const text = readFileSync(placesPath, "utf8").replace(/\r\n/g, "\n")
  const before = noDivision(published)
  const candidates = candidatesOf(cesacManifest, cesacRecords, cesacMapping)
  const result = plan({ decisions: LINKED.map(([key, id, value]) => departmentDecision(key, id, value)), candidates, resources: before })
  const withoutLines = text.split("\n").filter((line) => !line.includes('"department"')).join("\n")
  const written = serializePlacesPreserving(withoutLines, before, result.data.resources)
  assert.ok(written, "the layout is the expected one")
  assert.equal(written.split("\n").filter((line) => line.includes('"department"')).length, 3)
  assert.equal(written.split("\n").length - withoutLines.split("\n").length, 3, "three lines added, nothing else rewritten")
})

test("department: a person has to approve that value for that row; nothing is worked out", () => {
  const candidates = candidatesOf(cesacManifest, cesacRecords, cesacMapping)
  const before = noDivision(published)
  const refused = (decision, pattern) => {
    const result = plan({ decisions: [decision], candidates, resources: before })
    assert.ok(result.errors.some((error) => pattern.test(error)), JSON.stringify(result.errors))
    assert.deepEqual(result.data.resources, before, "nothing changed")
  }
  refused(departmentDecision("3", "cesac-3", "Comuna 8", { rowHash: undefined }), /falta "rowHash"/)
  refused(departmentDecision("3", "cesac-3", "Comuna 8", { rowHash: "0000000000000000" }), /la fila del dataset cambió/)
  refused(departmentDecision("3", "cesac-3", "Comuna 9"), /"values" tiene que traer el valor que se revisó/)
  refused(departmentDecision("3", "cesac-3", "Comuna 8", { values: undefined }), /"values" tiene que traer/)
  refused(departmentDecision("3", "cesac-3", "Comuna 8", { reason: undefined }), /falta "reason"/)
  refused(departmentDecision("3", "cesac-3", "Comuna 8", { reviewer: undefined }), /falta "reviewer"/)
  refused(departmentDecision("3", "cesac-3", "Comuna 8", { fields: ["address", "address.department"] }), /ya incluye la división/)
  refused(departmentDecision("3", "cesac-3", "Comuna 8", { fields: ["address.street"] }), /no se puede aplicar desde un dataset/)
  refused(departmentDecision("3", "cesac-3", "Comuna 8", { fields: ["address.department", "hours"] }), /no se puede aplicar desde un dataset/)
  // a source that gives no division for the row: it is not filled in from the neighborhood
  const blank = candidates.map((c) => (c.key === "3" ? { ...c, record: { ...c.record, address: { ...c.record.address, department: undefined, comuna: undefined } } } : c))
  const noValue = plan({ decisions: [departmentDecision("3", "cesac-3", "Comuna 8")], candidates: blank, resources: before })
  assert.ok(noValue.errors.some((error) => /no informa la división administrativa/.test(error)))
  // the place has to be linked first, like any apply
  const unlinked = plan({ decisions: [departmentDecision("3", "cesac-3", "Comuna 8")], candidates: candidatesOf(cesacManifest, cesacRecords, cesacMapping, []), resources: before })
  assert.ok(unlinked.errors.some((error) => /solo se aplican cambios a un lugar ya enlazado/.test(error)))
})

test("department: two applies on one place (coordinates and division) are two decisions; the same one twice is not", () => {
  const candidates = candidatesOf(hospManifest, hospRecords, hospMapping)
  const key = "hospital-especializado-de-oftalmologia-santa-lucia"
  const hospDecision = (fields, extra = {}) => ({ ...base, source: "caba-hospitales", key, action: "apply", resourceId: "hospital-oftalmologico-santa-lucia", fields, batch: batch.id, rowHash: byKey(hospRecords, key).rowHash, reason: "test", ...extra })
  const division = hospDecision(["address.department"], { values: { "address.department": "Comuna 3" } })
  const both = plan({ decisions: [hospDecision(["coordinates"]), division], candidates, resources: noDivision(published) })
  assert.deepEqual(both.errors, [])
  const twice = plan({ decisions: [division, division], candidates, resources: noDivision(published) })
  assert.ok(twice.errors.some((error) => /hay otra decisión para el mismo registro/.test(error)))
})

test("department: the six published divisions are the approved ones", () => {
  const approved = {
    "cesac-3": "Comuna 8",
    "cesac-41": "Comuna 4",
    "cesac-47": "Comuna 1",
    "hospital-oftalmologico-santa-lucia": "Comuna 3",
    "hospital-odontologia-carrillo": "Comuna 2",
    "hospital-odontologia-duenas": "Comuna 5",
  }
  assert.equal(published.length, 6)
  for (const [id, value] of Object.entries(approved)) {
    const place = published.find((r) => r.id === id)
    assert.equal(place.address.department, value, id)
    // neighborhood and locality are other things and are still there
    assert.ok(place.address.neighborhood && place.address.neighborhood !== value, id)
    assert.equal(place.address.locality, "Ciudad Autónoma de Buenos Aires", id)
    assert.equal(place.address.province, "AR-C")
  }
})

test("department: the report proposes the division when a published place lacks it", () => {
  const candidate = candidatesOf(cesacManifest, cesacRecords, cesacMapping).find((c) => c.key === "3")
  const lacking = noDivision(published).find((r) => r.id === "cesac-3")
  assert.deepEqual(proposalsFor(candidate, lacking).find((p) => p.field === "address.department"), { field: "address.department", published: null, source: "Comuna 8" })
  assert.equal(proposalsFor(candidate, published.find((r) => r.id === "cesac-3")).find((p) => p.field === "address.department"), undefined)
})
