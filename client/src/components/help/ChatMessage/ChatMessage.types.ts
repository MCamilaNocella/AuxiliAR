import type { ReactNode } from "react"

/** auxi · user: whoever uses AuxiliAR · peer: the volunteer, in a chat between people */
export type ChatAuthor = "auxi" | "user" | "peer"

export type ChatMessageProps = {
  from: ChatAuthor
  /** The volunteer's name, for its avatar (initial) and screen readers; only with from="peer" */
  peerName?: string
  children: ReactNode
}
