import { useCallback, useEffect, useRef, useState } from "react"
import type { ChatTurn } from "@/api/chat"
import {
  endPeerChat,
  getPeerChat,
  PeerChatGoneError,
  sendPeerFeedback,
  sendPeerMessage,
  startPeerChat,
  type GenderPreference,
  type PeerChat,
  type PeerFeedback,
  type PeerMessage,
  type Volunteer,
} from "@/api/peerChat"
import { CHAT_LOST, MAX_SHARED_MESSAGES, NOBODY_AVAILABLE, POLL_EVERY_MS } from "./PeerChat.constants"
import type { PeerStep } from "./PeerChat.types"

/**
 * One chat with a volunteer, from asking for it to saying how it went. The server keeps the chat: this asks it
 * every POLL_EVERY_MS what's new while waiting or chatting, so it works the same once volunteers are real people.
 */
export const usePeerChat = () => {
  const [step, setStep] = useState<PeerStep>("before")
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null)
  const [waitInfo, setWaitInfo] = useState({ available: 0, seconds: 0 })
  const [messages, setMessages] = useState<PeerMessage[]>([])
  const [typing, setTyping] = useState(false)
  const [busy, setBusy] = useState(false)
  // The volunteer closed the chat: nobody can write anymore, the person closes it when they're ready
  const [closed, setClosed] = useState(false)
  // Why the chat can't go on (step "unavailable")
  const [problem, setProblem] = useState("")
  const idRef = useRef<string | null>(null)
  const lastIdRef = useRef(0)

  /** What the server says: new messages added once, and the step follows its status */
  const apply = useCallback((chat: PeerChat) => {
    const newer = chat.messages.filter((message) => message.id > lastIdRef.current)
    if (newer.length > 0) {
      lastIdRef.current = newer[newer.length - 1].id
      setMessages((current) => [...current, ...newer])
    }
    setVolunteer(chat.volunteer)
    setTyping(chat.volunteerTyping)
    if (chat.status === "connected") setStep((current) => (current === "waiting" ? "chat" : current))
    // The volunteer said goodbye and closed it
    if (chat.status === "ended" && chat.volunteer) setClosed(true)
    // Ended without anyone taking it
    if (chat.status === "ended" && !chat.volunteer) {
      setProblem(NOBODY_AVAILABLE)
      setStep((current) => (current === "waiting" ? "unavailable" : current))
    }
  }, [])

  const lost = useCallback((error: unknown) => {
    if (!(error instanceof PeerChatGoneError)) return false
    setProblem(CHAT_LOST)
    setStep("unavailable")
    return true
  }, [])

  // Asks what's new while there's someone to wait for (a failed check just waits for the next one)
  useEffect(() => {
    if ((step !== "waiting" && step !== "chat") || closed) return
    const timer = setInterval(() => {
      const id = idRef.current
      if (!id) return
      getPeerChat(id, lastIdRef.current).then(apply, lost)
    }, POLL_EVERY_MS)
    return () => clearInterval(timer)
  }, [step, closed, apply, lost])

  /** "Buscar a alguien" */
  const start = async (nickname: string, sharedWithAuxi: ChatTurn[] | null, preference: GenderPreference) => {
    setBusy(true)
    try {
      const chat = await startPeerChat(nickname, (sharedWithAuxi ?? []).slice(-MAX_SHARED_MESSAGES), preference)
      idRef.current = chat.id
      setWaitInfo({ available: chat.availableVolunteers, seconds: chat.estimatedWaitSeconds })
      setStep("waiting")
      apply(chat)
    } catch {
      setProblem(NOBODY_AVAILABLE)
      setStep("unavailable")
    } finally {
      setBusy(false)
    }
  }

  /** The person writes: false if it couldn't be sent */
  const send = async (text: string) => {
    const id = idRef.current
    if (!id) return false
    setBusy(true)
    try {
      apply(await sendPeerMessage(id, text, lastIdRef.current))
      return true
    } catch (error) {
      lost(error)
      return false
    } finally {
      setBusy(false)
    }
  }

  /** Leaving the chat (then, how it went); if the volunteer already closed it, only the latter */
  const leave = async () => {
    setStep("ended")
    if (closed) return
    const id = idRef.current
    if (id) await endPeerChat(id, lastIdRef.current).then(apply, () => undefined)
  }

  /** Stops looking for someone (the server forgets it) */
  const cancel = () => {
    const id = idRef.current
    if (id) endPeerChat(id, lastIdRef.current).catch(() => undefined)
  }

  /** How it went: sent without waiting, it's never a reason to stay */
  const rate = (feedback: PeerFeedback) => {
    const id = idRef.current
    if (id) sendPeerFeedback(id, feedback).catch(() => undefined)
  }

  return { step, setStep, closed, volunteer, waitInfo, messages, typing, busy, problem, start, send, leave, cancel, rate }
}
