import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react"

/** How long the finger (or mouse) has to stay down before the element can be dragged */
const HOLD_MS = 120
/** Moving more than this before the hold ends: an up/down swipe drags right away, a sideways one is ignored */
const MOVE_TOLERANCE_PX = 6

const rootPx = (cssVar: string) =>
  Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue(cssVar)) || 0

/**
 * Press and hold a fixed element (or just swipe it up or down) to drag it. A quick tap still clicks
 * it; a sideways swipe does neither. `top` is the top edge as a fraction of the viewport height, kept between the
 * header and the bottom navigation (null until the first drag).
 * The element needs `touch-action: none`: otherwise the browser takes the finger's moves as a page
 * scroll (and cancels the pointer) before the hold can turn into a drag.
 */
export const useLongPressVerticalDrag = ({
  initialTop, onDrop }: { initialTop: number | null; onDrop: (top: number) => void }) => {
  const [top, setTop] = useState(initialTop)
  const [dragging, setDragging] = useState(false)
  const draggingRef = useRef(false)
  const holdTimer = useRef<number | undefined>(undefined)
  const start = useRef({ x: 0, y: 0, top: 0 })
  const lastTop = useRef<number | null>(null)
  // A drag ends with a pointerup that the browser may turn into a click: swallow that one
  const swallowClick = useRef(false)

  const cancelHold = () => window.clearTimeout(holdTimer.current)

  useEffect(() => () => window.clearTimeout(holdTimer.current), [])

  const startDrag = (element: HTMLElement, pointerId: number) => {
    cancelHold()
    draggingRef.current = true
    setDragging(true)
    lastTop.current = null
    try {
      // Keeps the moves coming even when the finger leaves the element
      element.setPointerCapture(pointerId)
    } catch {
      // The pointer is already gone
    }
    navigator.vibrate?.(15)
  }

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (!event.isPrimary || event.button !== 0) return
    const element = event.currentTarget
    const { pointerId } = event
    swallowClick.current = false
    start.current = { x: event.clientX, y: event.clientY, top: element.getBoundingClientRect().top }
    cancelHold()
    holdTimer.current = window.setTimeout(() => startDrag(element, pointerId), HOLD_MS)
  }

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const dx = event.clientX - start.current.x
    const dy = event.clientY - start.current.y
    if (!draggingRef.current) {
      if (Math.hypot(dx, dy) <= MOVE_TOLERANCE_PX) return
      // Not a tap anymore: up/down starts dragging without waiting for the hold, sideways does nothing
      swallowClick.current = true
      if (Math.abs(dy) < Math.abs(dx)) {
        cancelHold()
        return
      }
      startDrag(event.currentTarget, event.pointerId)
    }
    const min = rootPx("--header-h") + 8
    const max = window.innerHeight - rootPx("--bottom-nav-h") - event.currentTarget.offsetHeight - 8
    const nextTop = Math.min(Math.max(start.current.top + dy, min), Math.max(min, max)) / window.innerHeight
    lastTop.current = nextTop
    setTop(nextTop)
  }

  const endPress = () => {
    cancelHold()
    if (!draggingRef.current) return
    draggingRef.current = false
    setDragging(false)
    swallowClick.current = true
    if (lastTop.current !== null) onDrop(lastTop.current)
  }

  /** Wraps the element's click so it doesn't fire right after a drag */
  const guardClick = (onClick: () => void) => (event: MouseEvent<HTMLElement>) => {
    if (swallowClick.current) {
      swallowClick.current = false
      event.preventDefault()
      return
    }
    onClick()
  }

  return {
    top,
    dragging,
    guardClick,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endPress,
      onPointerCancel: endPress,
      // Long press on Android/desktop would open the context menu instead
      onContextMenu: (event: MouseEvent<HTMLElement>) => event.preventDefault(),
    },
  }
}
