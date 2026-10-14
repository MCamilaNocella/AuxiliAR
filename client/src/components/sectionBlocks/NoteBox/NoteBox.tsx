import { Info } from "lucide-react"
import type { NoteBoxProps } from "./NoteBox.types"

/** A remark on the field color, with an info icon (e.g. what the mutual-help groups are not) */
export const NoteBox = ({ children }: NoteBoxProps) => (
  <p className="m-0 mt-3 flex items-start gap-2 rounded-xl bg-field px-4 py-3 text-ink-soft in-data-[theme=contrast]:outline in-data-[theme=contrast]:outline-ink">
    <Info aria-hidden="true" className="mt-[0.15rem] size-[1.1rem] shrink-0" />
    <span>{children}</span>
  </p>
)
