import type { ReactNode } from "react"

export type SpeechBubbleProps = {
  children: ReactNode
  /** Where Auxi is: the tail points there */
  tail?: "right" | "left" | "bottom"
  className?: string
}
