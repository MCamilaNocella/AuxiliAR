import { useEffect, useRef, useState } from "react"
import { AccessibilityButton } from "../AccessibilityButton"
import { AccessibilityPanel } from "../AccessibilityPanel"

/** Lets the gear's half turn show before the panel slides over it */
const OPEN_DELAY_MS = 350

/** "Ver mejor" button + panel. Lives in the header so it is available on every screen. */
export const AccessibilityControls = () => {
  const [open, setOpen] = useState(false)
  const [spun, setSpun] = useState(false)
  const openTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(openTimer.current), [])

  const handleOpen = () => {
    setSpun(true)
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : OPEN_DELAY_MS
    window.clearTimeout(openTimer.current)
    openTimer.current = window.setTimeout(() => setOpen(true), delay)
  }

  const handleClose = () => {
    setOpen(false)
    setSpun(false)
  }

  return (
    <>
      <AccessibilityButton expanded={open} spun={spun} onClick={handleOpen} />
      <AccessibilityPanel open={open} onClose={handleClose} />
    </>
  )
}
