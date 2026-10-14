import { flushSync } from "react-dom"
import { DESKTOP_QUERY } from "@/components/category/CategorySidebar/CategorySidebar.constants"
import { prefersReducedMotion } from "./scroll"

/** How long the old content takes to fade out and the new one to fade in (large screens: a bit slower, as in the category models) */
const timing = () => (window.matchMedia(DESKTOP_QUERY).matches ? { out: 250, in: 450 } : { out: 180, in: 350 })
const EASE_OUT = "ease-out"
const EASE_IN = "cubic-bezier(0.22, 1, 0.36, 1)"

const contents = () => [...document.querySelectorAll<HTMLElement>("[data-transition-content]")]
const settled = (animation: Animation) => animation.finished.then(() => undefined, () => undefined)

/**
 * Changes what a <TransitionContent> shows as the category models do: the old content fades out, then the new one fades in. It
 * animates the real page (no snapshots), so the bars and the sections menu stay above it and still. `update` makes the change
 * (e.g. sets the URL). The promise resolves once the new content is in, so something can follow it (e.g. the sections drawer closes
 * after the section has changed). With reduced motion it just changes.
 */
export const changeContent = async (update: () => void): Promise<void> => {
  if (prefersReducedMotion()) {
    update()
    return
  }
  const { out, in: inMs } = timing()
  const old = contents()
  const fadeOut = old.map((element) => element.animate([{ opacity: 1 }, { opacity: 0 }], { duration: out, easing: EASE_OUT, fill: "forwards" }))
  await Promise.all(fadeOut.map(settled))
  flushSync(update)
  // The same element may hold the new content: its fade-out is dropped in the same frame the fade-in starts (no flash)
  const fadeIn = contents().map((element) => element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: inMs, easing: EASE_IN }))
  fadeOut.forEach((animation) => animation.cancel())
  await Promise.all(fadeIn.map(settled))
}
