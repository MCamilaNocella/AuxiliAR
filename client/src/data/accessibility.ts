import type { AccessibilitySettings, ColorThemeOption, TextScaleOption } from "@/types/accessibility"

/** localStorage key. The script in index.html reads it before first paint: keep both in sync. */
export const ACCESSIBILITY_STORAGE_KEY = "auxiliar:accessibility"

export const TEXT_SCALES: TextScaleOption[] = [
  { value: 87.5, label: "Chico" },
  { value: 100, label: "Normal" },
  { value: 112.5, label: "Grande" },
  { value: 125, label: "Más grande" },
  { value: 150, label: "Muy grande" },
]

export const COLOR_THEMES: ColorThemeOption[] = [
  { value: "light", label: "Claro", preview: { background: "#ffffff", text: "#1f1a1a" } },
  { value: "dark", label: "Oscuro", preview: { background: "#2a2323", text: "#f4eeec" } },
  { value: "contrast", label: "Contraste alto", preview: { background: "#000000", text: "#ffff00" } },
]

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  textScale: 100,
  theme: "light",
  largeCursor: false,
}
