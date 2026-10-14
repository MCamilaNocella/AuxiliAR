import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

export type BlockNoteProps = {
  /** Info by default */
  icon?: LucideIcon
  /** Urgent: the icon and the bold text in the alert color */
  alert?: boolean
  children: ReactNode
}
