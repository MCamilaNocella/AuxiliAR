import { useEffect, useState } from "react"
import type { RefObject } from "react"
import { AVOID_ATTRIBUTE, INTERACTIVE_SELECTOR, overlapMatters } from "@/utils/auxiAvoidance"
import type { Box } from "@/utils/auxiAvoidance"

/** Wait for the scroll to stop before moving: nothing jumps while the person is reading */
const SETTLE_MS = 180

export type Avoidance = {
  /** Auxi sits on something to press, or a modal / the urgent help is open: tuck it to the edge */
  botBlocked: boolean
  /** The bubble would cover something to press: hide it for now (it is not closed) */
  bubbleBlocked: boolean
}

const NOT_BLOCKED: Avoidance = { botBlocked: false, bubbleBlocked: false }

const boxOf = (element: Element): Box => {
  const { left, top, right, bottom } = element.getBoundingClientRect()
  return { left, top, right, bottom }
}

const onScreen = ({ left, top, right, bottom }: Box) => right > 0 && bottom > 0 && left < window.innerWidth && top < window.innerHeight

const isShown = (element: Element) => {
  const visible = (element as Element & { checkVisibility?: (options?: object) => boolean }).checkVisibility
  return visible ? visible.call(element, { checkVisibilityCSS: true }) : true
}

/** Whether pressing something is made harder by a bot occupying `bot`: the bot's own elements don't count */
const coversInteractive = (bot: Box, own: Element, strict = false) => {
  for (const element of document.querySelectorAll(INTERACTIVE_SELECTOR)) {
    if (own.contains(element)) continue
    const box = boxOf(element)
    if (!onScreen(box) || !overlapMatters(bot, box, strict) || !isShown(element)) continue
    return true
  }
  return false
}

/**
 * Keeps Auxi from covering what a person needs: buttons, calls, filters, form fields, links. Looks at the page when it
 * scrolls, resizes or changes, and decides once it has stopped moving (so it does not flicker):
 *  - a modal panel is open, or an urgent-help region (data-auxi-avoid) is on screen: Auxi and its bubble step aside at once;
 *  - the bubble would cover something pressable: it is hidden until there is room;
 *  - Auxi itself sits on something pressable: it tucks to the edge until there is room.
 * `measureRef` is the fixed box of Auxi at its resting place (not the tucked one, so the check does not chase itself).
 */
export const useAuxiAvoidance = (measureRef: RefObject<HTMLElement | null>, bubbleRef: RefObject<HTMLElement | null>): Avoidance => {
  const [avoidance, setAvoidance] = useState<Avoidance>(NOT_BLOCKED)

  useEffect(() => {
    let frame = 0
    let settle: ReturnType<typeof setTimeout> | undefined

    const check = () => {
      const measure = measureRef.current
      if (!measure) return
      const modal = document.querySelector("[role=dialog][aria-modal=true]") !== null
      const urgent = [...document.querySelectorAll(`[${AVOID_ATTRIBUTE}]`)].some((element) => onScreen(boxOf(element)))
      const botBlocked = modal || urgent || coversInteractive(boxOf(measure), measure)
      const bubble = bubbleRef.current
      const bubbleBlocked = botBlocked || (bubble !== null && coversInteractive(boxOf(bubble), measure, true))
      setAvoidance((previous) => (previous.botBlocked === botBlocked && previous.bubbleBlocked === bubbleBlocked ? previous : { botBlocked, bubbleBlocked }))
    }

    // Modal and urgent help are decided right away; the rest waits for the page to be still
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const urgentOrModal = document.querySelector(`[role=dialog][aria-modal=true], [${AVOID_ATTRIBUTE}]`) !== null
        if (urgentOrModal) check()
        clearTimeout(settle)
        settle = setTimeout(check, SETTLE_MS)
      })
    }

    schedule()
    window.addEventListener("scroll", schedule, { passive: true, capture: true })
    window.addEventListener("resize", schedule)
    document.addEventListener("focusin", schedule)
    // Panels opening, the page changing, filters applied: the DOM changes without a scroll
    const observer = new MutationObserver(schedule)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["open", "hidden", "aria-expanded"] })

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(settle)
      window.removeEventListener("scroll", schedule, { capture: true })
      window.removeEventListener("resize", schedule)
      document.removeEventListener("focusin", schedule)
      observer.disconnect()
    }
  }, [measureRef, bubbleRef])

  return avoidance
}
