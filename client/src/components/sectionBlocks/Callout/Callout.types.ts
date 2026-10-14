import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

export type CalloutProps = {
  /** `soft`: plain background. `brand`: a hint of the category color, for something to act on. `alert`: something urgent */
  tone?: "soft" | "brand" | "alert"
  /** Anchor (part-<id>), when a summary cell takes you here */
  id?: string
  title?: string
  icon?: LucideIcon
  children?: ReactNode
}
