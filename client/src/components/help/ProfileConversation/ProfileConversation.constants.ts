import type { ProfileFieldKey } from "@/types/myHealth"
import type { ProfileSubject } from "./ProfileConversation.types"

export const GREETING = "¡Hola, soy Auxi!"

export const intro = ({ own, name }: ProfileSubject, update = false) =>
  update
    ? `Actualicemos ${own ? "tu perfil" : `el perfil de ${name}`}. Si algo sigue igual, decímelo y pasamos a lo siguiente.`
    : own
      ? "Completemos tu perfil."
      : `Completemos el perfil de ${name}.`

/** Auxi's question for each piece of data; the model then reads the answer (server prompts/perfil.md) */
export const QUESTIONS: Record<ProfileFieldKey, (subject: ProfileSubject) => string> = {
  name: ({ own }) => (own ? "¿Cómo te llamás?" : "¿Cómo se llama?"),
  age: ({ own, name }) => (own ? "¿Cuántos años tenés?" : `¿Cuántos años tiene ${name}?`),
  bloodType: ({ own, name }) =>
    `¿Cuál es ${own ? "tu grupo sanguíneo" : `el grupo sanguíneo de ${name}`}? Por ejemplo: 0+ o A-. Si no lo sabés, no pasa nada.`,
  allergies: ({ own, name }) =>
    `¿${own ? "Tenés" : `${name} tiene`} alguna alergia? A medicamentos, alimentos u otra cosa.`,
  contact: ({ own, name }) =>
    `¿A quién hay que llamar si ${own ? "tenés" : `${name} tiene`} una emergencia? Decime su nombre y su teléfono.`,
  insurance: ({ own, name }) => `¿${own ? "Tenés" : `${name} tiene`} obra social o prepaga? ¿Cuál?`,
  location: ({ own, name }) => (own ? "¿En qué localidad vivís?" : `¿En qué localidad vive ${name}?`),
}

/** Placeholder of the text field while each piece of data is asked */
export const PLACEHOLDERS: Partial<Record<ProfileFieldKey, string>> = {
  age: "Escribí la edad…",
  location: "Escribí la localidad…",
}

export const DEFAULT_PLACEHOLDER = "Escribí tu respuesta…"

/** At the end, depending on whether something was saved */
export const CLOSING = {
  saved: "Eso es todo, ¡gracias! Ya quedó guardado en el perfil.",
  nothing: "No hay problema. Cuando quieras, lo completamos.",
  /** Updating and nothing changed */
  unchanged: "Perfecto, queda todo como estaba.",
}

export const BACK_LABEL = "Volver a Mi Salud"

/** Shown when the backend can't be reached or the model fails: the same question stays open */
export const CONNECTION_ERROR_REPLY = "Perdón, no me pude conectar en este momento. Probá de nuevo en un rato."
