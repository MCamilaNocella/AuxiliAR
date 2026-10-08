import { useEffect, useRef, useState } from "react"
import type { ChatAuthor } from "../ChatMessage"
import { MESSAGE_GAP_MS } from "./ChatLog.constants"

/**
 * Shows a conversation's messages one at a time: when Auxi says several things in a row, each one comes
 * MESSAGE_GAP_MS after the previous one instead of all at once.
 * The person's own messages and Auxi's first answer to them show right away.
 * Only while `active` (the chat is open): the conversation exists while closed too, and opening it should
 * still show the messages coming in, not all of them already there.
 * `pending`: some of Auxi's messages are still waiting their turn.
 */
export const useRevealedMessages = <T extends { from: ChatAuthor }>(messages: T[], active: boolean) => {
  const [count, setCount] = useState(0)
  const lastShownAt = useRef(0)

  useEffect(() => {
    if (!active || count >= messages.length) return
    const previous = messages[count - 1]
    const inARow = previous?.from === "auxi" && messages[count].from === "auxi"
    const delay = inARow ? Math.max(0, lastShownAt.current + MESSAGE_GAP_MS - Date.now()) : 0
    const timer = setTimeout(() => {
      lastShownAt.current = Date.now()
      setCount(count + 1)
    }, delay)
    return () => clearTimeout(timer)
  }, [active, count, messages])

  return { shown: messages.slice(0, count), pending: count < messages.length }
}
