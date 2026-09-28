import { useSyncExternalStore } from "react"
import { accessibilityStore } from "@/stores/accessibilityStore"

/** Opciones de "Ver mejor" (tamaño de texto, colores, cursor) y cómo cambiarlas. */
export const useAccessibilitySettings = () => {
  const settings = useSyncExternalStore(accessibilityStore.subscribe, accessibilityStore.getSnapshot)
  return { settings, update: accessibilityStore.update, reset: accessibilityStore.reset }
}
