import type { BlockButton as BlockButtonData } from "@/types/blocks"

export type BlockButtonProps = {
  button: BlockButtonData
  /** Inside an alert callout the emergency button takes the alert color */
  alert?: boolean
}
