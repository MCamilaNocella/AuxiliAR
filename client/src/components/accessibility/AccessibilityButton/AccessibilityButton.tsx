import type { ReactNode } from "react"
import { Settings } from "lucide-react"
import type { AccessibilityButtonProps } from "./AccessibilityButton.types"

/** The gear's two spins (on load, on press), shared by the gear and its glint copy so they stay in sync */
const GearSpin = ({ spun, children }: { spun: boolean; children: ReactNode }) => (
  <span className="flex animate-gear-spin motion-reduce:animate-none">
    <span
      className={`flex transition-[rotate] duration-800 ease-in-out motion-reduce:transition-none ${spun ? "rotate-180" : "rotate-0 delay-300"}`}
    >
      {children}
    </span>
  </span>
)

/**
 * Gear in the header's right corner that opens "Ver mejor" (accessibility settings).
 *  - Page load (the header mounts once per load): the "Ajustes" label rolls out of the gear to its
 *    left, stays 5s and rolls back in, the gear spinning both ways; meanwhile a metallic glint
 *    sweeps across both, right to left and back.
 *  - Press: the gear turns half a turn; on close it turns back once the panel has slid away.
 * The button is anchored to the right, so it grows leftwards.
 * Glint: a copy of the gear/text in the shine color on top, visible only through a moving mask.
 * The gear's mask sits outside its spin, so the light always travels the same way as the label's.
 */
export const AccessibilityButton = ({ expanded, spun, onClick }: AccessibilityButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Ajustes: opciones de accesibilidad para ver mejor"
    aria-haspopup="dialog"
    aria-expanded={expanded}
    title="Ajustes"
    className="flex h-11 cursor-pointer items-center rounded-full bg-card text-ink transition-colors hover:bg-field"
  >
    {/* Grid columns 0fr → 1fr → 0fr open and close the label's width smoothly. -mr-1: closer to the gear */}
    <span aria-hidden="true" className="-mr-1 grid animate-label-reveal grid-cols-[0fr] motion-reduce:animate-none">
      <span className="min-w-0 overflow-hidden">
        <span className="relative block animate-label-roll pl-3.5 text-base font-bold whitespace-nowrap motion-reduce:animate-none">
          Ajustes
          <span className="absolute inset-y-0 right-0 left-3.5 shine-mask animate-shine-sweep text-shine motion-reduce:hidden">
            Ajustes
          </span>
        </span>
      </span>
    </span>
    <span className="grid size-11 flex-none place-items-center">
      <span className="col-start-1 row-start-1">
        <GearSpin spun={spun}>
          <Settings aria-hidden="true" className="size-6.5" />
        </GearSpin>
      </span>
      <span className="col-start-1 row-start-1 shine-mask animate-shine-sweep text-shine motion-reduce:hidden">
        <GearSpin spun={spun}>
          <Settings aria-hidden="true" className="size-6.5" />
        </GearSpin>
      </span>
    </span>
  </button>
)
