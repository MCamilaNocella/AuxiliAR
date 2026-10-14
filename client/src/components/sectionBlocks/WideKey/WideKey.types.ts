import type { LucideIcon } from "lucide-react"

export type WideKeyCard = { icon?: LucideIcon, name: string, when: string, text: string, examples: string[] }

export type WideKeyProps = {
  cards: WideKeyCard[]
}
