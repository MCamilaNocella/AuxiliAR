import { GENERAL_EMERGENCY_NUMBER } from "@/data/emergency"
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
export const EMERGENCY_REPLY = `Llamá ahora: es gratis y atienden las 24 horas. Si hay riesgo para la vida, llamá al ${GENERAL_EMERGENCY_NUMBER}.`

/** Then Auxi asks what's going on, to find the right first aid guide */
export const EMERGENCY_QUESTION = "¿Qué está pasando? Contame en pocas palabras y te digo qué hacer mientras llega la ayuda."

/** Pause before Auxi's local answers, so they don't feel instant */
export const LOCAL_REPLY_DELAY_MS = 600

/** Shown when the backend can't be reached or the model fails */
export const CONNECTION_ERROR_REPLY = `Perdón, no me pude conectar en este momento. Probá de nuevo en un rato. Si es una emergencia, llamá al ${GENERAL_EMERGENCY_NUMBER}.`

/** Buttons under Auxi's offer to talk with a volunteer */
export const OFFER_LABELS = { yes: "Sí, quiero hablar con alguien", no: "Seguir con Auxi" }

/** When they press "¿Necesitás hablar con alguien?" in the header */
export const PERSON_OFFER = "¿Querés hablar con alguien? Te puedo conectar con una persona voluntaria para charlar. Yo sigo acá igual."

/** Answer to "Seguir con Auxi" */
export const KEEP_WITH_AUXI_REPLY = "Dale, sigo acá con vos. Contame, ¿en qué te puedo ayudar?"

/** When they come back from the chat with a person */
export const WELCOME_BACK_REPLY = "Acá estoy de nuevo. ¿En qué más te puedo ayudar?"

/** What the model reads before that welcome (the person doesn't see it): so it doesn't offer a volunteer again */
export const BACK_FROM_PERSON_NOTE =
  "(La persona ya habló con una persona voluntaria y volvió al chat con Auxi: no le vuelvas a ofrecer hablar con una persona ni marques offerPerson, salvo que te lo pida.)"

export const INPUT_PLACEHOLDER = "Escribí tu mensaje…"

/** When Auxi asks where they are (the field suggests localities) */
export const LOCATION_PLACEHOLDER = "Escribí tu localidad…"
