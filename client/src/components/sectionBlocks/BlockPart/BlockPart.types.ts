import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

export type BlockPartProps = {
  /** Anchor (part-<id>) */
  id?: string
  /** Small title of the part */
  title?: string
  icon?: LucideIcon
  /** Paragraphs right under the title */
  lead?: ReactNode[]
  children?: ReactNode
}
