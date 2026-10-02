import { PersonStanding } from "lucide-react"
import { useLongPressVerticalDrag } from "@/hooks/useLongPressVerticalDrag"
import { loadButtonTop, saveButtonTop } from "@/utils/accessibilityButtonPosition"
import type { AccessibilityButtonProps } from "./AccessibilityButton.types"

/**
 * Fixed tab on the right edge that opens "Ver mejor". Its top edge is pinned so the collapsed
 * (icon-only) tab ends up vertically centered and the label folds upwards, not towards the middle.
 * Icon + vertical "Accesibilidad" label; on load (mounted once in RootLayout) it glows for 3s,
 * then the label slides up under the icon and only the icon stays.
 * Press and hold (or swipe up or down) to drag it along the right edge; the spot is remembered on this device.
 * Touch: the <button> itself is a transparent hit area larger than the visible tab (8px above,
 * 16px below where fingers tend to land, 12px to the left), so taps and drags work on that margin
 * too. `touch-none` makes moving the finger on it drag the tab instead of scrolling the page.
 */
export const AccessibilityButton = ({ expanded, onClick }: AccessibilityButtonProps) => {
  const { top, dragging, guardClick, handlers } = useLongPressVerticalDrag({
    initialTop: loadButtonTop(),
    onDrop: saveButtonTop,
  })

  return (
    <button
      type="button"
      onClick={guardClick(onClick)}
      {...handlers}
      aria-label="Accesibilidad: opciones para ver mejor"
      aria-haspopup="dialog"
      aria-expanded={expanded}
      title="Ver mejor"
      // Saved spot: CSS clamp keeps it between the bars if the screen gets smaller (rotation, resize)
      style={
        top === null
          ? undefined
          : { top: `clamp(calc(var(--header-h) - 0.5rem), ${top * 100}%, 100% - var(--bottom-nav-h) - 4.5rem)` }
      }
      data-dragging={dragging || undefined}
      className="group fixed top-[calc(50%-2rem)] right-0 z-40 cursor-pointer pt-2 pb-4 pl-3 touch-none select-none [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] [view-transition-name:a11y-button] focus-visible:outline-none data-dragging:cursor-grabbing lg:top-[calc(50%-1.75rem)]"
    >
      {/* The visible tab: a bit bigger on phones and tablets, easier to hit with a finger */}
      <span className="flex w-11 animate-attention-glow flex-col items-center rounded-l-lg bg-brand py-2 lg:w-9 lg:py-1.5 text-on-brand shadow-[-2px_2px_8px_rgba(0,0,0,.15)] transition-colors group-hover:bg-brand-dark group-focus-visible:outline-3 group-focus-visible:outline-offset-2 group-focus-visible:outline-brand group-data-dragging:bg-brand-dark group-data-dragging:shadow-[-4px_4px_16px_rgba(0,0,0,.3)]">
        <PersonStanding aria-hidden="true" className="size-8 shrink-0 lg:size-7" />
        {/* Grid rows 1fr → 0fr shrink the label's height smoothly while its content slides up */}
        <span aria-hidden="true" className="grid animate-label-collapse">
          <span className="min-h-0 overflow-hidden">
            <span className="block animate-label-slide-up pt-1">
              <span className="block rotate-180 text-base font-bold lg:text-sm tracking-wide [writing-mode:vertical-rl]">
                Accesibilidad
              </span>
            </span>
          </span>
        </span>
      </span>
    </button>
  )
}
