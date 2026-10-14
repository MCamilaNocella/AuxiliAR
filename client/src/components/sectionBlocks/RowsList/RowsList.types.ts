import type { RowData } from "@/types/blocks"

export type RowsListProps = {
  items: RowData[]
  /** The phone before the other facts (Salud mental's lines) */
  phoneFirst?: boolean
}
