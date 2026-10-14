import { Info } from "lucide-react"
import type { BlockNoteProps } from "./BlockNote.types"

/** A side remark at the end of a block, smaller, with an icon in the brand color (or, in an accent block, in the block's tone) */
export const BlockNote = ({ icon: Icon = Info, alert = false, children }: BlockNoteProps) => (
  <p className={`m-0 flex gap-2 pt-3 text-[0.95rem] text-ink-soft ${alert ? "[&_b]:text-alert-text" : ""}`}>
    <Icon aria-hidden="true" className={`mt-[0.15rem] size-[1.25em] shrink-0 ${alert ? "text-alert-text" : "text-[var(--note-ink,var(--color-brand))]"}`} />
    <span>{children}</span>
  </p>
)
