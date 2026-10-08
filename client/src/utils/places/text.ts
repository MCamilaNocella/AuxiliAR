/** Lowercase and without accents, so "Odontología" and "odontologia" are the same thing when searching */
export const normalizeText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()

const ENDINGS = ["ias", "ia", "os", "as", "es", "o", "a", "e", "s"]
const MIN_STEM = 5

/**
 * The root of a searched word, so that the masculine, the feminine, the plural and the name of the discipline find each other:
 * "psicólogo", "psicóloga", "psicólogos" and "psicología" are all "psicolog". Only the ending is cut, only from words long
 * enough to keep a root of 5 letters or more ("salud", "esi" and "ive" stay as they are), and what is left is looked for as
 * a part of the text, like any other word. It is not a synonym finder: "dentista" does not become "odontología".
 */
export const stemOf = (term: string) => {
  const ending = ENDINGS.find((suffix) => term.endsWith(suffix) && term.length - suffix.length >= MIN_STEM)
  return ending ? term.slice(0, -ending.length) : term
}
