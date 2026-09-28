export type ColorTheme = "light" | "dark" | "contrast"

export type AccessibilitySettings = {
  /** Tamaño base del texto, en % del tamaño del navegador */
  textScale: number
  theme: ColorTheme
  largeCursor: boolean
}

export type TextScaleOption = {
  value: number
  /** Nombre para lectores de pantalla */
  label: string
}

export type ColorThemeOption = {
  value: ColorTheme
  label: string
  /** Colores de la muestra "Aa": fijos, porque muestran el tema aunque no esté activo */
  preview: { background: string; text: string }
}
