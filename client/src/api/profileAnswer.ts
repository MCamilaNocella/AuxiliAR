import type { ProfileFieldKey } from "@/types/myHealth"
import { API_URL } from "./apiUrl"
import type { ChatTurn } from "./chat"

/** Auxi's take on one answer while completing a Mi Salud profile */
export type ProfileAnswerReply = {
  /** A short acknowledgement, or the question asked again */
  reply: string
  /** The data to save (the age as digits), for every field but the location */
  value: string | null
  /** When the location was asked */
  locality: string | null
  province: string | null
  /** They don't know it or prefer not to say: move on without saving */
  skipped: boolean
}

/**
 * Sends the person's answer about one piece of profile data; the model reads it (see server prompts/perfil.md).
 * `exchange`: Auxi's question, the answers and any question asked again, the last one being the person's.
 */
export const sendProfileAnswer = async (field: ProfileFieldKey, exchange: ChatTurn[]): Promise<ProfileAnswerReply> => {
  const response = await fetch(`${API_URL}/api/profile/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ field, messages: exchange }),
  })
  if (!response.ok) throw new Error(`Profile answer request failed: ${response.status}`)
  return (await response.json()) as ProfileAnswerReply
}
