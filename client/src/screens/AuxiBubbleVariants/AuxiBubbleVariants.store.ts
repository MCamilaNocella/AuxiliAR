import { useSyncExternalStore } from "react"

/*
 * TEMPORARY. The variant chosen on /auxi-burbujas, kept in memory (like useAuxiPreview), so it lasts
 * while navigating the app: the floating Auxi then wears that bubble over the real screens.
 */
let selectedId: string | null = null
const listeners = new Set<() => void>()

export const setBubblePreview = (id: string | null) => {
  selectedId = id
  listeners.forEach((listener) => listener())
}

const subscribe = (onChange: () => void) => {
  listeners.add(onChange)
  return () => listeners.delete(onChange)
}

export const useBubblePreview = () => useSyncExternalStore(subscribe, () => selectedId)
