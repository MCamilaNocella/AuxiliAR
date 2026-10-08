/*
 * Official pages ("fichas") of buenosaires.gob.ar: the complementary source for what the datasets don't say
 * (the full list of specialties and programs of a CeSAC, what a hospital page states).
 *
 * This file only READS a page and keeps what the page literally says, split by its own labels ("Especialidades:", "Programas:"…).
 * It interprets nothing: turning a term into a service type is the job of the reviewed mapping table. The text of every page is
 * kept (as lines) so that a person can check any claim against what the page said on the day it was read.
 * The contents of buenosaires.gob.ar are published under Creative Commons Reconocimiento 2.5 Argentina.
 */
import { cleanText } from "./lib/normalize.mjs"
import { sha256 } from "./lib/util.mjs"

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"

const ENTITIES = {
  "&nbsp;": " ", "&amp;": "&", "&quot;": '"', "&#039;": "'", "&lt;": "<", "&gt;": ">", "&iquest;": "¿", "&iexcl;": "¡",
  "&aacute;": "á", "&eacute;": "é", "&iacute;": "í", "&oacute;": "ó", "&uacute;": "ú", "&ntilde;": "ñ", "&uuml;": "ü",
  "&Aacute;": "Á", "&Eacute;": "É", "&Iacute;": "Í", "&Oacute;": "Ó", "&Uacute;": "Ú", "&Ntilde;": "Ñ",
  "&ordm;": "º", "&ordf;": "ª", "&deg;": "°", "&ndash;": "–", "&mdash;": "—", "&laquo;": "«", "&raquo;": "»",
}

