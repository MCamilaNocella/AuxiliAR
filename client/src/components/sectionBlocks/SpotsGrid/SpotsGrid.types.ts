import type { RowData } from "@/types/blocks"

export type SpotsGridProps = {
  /** Testing centers: "Barrio (CeSAC Nº 1)" are grouped by barrio; the rest are hospitals or organizations */
  items: RowData[]
}
