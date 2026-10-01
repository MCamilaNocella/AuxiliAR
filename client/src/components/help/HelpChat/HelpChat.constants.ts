import type { MessageDraft } from "./HelpChat.types"

/** What Auxi says when the chat opens */
export const WELCOME_MESSAGES: MessageDraft[] = [
  { from: "auxi", text: "¡Hola, soy Auxi!" },
  { from: "auxi", text: "¿En qué puedo ayudarte?" },
]

/* Sketch: Auxi doesn't understand messages yet, it always answers this */
export const PLACEHOLDER_REPLY = "¡Gracias por escribirme! Todavía estoy aprendiendo a responder. Mientras tanto, podés buscar en los temas de AuxiliAR."

export const INPUT_PLACEHOLDER = "Escribí tu mensaje…"

/** Pause before Auxi answers, so the "typing" dots show */
export const REPLY_DELAY_MS = 900
