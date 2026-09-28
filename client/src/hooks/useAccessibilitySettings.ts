import { useSyncExternalStore } from "react"
import { accessibilityStore } from "@/stores/accessibilityStore"

/** "Ver mejor" settings (text size, colors, cursor) and how to change them. */
export const useAccessibilitySettings = () => {
  const settings = useSyncExternalStore(accessibilityStore.subscribe, accessibilityStore.getSnapshot)
  return { settings, update: accessibilityStore.update, reset: accessibilityStore.reset }
}
