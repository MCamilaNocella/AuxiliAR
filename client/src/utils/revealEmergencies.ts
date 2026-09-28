import { EMERGENCY_HEADING_ID } from "@/components/layout/EmergencyBar"
import { prefersReducedMotion } from "./scroll"

/** Vuelve a mostrar la barra de emergencias y le pasa el foco (lectores de pantalla / teclado). */
export const revealEmergencies = () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "instant" : "smooth" })
  document.getElementById(EMERGENCY_HEADING_ID)?.focus({ preventScroll: true })
}
