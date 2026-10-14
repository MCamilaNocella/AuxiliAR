import { useRef } from "react"
import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls"
import { useElementHeightVar } from "@/hooks/useElementHeightVar"
import { Logo } from "../Logo"
import { TalkToSomeoneButton } from "../TalkToSomeoneButton"

/** Logo on the left; on the right, "¿Necesitás hablar con alguien?" and the "Ver mejor" gear, inside the header's max width */
export const Header = () => {
  const ref = useRef<HTMLElement>(null)
  useElementHeightVar(ref, "--header-h")

  return (
    <header ref={ref} className="sticky top-0 z-30 border-b border-line bg-card">
      {/* The gear's label grows leftwards from the right end (ml-auto) */}
      <div className="page-container flex items-center gap-3 py-1.5">
        <Logo />
        <div className="ml-auto flex items-center gap-2 -mr-2.5">
          <TalkToSomeoneButton />
          <AccessibilityControls />
        </div>
      </div>
    </header>
  )
}
