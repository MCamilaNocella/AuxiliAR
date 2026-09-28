import { TEXT_SCALES } from "@/data/accessibility"
import { GLYPH_SIZE_CLASSES } from "./TextSizeSelector.constants"
import type { TextSizeSelectorProps } from "./TextSizeSelector.types"

export const TextSizeSelector = ({ value, onChange }: TextSizeSelectorProps) => (
  <div>
    <div className="grid grid-cols-5 items-end gap-1.5">
      {TEXT_SCALES.map((option, index) => (
        <label
          key={option.value}
          className="flex min-h-12 items-center justify-center rounded-lg border-2 border-control-line bg-card font-bold text-ink transition-colors hover:border-ink has-checked:border-ink has-checked:bg-ink has-checked:text-surface has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand"
        >
          <input
            type="radio"
            name="text-scale"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            aria-label={option.label}
            className="sr-only"
          />
          <span aria-hidden="true" className={`${GLYPH_SIZE_CLASSES[index]} leading-none`}>
            A
          </span>
        </label>
      ))}
    </div>
    <div aria-hidden="true" className="mt-1.5 flex justify-between text-sm text-muted">
      <span>Más chico</span>
      <span>Más grande</span>
    </div>
  </div>
)
