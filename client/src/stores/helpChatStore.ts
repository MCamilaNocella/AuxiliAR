import type { ProfileFieldKey } from "@/types/myHealth"

/** Completing a Mi Salud profile with Auxi: the data to ask for, one at a time, in this order */
export type ProfileTask = {
  profileId: string
  fields: ProfileFieldKey[]
  /** The profile was already complete: Auxi goes over the data to update it ("si sigue igual, pasamos") */
  update?: boolean
}

type HelpChatState = {
  open: boolean
  /** Set: the chat is completing a profile instead of the usual conversation */
  task: ProfileTask | null
  /** A new number = a brand new conversation */
  conversation: number
}

let state: HelpChatState = { open: false, task: null, conversation: 0 }

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
  startOver: () => set({ task: null, conversation: state.conversation + 1 }),
}
