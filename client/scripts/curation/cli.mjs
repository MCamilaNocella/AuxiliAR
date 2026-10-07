/*
 * Curation pipeline (v0). Usage, from client/:
 *   npm run curation -- profile <source> [--write]
 *   npm run curation -- ingest <source> <file> --retrieved-at=AAAA-MM-DD [--official-updated-at=AAAA-MM-DD]
 *   npm run curation -- normalize [<source>]
 *   npm run curation -- pages <source> --retrieved-at=AAAA-MM-DD   (downloads the official pages that complement a dataset)
 *   npm run curation -- candidates <province>           (e.g. AR-C)
 *   npm run curation -- proposal <province> --batch=<batch>   (report for editorial review; publishes nothing)
 *   npm run curation -- publish <province> [--write]    (dry run unless --write; then run npm run resources:sync)
 *   npm run curation -- attribution [--write]
 *   npm run curation -- check
 * Nothing here publishes a new place by itself: see publish.mjs and curation/README.md.
 */
import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { pathToFileURL } from "node:url"
import { fetchSupplements } from "./supplements.mjs"
import { attributionText, checkCuration, generateCandidates, proposeBatch, runPublish } from "./pipeline.mjs"
import { formatProfile, profileText } from "./profile.mjs"
import { PATHS, ingest, listManifests, loadManifest, loadSnapshot, normalizeSource, rawFile } from "./sources.mjs"
import { CURATION_DIR } from "./lib/util.mjs"

const flag = (args, name) => args.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3)
const positional = (args) => args.filter((arg) => !arg.startsWith("--"))

const commands = {
  async profile(args) {
    const [id] = positional(args)
    const manifest = await loadManifest(id)
    const text = (await readFile(rawFile(manifest))).toString("utf8")
    const report = formatProfile(profileText({ manifest, text }))
    if (args.includes("--write")) {
      await writeFile(join(PATHS.reports, `${id}.profile.md`), report)
      console.log(`Perfil escrito en curation/reports/${id}.profile.md`)
    } else console.log(report)
  },

  async ingest(args) {
    const [id, file] = positional(args)
    if (!id || !file) throw new Error("uso: ingest <fuente> <archivo> --retrieved-at=AAAA-MM-DD [--official-updated-at=AAAA-MM-DD]")
    const next = await ingest({ manifest: await loadManifest(id), file, retrievedAt: flag(args, "retrieved-at"), officialUpdatedAt: flag(args, "official-updated-at") })
    console.log(`${id}: ${next.current.rows} filas, sha256 ${next.current.sha256.slice(0, 12)}…, guardado en ${next.current.file}`)
  },

  async normalize(args) {
    const [only] = positional(args)
    const manifests = only ? [await loadManifest(only)] : await listManifests()
    for (const manifest of manifests) {
      const snapshot = await normalizeSource({ manifest })
      const withCoordinates = snapshot.records.filter((record) => record.coordinates).length
      console.log(`${manifest.id}: ${snapshot.count} registros normalizados (${withCoordinates} con coordenadas) → curation/normalized/${manifest.id}.json`)
    }
  },

  async pages(args) {
    const [id] = positional(args)
    const manifest = await loadManifest(id)
    const snapshot = await loadSnapshot(id)
    if (!snapshot) throw new Error(`no hay snapshot de ${id}: corré normalize primero`)
    const retrievedAt = flag(args, "retrieved-at")
    if (!retrievedAt) throw new Error("uso: pages <fuente> --retrieved-at=AAAA-MM-DD")
    const file = await fetchSupplements({ manifest, snapshot, retrievedAt, log: (line) => console.log(`  ${line}`) })
    const failed = [...Object.entries(file.pages), ...Object.entries(file.shared)].filter(([, page]) => page.status !== 200)
    console.log(`${id}: ${Object.keys(file.pages).length} páginas y ${Object.keys(file.shared).length} compartidas guardadas en curation/supplements/${id}.pages.json${failed.length ? `; FALLARON: ${failed.map(([key, page]) => `${key} (${page.status})`).join(", ")}` : ""}`)
  },

  async candidates(args) {
    const [province] = positional(args)
    if (!province) throw new Error("uso: candidates <provincia> (por ejemplo AR-C)")
    const { summary } = await generateCandidates({ province })
    for (const s of summary) console.log(`${s.source}: ${s.count} candidatos — T1 ${s.T1}, T2 ${s.T2}, T3 ${s.T3} — publicables hoy: ${s.publishable}`)
    console.log("Informes en curation/reports/. Ningún candidato se publica sin una decisión.")
  },

  async proposal(args) {
    const [province] = positional(args)
    const batchId = flag(args, "batch")
    if (!province || !batchId) throw new Error("uso: proposal <provincia> --batch=<lote> (por ejemplo AR-C --batch=caba-2)")
    const { stats } = await proposeBatch({ province, batchId })
    console.log(`CeSAC: ${stats.cesac.proposed} propuestos, ${stats.cesac.manual} a revisar a mano, ${stats.cesac.published} ya publicados (de ${stats.cesac.total})`)
    console.log(`Hospitales Generales de Agudos: ${stats.generales.proposed} propuestos, ${stats.generales.manual} a revisar a mano (de ${stats.generales.total})`)
    console.log(`Informe y decisiones propuestas en curation/proposals/ (sin efecto: reviewer y decidedAt vacíos)`)
  },

  async publish(args) {
    const [province] = positional(args)
    if (!province) throw new Error("uso: publish <provincia> [--write]")
    const result = await runPublish({ province, write: args.includes("--write") })
    if (result.errors.length > 0) {
      console.error(`publish ${province} — NO se escribió nada. Problemas:\n${result.errors.map((error) => `  - ${error}`).join("\n")}`)
      process.exitCode = 1
      return
    }
    for (const item of result.applied) console.log(`  ${item.action}: ${item.resourceId}${item.fields ? ` (${item.fields.join(", ")})` : ""}`)
    for (const item of result.skipped) console.log(`  omitida: ${item.decision} — ${item.reason}`)
    console.log(result.written ? "Escrito. Ahora corré: npm run resources:sync" : result.changed ? "Simulación: hay cambios pero no se escribieron (usá --write)." : "Sin cambios.")
  },

  async attribution(args) {
    const text = await attributionText()
    if (args.includes("--write")) {
      await writeFile(join(CURATION_DIR, "ATTRIBUTION.md"), text)
      console.log("curation/ATTRIBUTION.md escrito")
    } else console.log(text)
  },

  async check() {
    const errors = await checkCuration()
    if (errors.length > 0) {
      console.error(`curation:check — hay problemas:\n${errors.map((error) => `  - ${error}`).join("\n")}`)
      process.exitCode = 1
    } else console.log("curation:check — ok")
  },
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [command, ...args] = process.argv.slice(2)
  try {
    if (!commands[command]) throw new Error(`comando desconocido "${command ?? ""}". Hay: ${Object.keys(commands).join(", ")}`)
    await commands[command](args)
  } catch (error) {
    console.error(`curation ${command ?? ""} — ${error.message}`)
    process.exitCode = 1
  }
}
