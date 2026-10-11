import type { ReactNode } from "react"
import type { Frame } from "../../EmergencyNumberModels.types"

export type ModelSectionProps = {
  id: string
  title: string
  note: string
  /** One preview per frame, side by side (they wrap when they don't fit) */
  frames: Frame[]
  children: ReactNode
}
