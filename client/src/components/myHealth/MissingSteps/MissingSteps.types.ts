import type { MissingItem, ProfileFieldKey } from "@/types/myHealth"

export type MissingStepsProps = {
  missing: MissingItem[]
  /** Tapping one: complete that piece of data */
  onSelect: (key: ProfileFieldKey) => void
}
