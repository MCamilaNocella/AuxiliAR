/*
 * Validates the resources dataset (client/src/data/resources) and generates the copy the server reads:
 * server/src/main/resources/data/resources.json. The server is built on its own (its Docker context is
 * server/), so it can't read the client's folder: it gets this generated copy, like content-index.json.
 *
 *   npm run resources:sync    validate and write the server copy
 *   npm run resources:check   validate and fail if the server copy is out of date (nothing is written)
 *
 * It also generates client/src/data/resources/coverage.json: a small index of what each places/<province>.json has (how many
 * places, which categories, services and divisions, until when something is current). The app reads it to know where there are
 * places WITHOUT downloading the files. Like the server copy, it is generated from the places, never edited by hand.
 *
 * The edited source is always client/src/data/resources (lines/ and places/, one Base AuxiliAR). The server copy is never edited by hand.
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { derivedCategories, resolveResource } from "./resources-resolve.mjs"
import { validateDataset } from "./resources-validate.mjs"

const clientRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")

export const DEFAULT_PATHS = {
  sourceDir: join(clientRoot, "src/data/resources"),
  outFile: resolve(clientRoot, "../server/src/main/resources/data/resources.json"),
  coverageFile: join(clientRoot, "src/data/resources/coverage.json"),
  numbersTemplateFile: join(clientRoot, "src/data/resources/numeros.template.md"),
  numbersFile: resolve(clientRoot, "../server/src/main/resources/prompts/numeros.md"),
  safetyRulesFile: resolve(clientRoot, "../server/src/main/java/com/auxiliar/server/chat/SafetyRules.java"),
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

/* ── The table of help numbers the chat reads (server/.../prompts/numeros.md), generated from lines/ ── */

const NUMBERS_NOTICE = "<!-- GENERADO por client/scripts/resources-sync.mjs desde client/src/data/resources/lines y numeros.template.md. No editar a mano: se pisa con npm run resources:sync. -->"

const dialDigits = (dial) => String(dial).replace(/\D/g, "")

const cell = (text, where) => {
  const clean = String(text ?? "").replace(/\s+/g, " ").trim()
  if (clean.includes("|")) throw new Error(`${where}: el texto no puede llevar "|" (rompe la tabla de números)`)
  return clean
}

/** Where a number works, in the words of the dataset: the contact's own note, "Todo el país" for a national line, or the line's note */
const zoneOf = (resource, contact) => {
  // A number listed once per jurisdiction (the 107): what is said about the number is the line's note
  const listedByJurisdiction = (resource.contacts ?? []).filter((entry) => dialDigits(entry.dial) === dialDigits(contact.dial)).length > 1
  if (listedByJurisdiction) return resource.coverage?.note
  if (contact.scope?.note) return contact.scope.note
  const scope = contact.scope ?? resource.coverage
  return scope?.level === "national" ? "Todo el país" : resource.coverage?.note
}

/** "24 h" for a line that answers all day; the dataset's own words when it gives its hours; nothing when they are not known */
const hoursOf = (resource, contact) => {
  const hours = contact.hours ?? resource.hours
  if (!hours) return ""
  return hours.open24h ? "24 h" : (hours.note ?? "").replace(/\.$/, "")
}

/** The verified lines (not the places) in the order of the files, one row per number */
export const buildNumberRows = (resources) => {
  const seen = new Set()
  const rows = []
  for (const resource of resources) {
    if (resource.kind === "service" || resource.verification?.status !== "verified") continue
    for (const contact of resource.contacts ?? []) {
      const key = dialDigits(contact.dial)
      if (seen.has(key)) continue
      seen.add(key)
      const where = `${resource.id} ${contact.display}`
      const zone = cell(zoneOf(resource, contact), where)
      if (!zone) throw new Error(`${where}: sin alcance no se puede escribir la tabla de números (falta coverage o scope)`)
      rows.push({ key, line: `| ${cell(contact.display, where)} | ${cell(resource.name, where)} | ${zone} | ${cell(resource.whenToUse ?? resource.description ?? "", where)} | ${cell(hoursOf(resource, contact), where)} |` })
    }
  }
  return rows
}

/**
 * The instructions of numeros.template.md with the numbers and hours that they name taken from the dataset ({{n:id}} the
 * number of a line, {{n:id:1}} its second contact, {{h:id}} its hours) and the verified rows where {{ROWS}} is. The rows that
 * the template still carries by hand (not verified yet) cannot repeat a number of the dataset: that would be two answers.
 */
