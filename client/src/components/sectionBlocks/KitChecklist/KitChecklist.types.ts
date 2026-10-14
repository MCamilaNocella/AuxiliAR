import type { Tone } from "@/types/tone"

export type KitItem = { id: string, name: string, use?: string }

export type KitChecklistProps = {
  id: string
  title: string
  lead?: string
  groups: { title: string, items: KitItem[] }[]
  tone: Tone
}
