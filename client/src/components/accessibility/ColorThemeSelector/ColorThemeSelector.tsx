import { Check } from "lucide-react"
import { COLOR_THEMES } from "@/data/accessibility"
import { THEMES_GRID } from "./ColorThemeSelector.constants"
import type { ColorThemeSelectorProps } from "./ColorThemeSelector.types"

/** Cada tema se elige viendo una muestra de cómo queda (diseño 5b). */
export const ColorThemeSelector = ({ value, onChange }: ColorThemeSelectorProps) => (
  <div className={`grid gap-2 ${THEMES_GRID}`}>
    {COLOR_THEMES.map(({ value: theme, label, preview }) => {
      const selected = value === theme
      return (
        <label
          key={theme}
          className="flex min-w-0 flex-col gap-1.5 rounded-lg border-2 border-control-line bg-card p-1.5 text-ink transition-colors hover:border-ink has-checked:border-ink has-checked:ring-2 has-checked:ring-ink has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand"
        >
          <input
            type="radio"
            name="color-theme"
            value={theme}
            checked={selected}
            onChange={() => onChange(theme)}
            className="sr-only"
          />
          <span
            aria-hidden="true"
            className="flex h-12 items-center justify-center rounded-md border border-[#d6cfcc] text-xl font-bold"
            style={{ background: preview.background, color: preview.text }}
          >
            Aa
          </span>
          <span className="flex flex-wrap items-center justify-center gap-x-1 text-center text-sm/tight font-bold wrap-break-word">
            {label}
            {selected && <Check aria-hidden="true" className="size-4 flex-none" />}
          </span>
        </label>
      )
    })}
  </div>
)
