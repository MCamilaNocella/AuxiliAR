import { useCallback, useSyncExternalStore } from "react"

/** `true` while the media query matches; updates when the screen size changes. */
export const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener("change", onChange)
      return () => mediaQuery.removeEventListener("change", onChange)
    },
    [query],
  )

  // Rendered on a server (the tests, or a static page) nothing matches: the answer is the small-screen one
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false)
}
