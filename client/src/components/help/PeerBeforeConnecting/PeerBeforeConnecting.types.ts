import type { GenderPreference } from "@/api/peerChat"

export type PeerBeforeConnectingProps = {
  /** Asking the server for a chat */
  busy: boolean
  /** "Buscar a alguien": the nickname, whether to share what they told Auxi and who they'd rather talk with */
  onStart: (nickname: string, share: boolean, preference: GenderPreference) => void
}
