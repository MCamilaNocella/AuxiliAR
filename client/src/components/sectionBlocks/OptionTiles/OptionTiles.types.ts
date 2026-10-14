import type { LucideIcon } from "lucide-react"

export type OptionTile = { icon?: LucideIcon, text: string }

export type OptionTilesProps = {
  items: OptionTile[]
}
