import { useState } from "react"

/** Boolean flag that survives navigation and reloads for the rest of the browser session. */
export const useSessionFlag = (key: string) => {
  const [value, setValue] = useState(() => {
    try {
      return sessionStorage.getItem(key) === "true"
    } catch {
      return false
    }
  })

  const raise = () => {
    setValue(true)
    try {
      sessionStorage.setItem(key, "true")
    } catch {
      // No storage available: the flag lasts until the page is reloaded
    }
  }

  return [value, raise] as const
}
