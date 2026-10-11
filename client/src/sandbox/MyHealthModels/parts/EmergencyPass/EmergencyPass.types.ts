import type { EmergencyRecord } from "../../MyHealthModels.types"

export type EmergencyPassProps = {
  record: EmergencyRecord
  /** Whole card in the alert red instead of a red header on a light card */
  solid?: boolean
  /** Name and age as the first row (ID card layout) */
  identity?: { name: string; age?: number }
  /** Square bottom corners (accent bars go right under it) */
  flatBottom?: boolean
  /** Corner radius class of the data tiles (default rounded-2xl) */
  tileRadius?: "rounded-2xl" | "rounded-lg"
}
