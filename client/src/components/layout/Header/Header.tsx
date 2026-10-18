import { useRef } from "react"
import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls"
import { useElementHeightVar } from "@/hooks/useElementHeightVar"
import { Logo } from "../Logo"
import { TalkToSomeoneButton } from "../TalkToSomeoneButton"

/** Bordó in every theme, or the theme's background (data-header, see index.css). Logo on the left; on the right, "¿Querés hablar con alguien?" and the "Ver mejor" gear, inside the header's max width */
export const Header = () => {
  const ref = useRef<HTMLElement>(null)
  useElementHeightVar(ref, "--header-h")

  return (
    <header ref={ref} className="sticky top-0 z-30 border-b border-line bg-header">
      {/* The gear's label grows leftwards from the right end (ml-auto) */}
      <div className="page-container flex items-center gap-3 py-[0.3125rem]">
        <div className="on-header contents">
          <Logo />
        </div>
        <div className="ml-auto flex items-center gap-2 -mr-2.5">
          <div className="on-header contents">
            <TalkToSomeoneButton />
          </div>
          <AccessibilityControls />
        </div>
      </div>
    </header>
  )
}
