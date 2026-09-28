import { EMERGENCY_HEADING_ID } from "@/components/layout/EmergencyBar"
import { prefersReducedMotion } from "./scroll"

/** Brings the emergency bar back into view and moves focus to it (screen readers / keyboard). */
export const revealEmergencies = () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "instant" : "smooth" })
  document.getElementById(EMERGENCY_HEADING_ID)?.focus({ preventScroll: true })
}
