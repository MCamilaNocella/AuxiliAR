import type { EmergencyNumber } from "@/types/emergency"
import type { ChatLink } from "@/api/chat"
import type { ChatAuthor } from "../ChatMessage"

export type ChatConversationProps = {
  /** Going to a suggested page (the chat closes, so the page shows) */
  onNavigate: () => void
  /** Whether the person already said something (starting over would lose it) */
  onStartedChange: (started: boolean) => void
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
