import { useRef } from "react"
import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls"
import { useElementHeightVar } from "@/hooks/useElementHeightVar"
import { useHiddenUnderHeader } from "@/hooks/useHiddenUnderHeader"
import { Logo } from "../Logo"
import { TalkToSomeoneButton } from "../TalkToSomeoneButton"

/* Folding and unfolding: grid tracks 0fr ↔ 1fr animate the width; the clip leaves room for the focus outline and ring */
const FOLD = "grid transition-[grid-template-columns,opacity] duration-300 ease-in-out motion-reduce:transition-none"
const FOLD_INNER = "min-w-0 overflow-clip [overflow-clip-margin:0.375rem]"

/**
 * Bordó in every theme, or the theme's background (data-header, see index.css). Logo on the left; on the right,
 * "¿Querés hablar con alguien?" and the "Ver mejor" gear, inside the header's max width. When the row has no room for
 * all three (phones with the bigger text sizes), the talk button goes under the header, full width, and scrolls away
 * with the page; once it's gone under the header, a square one with just its icon opens next to the gear.
 */
export const Header = () => {
  const ref = useRef<HTMLElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  useElementHeightVar(ref, "--header-h")
  const talkScrolledAway = useHiddenUnderHeader(stripRef, ref)

  return (
    <>
      <header ref={ref} className="sticky top-0 z-30 border-b border-line bg-header">
        {/* A container: whether everything fits on one row is measured in rem, so it follows the text size */}
        <div className="page-container @container">
          {/* The gear's label grows leftwards from the right end. One row only while everything fits, "Ajustes"
              included; else the talk button goes under the header (below) */}
          <div className="flex items-center gap-x-2 py-[0.3125rem]">
            <div className="on-header contents">
              <Logo />
            </div>
            <div className="on-header ml-auto flex @max-header-row:hidden">
              <TalkToSomeoneButton />
            </div>
            <div className="-mr-2.5 flex items-center @max-header-row:ml-auto">
              <div
                inert={!talkScrolledAway}
                className={`on-header hidden @max-header-row:grid ${FOLD} ${talkScrolledAway ? "grid-cols-[1fr]" : "grid-cols-[0fr] opacity-0"}`}
              >
                <div className={`flex pr-1 ${FOLD_INNER}`}>
                  <TalkToSomeoneButton iconOnly />
                </div>
              </div>
              <AccessibilityControls />
            </div>
          </div>
        </div>
      </header>

      {/* Under the header, not sticky: only when it has no room in it (the same container width, so the same check) */}
      <div className="on-header bg-header">
        <div className="page-container @container">
          <div ref={stripRef} className="hidden py-[0.3125rem] @max-header-row:flex">
            <TalkToSomeoneButton />
          </div>
        </div>
      </div>
    </>
  )
}
