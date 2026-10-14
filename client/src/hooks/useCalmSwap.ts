import { useEffect, useRef, useState } from "react"
import { prefersReducedMotion } from "@/utils/scroll"

/** How long what goes away takes to fade out */
export const CALM_OUT_MS = 250

/**
 * Changes as in Mi Salud and the self-care tools of the models: what goes away first fades out gently (`out`), then the change
 * happens and the new content fades in (give it `animate-calm-in`, and a new key when it is another thing)
 */
export const useCalmSwap = () => {
  const [out, setOut] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const swap = (change: () => void) => {
    window.clearTimeout(timer.current)
    if (prefersReducedMotion()) {
      change()
      return
    }
    setOut(true)
    timer.current = window.setTimeout(() => {
      change()
      setOut(false)
    }, CALM_OUT_MS)
  }
  /** Classes for the parts that fade: out while leaving, calm-in when they come back */
  const fade = out ? "opacity-0 transition-opacity duration-250 ease-in motion-reduce:transition-none" : "animate-calm-in motion-reduce:animate-none"
  return { out, swap, fade }
}
