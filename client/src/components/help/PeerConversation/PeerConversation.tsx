import { Fragment, useState } from "react"
import { ChatEmergencyCalls } from "../ChatEmergencyCalls"
import { ChatInput } from "../ChatInput"
import { ChatLog } from "../ChatLog"
import { ChatMessage } from "../ChatMessage"
import { ChatNote } from "../ChatNote"
import { MAIN_STEP_BUTTON, SEND_ERROR, SIMULATED_NOTICE, VOLUNTEERS_ARE_SIMULATED } from "../PeerChat/PeerChat.constants"
import type { PeerConversationProps } from "./PeerConversation.types"

/** The chat with the volunteer, just the two of them (Auxi steps out) */
export const PeerConversation = ({ volunteer, messages, typing, busy, closed, onClose, onSend }: PeerConversationProps) => {
  const [failed, setFailed] = useState(false)

  const send = async (text: string) => setFailed(!(await onSend(text)))

  return (
    <>
      <ChatLog label={`Conversación con ${volunteer.name}`} withAuxi={false}>
        {VOLUNTEERS_ARE_SIMULATED && (
          <li className="pb-1 text-center text-sm text-muted">{SIMULATED_NOTICE}</li>
        )}
        {messages.map((message) => (
          <Fragment key={message.id}>
            {message.author === "system" ? (
              <ChatNote>{message.text}</ChatNote>
            ) : (
              <ChatMessage from={message.author === "person" ? "user" : "peer"} peerName={volunteer.name}>
                {message.text}
              </ChatMessage>
            )}
            {message.phones.length > 0 && <ChatEmergencyCalls numbers={message.phones} />}
          </Fragment>
        ))}
        {typing && (
          <ChatMessage from="peer" peerName={volunteer.name}>
            <span aria-label={`${volunteer.name} está escribiendo`}>…</span>
          </ChatMessage>
        )}
        {failed && <ChatNote>{SEND_ERROR}</ChatNote>}
      </ChatLog>
      {closed ? (
        <div className="flex flex-col gap-2 border-t border-line p-3">
          <p role="status" className="m-0 text-center text-sm text-muted">
            {volunteer.name} cerró el chat. Ya no se pueden enviar mensajes.
          </p>
          <button type="button" onClick={onClose} className={MAIN_STEP_BUTTON}>
            Cerrar chat
          </button>
        </div>
      ) : (
        <ChatInput placeholder={`Escribile a ${volunteer.name}…`} busy={busy} onSend={send} />
      )}
    </>
  )
}
