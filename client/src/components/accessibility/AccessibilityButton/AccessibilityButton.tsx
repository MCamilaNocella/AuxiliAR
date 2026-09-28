import { PersonStanding } from "lucide-react"
import type { AccessibilityButtonProps } from "./AccessibilityButton.types"

/** Fixed tab on the right edge, vertically centered, that opens "Ver mejor". Icon only: the name is in aria-label. */
export const AccessibilityButton = ({ expanded, onClick }: AccessibilityButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Ver mejor: opciones de accesibilidad"
    aria-haspopup="dialog"
    aria-expanded={expanded}
    title="Ver mejor"
    className="fixed top-1/2 right-0 z-40 flex h-12 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-l-lg bg-brand text-on-brand shadow-[-2px_2px_8px_rgba(0,0,0,.15)] transition-colors hover:bg-brand-dark"
  >
    <PersonStanding aria-hidden="true" className="size-8" />
  </button>
)
