/*
 * What a saved official page says, as facts the candidates can compare with the dataset: address, phones, the terms listed as
 * specialties and programs, and the text of any schedule. Nothing is inferred: a schedule is kept as the text the page has
 * (it is never turned into hours here) and a phone that isn't complete is a fragment.
 */
import { fichaFields, splitTerms, termKey } from "./fichas.mjs"
import { cleanText } from "./lib/normalize.mjs"

const clean = (value) => cleanText(value).replace(/[.\s]+$/, "")

/** Items of a section: one per line when the page lists them one by one, or split by commas when it writes them in one line */
export const termsOf = (values = []) => {
  const lines = values.map(clean).filter(Boolean)
  return lines.length > 1 ? lines : lines.flatMap(splitTerms)
}

/**
 * Phones as the pages write them: "28213604", "1150481097", "4918-4879", "5197-5078 / 5079", "4639-8700 al 05", "4611-6666 (int. 2111 y 2948)".
 * Complete numbers are taken out of the text: 10 digits starting with 11 (with area code) and 8 digits (CABA, area code 11).
 * An extension ("int. 2111") is not part of the number. Whatever digits remain ("05", "5079") are fragments: reported, never completed.
 */
export const parsePagePhones = (values = [], label) => {
  const phones = []
  const fragments = []
  const add = (dial, display) => {
    if (!phones.some((phone) => phone.dial === dial)) phones.push({ dial, display, ...(label ? { label } : {}) })
  }
  for (const value of values) {
    let rest = cleanText(value).replace(/\(\s*int\.?[^)]*\)/gi, " ").replace(/\bint\.?\s*\d+/gi, " ")
    rest = rest.replace(/(?<!\d)(11)\s*-?\s*(\d{4})\s*-?\s*(\d{4})(?!\d)/g, (_, area, a, b) => {
      add(`+54${area}${a}${b}`, `${area} ${a}-${b}`)
      return " "
    })
    rest = rest.replace(/(?<!\d)(\d{4})\s*-?\s*(\d{4})(?!\d)/g, (_, a, b) => {
      add(`+5411${a}${b}`, `${a}-${b}`)
      return " "
    })
    for (const token of rest.split(/\s*[/,;]\s*|\s+y\s+/)) if (/\d/.test(token)) fragments.push(token.trim())
  }
  return { phones, fragments }
}

/** Facts of a saved page record ({ status, lines… }). Null when the page was not read */
export const pageFacts = (page) => {
  if (!page || page.status !== 200) return null
  const { fields } = fichaFields(page.lines)
  const principal = parsePagePhones(fields["Teléfono principal"], "Principal")
  const alternate = parsePagePhones(fields["Teléfonos alternativos"], "Alternativo")
  const general = parsePagePhones(fields["Teléfono"])
  const guardia = parsePagePhones(fields["Guardia"], "Guardia")
  const phones = []
  for (const phone of [...principal.phones, ...alternate.phones, ...general.phones, ...guardia.phones]) if (!phones.some((p) => p.dial === phone.dial)) phones.push(phone)
  return {
    address: fields["Dirección"]?.map(clean).find(Boolean) ?? null,
    neighborhood: fields["Barrio"]?.map(clean).find(Boolean) ?? null,
    phones,
    guardiaPhones: guardia.phones,
    phoneFragments: [...principal.fragments, ...alternate.fragments, ...general.fragments, ...guardia.fragments],
    specialties: termsOf(fields["Especialidades"]),
    programs: termsOf(fields["Programas"]),
    hours: Object.entries(fields).filter(([label]) => /^horario/i.test(label)).map(([label, values]) => ({ label, text: values.map(cleanText).join(" ") })),
  }
}

export { termKey }
