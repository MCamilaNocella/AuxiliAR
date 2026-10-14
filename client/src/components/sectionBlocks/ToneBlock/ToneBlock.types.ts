import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import type { Tone } from "@/types/tone"

export type ToneBlockProps = {
  /** Anchor of the block (part-<id>): the summary cells take you here */
  id?: string
  title?: string
  /** Icon in a soft tile next to the title (optional: not every block needs one) */
  icon?: LucideIcon
  /** The block's soft tone: its icon tile (classic look) or its title, line and markers (accent look) take it */
  tone: Tone | "category"
  /** Paragraphs under the title */
  lead?: ReactNode[]
  /** A key fact on the right of the title (e.g. "Cada 6 meses" / "consulta odontológica") */
  value?: string
  valueLabel?: string
  /** Only the content: no title and no line (a banner, an illustration) */
  bare?: boolean
  children?: ReactNode
}
