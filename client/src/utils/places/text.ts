/** Lowercase and without accents, so "Odontología" and "odontologia" are the same thing when searching */
export const normalizeText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()

/**
 * The few words that name the same thing in the way people ask and in the way the data is written. Short on purpose and
 * exact (the whole word, not a part of it): "castrar a mi perro" has to find a "castración", and nothing else is widened -
 * this is not a synonym finder. Keys are normalized words; the values are the words the text can have instead.
 */
const EQUIVALENTS: Record<string, string[]> = {
  ...Object.fromEntries(["castrar", "castrarlo", "castrarla", "castrarle", "castrado", "castrada", "castrados", "castradas"].map((word) => [word, ["castracion"]])),
  // The feminine of the two animals the data names: too short for stemOf to join them with "perros" and "gatos"
  perra: ["perro"],
  perras: ["perro"],
  gata: ["gato"],
  gatas: ["gato"],
}

/** The words that count as the typed one: the word itself and, for the few that have one, what the data says instead */
export const alternativesOf = (term: string) => [term, ...(EQUIVALENTS[term] ?? [])]

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
