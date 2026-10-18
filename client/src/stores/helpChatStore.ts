import type { ChatTurn } from "@/api/chat"
import type { ProfileFieldKey } from "@/types/myHealth"

/** Completing a Mi Salud profile with Auxi: the data to ask for, one at a time, in this order */
export type ProfileTask = {
  profileId: string
  fields: ProfileFieldKey[]
  /** The profile was already complete: Auxi goes over the data to update it ("si sigue igual, pasamos") */
  update?: boolean
}

/** Talking with a volunteer, away from Auxi's conversation (which waits underneath) */
export type PersonTalk = {
  /** A new number = a brand new chat with a person */
  id: number
  /** Auxi's conversation so far, to share with the volunteer if the person agrees */
  auxiConversation: ChatTurn[]
}

type HelpChatState = {
  open: boolean
  /** Set: the chat is completing a profile instead of the usual conversation */
  task: ProfileTask | null
  /** A new number = a brand new conversation */
  conversation: number
  /** Set: the chat shows the chat with a volunteer instead of Auxi's */
  person: PersonTalk | null
  /** "¿Querés hablar con alguien?" was pressed: Auxi's conversation asks it as soon as it's on screen */
  personOfferPending: boolean
}

let state: HelpChatState = { open: false, task: null, conversation: 0, person: null, personOfferPending: false }

const listeners = new Set<() => void>()

const set = (changes: Partial<HelpChatState>) => {
  state = { ...state, ...changes }
  listeners.forEach((listener) => listener())
}

/** Auxi's chat, openable from anywhere (Auxi floating, Mi Salud). Compatible with useSyncExternalStore. */
export const helpChatStore = {
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  getSnapshot: () => state,
  /** Opens the chat as it was left */
  open: () => set({ open: true }),
  close: () => set({ open: false }),
  /** Opens a new conversation that asks for these profile data */
  completeProfile: (task: ProfileTask) => set({ open: true, task, conversation: state.conversation + 1 }),
  /** "Nuevo chat": back to the usual conversation */
  startOver: () => set({ task: null, conversation: state.conversation + 1, person: null }),
  /** "Sí, quiero hablar con alguien": the steps to connect with a volunteer */
  talkToPerson: (auxiConversation: ChatTurn[]) => set({ person: { id: (state.person?.id ?? 0) + 1, auxiConversation } }),
  /** Back to Auxi's conversation, as it was left */
  backToAuxi: () => set({ person: null }),
  /**
   * "¿Querés hablar con alguien?" (header): opens the chat and Auxi asks whether they want a volunteer. Already talking
   * with one: it just opens. Completing a Mi Salud profile: back to the usual conversation first.
   */
  askAboutPerson: () =>
    set(
      state.person
        ? { open: true }
        : { open: true, personOfferPending: true, ...(state.task && { task: null, conversation: state.conversation + 1 }) },
    ),
  /** Auxi asked it */
  personOfferShown: () => set({ personOfferPending: false }),
}
