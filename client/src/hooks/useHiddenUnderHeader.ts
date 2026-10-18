import { useEffect, useState, type RefObject } from "react"

/**
 * `true` while the element is scrolled away under the sticky header (or not shown at all). Checked on scroll, on
 * resize and when either one changes size (the text size changes both without scrolling).
 */
export const useHiddenUnderHeader = (ref: RefObject<HTMLElement | null>, headerRef: RefObject<HTMLElement | null>) => {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const element = ref.current
    const header = headerRef.current
    if (!element || !header) return

    const update = () => setHidden(element.getBoundingClientRect().bottom <= header.getBoundingClientRect().bottom)
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    const observer = new ResizeObserver(update)
    observer.observe(element)
    observer.observe(header)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      observer.disconnect()
    }
  }, [ref, headerRef])

  return hidden
}
