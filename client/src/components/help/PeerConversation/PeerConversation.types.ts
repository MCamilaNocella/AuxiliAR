import type { PeerMessage, Volunteer } from "@/api/peerChat"

export type PeerConversationProps = {
  volunteer: Volunteer
  messages: PeerMessage[]
  /** The volunteer is writing */
  typing: boolean
  /** A message is on its way */
  busy: boolean
  /** The volunteer closed the chat: no more writing, a button to close it instead */
  closed: boolean
  /** "Cerrar chat", once it's closed */
  onClose: () => void
  /** Resolves false if it couldn't be sent */
  onSend: (text: string) => Promise<boolean>
}
