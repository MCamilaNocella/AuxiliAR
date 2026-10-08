/*
 * Orchestration: reads the curation files and the dataset from disk and calls the pure pieces.
 * Every function takes its folders as parameters (defaults: the real ones) so the tests can run on copies.
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { buildCandidates } from "./candidates.mjs"
import { diffSnapshots, proposalsFor } from "./diff.mjs"
import { PATHS, listManifests, loadManifest, loadSnapshot, validateManifest } from "./sources.mjs"
import { planPublish, serializePlaces, serializePlacesPreserving, validateBatch } from "./publish.mjs"
import { buildReport } from "./report.mjs"
import { loadSupplements } from "./supplements.mjs"
import { buildProposal, mappingReview } from "./proposal.mjs"
import { readJson, readJsonOr, writeJson } from "./lib/util.mjs"
import { termKey } from "./fichas.mjs"
import { clientRoot } from "./lib/util.mjs"

export const DATASET_DIR = join(clientRoot, "src/data/resources")

export const provinceFile = (province) => `${province.toLowerCase()}.json`

const readFolder = async (dir, folder) => {
  let names
  try {
    names = (await readdir(dir)).filter((name) => name.endsWith(".json")).sort()
  } catch (error) {
    if (error.code === "ENOENT") return []
    throw error
  }
  return Promise.all(names.map(async (name) => ({ name: `${folder}/${name}`, data: await readJson(join(dir, name)) })))
}

/** The dataset as the validator wants it, split in "this province's file" and "the rest" */
export const loadDataset = async ({ datasetDir = DATASET_DIR, province }) => {
  const [schema, taxonomy, lines, places] = await Promise.all([
    readJson(join(datasetDir, "resource.schema.json")),
    readJson(join(datasetDir, "taxonomy.json")),
    readFolder(join(datasetDir, "lines"), "lines"),
    readFolder(join(datasetDir, "places"), "places"),
  ])
  const ownName = `places/${provinceFile(province)}`
  const own = places.find((file) => file.name === ownName)
  return { schema, taxonomy, otherFiles: [...lines, ...places.filter((file) => file.name !== ownName)], own: own ?? { name: ownName, data: { resources: [] } } }
}

export const loadMapping = (manifest, dir = PATHS.mappings) => readJson(join(dir, `${manifest.mapping}.json`))

/** Candidates of every source of a province: written to curation/candidates, with the id-map and one report per source */
export const generateCandidates = async ({ province, paths = PATHS, datasetDir = DATASET_DIR }) => {
  const manifests = (await listManifests(paths.sources)).filter((manifest) => manifest.province === province)
  if (manifests.length === 0) throw new Error(`No hay fuentes para ${province}`)
  const { own } = await loadDataset({ datasetDir, province })
  let idMap = await readJsonOr(paths.idMap, {})
  const all = []
  const summary = []
  for (const manifest of manifests) {
    const snapshot = await loadSnapshot(manifest.id, paths.normalized)
    if (!snapshot) throw new Error(`${manifest.id}: no hay snapshot normalizado (corré: npm run curation -- normalize ${manifest.id})`)
    const mapping = await loadMapping(manifest, paths.mappings)
    const supplements = await loadSupplements(manifest.id, paths.supplements)
    const built = buildCandidates({ manifest, snapshot, mapping, published: own.data.resources, idMap, supplements })
    idMap = built.idMap
    const previous = await readJsonOr(join(paths.normalized, `${manifest.id}.prev.json`), null)
    const diff = diffSnapshots(previous, snapshot)
    const published = new Map(own.data.resources.map((resource) => [resource.id, resource]))
    const linkedProposals = built.candidates
      .filter((candidate) => candidate.link.status === "linked")
      .map((candidate) => ({ resourceId: candidate.link.resourceId, proposals: proposalsFor(candidate, published.get(candidate.link.resourceId)) }))
      .filter(({ proposals }) => proposals.length > 0)
    await mkdir(paths.reports, { recursive: true })
    await writeFile(join(paths.reports, `${manifest.id}.report.md`), buildReport({ manifest, snapshot, candidates: built.candidates, diff, linkedProposals }))
    all.push(...built.candidates)
    summary.push({ source: manifest.id, count: built.candidates.length, T1: built.candidates.filter((c) => c.tier === "T1").length, T2: built.candidates.filter((c) => c.tier === "T2").length, T3: built.candidates.filter((c) => c.tier === "T3").length, publishable: built.candidates.filter((c) => c.publishable.ready).length })
  }
  await writeJson(paths.idMap, idMap)
  await writeJson(join(paths.candidates, `${province.toLowerCase()}.candidates.json`), {
    province,
    note: "GENERADO por npm run curation -- candidates. Candidatos internos: NO son lugares publicados y nunca se cargan en la app.",
    candidates: all,
  })
  return { candidates: all, summary, idMap }
}

