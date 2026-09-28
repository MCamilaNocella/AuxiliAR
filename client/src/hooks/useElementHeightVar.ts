import { useLayoutEffect, type RefObject } from "react"

/**
 * Publica la altura de un elemento como variable CSS en :root y la mantiene
 * actualizada (el header, por ejemplo, cambia de alto al envolver en mobile).
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
