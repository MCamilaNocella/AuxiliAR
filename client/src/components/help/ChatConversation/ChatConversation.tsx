import { Fragment, useEffect, useRef } from "react"
import { GENERAL_EMERGENCY_NUMBER } from "@/data/emergency"
import { describeHelpLine } from "@/utils/helpLines"
import { ChatEmergencyCalls } from "../ChatEmergencyCalls"
import { ChatInput } from "../ChatInput"
import { ChatLinks } from "../ChatLinks"
import { ChatLog, useRevealedMessages } from "../ChatLog"
import { ChatMessage } from "../ChatMessage"
import { ChatQuickReplies } from "../ChatQuickReplies"
import { EMERGENCY_LABELS, INPUT_PLACEHOLDER, LOCATION_PLACEHOLDER, OFFER_LABELS } from "./ChatConversation.constants"
import type { ChatConversationProps } from "./ChatConversation.types"
import { useChatConversation } from "./useChatConversation"

/** The national mental health line, said next to the offer to talk with a person */
const MENTAL_HEALTH_LINE = describeHelpLine("urgencias-salud-mental-0800")

/** One conversation with Auxi: the messages and the field to write. A new chat is a new instance of it */
export const ChatConversation = ({
  active,
  onNavigate,
  onStartedChange,
  away = false,
  personOfferPending = false,
  onPersonOfferShown,
  onTalkToPerson,
}: ChatConversationProps) => {
  const {
    messages,
    typing,
    thinking,
    askingEmergency,
    offeringPerson,
    asksLocation,
    answerEmergency,
    keepWithAuxi,
    acceptPerson,
    offerPerson,
    welcomeBack,
    write,
  } = useChatConversation()
  // Auxi's messages come in one at a time; the buttons wait for the question they answer
  const { shown, pending } = useRevealedMessages(messages, active)

  const started = messages.some((message) => message.from === "user")
  useEffect(() => onStartedChange(started), [started, onStartedChange])

  // Asked from the header: once, when the chat is on screen and Auxi isn't answering something
  useEffect(() => {
    if (!personOfferPending || !active || typing) return
    if (!offeringPerson) offerPerson()
    onPersonOfferShown?.()
  }, [personOfferPending, active, typing, offeringPerson, offerPerson, onPersonOfferShown])

  // Coming back from the chat with a person
  const wasAway = useRef(away)
  useEffect(() => {
    if (wasAway.current && !away) welcomeBack()
    wasAway.current = away
  }, [away, welcomeBack])

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
      {offeringPerson && !pending && (
        <>
          <ChatQuickReplies
            label="¿Querés hablar con una persona voluntaria?"
            replies={[
              { label: OFFER_LABELS.yes, onSelect: () => onTalkToPerson?.(acceptPerson()) },
              { label: OFFER_LABELS.no, onSelect: keepWithAuxi },
            ]}
          />
          <li className="rounded-xl bg-alert-soft p-2.5 text-sm font-bold text-alert-text motion-safe:animate-message-in">
            Si estás en peligro ahora, llamá al {GENERAL_EMERGENCY_NUMBER} o al {MENTAL_HEALTH_LINE.display}.
          </li>
        </>
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
