import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

export type CalloutButtonProps = {
  /** A phone link (tel:…) or an official page; pages outside AuxiliAR open in a new tab */
  href: string
  icon?: LucideIcon
  children: ReactNode
}
