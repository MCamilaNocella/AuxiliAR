import type { Ref } from "react"
import type { Volunteer } from "@/api/peerChat"

export type PeerChatHeaderProps = {
  /** id that names the chat window */
  titleId: string
  /** The step's title; with a volunteer, their name and role instead */
  title: string
  volunteer?: Volunteer | null
  /** Shows the back arrow (steps before the chat) */
  onBack?: () => void
  /** Shows the emergency number (every step but the notice that it couldn't start) */
  withCall?: boolean
  /** The X: asks before leaving */
  onLeave: () => void
  /** To give the focus back to the X when the question closes */
  leaveRef?: Ref<HTMLButtonElement>
}
