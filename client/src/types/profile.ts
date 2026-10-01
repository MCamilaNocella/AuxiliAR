/**
 * What's known about the person, gathered by Auxi's chat (and later shown and edited in Mi Salud).
 * Any field may be unknown.
 */
export type Profile = {
  province: string | null
  locality: string | null
  /** Age of whoever needed help */
  age: number | null
  /** Who that age refers to: "vos", "abuelo", "mamá"... */
  person: string | null
}
