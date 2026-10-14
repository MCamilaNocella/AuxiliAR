import type { PeerFeedback } from "@/api/peerChat"

export type PeerChatEndedProps = {
  /** Who they talked to */
  name: string
  /** "Enviar": how it went (only when they said something) */
  onSend: (feedback: PeerFeedback) => void
  /** "Volver con Auxi" */
  onBack: () => void
}
