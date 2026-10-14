import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type PointerEvent, type RefObject } from "react"

/** How long to keep it pressed before it can be dragged */
const HOLD_MS = 175
/** Moving more than this (px) before the hold ends cancels it: it was a swipe, not a long press */
const MOVE_TOLERANCE = 8
/** Gap (px) always kept from the screen edges */
const EDGE = 8

export type DragOffset = { x: number; y: number }

type Gesture = {
  pointerId: number
  startX: number
  startY: number
  startOffset: DragOffset
  timer: number
  active: boolean
}

const loadOffset = (key: string): DragOffset => {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(key) ?? "null")
    if (stored && typeof stored === "object" && "x" in stored && "y" in stored) {
      const { x, y } = stored
      if (typeof x === "number" && typeof y === "number") return { x, y }
    }
  } catch {
    // No storage (private mode, blocked): it starts in its usual place
  }
  return { x: 0, y: 0 }
}

const saveOffset = (key: string, offset: DragOffset) => {
  try {
    localStorage.setItem(key, JSON.stringify(offset))
  } catch {
    // Not saved: it still moves, it just won't be remembered
  }
}

/**
 * Lets a floating element be moved by keeping it pressed a moment and then dragging (mouse, finger or pen).
 * Returns the offset to translate it by (remembered in this browser), whether it's being dragged,
 * and the handlers for the element that's pressed. `boundsRefs` are what has to stay on screen (all of them together);
 * `horizontalBoundsRefs`, if given, replace them for left/right (e.g. a bubble that flips sides by itself).
 * After a drag, the click that ends it is swallowed so it doesn't also activate the element.
 */
export const useLongPressDrag = (
  boundsRefs: RefObject<HTMLElement | null>[],
  storageKey: string,
  horizontalBoundsRefs = boundsRefs,
) => {
  const [offset, setOffset] = useState<DragOffset>(() => loadOffset(storageKey))
  const [dragging, setDragging] = useState(false)
  const gesture = useRef<Gesture | null>(null)
  const swallowClick = useRef(false)
  // Latest values for the handlers and the clamp, which don't re-render
  const offsetRef = useRef(offset)
  const bounds = useRef({ both: boundsRefs, horizontal: horizontalBoundsRefs })
  useLayoutEffect(() => {
    offsetRef.current = offset
    bounds.current = { both: boundsRefs, horizontal: horizontalBoundsRefs }
  })

  /** The closest offset to `next` that keeps the bounds inside the screen */
  const clamp = useCallback(
    (next: DragOffset): DragOffset => {
      const rectsOf = (refs: RefObject<HTMLElement | null>[]) =>
        refs.flatMap(({ current }) => (current ? [current.getBoundingClientRect()] : []))
      const rects = rectsOf(bounds.current.both)
      const xRects = rectsOf(bounds.current.horizontal)
      if (rects.length === 0 || xRects.length === 0) return next
      // Where they would be with no offset
      const left = Math.min(...xRects.map((rect) => rect.left)) - offsetRef.current.x
      const right = Math.max(...xRects.map((rect) => rect.right)) - offsetRef.current.x
      const top = Math.min(...rects.map((rect) => rect.top)) - offsetRef.current.y
      const bottom = Math.max(...rects.map((rect) => rect.bottom)) - offsetRef.current.y
      const minX = EDGE - left
      const maxX = window.innerWidth - EDGE - right
      const minY = EDGE - top
      const maxY = window.innerHeight - EDGE - bottom
      return {
        x: Math.min(Math.max(next.x, minX), Math.max(minX, maxX)),
        y: Math.min(Math.max(next.y, minY), Math.max(minY, maxY)),
      }
    },
    [],
  )

  // A remembered place may be off screen on a smaller window: bring it back, now and on every resize
  useLayoutEffect(() => {
    const keepInside = () =>
      setOffset((current) => {
        const next = clamp(current)
        return next.x === current.x && next.y === current.y ? current : next
      })
    keepInside()
    window.addEventListener("resize", keepInside)
    return () => window.removeEventListener("resize", keepInside)
  }, [clamp])

  useEffect(() => () => window.clearTimeout(gesture.current?.timer), [])

  const end = () => {
    const current = gesture.current
    if (!current) return
    window.clearTimeout(current.timer)
    if (current.active) {
      setDragging(false)
      swallowClick.current = true
      saveOffset(storageKey, offsetRef.current)
    }
    gesture.current = null
  }

  const handlers = {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      if (event.button !== 0) return
      const element = event.currentTarget
      const { pointerId, clientX, clientY } = event
      const timer = window.setTimeout(() => {
        if (gesture.current?.pointerId !== pointerId) return
        gesture.current.active = true
        setDragging(true)
        element.setPointerCapture(pointerId)
        navigator.vibrate?.(20)
      }, HOLD_MS)
      gesture.current = { pointerId, startX: clientX, startY: clientY, startOffset: offsetRef.current, timer, active: false }
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      const current = gesture.current
      if (!current || current.pointerId !== event.pointerId) return
      const dx = event.clientX - current.startX
      const dy = event.clientY - current.startY
      if (!current.active) {
        if (Math.hypot(dx, dy) > MOVE_TOLERANCE) {
          window.clearTimeout(current.timer)
          gesture.current = null
        }
        return
      }
      event.preventDefault()
      setOffset(clamp({ x: current.startOffset.x + dx, y: current.startOffset.y + dy }))
    },
    onPointerUp: end,
    onPointerCancel: end,
    onClickCapture: (event: MouseEvent<HTMLElement>) => {
      if (!swallowClick.current) return
      swallowClick.current = false
      event.preventDefault()
      event.stopPropagation()
    },
    // A long press would otherwise open the phone's menu (copy image, etc.)
    onContextMenu: (event: MouseEvent<HTMLElement>) => {
      if (gesture.current) event.preventDefault()
    },
  }

  return { offset, dragging, handlers }
}
