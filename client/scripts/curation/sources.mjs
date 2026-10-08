/*
 * Sources: manifests (curation/sources/*.source.json), downloads (ingest) and the normalized snapshot of each source.
 *
 *   raw file (curation/raw/, not in git)  →  ingest  →  manifest.current { file, sha256, retrievedAt, officialUpdatedAt }
 *   raw file                              →  normalize  →  curation/normalized/<id>.json  (the previous one becomes <id>.prev.json)
 *
 * A source without license and attribution is refused: nothing from it can be normalized or published.
 */
import { copyFile, mkdir, readdir, readFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { getAdapter } from "./adapters/index.mjs"
import { loadCrs } from "./lib/crs.mjs"
import { CURATION_DIR, clientRoot, isIsoDate, readJson, readJsonOr, sha256, writeJson } from "./lib/util.mjs"

export const PATHS = {
  sources: join(CURATION_DIR, "sources"),
  mappings: join(CURATION_DIR, "mappings"),
  supplements: join(CURATION_DIR, "supplements"),
  proposals: join(CURATION_DIR, "proposals"),
  normalized: join(CURATION_DIR, "normalized"),
  candidates: join(CURATION_DIR, "candidates"),
  decisions: join(CURATION_DIR, "decisions"),
  batches: join(CURATION_DIR, "batches"),
  reports: join(CURATION_DIR, "reports"),
  raw: join(CURATION_DIR, "raw"),
  idMap: join(CURATION_DIR, "id-map.json"),
  crs: join(CURATION_DIR, "crs"),
  places: join(clientRoot, "src/data/resources/places"),
}

const FORMATS = new Set(["csv", "geojson"])
const ID_STRATEGIES = new Set(["official-id", "name-slug"])

/** Problems of a manifest. License and attribution are mandatory for every source */
export const validateManifest = (manifest, { provinces = null } = {}) => {
  const errors = []
  const need = (field) => {
    if (typeof manifest[field] !== "string" || manifest[field].trim() === "") errors.push(`${manifest.id ?? "(sin id)"}: falta "${field}"`)
  }
  for (const field of ["id", "label", "adapter", "province", "organization", "datasetUrl", "downloadUrl", "format", "license", "attribution", "mapping"]) need(field)
  if (manifest.license && !manifest.attribution?.includes(manifest.license)) errors.push(`${manifest.id}: la atribución tiene que nombrar la licencia (${manifest.license})`)
  if (manifest.format && !FORMATS.has(manifest.format)) errors.push(`${manifest.id}: formato desconocido "${manifest.format}"`)
  if (manifest.idStrategy && !ID_STRATEGIES.has(manifest.idStrategy)) errors.push(`${manifest.id}: idStrategy desconocida "${manifest.idStrategy}"`)
  if (!manifest.crs?.declared) errors.push(`${manifest.id}: falta crs.declared`)
  if (provinces && manifest.province && !provinces.includes(manifest.province)) errors.push(`${manifest.id}: la provincia "${manifest.province}" no está en taxonomy.provinces`)
  const box = manifest.expectedBox
  if (!box || ![box.south, box.west, box.north, box.east].every(Number.isFinite)) errors.push(`${manifest.id}: falta expectedBox (south, west, north, east)`)
  const current = manifest.current
  if (current) {
    if (!/^[0-9a-f]{64}$/.test(current.sha256 ?? "")) errors.push(`${manifest.id}: current.sha256 inválido`)
    if (!isIsoDate(current.retrievedAt)) errors.push(`${manifest.id}: current.retrievedAt tiene que ser AAAA-MM-DD`)
    if (current.officialUpdatedAt && !isIsoDate(current.officialUpdatedAt)) errors.push(`${manifest.id}: current.officialUpdatedAt tiene que ser AAAA-MM-DD`)
  }
  return errors
}

export const manifestPath = (id, dir = PATHS.sources) => join(dir, `${id}.source.json`)

export const loadManifest = async (id, dir = PATHS.sources) => {
  const manifest = await readJson(manifestPath(id, dir))
  const errors = validateManifest(manifest)
  if (errors.length > 0) throw new Error(`Manifiesto inválido:\n${errors.map((error) => `  - ${error}`).join("\n")}`)
  return manifest
}

export const listManifests = async (dir = PATHS.sources) => {
  const names = (await readdir(dir)).filter((name) => name.endsWith(".source.json")).sort()
  return Promise.all(names.map((name) => loadManifest(name.replace(".source.json", ""), dir)))
}

export const rawFile = (manifest, root = clientRoot) => {
  if (!manifest.current) throw new Error(`${manifest.id}: todavía no se ingirió ninguna descarga (npm run curation -- ingest ${manifest.id} <archivo>)`)
  return join(root, manifest.current.file)
}

/** A portal that answers "Request Rejected" with a 200 is not a dataset */
export const looksLikeDataset = (bytes) => bytes.length > 0 && !/^\s*<(!doctype|html)/i.test(bytes.subarray(0, 200).toString("utf8"))

/**
 * Registers a downloaded file: checks it is a dataset the adapter can read, copies it to curation/raw/<id>/<retrievedAt>.<ext>
 * and records its sha256 in the manifest.
 */
export const ingest = async ({ manifest, file, retrievedAt, officialUpdatedAt, sourcesDir = PATHS.sources, rawDir = PATHS.raw }) => {
  if (!isIsoDate(retrievedAt)) throw new Error("ingest: falta retrievedAt (AAAA-MM-DD)")
  if (officialUpdatedAt && !isIsoDate(officialUpdatedAt)) throw new Error("ingest: officialUpdatedAt tiene que ser AAAA-MM-DD")
  const bytes = await readFile(file)
  if (!looksLikeDataset(bytes)) throw new Error(`ingest: ${file} no es un dataset (¿una página de error del portal?)`)
  const adapter = getAdapter(manifest.adapter)
  const rows = adapter.parseRows(bytes.toString(manifest.encoding === "utf-8" ? "utf8" : "latin1"))
  assertColumns(adapter, rows, manifest.id)
  const target = join(rawDir, manifest.id, `${retrievedAt}.${manifest.format}`)
  await mkdir(dirname(target), { recursive: true })
  await copyFile(file, target)
  const relative = target.startsWith(clientRoot) ? target.slice(clientRoot.length + 1).replaceAll("\\", "/") : target
  const next = {
    ...manifest,
    current: { file: relative, sha256: sha256(bytes), bytes: bytes.length, rows: rows.length, retrievedAt, ...(officialUpdatedAt ? { officialUpdatedAt } : {}) },
  }
  await writeJson(manifestPath(manifest.id, sourcesDir), next)
  return next
}

const assertColumns = (adapter, rows, id) => {
  if (rows.length === 0) throw new Error(`${id}: el archivo no tiene filas`)
  const present = new Set(Object.keys(rows[0].fields))
  const missing = adapter.REQUIRED_COLUMNS.filter((column) => !present.has(column))
  if (missing.length > 0) throw new Error(`${id}: al archivo le faltan columnas que el adapter necesita: ${missing.join(", ")} (¿cambió el formato del dataset?)`)
}

/** Raw text → normalized records. Pure: the tests use it with fixtures */
export const normalizeText = async ({ manifest, text, crsDir = PATHS.crs }) => {
  const adapter = getAdapter(manifest.adapter)
  const rows = adapter.parseRows(text)
  assertColumns(adapter, rows, manifest.id)
  const crs = manifest.crs.declared === "EPSG:4326" ? null : await loadCrs(manifest.crs.declared, crsDir)
  return rows.map((row) => adapter.normalizeRow(row, { manifest, crs }))
}

export const snapshotFile = (id, dir = PATHS.normalized) => join(dir, `${id}.json`)

export const loadSnapshot = (id, dir = PATHS.normalized) => readJsonOr(snapshotFile(id, dir), null)

/** Reads the raw file (checking its sha256 against the manifest), normalizes it and writes the snapshot, keeping the previous one */
export const normalizeSource = async ({ manifest, normalizedDir = PATHS.normalized, root = clientRoot }) => {
  const file = rawFile(manifest, root)
  const bytes = await readFile(file).catch(() => {
    throw new Error(`${manifest.id}: no está ${file}. Los archivos crudos no van en git: volvé a bajarlo de ${manifest.downloadUrl} y corré ingest`)
  })
  if (sha256(bytes) !== manifest.current.sha256) throw new Error(`${manifest.id}: el archivo ${file} no coincide con el sha256 del manifiesto (otra descarga o archivo modificado)`)
  const records = await normalizeText({ manifest, text: bytes.toString(manifest.encoding === "utf-8" ? "utf8" : "latin1") })
  const snapshot = {
    source: manifest.id,
    adapter: manifest.adapter,
    retrievedAt: manifest.current.retrievedAt,
    officialUpdatedAt: manifest.current.officialUpdatedAt ?? null,
    sha256: manifest.current.sha256,
    count: records.length,
    records,
  }
  const previous = await loadSnapshot(manifest.id, normalizedDir)
  if (previous && previous.sha256 !== snapshot.sha256) await writeJson(join(normalizedDir, `${manifest.id}.prev.json`), previous)
  await writeJson(snapshotFile(manifest.id, normalizedDir), snapshot)
  return snapshot
}
