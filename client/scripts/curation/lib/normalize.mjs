/*
 * Normalizers shared by every adapter. They only reshape what the source says; they never complete, guess or "fix" a fact.
 * When something can't be read with confidence they say so (confidence "low", fragments, warnings) instead of choosing.
 */
import { createHash } from "node:crypto"

/** NFC, no control characters, single spaces */
export const cleanText = (text) =>
  String(text ?? "")
    .normalize("NFC")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

export const rowHash = (fields) => createHash("sha256").update(JSON.stringify(fields)).digest("hex").slice(0, 16)

const CONNECTORS = new Set(["de", "del", "la", "las", "los", "el", "y", "e"])
/** "Combate De Los Pozos" → "Combate de los Pozos": only the connecting words, and only when they are not the first word */
export const fixConnectors = (text) =>
  cleanText(text)
    .split(" ")
    .map((word, index) => (index > 0 && CONNECTORS.has(word.toLowerCase()) ? word.toLowerCase() : word))
    .join(" ")

/**
 * Phones as written by the Buenos Aires datasets: "2821-3601 / 4302-0059 | Guardia: 4941-8081 / 8082".
 * Only complete 8-digit local numbers (CABA, area code 11) become phones. Anything else that has digits ("5005", "6485": the
 * source abbreviates a second number) is a fragment: it is kept out of the phones and reported, never expanded by guessing.
 */
export const parsePhonesCaba = (raw) => {
  const text = cleanText(raw)
  const phones = []
  const fragments = []
  if (!text) return { phones, fragments }
  const seen = new Set()
  for (const segment of text.split("|")) {
    const labelMatch = /^\s*([A-Za-zÁÉÍÓÚáéíóúñÑ ]+):\s*/.exec(segment)
    const label = labelMatch ? cleanText(labelMatch[1]) : undefined
    let rest = labelMatch ? segment.slice(labelMatch[0].length) : segment
    rest = rest.replace(/(?<!\d)(\d{4})(?:\s*-\s*)?(\d{4})(?!\d)/g, (_, a, b) => {
      const key = `${a}${b}`
      if (!seen.has(key)) {
        seen.add(key)
        phones.push({ dial: `+5411${key}`, display: `${a}-${b}`, ...(label ? { label } : {}) })
      }
      return " "
    })
    for (const piece of rest.split(/[\s/,;]+/)) if (/\d/.test(piece)) fragments.push(piece)
  }
  return { phones, fragments }
}

/**
 * "Soldado De La Frontera Av. 5144, Barrio Gral. Savio" → street, number, reference. Confidence "low" when the street is
 * written inverted ("Brin, Ministro 843") or there is no number: a person decides how it is written.
 */
export const parseAddressCaba = (raw) => {
  const text = cleanText(raw)
  if (!text) return { raw: text, confidence: "low", problems: ["address-missing"] }
  const match = /^(?<street>.+?)\s+(?<number>\d{1,5})(?:\s*(?:,|-)\s*(?<rest>.+))?$/.exec(text)
  if (!match) return { raw: text, confidence: "low", problems: ["address-unparsed"] }
  const { street, number, rest } = match.groups
  const problems = []
  if (street.includes(",")) problems.push("address-street-inverted")
  // Digits in a street name are fine when they are part of the name: a date ("24 de Noviembre", "2 de Abril de 1982") or an ordinal ("Humberto 1°")
  const nameWithoutKnownDigits = street.replace(/^\d{1,2}\s+de\s+\S+(?:\s+de\s+\d{4})?/i, " ").replace(/\d{1,2}\s*[°º]/g, " ")
  if (/\d/.test(nameWithoutKnownDigits)) problems.push("address-street-has-digits")
  return {
    raw: text,
    street: fixConnectors(street),
    number,
    ...(rest ? { reference: cleanText(rest) } : {}),
    confidence: problems.length === 0 ? "high" : "low",
    problems,
  }
}

/** An http(s) URL as is, or a bare domain with https:// in front; undefined if it is neither */
export const cleanUrl = (raw) => {
  const text = cleanText(raw)
  if (!text) return undefined
  if (/^https?:\/\/\S+$/.test(text)) return text
  return /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(text) ? `https://${text}` : undefined
}
