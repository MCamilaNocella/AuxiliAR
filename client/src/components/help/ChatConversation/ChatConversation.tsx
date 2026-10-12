import { Fragment, useEffect } from "react"
import { ChatEmergencyCalls } from "../ChatEmergencyCalls"
import { ChatInput } from "../ChatInput"
import { ChatLinks } from "../ChatLinks"
import { ChatLog, useRevealedMessages } from "../ChatLog"
import { ChatMessage } from "../ChatMessage"
import { ChatQuickReplies } from "../ChatQuickReplies"
import { EMERGENCY_LABELS, INPUT_PLACEHOLDER, LOCATION_PLACEHOLDER } from "./ChatConversation.constants"
import type { ChatConversationProps } from "./ChatConversation.types"
import { useChatConversation } from "./useChatConversation"

/** One conversation with Auxi: the messages and the field to write. A new chat is a new instance of it */
export const ChatConversation = ({ active, onNavigate, onStartedChange }: ChatConversationProps) => {
  const { messages, typing, thinking, askingEmergency, asksLocation, answerEmergency, write } = useChatConversation()
  // Auxi's messages come in one at a time; the buttons wait for the question they answer
  const { shown, pending } = useRevealedMessages(messages, active)

  const started = messages.some((message) => message.from === "user")
  useEffect(() => onStartedChange(started), [started, onStartedChange])

  return (
    <>
    <ChatLog>
      {shown.map((message) => (
        <Fragment key={message.id}>
          <ChatMessage from={message.from}>{message.text}</ChatMessage>
          {/* Going to a page closes the chat, so the page shows */}
          {message.links && message.links.length > 0 && <ChatLinks links={message.links} onNavigate={onNavigate} />}
          {message.phones && message.phones.length > 0 && <ChatEmergencyCalls numbers={message.phones} />}
        </Fragment>
      ))}
      {askingEmergency && !pending && (
        <ChatQuickReplies
          label="¿Estás en una emergencia?"
          replies={[
            { label: EMERGENCY_LABELS.yes, onSelect: () => answerEmergency(true) },
            { label: EMERGENCY_LABELS.no, onSelect: () => answerEmergency(false) },
          ]}
        />
      )}
      {thinking && (
        <ChatMessage from="auxi">
          <span aria-label="Auxi está escribiendo">…</span>
        </ChatMessage>
      )}
    </ChatLog>

    <ChatInput
        placeholder={asksLocation ? LOCATION_PLACEHOLDER : INPUT_PLACEHOLDER}
        busy={typing}
        suggestZones={asksLocation}
        onSend={write}
      />
    </>
  )
}
