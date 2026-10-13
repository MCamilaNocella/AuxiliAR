import type { ProfileTask } from "@/stores/helpChatStore"

export type ProfileConversationProps = {
  /** The chat is open: Auxi's messages only come in while it's on screen */
  active: boolean
  task: ProfileTask
  /** "Volver a Mi Salud" once everything was asked */
  onClose: () => void
  /** Whether the person already answered something (starting over would lose it) */
  onStartedChange: (started: boolean) => void
}

/** Who the questions are about: "vos" on your own profile, the name on a relative's */
export type ProfileSubject = {
  own: boolean
  name: string
}
