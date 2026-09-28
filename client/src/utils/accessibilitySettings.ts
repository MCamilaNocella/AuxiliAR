import {
  ACCESSIBILITY_STORAGE_KEY,
  COLOR_THEMES,
  DEFAULT_ACCESSIBILITY_SETTINGS,
  TEXT_SCALES,
} from "@/data/accessibility"
import type { AccessibilitySettings } from "@/types/accessibility"

/** Reads the saved settings; any invalid value falls back to its default. */
export const loadAccessibilitySettings = (): AccessibilitySettings => {
  try {
    const stored: Partial<AccessibilitySettings> = JSON.parse(localStorage.getItem(ACCESSIBILITY_STORAGE_KEY) ?? "{}")
    return {
      textScale: TEXT_SCALES.some(({ value }) => value === stored.textScale)
        ? stored.textScale!
        : DEFAULT_ACCESSIBILITY_SETTINGS.textScale,
      theme: COLOR_THEMES.some(({ value }) => value === stored.theme)
        ? stored.theme!
        : DEFAULT_ACCESSIBILITY_SETTINGS.theme,
      largeCursor: typeof stored.largeCursor === "boolean" ? stored.largeCursor : DEFAULT_ACCESSIBILITY_SETTINGS.largeCursor,
    }
  } catch {
    return DEFAULT_ACCESSIBILITY_SETTINGS
  }
}

export const saveAccessibilitySettings = (settings: AccessibilitySettings) => {
  try {
    localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // No storage (private mode, blocked): settings last until the page is reloaded
  }
}

/** Applies the settings to <html>: base size (everything uses rem), theme and cursor. */
export const applyAccessibilitySettings = ({ textScale, theme, largeCursor }: AccessibilitySettings) => {
  const root = document.documentElement
  root.style.fontSize = `${textScale}%`
  root.dataset.theme = theme
  root.dataset.cursor = largeCursor ? "large" : "normal"
}
