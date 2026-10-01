import type { MessageDraft } from "./ChatConversation.types"

/** What Auxi says when the chat opens */
export const WELCOME_MESSAGES: MessageDraft[] = [
  { from: "auxi", text: "¡Hola, soy Auxi!" },
  { from: "auxi", text: "Antes de empezar, ¿estás en una situación de emergencia en este momento?" },
]

export const EMERGENCY_LABELS = { yes: "Sí", no: "No" }

/** Answers to the "No" button (one at random): the chat starts as usual */
export const NO_EMERGENCY_REPLIES = [
  "¡Qué bueno! ¿En qué puedo ayudarte?",
  "Perfecto, me alegra. ¿En qué puedo ayudarte?",
  "Qué bueno saberlo. ¿En qué puedo ayudarte?",
  "Me alegra. Contame, ¿en qué puedo ayudarte?",
  "Bueno, me alegro. ¿En qué puedo ayudarte?",
  "Genial, entonces. ¿En qué puedo ayudarte?",
  "Qué bueno que estés bien. ¿En qué puedo ayudarte?",
  "Me alegra saberlo. Contame, ¿en qué puedo ayudarte?",
]

/** Answer to "Sí": the numbers to call show right under it */
export const EMERGENCY_REPLY = "Llamá ahora: es gratis y atienden las 24 horas. Si hay riesgo para la vida, el 107 manda una ambulancia."

/** Then Auxi asks what's going on, to find the right first aid guide */
export const EMERGENCY_QUESTION = "¿Qué está pasando? Contame en pocas palabras y te digo qué hacer mientras llega la ayuda."

/** Shown right after each message sent to Auxi, while it works on the answer (one at random, never the same twice in a row) */
export const WORKING_MESSAGES = [
  "Déjame pensar un momento...",
  "Estoy buscando la mejor forma de ayudarte...",
  "Un momento, estoy buscando información para vos...",
  "Estoy revisando la información para ayudarte mejor...",
]

/** Pause before Auxi's local answers, so they don't feel instant */
export const LOCAL_REPLY_DELAY_MS = 600

/** Shown when the backend can't be reached or the model fails */
export const CONNECTION_ERROR_REPLY = "Perdón, no me pude conectar en este momento. Probá de nuevo en un rato. Si es una emergencia, llamá al 107."

export const INPUT_PLACEHOLDER = "Escribí tu mensaje…"

/** When Auxi asks where they are (the field suggests localities) */
export const LOCATION_PLACEHOLDER = "Escribí tu localidad…"
