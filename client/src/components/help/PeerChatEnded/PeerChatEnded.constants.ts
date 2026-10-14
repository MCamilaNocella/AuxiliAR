import { Frown, Meh, Smile } from "lucide-react"
import type { PeerChatRating } from "@/api/peerChat"

export const RATINGS: { value: PeerChatRating, label: string, Icon: typeof Smile }[] = [
  { value: "bad", label: "Mal", Icon: Frown },
  { value: "okay", label: "Más o menos", Icon: Meh },
  { value: "good", label: "Bien", Icon: Smile },
]

export const MESSAGE_MAX_LENGTH = 500
export const REPORT_MAX_LENGTH = 1000
