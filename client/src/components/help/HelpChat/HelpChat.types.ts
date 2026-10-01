import type { ChatAuthor } from "../ChatMessage"

export type HelpChatProps = {
  open: boolean
  onClose: () => void
}

export type MessageDraft = {
  from: ChatAuthor
  text: string
}

export type Message = MessageDraft & { id: number }
