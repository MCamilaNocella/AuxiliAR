import { useRef, useState } from "react"
import { flushSync } from "react-dom"
import { prefersReducedMotion } from "@/utils/scroll"

const DURATION = 500
const EASING = "cubic-bezier(0.32, 0.72, 0, 1)"

/**
 * A panel that slides open and back (height and opacity, 500 ms, the curve of main's drawer), as the folds of the category models.
 * `open` is what the button announces; `visible` keeps the panel in the layout while it closes. With reduced motion it just shows or hides.
 */
export const useSlidePanel = () => {
  const panelRef = useRef<HTMLDivElement>(null)
  const animation = useRef<Animation | null>(null)
  const settle = useRef(0)
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  const toggle = () => {
    const opening = !open
    setOpen(opening)
    const panel = panelRef.current
    if (!panel || prefersReducedMotion()) {
      setVisible(opening)
      return
    }
    animation.current?.cancel()
    window.clearTimeout(settle.current)
    if (opening) flushSync(() => setVisible(true))
    const frames = [
      { height: "0px", opacity: 0 },
      { height: `${panel.scrollHeight}px`, opacity: 1 },
    ]
    animation.current = panel.animate(opening ? frames : [...frames].reverse(), { duration: DURATION, easing: EASING })
    // Settled by a timer (not onfinish), so the panel always ends in its final state
    settle.current = window.setTimeout(() => {
      animation.current?.cancel()
      animation.current = null
      if (!opening) setVisible(false)
    }, DURATION)
  }

  return { open, visible, toggle, panelRef }
}
