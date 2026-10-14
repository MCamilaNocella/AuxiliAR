import type { BlockButton } from "@/types/blocks"
import type { Tone } from "@/types/tone"

export type GuideData = {
  id: string
  title: string
  /** Shows the "Llamá a emergencias" pill next to the title */
  call?: boolean
  lead?: string
  signs?: { title: string, items: string[] }
  signs2?: { title: string, items: string[] }
  /** One set: plain steps. Several: one tab each (Adultos y niños / Bebés…) */
  sets: { label?: string, steps: string[] }[]
  tip?: { icon: string, text: string }
  dont?: string[]
  help?: { title: string, items: string[] }
  note?: string
  button?: BlockButton
  /** How to prevent it, folded at the end */
  prevent?: string[]
}

export type GuideProps = {
  guide: GuideData
  tone: Tone
}