/** Entities of the pages to text. An entity it doesn't know is left as it is (never turned into a space that hides a letter) */
export const decodeEntities = (text) =>
  text.replace(/&[a-zA-Z]+;|&#\d+;/g, (entity) => ENTITIES[entity] ?? (/^&#(\d+);$/.test(entity) ? String.fromCharCode(Number(entity.slice(2, -1))) : entity))

/** Visible text of an HTML page, one line per block */
export const htmlToLines = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/tr|\/dt|\/dd|\/span|\/a)\b[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .split("\n")
    .map((line) => cleanText(decodeEntities(line)))
    .filter(Boolean)

const END_MARKERS = [/^Dirección$/, /^Cómo llego$/, /^Paso 1 de 2$/, /^Ayudanos a mejorar$/]
/** A page about a group (a table of hospitals) keeps everything up to the feedback form: its table has a "Dirección" column header */
const FOOTER_MARKERS = [/^Paso 1 de 2$/, /^Ayudanos a mejorar$/]
/** Lines of the page furniture that sit inside the body */
const FURNITURE = [/^Compartir en redes$/]
/** What a label is called once spelling variants are put together. Anything not listed is not a label (it is a value) */
const CANONICAL_LABELS = {
  "jefe del cesac": "Jefatura", "jefa del cesac": "Jefatura", "jefe del cesac ": "Jefatura",
  "area programatica": "Área programática", "direccion": "Dirección", "barrio": "Barrio", "comuna": "Comuna",
  "codigo postal": "Código Postal", "cod. postal": "Código Postal", "cod. post.": "Código Postal", "colectivos": "Colectivos",
  "datos de contacto": "Datos de contacto", "telefono principal": "Teléfono principal", "telefonos alternativos": "Teléfonos alternativos",
  "telefono": "Teléfono", "telefonos": "Teléfono", "tel.": "Teléfono", "guardia": "Guardia", "telefono guardia": "Guardia", "telefonos guardia": "Guardia",
  "correo electronico de consultas": "Correo", "correo": "Correo", "email": "Correo", "e-mail": "Correo",
  "especialidades": "Especialidades", "programas": "Programas", "talleres": "Talleres", "actividades": "Actividades",
  "otras actividades": "Otras actividades", "mas informacion": "Más información", "sac": "SAC",
}
const plain = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim()
const SECTIONS = new Set(["Especialidades", "Programas", "Talleres", "Actividades", "Otras actividades"])

/** The canonical label of a name ("Dirección ", "Cód. Postal") or null if it is not a known label. "Horario…" keeps its own text */
export const canonicalLabel = (name) => {
  const key = plain(name.replace(/:\s*$/, ""))
  if (/^jefa? del ce?sac$/.test(key)) return "Jefatura"
  if (/^horarios?(?: de [a-z ]{3,30}| [a-z ]{2,30})?$/.test(key)) return name.replace(/\s*:\s*$/, "").trim()
  return CANONICAL_LABELS[key] ?? null
}

/**
 * Field → values, from the lines of a page. A known label starts a field, with or without a colon, alone on its line or followed by its value
 * ("Teléfono principal:28213604"). Every line up to the next label is a value of that field. Lines before the first label are the summary.
 */
export const fichaFields = (lines) => {
  const fields = {}
  const summary = []
  let current = null
  for (const line of lines) {
    const colon = line.indexOf(":")
    const head = colon >= 0 ? line.slice(0, colon) : line
    const rest = colon >= 0 ? line.slice(colon + 1).trim() : ""
    let label = canonicalLabel(head)
    // A section name alone on its line, without colon ("Especialidades"), starts the section
    if (!label && colon < 0) label = SECTIONS.has(canonicalLabel(line) ?? "") ? canonicalLabel(line) : null
    if (label) {
      current = label
      fields[current] = fields[current] ?? []
      if (rest) fields[current].push(rest)
    } else if (current) fields[current].push(line)
    else summary.push(line)
  }
  return { fields, summary }
}

export const pageTitle = (html) =>
  cleanText(decodeEntities(/<title>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? "")).replace(/\s*\|\s*Buenos Aires Ciudad.*$/i, "")

/** The body of a page (from its title to the map block): the evidence that is kept */
export const parseFicha = (html, { wholeBody = false } = {}) => {
  const lines = htmlToLines(html)
  const title = pageTitle(html)
  const startIndex = lines.findIndex((line) => line === title)
  const body = startIndex >= 0 ? lines.slice(startIndex + 1) : lines
  const endAt = body.findIndex((line) => (wholeBody ? FOOTER_MARKERS : END_MARKERS).some((marker) => marker.test(line)))
  const content = (endAt >= 0 ? body.slice(0, endAt) : body).filter((line) => !FURNITURE.some((pattern) => pattern.test(line)))
  return { title, lines: content, contentHash: sha256(content.join("\n")).slice(0, 16) }
}

/** Fetches a page. Never throws for an HTTP error: returns the status so the report can say which pages failed */
export const fetchPage = async (url, { timeoutMs = 45000 } = {}) => {
  const secure = url.replace(/^http:\/\//, "https://")
  try {
    const response = await fetch(secure, { headers: { "user-agent": USER_AGENT, "accept-language": "es-AR,es;q=0.9" }, redirect: "follow", signal: AbortSignal.timeout(timeoutMs) })
    const html = await response.text()
    return { url, finalUrl: response.url, status: response.status, html }
  } catch (error) {
    return { url, finalUrl: null, status: 0, html: "", error: error.message }
  }
}

/** What the pipeline keeps of a fetched page: facts for the candidates plus the lines as evidence. No HTML is stored */
export const pageRecord = (page, options = {}) => {
  if (page.status !== 200) return { url: page.url, finalUrl: page.finalUrl, status: page.status, ...(page.error ? { error: page.error } : {}) }
  const ficha = parseFicha(page.html, options)
  return { url: page.url, finalUrl: page.finalUrl, status: 200, title: ficha.title, lines: ficha.lines, contentHash: ficha.contentHash }
}

/** Splits "a, b (c, d), e." at the commas that are not inside parentheses */
export const splitTerms = (text) => {
  const terms = []
  let depth = 0
  let current = ""
  for (const char of text) {
    if (char === "(") depth++
    if (char === ")") depth = Math.max(0, depth - 1)
    if ((char === "," || char === ";") && depth === 0) {
      terms.push(current)
      current = ""
    } else current += char
  }
  terms.push(current)
  return terms.map((term) => cleanText(term).replace(/[.\s]+$/, "")).filter(Boolean)
}

/** The key a term is looked up by in the mapping: lowercase, no accents, single spaces */
export const termKey = (term) =>
  cleanText(term)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[.\s]+$/, "")
