import { useEffect, useLayoutEffect, useRef } from "react"
import { CategorySectionList } from "../CategorySectionList"
import type { CategorySectionsDrawerProps } from "./CategorySectionsDrawer.types"

const transition = "duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"

/**
 * Mobile section menu: slides in from the left, between the category bar and the
 * bottom navigation, so neither bar gets covered. Not a modal <dialog> on purpose:
 * the top layer would cover the help bot, which must stay above everything.
 * Esc, a tap outside or choosing a section closes it.
 */
export const CategorySectionsDrawer = ({
  id,
  label,
  open,
  focusOnOpen,
  onClose,
  anchorRef,
  sections,
  activeSectionId,
  onSelectSection,
}: CategorySectionsDrawerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLElement>(null)

  // Hangs from the bottom of the bar (it moves with the emergency bar, so it's measured on each open)
  useLayoutEffect(() => {
    const anchor = anchorRef.current
    const container = containerRef.current
    if (!open || !anchor || !container) return

    const place = () => container.style.setProperty("--drawer-top", `${anchor.getBoundingClientRect().bottom}px`)
    place()
    window.addEventListener("resize", place)
    return () => window.removeEventListener("resize", place)
  }, [open, anchorRef])

  // While open: page scroll is locked (the drawer stays aligned to the bar), Esc closes,
  // focus goes to the current section (if asked) and, on close, back to the menu button
  useEffect(() => {
    const panel = panelRef.current
    if (!open || !panel) return
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = "hidden"

    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    if (focusOnOpen) {
      // The current section, or the first one if none is chosen yet
      const target = panel.querySelector<HTMLElement>("[aria-current=true]") ?? panel.querySelector<HTMLElement>("button")
      target?.focus({ preventScroll: true })
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      root.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleKeyDown)
      if (panel.contains(document.activeElement)) opener?.focus({ preventScroll: true })
    }
  }, [open, focusOnOpen, onClose])

  const handleSelect = (sectionId: string) => {
    onSelectSection(sectionId)
    onClose()
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-x-0 top-(--drawer-top) bottom-(--bottom-nav-h) overflow-hidden lg:hidden"
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`absolute inset-0 bg-black/30 transition-opacity ${transition} ${open ? "pointer-events-auto opacity-100" : "opacity-0"}`}
      />
      {/* Visibility switches instantly on open (so focus can land inside) and only after the slide on close.
          80% of the screen, but never so narrow the names break apart (large text on small phones → full width) */}
      <nav
        ref={panelRef}
        id={id}
        aria-label={label}
        className={`pointer-events-auto absolute inset-y-0 left-0 w-[max(80vw,min(100vw,17rem))] max-w-80 overflow-y-auto overscroll-contain border-r border-line-strong bg-surface-alt p-4 text-ink shadow-2xl ${transition} ${open ? "visible translate-x-0 transition-[translate]" : "invisible -translate-x-full transition-[translate,visibility]"}`}
      >
        <CategorySectionList sections={sections} activeSectionId={activeSectionId} onSelectSection={handleSelect} />
      </nav>
    </div>
  )
}
