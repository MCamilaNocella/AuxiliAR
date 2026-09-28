export type ColorTheme = "light" | "dark" | "contrast"

export type AccessibilitySettings = {
  /** Base text size, as a % of the browser's default size */
  textScale: number
  theme: ColorTheme
  largeCursor: boolean
}

export type TextScaleOption = {
  value: number
  /** Name announced by screen readers */
  label: string
}

export type ColorThemeOption = {
  value: ColorTheme
  label: string
  /** Colors of the "Aa" swatch: hardcoded, since they preview the theme even when it is not active */
  preview: { background: string; text: string }
}
