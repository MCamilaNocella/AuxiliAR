import { useState } from "react"
import { AccessibilityButton } from "../AccessibilityButton"
import { AccessibilityPanel } from "../AccessibilityPanel"

/** "Ver mejor" button + panel. Lives at the app root so it is available on every screen. */
export const AccessibilityControls = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <AccessibilityButton expanded={open} onClick={() => setOpen(true)} />
      <AccessibilityPanel open={open} onClose={() => setOpen(false)} />
    </>
  )
}
