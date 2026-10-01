import { useEffect, useState } from "react"
import { PLACEHOLDER_REPLY, REPLY_DELAY_MS, WELCOME_MESSAGES } from "./HelpChat.constants"
import type { Message, MessageDraft } from "./HelpChat.types"

let lastId = 0
const withId = (draft: MessageDraft): Message => ({ ...draft, id: ++lastId })

/** Conversation with Auxi (sketch: it always answers the same, after a short "typing" pause) */
export const useHelpChat = () => {
  const [messages, setMessages] = useState<Message[]>(() => WELCOME_MESSAGES.map(withId))
  // Auxi's messages still to come, one at a time while the "typing" dots show
  const [queue, setQueue] = useState<MessageDraft[]>([])
  const typing = queue.length > 0

  useEffect(() => {
    if (queue.length === 0) return
    const timer = setTimeout(() => {
      setMessages((current) => [...current, withId(queue[0])])
      setQueue((current) => current.slice(1))
    }, REPLY_DELAY_MS)
    return () => clearTimeout(timer)
  }, [queue])

  const write = (text: string) => {
    setMessages((current) => [...current, withId({ from: "user", text })])
    setQueue((current) => [...current, { from: "auxi", text: PLACEHOLDER_REPLY }])
  }

  return { messages, typing, write }
}
