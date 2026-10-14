/** How often the chat asks the server what's new */
export const POLL_EVERY_MS = 1500

/**
 * While there are no real volunteers, an AI plays them: the person is told so before connecting and in the chat.
 * When real volunteers answer, this goes false (and the notices go away).
 */
export const VOLUNTEERS_ARE_SIMULATED = true

export const SIMULATED_NOTICE = "Por ahora te responde una inteligencia artificial que hace de persona voluntaria, mientras se suman las personas reales."

/** The X's question on each step: what happens if they leave */
export const LEAVE_TITLE = "¿Salir de la conversación?"
export const LEAVE_BACK = "Seguir en el chat"
export const LEAVE_CONFIRM = "Salir"
export const LEAVE_BEFORE = "No te conectamos con nadie y volvés al chat con Auxi."
export const LEAVE_WAITING = "Dejamos de buscar y volvés al chat con Auxi."
export const LEAVE_ENDED = "Volvés al chat con Auxi sin contarnos cómo te fue."
export const leaveChatMessage = (name: string) => `Se termina el chat con ${name}.`

/** When the chat can't go on */
export const NOBODY_AVAILABLE = "No encontramos a nadie disponible en este momento. Probá de nuevo en un rato: Auxi sigue acá."
export const CHAT_LOST = "Se cortó la conversación. Podés volver con Auxi y pedir hablar con alguien de nuevo."
export const SEND_ERROR = "No se pudo enviar tu mensaje. Probá de nuevo."

/** Messages sent to Auxi's model along with the chat, at most (the server takes 40) */
export const MAX_SHARED_MESSAGES = 40

/** Buttons at the bottom of each step (the chat's buttons are round) */
export const MAIN_STEP_BUTTON =
  "flex min-h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-brand px-4 text-base font-bold text-on-brand transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
export const SOFT_STEP_BUTTON =
  "flex min-h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-field px-4 text-base font-bold text-ink transition-colors hover:bg-brand-soft in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-control-line"
