import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

export type SideCalloutProps = {
  /** `alert`: urgent (red line). `brand`: something to keep in mind */
  tone?: "alert" | "brand"
  title?: string
  icon?: LucideIcon
  children: ReactNode
}
