export type HelpBubbleProps = {
  message: string
  onOpen: () => void
  onClose: () => void
  /** Which side of Auxi's head the bubble sits on (the tail points back at it). Default: left */
  side?: "left" | "right"
}
