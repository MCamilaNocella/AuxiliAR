import { useRef } from "react"
import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls"
import { useElementHeightVar } from "@/hooks/useElementHeightVar"
import { Logo } from "../Logo"

/** Logo, plus the "Ver mejor" gear pinned to the right corner (vertically centered) */
export const Header = () => {
  const ref = useRef<HTMLElement>(null)
  useElementHeightVar(ref, "--header-h")

  return (
    <header ref={ref} className="sticky top-0 z-30 border-b border-line bg-card">
      {/* min-h-11: same height as the gear; pr-16 keeps the logo clear of it */}
      <div className="mx-auto flex min-h-11 max-w-310 items-center py-2.5 pr-16 pl-4 sm:pl-6 lg:pl-8">
        <Logo />
      </div>
      <div className="absolute top-1/2 right-2 -translate-y-1/2 sm:right-3">
        <AccessibilityControls />
      </div>
    </header>
  )
}
