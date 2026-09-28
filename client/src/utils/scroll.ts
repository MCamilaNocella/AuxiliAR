export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)

/** Scroll position that puts `element` right below the sticky header. */
export const scrollTopBelowHeader = (element: HTMLElement) => {
  const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0
  const target = element.getBoundingClientRect().top + window.scrollY - headerHeight
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  return Math.max(0, Math.min(target, maxScroll))
}

/** Animated window scroll. Returns a function that cancels it. */
export const animateWindowScroll = (getTarget: () => number, duration: number, onDone: () => void) => {
  let frame = 0
  let start: number | undefined
  let from = 0
  let to = 0

  const step = (now: number) => {
    if (start === undefined) {
      start = now
      from = window.scrollY
      to = getTarget()
    }
    const progress = Math.min((now - start) / duration, 1)
    window.scrollTo({ top: from + (to - from) * easeInOutCubic(progress), behavior: "instant" })
    if (progress < 1) frame = requestAnimationFrame(step)
    else onDone()
  }

  frame = requestAnimationFrame(step)
  return () => cancelAnimationFrame(frame)
}
