import type { ReactNode } from "react"

export type RuleRowsProps = {
  /** [who or what, the rule]; with only the rule, one column of bold lines */
  rows: { key?: ReactNode, value: ReactNode }[]
}
