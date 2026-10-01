import { useSyncExternalStore } from "react"
import type { AuxiExtras } from "@/components/help/Auxi"

/*
 * Auxi model being previewed on the floating help bot (set from the "Modelos de Auxi" page).
 * Lives in memory only: `null` = the regular Auxi.
 */

let preview: AuxiExtras | null = null
const listeners = new Set<() => void>()

export const setAuxiPreview = (next: AuxiExtras | null) => {
  preview = next
  listeners.forEach((listener) => listener())
}

const subscribe = (onChange: () => void) => {
  listeners.add(onChange)
  return () => listeners.delete(onChange)
}

/** Model to draw on the floating Auxi, or `null` for the regular one */
export const useAuxiPreview = () => useSyncExternalStore(subscribe, () => preview)
