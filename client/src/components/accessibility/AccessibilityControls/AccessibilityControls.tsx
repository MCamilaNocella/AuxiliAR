import { useState } from "react"
import { AccessibilityButton } from "../AccessibilityButton"
import { AccessibilityPanel } from "../AccessibilityPanel"

/** Botón + panel "Ver mejor". Va en la raíz de la app para estar disponible en todas las pantallas. */
export const AccessibilityControls = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <AccessibilityButton expanded={open} onClick={() => setOpen(true)} />
      <AccessibilityPanel open={open} onClose={() => setOpen(false)} />
    </>
  )
}
