/*
 * Validates the resources dataset (client/src/data/resources) and generates the copy the server reads:
 * server/src/main/resources/data/resources.json. The server is built on its own (its Docker context is
 * server/), so it can't read the client's folder: it gets this generated copy, like content-index.json.
 *
 *   npm run resources:sync    validate and write the server copy
 *   npm run resources:check   validate and fail if the server copy is out of date (nothing is written)
 *
 * The edited source is always client/src/data/resources (lines/ and places/, one Base AuxiliAR). The server copy is never edited by hand.
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { resolveResource } from "./resources-resolve.mjs"
import { validateDataset } from "./resources-validate.mjs"

const clientRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")

export const DEFAULT_PATHS = {
  sourceDir: join(clientRoot, "src/data/resources"),
  outFile: resolve(clientRoot, "../server/src/main/resources/data/resources.json"),
}

const NOTICE = "GENERADO por client/scripts/resources-sync.mjs desde client/src/data/resources. No editar a mano: se pisa con npm run resources:sync."

const readJson = async (file) => {
  try {
    return JSON.parse(await readFile(file, "utf8"))
  } catch (error) {
    throw new Error(`No se pudo leer ${file}: ${error.message}`)
  }
}

/** Every .json file of a folder (lines/ or places/), in name order, parsed. A folder that doesn't exist has none */
const readFolder = async (dir, folderName) => {
  let names
  try {
    names = (await readdir(dir)).filter((name) => name.endsWith(".json")).sort()
  } catch (error) {
    if (error.code === "ENOENT") return []
    throw error
  }
  return Promise.all(names.map(async (name) => ({ name: `${folderName}/${name}`, data: await readJson(join(dir, name)) })))
}

/** The server copy: deterministic (sorted by id, no dates), services resolved, with LF line endings */
export const buildServerCopy = (resources, taxonomy) => {
  const sorted = resources.map((resource) => resolveResource(resource, taxonomy)).sort((a, b) => a.id.localeCompare(b.id, "en"))
  return `${JSON.stringify({ schemaVersion: taxonomy.schemaVersion, notice: NOTICE, resources: sorted }, null, 2)}\n`
}

/** Ids of the app's real categories (same way content-index.mjs reads them): to keep taxonomy.categories honest */
const loadCategoryIds = async () => {
  const { createServer } = await import("vite")
  const vite = await createServer({ root: clientRoot, logLevel: "error", server: { middlewareMode: true }, appType: "custom" })
  try {
    const { ALL_CATEGORIES } = await vite.ssrLoadModule("/src/content/categories/index.ts")
    return ALL_CATEGORIES.map(({ id }) => id)
  } finally {
    await vite.close()
  }
}

/** Git on Windows may check files out with CRLF: line endings don't count as a difference */
const normalize = (text) => text.replace(/\r\n/g, "\n")

/**
 * mode: "sync" writes the server copy, "check" only compares it.
 * Returns { ok, errors, output } instead of exiting, so it can be tested.
 */
export const run = async ({
  mode = "sync",
  sourceDir = DEFAULT_PATHS.sourceDir,
  outFile = DEFAULT_PATHS.outFile,
  schemaFile = join(sourceDir, "resource.schema.json"),
  taxonomyFile = join(sourceDir, "taxonomy.json"),
  linesDir = join(sourceDir, "lines"),
  placesDir = join(sourceDir, "places"),
  categoryIds = null,
} = {}) => {
  const [schema, taxonomy, lines, places] = await Promise.all([
    readJson(schemaFile),
    readJson(taxonomyFile),
    readFolder(linesDir, "lines"),
    readFolder(placesDir, "places"),
  ])
  const files = [...lines, ...places]
  const { errors, resources } = validateDataset({ files, schema, taxonomy, categoryIds })
  if (errors.length > 0) return { ok: false, errors, output: null }

  const output = buildServerCopy(resources, taxonomy)

  if (mode === "check") {
    let current = null
    try {
      current = normalize(await readFile(outFile, "utf8"))
    } catch {
      // Missing file: reported below
    }
    if (current !== output) {
      return { ok: false, errors: [`${outFile} no coincide con client/src/data/resources. Corré: npm run resources:sync`], output }
    }
    return { ok: true, errors: [], output }
  }

  await mkdir(dirname(outFile), { recursive: true })
  await writeFile(outFile, output)
  return { ok: true, errors: [], output }
}

// Command line (not when imported by the tests)
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const mode = process.argv.includes("--check") ? "check" : "sync"
  try {
    const result = await run({ mode, categoryIds: await loadCategoryIds() })
    if (!result.ok) {
      console.error(`resources:${mode} — hay problemas:\n${result.errors.map((error) => `  - ${error}`).join("\n")}`)
      process.exitCode = 1
    } else {
      const count = JSON.parse(result.output).resources.length
      console.log(mode === "check" ? `resources:check — ok (${count} recursos, copia del servidor al día)` : `resources:sync — ${count} recursos escritos en el servidor`)
    }
  } catch (error) {
    console.error(`resources:${mode} — ${error.message}`)
    process.exitCode = 1
  }
}
