import type { LucideIcon } from "lucide-react"

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  /** Active only on an exact route match (needed for "/") */
  end?: boolean
}
