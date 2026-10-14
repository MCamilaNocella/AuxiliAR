import type { ReactNode } from "react"

export type FoldProps = {
  label: string
  /** Small count on the right (e.g. "6 tipos") */
  count?: string
  /** A question of a FAQ: slightly bigger label, answers in soft ink */
  question?: boolean
  /** Inside a card: a smaller label, close to the text */
  inCard?: boolean
  children: ReactNode
}
