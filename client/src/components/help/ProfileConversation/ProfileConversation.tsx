import { useEffect } from "react"
import { ChatInput } from "../ChatInput"
import { ChatLog, useRevealedMessages } from "../ChatLog"
import { ChatMessage } from "../ChatMessage"
import { ChatQuickReplies } from "../ChatQuickReplies"
import { BACK_LABEL, DEFAULT_PLACEHOLDER, PLACEHOLDERS } from "./ProfileConversation.constants"
import type { ProfileConversationProps } from "./ProfileConversation.types"
import { useProfileConversation } from "./useProfileConversation"

/**
 * The chat completing a Mi Salud profile: Auxi asks, the person writes. The age gets the numeric keyboard and
 * the location suggests localities while typing. Once done, a button goes back to Mi Salud.
 */
export const ProfileConversation = ({ active, task, onClose, onStartedChange }: ProfileConversationProps) => {
  const { messages, typing, thinking, done, field, write } = useProfileConversation(task)
  // Auxi's messages come in one at a time; "Volver a Mi Salud" waits for the last one
  const { shown, pending } = useRevealedMessages(messages, active)

  const started = messages.some((message) => message.from === "user")
  useEffect(() => onStartedChange(started), [started, onStartedChange])

  return (
    <>
      <ChatLog>
        {shown.map((message) => (
          <ChatMessage key={message.id} from={message.from}>
            {message.text}
          </ChatMessage>
        ))}
        {thinking && (
          <ChatMessage from="auxi">
            <span aria-label="Auxi está escribiendo">…</span>
          </ChatMessage>
        )}
        {done && !pending && <ChatQuickReplies label="Terminar" replies={[{ label: BACK_LABEL, onSelect: onClose }]} />}
      </ChatLog>

      {!done && (
        <ChatInput
          placeholder={PLACEHOLDERS[field] ?? DEFAULT_PLACEHOLDER}
          inputMode={field === "age" ? "numeric" : undefined}
          busy={typing}
          suggestZones={field === "location"}
          onSend={write}
        />
      )}
    </>
  )
}
