/** Lowercase and without accents, so "Odontología" and "odontologia" are the same thing when searching */
export const normalizeText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
