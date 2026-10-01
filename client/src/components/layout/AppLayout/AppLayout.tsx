import { useRef } from "react"
import { Outlet, ScrollRestoration } from "react-router"
import { HelpBot } from "@/components/help/HelpBot"
import { useEmergencyAutoScroll } from "@/hooks/useEmergencyAutoScroll"
import { getScrollRestorationKey } from "@/router/scrollRestorationKey"
import { BottomNav } from "../BottomNav"
import { EmergencyBar } from "../EmergencyBar"
import { Footer } from "../Footer"
import { Header } from "../Header"
import { SkipLink } from "../SkipLink"
import { CONTENT_ID } from "./AppLayout.constants"

/**
 * Layout shared by every page:
 *  header (sticky) → emergency bar → content → footer, + bottom navigation (fixed).
 */
export const AppLayout = () => {
  const contentRef = useRef<HTMLElement>(null)
  // Runs after the <ScrollRestoration /> below (children's effects run first)
  useEmergencyAutoScroll(contentRef)

  return (
    <div className="pb-(--bottom-nav-h)">
      <SkipLink targetId={CONTENT_ID} />

      <Header />
      <EmergencyBar />

      <main
        ref={contentRef}
        id={CONTENT_ID}
        tabIndex={-1}
        // Always at least one screen tall: guarantees the page can scroll
        // far enough to hide the emergency bar.
        // Named view transition: only the content animates when changing screens, the bars stay still.
        className="min-h-(--content-min-h) outline-none [view-transition-name:page-content]"
      >
        <Outlet />
      </main>

      <Footer />
      {/* TODO: pass onOpen once the help chat exists */}
      <HelpBot />
      <BottomNav />
      <ScrollRestoration getKey={getScrollRestorationKey} />
    </div>
  )
}
