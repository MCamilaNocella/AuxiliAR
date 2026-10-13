import { useLayoutEffect, useRef } from "react"
import { prefersReducedMotion } from "@/utils/scroll"
import { MOVE_EASING, MOVE_MS } from "./MissingSteps.constants"

/**
 * Animates the list's items to their new places when the order changes (FLIP: measure, jump back, glide).
 * The `lifted` ones (just completed, going up) rise over the rest: a bit bigger, with a shadow, on top; the list
 * scrolls back up so they're seen. `ref(key)` goes on each item.
 */
export const useListMoves = (lifted: string[]) => {
  const nodes = useRef(new Map<string, HTMLElement>())
  const tops = useRef(new Map<string, number>())

  useLayoutEffect(() => {
    // Items that left the list: their last place no longer matters
    tops.current.forEach((_, key) => {
      if (!nodes.current.has(key)) tops.current.delete(key)
    })
    let liftedAny = false
    nodes.current.forEach((node, key) => {
      const top = node.offsetTop
      const before = tops.current.get(key)
      tops.current.set(key, top)
      if (before === undefined || before === top || prefersReducedMotion()) return
      const from = `translateY(${before - top}px)`
      if (lifted.includes(key) && before > top) {
        liftedAny = true
        node.style.zIndex = "1"
        const shadow = "0 10px 24px rgba(0, 0, 0, 0.18)"
        node
          .animate(
            [
              { transform: from, boxShadow: "none" },
              { transform: `translateY(${(before - top) / 2}px) scale(1.04)`, boxShadow: shadow, offset: 0.5 },
              { transform: "none", boxShadow: "none" },
            ],
            { duration: MOVE_MS, easing: MOVE_EASING },
          )
          .finished.then(() => (node.style.zIndex = ""), () => {})
      } else {
        node.animate([{ transform: from }, { transform: "none" }], { duration: MOVE_MS, easing: MOVE_EASING })
      }
    })
    if (liftedAny) nodes.current.values().next().value?.parentElement?.scrollTo({ top: 0, behavior: "smooth" })
  })

  // A new callback every render: React detaches and reattaches it, so only the node is forgotten here (not its last place)
  return (key: string) => (node: HTMLElement | null) => {
    if (node) nodes.current.set(key, node)
    else nodes.current.delete(key)
  }
}
