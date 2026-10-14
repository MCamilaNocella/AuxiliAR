import type { Source } from "@/components/health/SourceList"
import type { GuideData } from "@/components/sectionBlocks/Guide"
import type { KitItem } from "@/components/sectionBlocks/KitChecklist"

/**
 * The content of a section in the design of the category models (diseñoCategorias): a summary and a list of blocks, each one of a
 * type the block renderer knows. Texts may carry <b>, <strong>, <i> and <a href> (RichText shows them).
 */
export type ToneName = "t1" | "t2" | "t3" | "t4" | "t5"

export type BlockButton =
  | { go: string, label: string }
  | { emergency: true, label: string }
  | { tel: string, label: string }
  | { url: string, label: string }

export type KeyCellData = { icon?: string, title: string, value: string, label: string, to?: string, section?: string, tone?: ToneName }

type BlockBase = {
  id?: string
  title?: string
  icon?: string
  /** No icon tile next to the title */
  noIcon?: boolean
  tone?: ToneName
  lead?: string | string[]
  note?: string
  /** No title, no line: only the content */
  bare?: boolean
  /** An action after the content */
  button?: BlockButton
}

export type CardData = { icon?: string, tone?: ToneName, title: string, text?: string, paras?: string[], list?: string[], more?: string[], moreLabel?: string, note?: string, button?: BlockButton }
export type RowData = { title: string, text?: string, meta?: [string, string][], phone?: string, note?: string, url?: string }
export type FaqData = { q: string, a?: string[], url?: string }

export type Block =
  | (BlockBase & { type: "text", paras?: string[], text?: string })
  | (BlockBase & { type: "list", items: string[] })
  | (BlockBase & { type: "steps", items: string[] })
  | (BlockBase & { type: "cards", items: CardData[] })
  | (BlockBase & { type: "rows", items: RowData[] })
  | (Omit<BlockBase, "tone"> & { type: "callout", tone?: "soft" | "brand" | "alert", paras?: string[], text?: string, list?: string[], button?: BlockButton, foot?: string })
  | (BlockBase & { type: "phone", number: string, dial: string, name: string, text: string, hours?: string, where?: string, cost?: string, variant?: string })
  | (BlockBase & { type: "faq", items: FaqData[] })
  | (BlockBase & { type: "table", head: string[], rows: string[][] })
  | (BlockBase & { type: "slide", label: string, count?: string, blocks: Block[] })
  | (BlockBase & { type: "group", blocks: Block[] })
  | (BlockBase & { type: "banner", text: string })
  | (BlockBase & { type: "aspects", items: [string, string][] })
  | (BlockBase & { type: "axes", items: [string, string][] })
  | (BlockBase & { type: "checks", items: string[] })
  | (BlockBase & { type: "spots", items: RowData[] })
  | (BlockBase & { type: "links", items: { icon: string, who: string, title: string, text: string, url: string }[] })
  | (BlockBase & { type: "map", filters: [string, string][], empty: { title: string, text: string } })
  | (BlockBase & { type: "dodont", yes: string[], no: string[] })
  | (BlockBase & { type: "trainers", items: { logo: string, name: string, where: string, url: string }[], after?: string, listTitle?: string })
  | (BlockBase & { type: "petvax", species: { label: string, icon?: string, rows: ([string, string, string] | { group: string })[], notes?: string[] }[] })
  | (BlockBase & { type: "citytabs", cities: { label: string, steps: string[], button?: BlockButton, more?: Block[] }[] })
  | (BlockBase & { type: "picture", text: string })
  | (Omit<GuideData, "lead"> & { type: "guide", lead?: string })
  | { type: "kit", id: string, title: string, lead?: string, groups: { title: string, items: KitItem[] }[] }

export type SectionView = {
  lead?: string
  key?: KeyCellData[]
  blocks: Block[]
  sources: Source[]
}

/** A place of a category model's map (Leaflet), with its own flags for the filters (consejeria, castracion…) */
export type BlockPlace = {
  id: string
  name: string
  kind: string
  province: string
  zone?: string | null
  address: string
  phones: [string, string][]
  lat: number | null
  lng: number | null
  guard24?: boolean
  free?: boolean | null
  /** Free, with conditions the source states */
  freeCond?: boolean
  /** It charges a fee */
  paid?: boolean
  kids?: boolean
  prog?: boolean
  mental?: boolean
  facts: string[]
  note?: string
  source: { label: string, url: string }[]
  [flag: string]: unknown
}