export const buildNumbersDocument = (resources, template) => {
  const lines = resources.filter((resource) => resource.kind !== "service")
  const byId = (id) => {
    const line = lines.find((resource) => resource.id === id && resource.verification?.status === "verified")
    if (!line) throw new Error(`numeros.template.md nombra la línea "${id}", que no está verificada en lines/`)
    return line
  }
  const rows = buildNumberRows(resources)
  const body = template
    .replace(/\{\{n:([a-z0-9-]+)(?::(\d+))?\}\}/g, (_, id, index) => {
      const contact = (byId(id).contacts ?? [])[Number(index ?? 0)]
      if (!contact) throw new Error(`numeros.template.md: la línea "${id}" no tiene el contacto ${index ?? 0}`)
      return contact.display
    })
    .replace(/\{\{h:([a-z0-9-]+)\}\}/g, (_, id) => {
      const note = byId(id).hours?.note
      if (!note) throw new Error(`numeros.template.md: la línea "${id}" no dice su horario`)
      return note
    })
    .replace("{{ROWS}}", rows.map((row) => row.line).join("\n"))
  if (/\{\{/.test(body)) throw new Error("numeros.template.md: queda un {{…}} sin reemplazar")

  const seen = new Set()
  for (const line of body.split("\n")) {
    const match = /^\|\s*([^|]+?)\s*\|/.exec(line)
    const digits = match ? dialDigits(match[1]) : ""
    if (!digits || /Número/.test(line)) continue
    if (seen.has(digits)) throw new Error(`El número ${match[1]} está dos veces en la tabla de numeros.md: una fila a mano repite una del dataset (hay que borrar la de mano)`)
    seen.add(digits)
  }
  return `${NUMBERS_NOTICE}\n${body.replace(/\n+$/, "")}\n`
}

/**
 * What SafetyRules.java assumes about the table (it names PAMI's two numbers and where the second one works). It is checked here -
 * in resources:check, which is what CI runs - and not when the server starts, where a failure would stop the whole server.
 */
export const checkSafetyRules = (resources, javaSource) => {
  const errors = []
  const constant = (name) => new RegExp(`${name}\\s*=\\s*"([0-9]+)"`).exec(javaSource)?.[1]
  const pami = constant("PAMI")
  const emergencies = constant("PAMI_EMERGENCIES")
  if (!pami || !emergencies) return ["SafetyRules.java: no se encontraron las constantes PAMI y PAMI_EMERGENCIES (¿cambió el archivo? actualizá resources-sync.mjs)"]
  const lineOf = (dial) => resources.find((resource) => resource.kind !== "service" && resource.verification?.status === "verified" && (resource.contacts ?? []).some((contact) => dialDigits(contact.dial) === dialDigits(dial)))
  if (!lineOf(pami)) errors.push(`SafetyRules.java usa el ${pami} (PAMI), que no es una línea verificada de lines/`)
  const emergencyLine = lineOf(emergencies)
  if (!emergencyLine) errors.push(`SafetyRules.java usa el ${emergencies} (emergencias de PAMI), que no es una línea verificada de lines/`)
  else {
    const areas = emergencyLine.coverage?.areas ?? []
    if (!areas.includes("amba") || !areas.includes("ugl-rosario")) errors.push(`SafetyRules.java supone que el ${emergencies} es del AMBA y de Rosario, y lines/ dice otra cosa (${areas.join(", ") || "sin áreas"})`)
  }
  return errors
}

/** Lines whose review date is past or near: the bar and the chat keep showing them, so someone has to be told */
export const reviewWarnings = (resources, today, days = 30) => {
  const limit = new Date(`${today}T00:00:00Z`)
  limit.setUTCDate(limit.getUTCDate() + days)
  const near = limit.toISOString().slice(0, 10)
  return resources
    .filter((resource) => resource.kind !== "service" && resource.verification?.status === "verified" && resource.verification.nextReviewDue && resource.verification.nextReviewDue <= near)
    .map((resource) => `la línea ${resource.id} ${resource.verification.nextReviewDue <= today ? "venció" : "vence"} el ${resource.verification.nextReviewDue}: hay que volver a verificarla (sigue mostrándose)`)
}

const COVERAGE_NOTICE ="GENERADO por client/scripts/resources-sync.mjs desde client/src/data/resources/places. No editar a mano: se pisa con npm run resources:sync. Dice qué hay en cada provincia, no qué está vigente hoy: eso se decide con los datos."

const later = (a, b) => (a === null ? b : b === null ? a : a > b ? a : b)

/**
 * Until when a place can be current: its own review date, or the latest of its services if none goes further. A day before
 * that date the place MAY be current (the app decides with the data); on or after it, it is not. Null: never verified.
 */
const currentUntilOf = (place) => {
  if (place.verification?.status !== "verified" || !place.verification.nextReviewDue) return null
  let services = null
  for (const service of place.services ?? []) {
    const verification = service.verification ?? place.verification
    if (verification.status === "verified" && verification.nextReviewDue) services = later(services, verification.nextReviewDue)
  }
  if (services === null) return null
  return services < place.verification.nextReviewDue ? services : place.verification.nextReviewDue
}

/**
 * The coverage index: for each province with a places file, what its places have. Counts every place of the file (not only
 * the current ones), so the numbers are for planning what to download, never for showing people. Deterministic and sorted.
 */
export const buildCoverage = (placeFiles, taxonomy) => {
  const provinces = {}
  for (const { name, data } of [...placeFiles].sort((a, b) => a.name.localeCompare(b.name, "en"))) {
    const code = /places\/(.+)\.json$/.exec(name)?.[1]?.toUpperCase()
    if (!code) continue
    const places = (data.resources ?? []).filter((resource) => (resource.services ?? []).length > 0)
    provinces[code] = {
      places: places.length,
      currentUntil: places.reduce((latest, place) => later(latest, currentUntilOf(place)), null),
      categories: [...new Set(places.flatMap((place) => derivedCategories(place, taxonomy)))].sort(),
      serviceTypes: [...new Set(places.flatMap((place) => place.services.map((service) => service.type)))].sort(),
      divisions: [...new Set(places.map((place) => place.address?.department).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es", { numeric: true })),
    }
  }
  return `${JSON.stringify({ schemaVersion: taxonomy.schemaVersion, notice: COVERAGE_NOTICE, provinces }, null, 2)}\n`
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
  /** Where the coverage index is written or checked; null: not generated (the tests of the other parts leave it alone) */
  coverageFile = null,
  /** The template of the table of numbers for the chat, and where the generated table goes; null: not generated */
  numbersTemplateFile = null,
  numbersFile = null,
  /** SafetyRules.java: its assumptions about the table are checked against lines/ (null: not checked) */
  safetyRulesFile = null,
  /** Today (AAAA-MM-DD), to warn about lines whose review is near */
  today = new Date().toISOString().slice(0, 10),
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

  if (safetyRulesFile) {
    const safetyErrors = checkSafetyRules(resources, await readFile(safetyRulesFile, "utf8"))
    if (safetyErrors.length > 0) return { ok: false, errors: safetyErrors, output: null }
  }

  const output = buildServerCopy(resources, taxonomy)
  const coverage = buildCoverage(places, taxonomy)
  const numbers = numbersFile && numbersTemplateFile ? buildNumbersDocument(resources, await readFile(numbersTemplateFile, "utf8").then(normalize)) : null
  const warnings = reviewWarnings(resources, today)

  if (mode === "check") {
    let current = null
    try {
      current = normalize(await readFile(outFile, "utf8"))
    } catch {
      // Missing file: reported below
    }
    if (current !== output) {
      return { ok: false, errors: [`${outFile} no coincide con client/src/data/resources. Corré: npm run resources:sync`], output, coverage }
    }
    if (numbers !== null) {
      let table = null
      try {
        table = normalize(await readFile(numbersFile, "utf8"))
      } catch {
        // Missing file: reported below
      }
      if (table !== numbers) return { ok: false, errors: [`${numbersFile} (la tabla de números del chat) no coincide con lines/ y numeros.template.md. Corré: npm run resources:sync`], output, coverage }
    }
    if (coverageFile) {
      let index = null
      try {
        index = normalize(await readFile(coverageFile, "utf8"))
      } catch {
        // Missing file: reported below
      }
      if (index !== coverage) return { ok: false, errors: [`${coverageFile} (el índice de cobertura) no coincide con los lugares. Corré: npm run resources:sync`], output, coverage }
    }
    return { ok: true, errors: [], output, coverage, numbers, warnings }
  }

  await mkdir(dirname(outFile), { recursive: true })
  await writeFile(outFile, output)
  if (coverageFile) {
    await mkdir(dirname(coverageFile), { recursive: true })
    await writeFile(coverageFile, coverage)
  }
  if (numbers !== null) {
    await mkdir(dirname(numbersFile), { recursive: true })
    await writeFile(numbersFile, numbers)
  }
  return { ok: true, errors: [], output, coverage, numbers, warnings }
}

// Command line (not when imported by the tests)
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const mode = process.argv.includes("--check") ? "check" : "sync"
  try {
    const result = await run({ mode, categoryIds: await loadCategoryIds(), coverageFile: DEFAULT_PATHS.coverageFile, numbersTemplateFile: DEFAULT_PATHS.numbersTemplateFile, numbersFile: DEFAULT_PATHS.numbersFile, safetyRulesFile: DEFAULT_PATHS.safetyRulesFile })
    if (!result.ok) {
      console.error(`resources:${mode} — hay problemas:\n${result.errors.map((error) => `  - ${error}`).join("\n")}`)
      process.exitCode = 1
    } else {
      const count = JSON.parse(result.output).resources.length
      for (const warning of result.warnings ?? []) console.warn(`resources:${mode} — aviso: ${warning}`)
      console.log(mode === "check" ? `resources:check — ok (${count} recursos, copia del servidor, índice de cobertura y tabla de números del chat al día)` : `resources:sync — ${count} recursos escritos en el servidor`)
    }
  } catch (error) {
    console.error(`resources:${mode} — ${error.message}`)
    process.exitCode = 1
  }
}
