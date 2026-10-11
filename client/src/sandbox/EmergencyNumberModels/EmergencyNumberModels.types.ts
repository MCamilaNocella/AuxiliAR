import type { EmergencyNumber } from "@/types/emergency"

/** Every model gets the same list */
export type NumberModelProps = {
  numbers: EmergencyNumber[]
}

/** A preview box at the width something has on a given screen */
export type Frame = {
  label: string
  width: string
}
