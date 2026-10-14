import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import type { Tone } from "@/types/tone"

export type SoftCard = {
  /** Icon in a soft tile on top (classic look) */
  icon?: LucideIcon
  /** The tile's tone; by default the cards take the tones in turn */
  tone?: Tone
  title: string
  /** Paragraphs */
  text?: ReactNode | ReactNode[]
  /** A short list under the text */
  list?: ReactNode[]
  /** More, folded under "Ver más" (or `moreLabel`) */
  more?: ReactNode[]
  moreLabel?: string
  /** A small closing remark */
  note?: ReactNode
  /** The law it comes from, small under the text (Más recursos) */
  law?: string
  /** An action at the end of the card */
  action?: ReactNode
}

export type SoftCardsProps = {
  items: SoftCard[]
}
