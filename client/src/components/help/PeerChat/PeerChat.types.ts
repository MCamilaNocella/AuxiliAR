import type { ChatTurn } from "@/api/chat"

export type PeerChatProps = {
  /** id for the title of the chat window (it names the dialog) */
  titleId: string
  /** Auxi's conversation so far, shared with the volunteer if the person agrees */
  auxiConversation: ChatTurn[]
  /** Back to Auxi's conversation */
  onBackToAuxi: () => void
}

/**
 * before: what to expect, nickname, sharing · waiting: looking for someone · chat · ended: how it went
 * · unavailable: nobody took it, or the chat was lost
 */
export type PeerStep = "before" | "waiting" | "chat" | "ended" | "unavailable"
