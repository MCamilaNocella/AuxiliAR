import type { EmergencyNumber } from "@/types/emergency"

export type ChatEmergencyCallsProps = {
  /** The numbers for this situation, most important first */
  numbers: EmergencyNumber[]
}
