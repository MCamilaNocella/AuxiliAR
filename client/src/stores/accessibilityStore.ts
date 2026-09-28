import { DEFAULT_ACCESSIBILITY_SETTINGS } from "@/data/accessibility"
import type { AccessibilitySettings } from "@/types/accessibility"
import {
  applyAccessibilitySettings,
  loadAccessibilitySettings,
  saveAccessibilitySettings,
} from "@/utils/accessibilitySettings"

let settings = loadAccessibilitySettings()
applyAccessibilitySettings(settings)

const listeners = new Set<() => void>()

const setSettings = (next: AccessibilitySettings) => {
  settings = next
  applyAccessibilitySettings(settings)
  saveAccessibilitySettings(settings)
  listeners.forEach((listener) => listener())
}

/** Estado global de "Ver mejor", compatible con useSyncExternalStore. */
export const accessibilityStore = {
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  getSnapshot: () => settings,
  update: (changes: Partial<AccessibilitySettings>) => setSettings({ ...settings, ...changes }),
  reset: () => setSettings(DEFAULT_ACCESSIBILITY_SETTINGS),
}
