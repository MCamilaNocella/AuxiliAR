import type { EmergencyNumber } from "@/types/emergency"
import type { ChatTurn } from "./chat"
import { API_URL } from "./apiUrl"

/** waiting: looking for someone · connected: a volunteer took it · ended: someone left, or nobody was found */
/** Who the person would rather talk with */
export type GenderPreference = "woman" | "man" | "any"

export type PeerChatStatus = "waiting" | "connected" | "ended"

export type Volunteer = {
  name: string
  /** "Voluntaria", "Voluntario" */
  role: string
}

export type PeerMessage = {
  /** In order: the client asks for the ones after the last it has */
  id: number
  /** person: whoever asked for help · volunteer · system: the app (someone joined, the chat ended) */
  author: "person" | "volunteer" | "system"
  text: string
  /** Help numbers to show as call buttons under it */
  phones: EmergencyNumber[]
}

export type PeerChat = {
  id: string
  status: PeerChatStatus
  /** Who took the chat; null while waiting */
  volunteer: Volunteer | null
  /** How many could take it, and about how long until someone does (while waiting) */
  availableVolunteers: number
  estimatedWaitSeconds: number
  /** Only the messages after the `after` of the request */
  messages: PeerMessage[]
  volunteerTyping: boolean
}

export type PeerChatRating = "bad" | "okay" | "good"

export type PeerFeedback = {
  rating: PeerChatRating | null
  /** A few words for the volunteer */
  message: string
  /** Something wrong in the chat, for the AuxiliAR team */
  report: string
}

/** The chat is gone on the server (it restarted, or it was forgotten after an hour without activity) */
export class PeerChatGoneError extends Error {}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_URL}/api/peer-chats${path}`, {
    ...init,
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
  })
  if (response.status === 404) throw new PeerChatGoneError()
  if (!response.ok) throw new Error(`Peer chat request failed: ${response.status}`)
  return (response.status === 204 ? undefined : await response.json()) as T
}

const post = <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) })

/**
 * Chat between the person and a volunteer, kept on the server: the client asks for it, then checks every few seconds
 * what's new. For now the volunteer is simulated with AI on the server; with real volunteers this stays the same.
 * `sharedWithAuxi`: the conversation with Auxi, only if the person agreed to share it.
 */
export const startPeerChat = (nickname: string, sharedWithAuxi: ChatTurn[], preference: GenderPreference) =>
  post<PeerChat>("", { nickname, sharedWithAuxi, preference })

/** What's new after the message `after` */
export const getPeerChat = (id: string, after: number) => request<PeerChat>(`/${encodeURIComponent(id)}?after=${after}`)

export const sendPeerMessage = (id: string, text: string, after: number) =>
  post<PeerChat>(`/${encodeURIComponent(id)}/messages?after=${after}`, { text })

/** The person leaves */
export const endPeerChat = (id: string, after: number) => post<PeerChat>(`/${encodeURIComponent(id)}/end?after=${after}`)

/** How it went (the chat is then forgotten) */
export const sendPeerFeedback = (id: string, feedback: PeerFeedback) =>
  post<void>(`/${encodeURIComponent(id)}/feedback`, {
    rating: feedback.rating,
    message: feedback.message.trim() || null,
    report: feedback.report.trim() || null,
  })
