import type { CursorToggleProps } from "./CursorToggle.types"

/** Interruptor con "Sí / No" escrito al lado, para quien no reconoce el símbolo (diseño 5a). */
export const CursorToggle = ({ checked, onChange }: CursorToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border-2 border-control-line bg-card px-3 py-2 text-left text-lg text-ink transition-colors hover:border-ink"
  >
    Cursor grande
    <span aria-hidden="true" className="flex flex-none items-center gap-2">
      <span className="text-base font-bold">{checked ? "Sí" : "No"}</span>
      <span
        className={`flex h-7 w-12 items-center rounded-full border-2 border-ink p-0.5 transition-colors ${checked ? "bg-ink" : "bg-card"}`}
      >
        <span
          className={`size-5 rounded-full transition-transform motion-reduce:transition-none ${checked ? "translate-x-5 bg-surface" : "bg-ink"}`}
        />
      </span>
    </span>
  </button>
)
