import type { LucideIcon } from "lucide-react"

export type ActivityCard = {
  title: string
  /** Facts with an icon (when, where, who) */
  rows: { icon: LucideIcon, text: string }[]
  /** A small closing remark (e.g. the cost) */
  note?: string
  /** A link at the end */
  link?: { label: string, url: string }
}

export type ActivityCardsProps = {
  items: ActivityCard[]
}