/**
 * The proposal of a batch for editorial review: a report, the decisions that would publish it (with reviewer/date empty, so they
 * can't be applied by accident) and the complete mapping table. It publishes NOTHING.
 */
export const proposeBatch = async ({ province, batchId, paths = PATHS, datasetDir = DATASET_DIR }) => {
  const batch = await readJson(join(paths.batches, `${batchId}.batch.json`))
  const { candidates } = await generateCandidates({ province, paths, datasetDir })
  const taxonomy = await readJson(join(datasetDir, "taxonomy.json"))
  const manifests = (await listManifests(paths.sources)).filter((manifest) => manifest.province === province)
  const proposal = buildProposal({ candidates, batch, taxonomy, manifests })
  await mkdir(paths.proposals, { recursive: true })
  await writeFile(join(paths.proposals, `${batchId}.proposal.md`), proposal.markdown)
  await writeJson(join(paths.proposals, `${batchId}.decisions.proposed.json`), proposal.decisions)
  for (const manifest of manifests) {
    const mapping = await loadMapping(manifest, paths.mappings)
    const supplements = await loadSupplements(manifest.id, paths.supplements)
    const snapshot = await loadSnapshot(manifest.id, paths.normalized)
    if (mapping.fichaTerms) await writeFile(join(paths.proposals, `${manifest.id}.mapping-review.md`), mappingReview({ mapping, pages: supplements.pages, snapshot, taxonomy }))
  }
  return proposal
}

/** Plans (and with write: applies) the decisions of a province. Candidates are recomputed from the snapshots, not read back */
export const runPublish = async ({ province, write = false, paths = PATHS, datasetDir = DATASET_DIR }) => {
  const manifests = (await listManifests(paths.sources)).filter((manifest) => manifest.province === province)
  const { schema, taxonomy, otherFiles, own } = await loadDataset({ datasetDir, province })
  const decisionsFile = await readJsonOr(join(paths.decisions, `${province.toLowerCase()}.decisions.json`), { decisions: [] })
  const batches = {}
  for (const name of await readdir(paths.batches).catch(() => [])) {
    if (name.endsWith(".batch.json")) {
      const batch = await readJson(join(paths.batches, name))
      batches[batch.id] = batch
    }
  }
  const candidates = []
  const idMap = await readJsonOr(paths.idMap, {})
  for (const manifest of manifests) {
    const snapshot = await loadSnapshot(manifest.id, paths.normalized)
    if (!snapshot) continue
    const supplements = await loadSupplements(manifest.id, paths.supplements)
    candidates.push(...buildCandidates({ manifest, snapshot, mapping: await loadMapping(manifest, paths.mappings), published: own.data.resources, idMap, supplements }).candidates)
  }
  const plan = planPublish({
    province,
    placesData: own.data,
    candidates,
    decisions: decisionsFile.decisions ?? [],
    batches,
    manifests: Object.fromEntries(manifests.map((manifest) => [manifest.id, manifest])),
    otherFiles,
    schema,
    taxonomy,
  })
  const file = join(datasetDir, "places", provinceFile(province))
  const originalText = await readFile(file, "utf8").catch(() => null)
  const next = originalText === null ? serializePlaces(plan.data) : serializePlacesPreserving(originalText, own.data.resources, plan.data.resources)
  const crlf = originalText?.includes("\r\n") ?? false
  const changed = originalText === null || next !== originalText.replace(/\r\n/g, "\n")
  const written = write && plan.errors.length === 0 && changed
  if (written) await writeFile(file, crlf ? next.replace(/\n/g, "\r\n") : next)
  return { ...plan, changed, written, text: next }
}

