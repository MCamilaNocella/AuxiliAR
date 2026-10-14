import type { Block, BlockPlace } from "@/types/blocks"

export type BlockListProps = {
  blocks: Block[]
  /** 0: blocks of the section (title over a line). 1: parts inside a group or a fold (small title) */
  depth?: 0 | 1
  /** For the map blocks */
  places?: BlockPlace[]
  provinces?: [string, string][]
}
