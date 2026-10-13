import type { ReactNode } from "react"

export type ScrollListProps = {
  /** Items shown at once; the rest are reached by scrolling */
  visible: number
  /** Keeps the room of `visible` one-line items even with fewer, so what's around doesn't move */
  keepRoom?: boolean
  /** The <li> items */
  children: ReactNode
}
