import type { ReactNode } from "react"
import type { BlockPlace } from "@/types/blocks"

export type BlockMapProps = {
  places: BlockPlace[]
  /** [id, name] of every province, in the order of the selector */
  provinces: [string, string][]
  /** [flag, label] of the chips; "all" first */
  filters: [string, string][]
  /** What to say when a province has no places yet ({prov} is its name) */
  empty: { title: string, text: string }
  /** More for that message, under its text (e.g. what to do meanwhile and a line to call) */
  emptyExtra?: ReactNode
}
