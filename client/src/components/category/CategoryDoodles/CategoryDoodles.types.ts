import type { LucideIcon } from "lucide-react"

export type Doodle = {
  Icon: LucideIcon
  /** Position in % of the banner */
  left: number
  top: number
  /** Side in rem */
  size: number
  /** Degrees */
  rotate: number
}

export type CategoryDoodlesProps = {
  categoryId: string
  /** "banner": wide and short, drawings on the right · "wallpaper": tall, drawings everywhere */
  layout: "banner" | "wallpaper"
}
