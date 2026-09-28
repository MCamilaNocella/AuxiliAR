import { useLayoutEffect, useState, type RefObject } from "react"

/** Relative luminance where white and black text give the same contrast */
const LUMINANCE_CROSSOVER = 0.179

const channel = (value: number) => {
  const c = value / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

const luminance = ([r, g, b]: number[]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)

/** Every rgb()/rgba() in a computed style value, as [r, g, b, alpha] */
const parseColors = (value: string) =>
  [...value.matchAll(/rgba?\(([^)]+)\)/g)].map((match) => {
    const [r, g, b, a = 1] = match[1].split(/[\s,/]+/).filter(Boolean).map(Number)
    return [r, g, b, a]
  })

/** Luminance of the first opaque background found at (x, y), skipping the probe's own elements */
const backdropLuminance = (x: number, y: number, ignore: Element) => {
  for (const element of document.elementsFromPoint(x, y)) {
    if (ignore.contains(element)) continue
    const style = getComputedStyle(element)

    // Gradients (e.g. bg-home): average of their color stops
    const stops = parseColors(style.backgroundImage)
    if (stops.length > 0) return stops.reduce((sum, stop) => sum + luminance(stop), 0) / stops.length

    const [color] = parseColors(style.backgroundColor)
    if (color && color[3] > 0.5) return luminance(color)
  }
  return luminance(parseColors(getComputedStyle(document.body).backgroundColor)[0] ?? [255, 255, 255])
}

/**
 * Whether the page background behind a point of a floating element is dark.
 * The point is given as a fraction of the probe's box; everything inside `ignore` is skipped.
 * Re-checks on scroll, resize, theme changes and DOM changes (route navigation).
 */
export const useIsOverDarkBackground = (
  probeRef: RefObject<Element | null>,
  ignoreRef: RefObject<Element | null>,
  point: { x: number; y: number },
) => {
  const [isDark, setIsDark] = useState(false)
  const { x, y } = point

  useLayoutEffect(() => {
    const probe = probeRef.current
    const ignore = ignoreRef.current
    if (!probe || !ignore) return

    let frame = 0
    const check = () => {
      frame = 0
      const rect = probe.getBoundingClientRect()
      const lum = backdropLuminance(rect.left + rect.width * x, rect.top + rect.height * y, ignore)
      setIsDark(lum < LUMINANCE_CROSSOVER)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }

    check()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    const observer = new MutationObserver(schedule)
    observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      observer.disconnect()
    }
  }, [probeRef, ignoreRef, x, y])

  return isDark
}
