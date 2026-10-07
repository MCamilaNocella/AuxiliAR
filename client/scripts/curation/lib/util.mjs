import { createHash } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

export const clientRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..")
export const CURATION_DIR = join(clientRoot, "curation")

export const sha256 = (data) => createHash("sha256").update(data).digest("hex")

/** Recursively sorted keys, so the same data always writes the same bytes (clean diffs) */
export const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable)
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
  return value
}

export const readJson = async (file) => {
  try {
    return JSON.parse(await readFile(file, "utf8"))
  } catch (error) {
    throw new Error(`No se pudo leer ${file}: ${error.message}`)
  }
}

export const readJsonOr = async (file, fallback) => {
  try {
    return JSON.parse(await readFile(file, "utf8"))
  } catch (error) {
    if (error.code === "ENOENT") return fallback
    throw new Error(`No se pudo leer ${file}: ${error.message}`)
  }
}

/** JSON with LF line endings and a final newline. `sorted: true` sorts the keys */
export const writeJson = async (file, value, { sorted = false } = {}) => {
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, `${JSON.stringify(sorted ? stable(value) : value, null, 2)}\n`)
}

/** Lowercase, no accents, words joined by hyphens: the format of our ids */
export const slugify = (text) =>
  String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

export const isIsoDate = (text) => /^\d{4}-\d{2}-\d{2}$/.test(text ?? "") && !Number.isNaN(Date.parse(`${text}T00:00:00Z`))

export const deepEqual = (a, b) => JSON.stringify(stable(a)) === JSON.stringify(stable(b))
