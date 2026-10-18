import { Check } from "lucide-react"
import { HEADER_STYLES, REAL_LOGO_SKETCH_ID } from "@/data/headerStyle"
import { useHeaderLogo } from "@/hooks/useHeaderLogo"
import { useHeaderStyle } from "@/hooks/useHeaderStyle"
import { BACKDROPS } from "./LogoSketches.constants"
import type { Backdrop, LogoSketch } from "./LogoSketches.types"

/** What each option paints, as small strips: the bordó, or the three theme backgrounds */
const OPTION_STRIPS = {
  brand: [BACKDROPS[0]],
  theme: BACKDROPS.slice(1),
}

/** Bordó or "según el tema": changes the real header (it's saved, so it stays while browsing the app) */
export const HeaderStyleSelector = () => {
  const { headerStyle, setHeaderStyle } = useHeaderStyle()

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {HEADER_STYLES.map(({ value, label, description }) => {
        const selected = headerStyle === value
        return (
          <label
            key={value}
            className="flex min-w-0 cursor-pointer flex-col gap-2 rounded-lg border-2 border-control-line bg-card p-3 text-ink transition-colors hover:border-ink has-checked:border-ink has-checked:ring-2 has-checked:ring-ink has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand"
          >
            <input
              type="radio"
              name="header-style"
              value={value}
              checked={selected}
              onChange={() => setHeaderStyle(value)}
              className="sr-only"
            />
            <span aria-hidden="true" className="flex h-8 overflow-hidden rounded-md border border-[#d6cfcc]">
              {OPTION_STRIPS[value].map(({ id, background }) => (
                <span key={id} className="flex-1" style={{ background }} />
              ))}
            </span>
            <span className="flex items-center gap-1 font-bold">
              {label}
              {selected && <Check aria-hidden="true" className="size-4 flex-none" />}
            </span>
            <span className="text-sm text-muted">{description}</span>
          </label>
        )
      })}
    </div>
  )
}

/** Three backgrounds side by side; four in two rows */
const SWATCHES_GRID = { 3: "sm:grid-cols-3", 4: "sm:grid-cols-2" }


/** One sketch, tried on each of the given backgrounds. Tapping it puts it on the header (a radio: one at a time) */
export const SketchCard = ({ id, name, description, render, backdrops }: LogoSketch & { backdrops: Backdrop[] }) => {
  const { headerLogo, setHeaderLogo } = useHeaderLogo()
  const selected = (headerLogo ?? REAL_LOGO_SKETCH_ID) === id

  return (
    <label className="flex min-w-0 cursor-pointer flex-col gap-3 rounded-xl bg-card p-4 transition-shadow hover:ring-2 hover:ring-control-line has-checked:ring-3 has-checked:ring-ink has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand">
      <input
        type="radio"
        name="header-logo"
        value={id}
        checked={selected}
        onChange={() => setHeaderLogo(id === REAL_LOGO_SKETCH_ID ? null : id)}
        className="sr-only"
      />
      <span className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <span className="flex min-w-0 flex-col">
          <span className="text-lg font-extrabold text-brand">{name}</span>
          <span className="text-sm text-muted">{description}</span>
        </span>
        <span
          className={`flex flex-none items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${selected ? "bg-ink text-card" : "bg-field text-muted"}`}
        >
          {selected && <Check aria-hidden="true" className="size-4" />}
          {selected ? "En el header" : "Tocá para probarlo"}
        </span>
      </span>
      <span className={`grid gap-2 ${SWATCHES_GRID[backdrops.length as 3 | 4]}`}>
        {backdrops.map((backdrop) => (
          <span key={backdrop.id} className="flex min-w-0 flex-col gap-1">
            <span
              className="flex min-h-24 items-center justify-center overflow-hidden rounded-lg border border-[#d6cfcc] px-3 py-5"
              style={{ background: backdrop.background }}
            >
              {render(backdrop)}
            </span>
            <span className="text-xs text-muted">{backdrop.label}</span>
          </span>
        ))}
      </span>
    </label>
  )
}
