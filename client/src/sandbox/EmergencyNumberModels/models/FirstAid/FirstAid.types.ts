import type { ReactNode } from "react"
import type { FirstAidGuide } from "@/types/emergency"

export type FirstAidBlockProps = {
  /** Heading size: the bar's usual one, or bigger */
  heading?: "plain" | "big"
  /** Color of "Ver todas las guías" */
  allLinkClass: string
  renderCard: (guide: FirstAidGuide) => ReactNode
}
