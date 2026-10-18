import type { EmergencyNumber } from "@/types/emergency"
import type { ChatLink, ChatTurn } from "@/api/chat"
import type { ChatAuthor } from "../ChatMessage"

export type ChatConversationProps = {
  /** The chat is open: Auxi's messages only come in while it's on screen */
  active: boolean
  /** Going to a suggested page (the chat closes, so the page shows) */
  onNavigate: () => void
  /** Whether the person already said something (starting over would lose it) */
  onStartedChange: (started: boolean) => void
  /** Talking with a volunteer: this conversation waits hidden, and Auxi welcomes them back */
  away?: boolean
  /** Auxi has to ask whether they want a volunteer ("¿Querés hablar con alguien?" was pressed) */
  personOfferPending?: boolean
  /** It asked */
  onPersonOfferShown?: () => void
  /** "Sí, quiero hablar con alguien", with the conversation so far (to share with the volunteer if they agree) */
  onTalkToPerson?: (conversation: ChatTurn[]) => void
}

export type MessageDraft = {
  from: ChatAuthor
  text: string
  /** AuxiliAR pages Auxi suggests with this answer */
  links?: ChatLink[]
  /** Numbers to call, shown as buttons under this message */
  phones?: EmergencyNumber[]
}

export type Message = MessageDraft & { id: number }
