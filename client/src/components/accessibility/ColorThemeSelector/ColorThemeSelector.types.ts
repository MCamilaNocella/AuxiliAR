import type { ColorTheme } from "@/types/accessibility"

export type ColorThemeSelectorProps = {
  value: ColorTheme
  onChange: (theme: ColorTheme) => void
}
