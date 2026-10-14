import type { ReactNode } from "react"
import type { Source } from "@/components/health/SourceList"
import type { BlockLook } from "../BlockLook"

export type SectionBodyProps = {
  /** Official sources of the section, folded at the end (none: no "Fuentes oficiales") */
  sources?: Source[]
  /** Without the general notice at the end (e.g. a quiz) */
  noNotice?: boolean
  /** The look of its blocks: `classic` (default) or `accent` (Más recursos) */
  look?: BlockLook
  children: ReactNode
}
