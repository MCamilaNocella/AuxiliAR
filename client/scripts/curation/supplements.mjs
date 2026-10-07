/*
 * Supplements: official pages that complement a dataset, saved as evidence in curation/supplements/<source>.pages.json.
 *
 *   pages:  one official page per record (the "ficha" of a CeSAC, the page of a hospital), by record key
 *   shared: official pages about a group (for example the list of the 14 Hospitales Generales de Agudos)
 *
 * Fetching is the only part of the pipeline that uses the network, and only when a person runs `curation -- pages <source>`.
 * Candidates and tests read the saved file, so everything else is reproducible offline and every claim can be checked against
 * the lines the page had on the day it was read.
 */
import { join } from "node:path"
import { fetchPage, pageRecord } from "./fichas.mjs"
import { PATHS } from "./sources.mjs"
import { readJsonOr, writeJson } from "./lib/util.mjs"

export const supplementsFile = (id, dir = PATHS.supplements) => join(dir, `${id}.pages.json`)

export const loadSupplements = async (id, dir = PATHS.supplements) => {
  const pages = await readJsonOr(supplementsFile(id, dir), null)
  const claims = await readJsonOr(join(dir, `${id}.claims.json`), null)
  return { pages: pages?.pages ?? {}, shared: pages?.shared ?? {}, retrievedAt: pages?.retrievedAt ?? null, claims }
}

const matches = (record, only) => !only || Object.entries(only).every(([field, value]) => record[field] === value)

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** Downloads the pages a manifest asks for. `fetcher` is injectable for tests */
export const fetchSupplements = async ({ manifest, snapshot, retrievedAt, dir = PATHS.supplements, fetcher = fetchPage, delayMs = 250, log = () => {} }) => {
  const config = manifest.supplements
  if (!config) throw new Error(`${manifest.id}: el manifiesto no declara supplements`)
  const pages = {}
  const shared = {}
  for (const record of snapshot.records) {
    const url = record[config.pages?.urlField ?? "detailUrl"]
    if (!url || !matches(record, config.pages?.only)) continue
    pages[record.key] = pageRecord(await fetcher(url))
    log(`${record.key}: ${pages[record.key].status}`)
    await sleep(delayMs)
  }
  for (const [id, url] of Object.entries(config.sharedPages ?? {})) {
    shared[id] = pageRecord(await fetcher(url), { wholeBody: true })
    log(`${id}: ${shared[id].status}`)
    await sleep(delayMs)
  }
  const file = {
    source: manifest.id,
    retrievedAt,
    license: "CC-BY-2.5-AR",
    attribution: "Los contenidos de buenosaires.gob.ar están licenciados bajo Creative Commons Reconocimiento 2.5 Argentina.",
    pages: Object.fromEntries(Object.entries(pages).sort(([a], [b]) => a.localeCompare(b, "en", { numeric: true }))),
    shared,
  }
  await writeJson(supplementsFile(manifest.id, dir), file)
  return file
}
