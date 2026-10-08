import { useLayoutEffect, useState, type RefObject } from "react"

/**
 * Height (px) of `list` up to the end of its `count`-th child, plus its own padding, kept up to date as the
 * items reflow (width, text size). `list` must be positioned (offsetTop is measured from it). Undefined while everything fits, so the list doesn't scroll for nothing.
 */
export const useVisibleHeight = (list: RefObject<HTMLElement | null>, count: number, itemCount: number) => {
  const [height, setHeight] = useState<number>()

  useLayoutEffect(() => {
    const element = list.current
    if (!element) return
    const update = () => {
      const items = element.children
      if (items.length <= count) return setHeight(undefined)
      const last = items[count - 1] as HTMLElement
      const paddingBottom = parseFloat(getComputedStyle(element).paddingBottom) || 0
      setHeight(last.offsetTop + last.offsetHeight + paddingBottom)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    for (const item of element.children) observer.observe(item)
    return () => observer.disconnect()
  }, [list, count, itemCount])

  return height
}
