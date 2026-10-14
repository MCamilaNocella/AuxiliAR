import type { LucideIcon } from "lucide-react"

export type NumberedCard = { id?: string, icon?: LucideIcon, title: string, text: string }

export type NumberedCardsProps = {
  items: NumberedCard[]
  /** Rows of the same length on wide containers (5 go 3 + 2, 6 go 3 + 3), as the Salud mental model */
  balanced?: boolean
}