/** Consistency of the curation files (for CI and before a run): manifests, mappings, decisions, batches, id-map */
export const checkCuration = async ({ paths = PATHS, datasetDir = DATASET_DIR } = {}) => {
  const errors = []
  const taxonomy = await readJson(join(datasetDir, "taxonomy.json"))
  const provinces = taxonomy.provinces.map(({ id }) => id)
  const serviceTypes = new Set(taxonomy.serviceTypes.map(({ id }) => id))
  const facilityTypes = new Set(taxonomy.facilityTypes.map(({ id }) => id))
  const manifests = await listManifests(paths.sources).catch((error) => {
    errors.push(error.message)
    return []
  })
  for (const manifest of manifests) {
    errors.push(...validateManifest(manifest, { provinces }))
    const mapping = await loadMapping(manifest, paths.mappings).catch(() => null)
    if (!mapping) {
      errors.push(`${manifest.id}: falta la tabla de mapeo curation/mappings/${manifest.mapping}.json`)
      continue
    }
    for (const [name, entry] of Object.entries(mapping.specialties ?? {})) {
      if (entry.serviceType && !serviceTypes.has(entry.serviceType)) errors.push(`${manifest.id}: la especialidad "${name}" apunta a "${entry.serviceType}", que no está en taxonomy.serviceTypes`)
      if (entry.approved && !entry.serviceType) errors.push(`${manifest.id}: la especialidad "${name}" está aprobada sin serviceType`)
    }
    for (const [name, entry] of Object.entries(mapping.facilityTypes ?? {})) {
      if (entry.facilityType && !facilityTypes.has(entry.facilityType)) errors.push(`${manifest.id}: el tipo "${name}" apunta a "${entry.facilityType}", que no está en taxonomy.facilityTypes`)
    }
    for (const table of ["specialties", "fichaTerms", "facilityTypes"]) {
      for (const [name, entry] of Object.entries(mapping[table] ?? {})) {
        if (!["approvable", "doubtful"].includes(entry.proposal)) errors.push(`${manifest.id}: ${table}["${name}"] necesita proposal: approvable o doubtful`)
        if (entry.proposal === "doubtful" && entry.approved) errors.push(`${manifest.id}: ${table}["${name}"] es dudosa y está aprobada: primero hay que resolver la duda`)
        if (table === "fichaTerms" && name !== termKey(name)) errors.push(`${manifest.id}: fichaTerms["${name}"] tiene que estar escrita como se busca: "${termKey(name)}"`)
        if (table === "fichaTerms" && entry.serviceType && !serviceTypes.has(entry.serviceType)) errors.push(`${manifest.id}: fichaTerms["${name}"] apunta a "${entry.serviceType}", que no está en taxonomy.serviceTypes`)
      }
    }
    // Statements about a group (guardias): each one has to quote the official page that was saved
    const supplements = await loadSupplements(manifest.id, paths.supplements)
    if (supplements.claims) {
      const snapshot = await loadSnapshot(manifest.id, paths.normalized)
      const keys = new Set((snapshot?.records ?? []).map((record) => record.key))
      if (supplements.claims.claims.some((claim) => claim.approved) && !supplements.claims.approvedBy) errors.push(`${manifest.id}: hay afirmaciones aprobadas pero el archivo no dice approvedBy/approvedAt`)
      for (const claim of supplements.claims.claims) {
        const where = `${manifest.id}: afirmación ${claim.key}/${claim.service.id}`
        if (!keys.has(claim.key)) errors.push(`${where}: el registro no existe en el snapshot`)
        if (!serviceTypes.has(claim.service.type)) errors.push(`${where}: el tipo "${claim.service.type}" no está en taxonomy.serviceTypes`)
        const page = supplements.shared[claim.evidence.page]
        if (!page || page.status !== 200) errors.push(`${where}: la página oficial "${claim.evidence.page}" no está guardada`)
        else if (!page.lines.join(" ").includes(claim.evidence.quote)) errors.push(`${where}: la cita no está en la página oficial guardada`)
        if (claim.proposal === "doubtful" && claim.approved) errors.push(`${where}: es dudosa y está aprobada`)
      }
    }
    const approved = [...Object.values(mapping.specialties ?? {}), ...Object.values(mapping.fichaTerms ?? {}), ...Object.values(mapping.facilityTypes ?? {})].some((entry) => entry.approved)
    if (approved && (!mapping.approvedBy || !mapping.approvedAt)) errors.push(`${manifest.id}: el mapeo tiene entradas aprobadas pero no dice approvedBy/approvedAt`)
  }
  const idMap = await readJsonOr(paths.idMap, {})
  const ids = new Map()
  for (const [source, entries] of Object.entries(idMap)) {
    for (const [key, id] of Object.entries(entries)) {
      if (ids.has(id)) errors.push(`id-map: el id "${id}" está asignado a ${ids.get(id)} y a ${source}:${key}`)
      else ids.set(id, `${source}:${key}`)
    }
  }
  for (const name of await readdir(paths.batches).catch(() => [])) {
    if (name.endsWith(".batch.json")) errors.push(...validateBatch(await readJson(join(paths.batches, name))))
  }
  return errors
}

export const attributionText = async (paths = PATHS) => {
  const manifests = await listManifests(paths.sources)
  const lines = ["# Fuentes de datos y licencias", "", "GENERADO por `npm run curation -- attribution`. Cada fuente exige su atribución cuando se muestran sus datos.", ""]
  for (const manifest of manifests) lines.push(`- **${manifest.label}** — ${manifest.organization}. Licencia ${manifest.license}${manifest.licenseUrl ? ` (${manifest.licenseUrl})` : ""}. ${manifest.attribution} Dataset: ${manifest.datasetUrl}`)
  return `${lines.join("\n")}\n`
}

export { loadManifest, readFile }
