import { Fragment, useEffect, useRef } from "react"
import { Auxi } from "../Auxi"
import { ChatEmergencyCalls } from "../ChatEmergencyCalls"
import { ChatInput } from "../ChatInput"
import { ChatLinks } from "../ChatLinks"
import { ChatMessage } from "../ChatMessage"
import { ChatQuickReplies } from "../ChatQuickReplies"
import { EMERGENCY_LABELS, INPUT_PLACEHOLDER, LOCATION_PLACEHOLDER } from "./ChatConversation.constants"
import type { ChatConversationProps } from "./ChatConversation.types"
import { useChatConversation } from "./useChatConversation"

/** One conversation with Auxi: the messages and the field to write. A new chat is a new instance of it */
export const ChatConversation = ({ onNavigate, onStartedChange }: ChatConversationProps) => {
  const logRef = useRef<HTMLOListElement>(null)
  const { messages, typing, askingEmergency, asksLocation, answerEmergency, write } = useChatConversation()

  const started = messages.some((message) => message.from === "user")
  useEffect(() => onStartedChange(started), [started, onStartedChange])

  // Keep the latest message in view
  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [messages, typing, askingEmergency])

  return (
    <>
    <ol
      ref={logRef}
      role="log"
      aria-label="Conversación con Auxi"
      className="m-0 flex min-h-0 flex-1 list-none flex-col gap-3 overflow-y-auto overscroll-contain p-4"
    >
      {/* Auxi waving on top; the greeting itself is the first message */}
      <li className="flex flex-col items-center gap-2 pb-2 text-center">
        {/* Nudged left: the waving hand fills the left side of the drawing, this centers Auxi's body */}
        <Auxi className="size-24 -translate-x-[10%]" />
        <span className="text-sm text-muted">No reemplazo una consulta médica. En una emergencia, llamá al 107.</span>
      </li>
      {messages.map((message) => (
        <Fragment key={message.id}>
          <ChatMessage from={message.from}>{message.text}</ChatMessage>
          {/* Going to a page closes the chat, so the page shows */}
          {message.links && message.links.length > 0 && <ChatLinks links={message.links} onNavigate={onNavigate} />}
          {message.phones && message.phones.length > 0 && <ChatEmergencyCalls numbers={message.phones} />}
        </Fragment>
      ))}
      {askingEmergency && (
        <ChatQuickReplies
          label="¿Estás en una emergencia?"
          replies={[
            { label: EMERGENCY_LABELS.yes, onSelect: () => answerEmergency(true) },
            { label: EMERGENCY_LABELS.no, onSelect: () => answerEmergency(false) },
          ]}
        />
      )}
      {typing && (
        <ChatMessage from="auxi">
          <span aria-label="Auxi está escribiendo">…</span>
        </ChatMessage>
      )}
    </ol>

    <ChatInput
        placeholder={asksLocation ? LOCATION_PLACEHOLDER : INPUT_PLACEHOLDER}
        busy={typing}
        suggestZones={asksLocation}
        onSend={write}
      />
    </>
  )
}
