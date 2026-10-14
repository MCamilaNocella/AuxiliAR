import { useRef, useState } from "react"
import { ChatConfirm } from "../ChatConfirm"
import { PeerBeforeConnecting } from "../PeerBeforeConnecting"
import { PeerChatEnded } from "../PeerChatEnded"
import { PeerChatHeader } from "../PeerChatHeader"
import { PeerConversation } from "../PeerConversation"
import { PeerNotice } from "../PeerNotice"
import { PeerWaiting } from "../PeerWaiting"
import {
  LEAVE_BACK,
  LEAVE_BEFORE,
  LEAVE_CONFIRM,
  LEAVE_ENDED,
  LEAVE_TITLE,
  LEAVE_WAITING,
  leaveChatMessage,
} from "./PeerChat.constants"
import type { PeerChatProps, PeerStep } from "./PeerChat.types"
import { usePeerChat } from "./usePeerChat"

const TITLES: Record<PeerStep, string> = {
  before: "Hablar con una persona",
  waiting: "Buscando a alguien",
  chat: "Chat con una persona",
  ended: "Chat terminado",
  unavailable: "Hablar con una persona",
}

/**
 * Talking with a volunteer, inside Auxi's chat window: before connecting, waiting, the chat and how it went.
 * Every step has the X, which asks before leaving, and the emergency number (Auxi's own chat doesn't have it).
 */
export const PeerChat = ({ titleId, auxiConversation, onBackToAuxi }: PeerChatProps) => {
  const peer = usePeerChat()
  const [askingToLeave, setAskingToLeave] = useState(false)
  const leaveRef = useRef<HTMLButtonElement>(null)
  const name = peer.volunteer?.name ?? "la persona voluntaria"

  const cancelAndBack = () => {
    peer.cancel()
    onBackToAuxi()
  }

  /** "Salir" in the X's question: what leaving means on each step */
  const leave = () => {
    setAskingToLeave(false)
    if (peer.step === "chat") peer.leave()
    else if (peer.step === "waiting") cancelAndBack()
    else onBackToAuxi()
  }

  const leaveMessage = {
    before: LEAVE_BEFORE,
    waiting: LEAVE_WAITING,
    chat: leaveChatMessage(name),
    ended: LEAVE_ENDED,
    unavailable: LEAVE_BEFORE,
  }[peer.step]

  return (
    <>
      <PeerChatHeader
        titleId={titleId}
        title={TITLES[peer.step]}
        volunteer={peer.step === "chat" ? peer.volunteer : null}
        onBack={peer.step === "before" ? onBackToAuxi : peer.step === "waiting" ? cancelAndBack : undefined}
        // Only from the nickname step on (Auxi's own chat doesn't show it)
        withCall={peer.step !== "unavailable"}
        leaveRef={leaveRef}
        // Nothing to lose when it couldn't even start, or the volunteer already closed it
        onLeave={peer.step === "unavailable" ? onBackToAuxi : peer.step === "chat" && peer.closed ? peer.leave : () => setAskingToLeave(true)}
      />
      <div className="relative flex min-h-0 flex-1 flex-col">
        {peer.step === "before" && (
          <PeerBeforeConnecting busy={peer.busy} onStart={(nickname, share, preference) => peer.start(nickname, share ? auxiConversation : null, preference)} />
        )}
        {peer.step === "waiting" && <PeerWaiting available={peer.waitInfo.available} seconds={peer.waitInfo.seconds} onCancel={cancelAndBack} />}
        {peer.step === "chat" && peer.volunteer && (
          <PeerConversation
            volunteer={peer.volunteer}
            messages={peer.messages}
            typing={peer.typing}
            busy={peer.busy}
            closed={peer.closed}
            onClose={peer.leave}
            onSend={peer.send}
          />
        )}
        {peer.step === "ended" && (
          <PeerChatEnded name={name} onSend={peer.rate} onBack={onBackToAuxi} />
        )}
        {peer.step === "unavailable" && <PeerNotice text={peer.problem} onBack={onBackToAuxi} />}

        {askingToLeave && (
          <ChatConfirm
            title={LEAVE_TITLE}
            message={leaveMessage}
            backLabel={LEAVE_BACK}
            confirmLabel={LEAVE_CONFIRM}
            onBack={() => {
              setAskingToLeave(false)
              leaveRef.current?.focus()
            }}
            onConfirm={leave}
          />
        )}
      </div>
    </>
  )
}
