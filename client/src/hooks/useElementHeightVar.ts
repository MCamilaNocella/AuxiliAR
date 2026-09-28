import { useLayoutEffect, type RefObject } from "react"

/**
 * Publishes an element's height as a CSS variable on :root and keeps it up to
 * date (the header, for example, changes height with the text size).
 */
export const useElementHeightVar = (ref: RefObject<HTMLElement | null>, cssVar: `--${string}`) => {
  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    const root = document.documentElement
    const update = () => root.style.setProperty(cssVar, `${element.offsetHeight}px`)

    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, cssVar])
}
