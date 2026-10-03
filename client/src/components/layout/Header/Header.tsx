import { useRef } from "react"
import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls"
import { useElementHeightVar } from "@/hooks/useElementHeightVar"
import { Logo } from "../Logo"

/** Logo on the left and the "Ver mejor" gear on the right, both inside the header's max width */
export const Header = () => {
  const ref = useRef<HTMLElement>(null)
  useElementHeightVar(ref, "--header-h")

  return (
    <header ref={ref} className="sticky top-0 z-30 border-b border-line bg-card">
      {/* The gear's label grows leftwards from the right end (ml-auto) */}
      <div className="mx-auto flex max-w-380 items-center gap-3 px-4 py-1.5 sm:px-6 lg:px-8">
        <Logo />
        <div className="ml-auto -mr-2.5">
          <AccessibilityControls />
        </div>
      </div>
    </header>
  )
}
