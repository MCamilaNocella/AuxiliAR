import type { EmergencyNumber } from "@/types/emergency"
import type { Profile } from "@/types/profile"

/**
 * Backend base URL: VITE_API_URL (a repo variable in the GitHub Pages build, or client/.env locally),
 * the local Spring server if it's unset or empty. No trailing slash, so paths join cleanly.
 */
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/+$/, "")

/** An AuxiliAR page related to the question */
export type ChatLink = {
  title: string
  /** App path, e.g. /temas/salud-fisica */
  path: string
}

export type ChatReply = {
  /** The answer as one or more chat bubbles, in order */
  replies: string[]
  links: ChatLink[]
  /** Auxi decided it's an emergency */
  emergency: boolean
  /** Help numbers Auxi chose for this situation, shown as call buttons */
  phones: EmergencyNumber[]
  /** What's known about the person so far (province, locality, age), to keep */
  profile: Profile
  /** The answer asks where they are: the text field suggests localities */
  asksLocation: boolean
}

export type ChatTurn = {
  role: "user" | "assistant"
  text: string
}

/**
 * Sends the conversation to Auxi (Spring + LangGraph4j + the model) and returns its answer.
 * `emergencyButton`: the person pressed "Sí" when asked whether it's an emergency.
 * `profile`: what's already known about the person, so Auxi doesn't ask again.
 */
export const sendChat = async (messages: ChatTurn[], emergencyButton: boolean, profile: Profile): Promise<ChatReply> => {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, emergency: emergencyButton, profile }),
  })
  if (!response.ok) throw new Error(`Chat request failed: ${response.status}`)
  return (await response.json()) as ChatReply
}
