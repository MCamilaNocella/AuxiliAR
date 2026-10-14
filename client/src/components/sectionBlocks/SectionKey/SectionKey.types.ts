import type { LucideIcon } from "lucide-react"
import type { Tone } from "@/types/tone"

export type SectionKeyCell = {
  /** Icon in a soft tile on top (classic look) */
  icon?: LucideIcon
  /** Small line on top */
  title: string
  /** The big word or number */
  value: string
  label: string
  /** Id of the block it takes you to (part-<target>) */
  target?: string
  /** Or another section of the category it opens */
  section?: string
  /** Something to do too when it's tapped (e.g. pick the exercise of the block it takes you to) */
  onOpen?: () => void
  tone: Tone
}

export type SectionKeyProps = {
  cells: SectionKeyCell[]
  /** Each cell on the soft background of its block's tone, its value in that tone (Primeros auxilios) */
  tinted?: boolean
}
