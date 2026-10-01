import type { HTMLAttributes } from "react"

export type ChatInputProps = {
  placeholder: string
  /** While Auxi answers: the field stays editable, sending waits */
  busy?: boolean
  /** Keyboard to show on phones (numeric for the age) */
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"]
  /** Auxi asked where they are: suggests localities with their province while typing; picking one sends it */
  suggestZones?: boolean
  onSend: (text: string) => void
}
