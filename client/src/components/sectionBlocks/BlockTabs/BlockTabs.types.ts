import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

export type BlockTab = { label: string, icon?: LucideIcon, content: ReactNode }

export type BlockTabsProps = {
  tabs: BlockTab[]
  /** What the tabs choose, for screen readers ("Elegí tu ciudad") */
  label: string
  /** One line that scrolls sideways instead of wrapping */
  scroll?: boolean
  /** The panel without its own card (when the tabs live inside a block that already is one) */
  plain?: boolean
  /** Long labels may break into two lines (centered) instead of staying on one */
  wrapLabels?: boolean
}
