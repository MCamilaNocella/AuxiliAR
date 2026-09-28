import { useLayoutEffect, type RefObject } from "react"
import { useLocation } from "react-router"
import { PATHS } from "@/router/paths"
import { animateWindowScroll, prefersReducedMotion, scrollTopBelowHeader } from "@/utils/scroll"

/** How long the emergency bar stays visible before sliding away. */
const REVEAL_DELAY_MS = 600
const SCROLL_DURATION_MS = 700

// Any of these gestures means the user has taken control of scrolling
const USER_SCROLL_EVENTS = ["wheel", "touchstart", "pointerdown", "keydown"] as const

/**
 * When entering an inner section, the emergency bar is shown for a moment
 * and then the page slides down to the content, which ends up right below the
 * sticky header. The animation makes it clear that the bar exists and that the
 * user can get back to it by scrolling up (or with the "Emergencia" button).
 *
 * Must run after <ScrollRestoration />, which on every navigation restores the
 * saved position (back/forward) or goes back to the very top. That's why we
 * only act when the page is at the top: this respects scroll restoration,
 * #anchor links and `preventScrollReset`.
 */
export const useEmergencyAutoScroll = (contentRef: RefObject<HTMLElement | null>) => {
  const location = useLocation()

  useLayoutEffect(() => {
    if (location.pathname === PATHS.home || location.hash) return
    if (window.scrollY > 0) return

    const content = contentRef.current
    if (!content) return

    // Focus goes to the content right away so keyboard and screen reader users start there
    content.focus({ preventScroll: true })

    if (prefersReducedMotion()) {
      window.scrollTo({ top: scrollTopBelowHeader(content), behavior: "instant" })
      return
    }

    let cancelAnimation: (() => void) | undefined
    const timer = window.setTimeout(() => {
      // If the user has scrolled in the meantime, don't move them
      if (window.scrollY > 0) return stop()
      cancelAnimation = animateWindowScroll(() => scrollTopBelowHeader(content), SCROLL_DURATION_MS, stop)
    }, REVEAL_DELAY_MS)

    const stop = () => {
      window.clearTimeout(timer)
      cancelAnimation?.()
      USER_SCROLL_EVENTS.forEach((type) => window.removeEventListener(type, stop))
    }
    USER_SCROLL_EVENTS.forEach((type) => window.addEventListener(type, stop, { passive: true }))

    return stop
  }, [location, contentRef])
}
