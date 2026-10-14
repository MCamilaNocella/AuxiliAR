import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

export type ModelLinkProps = {
  /** An internal route, or an official page (opens in a new tab) */
  to: string
  icon?: LucideIcon
  /** `big`: the large button of the models. `solid` / `soft`: the compact ones */
  variant?: "big" | "solid" | "soft"
  children: ReactNode
}
