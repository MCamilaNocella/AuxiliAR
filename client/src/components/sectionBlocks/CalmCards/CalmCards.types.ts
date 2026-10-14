import type { LucideIcon } from "lucide-react"

export type CalmCard = {
  icon?: LucideIcon
  title: string
  /** When it helps */
  when: string
  steps: string[]
}

export type CalmCardsProps = {
  items: CalmCard[]
}
