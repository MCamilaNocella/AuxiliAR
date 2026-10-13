import type { ComponentType } from "react"
import type { EmergencyNumbersProps } from "@/components/layout/EmergencyNumbers"

/** Route `handle` a page can set to swap the bar's number cards for another design (used by the sandbox models) */
export type EmergencyBarHandle = {
  emergencyNumbers?: ComponentType<EmergencyNumbersProps>
}
