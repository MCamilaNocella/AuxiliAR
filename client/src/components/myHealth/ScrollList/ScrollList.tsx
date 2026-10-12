import { Children, useRef, useState } from "react"
import { roomFor } from "./ScrollList.constants"
import type { ScrollListProps } from "./ScrollList.types"
import { useVisibleHeight } from "./useVisibleHeight"

/**
 * List of buttons/links beside the record card: only the first few show; the rest scroll, with a fade at the
 * bottom while there's more below (on a phone the scrollbar is hidden until you scroll, so the fade is the hint).
 * The wheel goes on to the page when the list has nothing (left) to scroll.
 * The -m-1.5/p-1.5 pair keeps the focus ring from being clipped by the scroll.
 */
export const ScrollList = ({ visible, keepRoom, children }: ScrollListProps) => {
  const list = useRef<HTMLUListElement>(null)
  const maxHeight = useVisibleHeight(list, visible, Children.count(children))
  const [atEnd, setAtEnd] = useState(false)
  const scrolls = maxHeight !== undefined

  return (
    <ul
      ref={list}
      role="list"
      style={{ maxHeight, minHeight: keepRoom ? roomFor(visible) : undefined }}
      onScroll={(event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
        setAtEnd(scrollTop + clientHeight >= scrollHeight - 1)
      }}
      className={`scrollbar-soft relative -m-1.5 flex list-none flex-col gap-1.5 overflow-y-auto p-1.5 ${scrolls ? "pr-2.5" : ""} ${scrolls && !atEnd ? "mask-[linear-gradient(to_bottom,#000_calc(100%-1.5rem),transparent)]" : ""}`}
    >
      {children}
    </ul>
  )
}
