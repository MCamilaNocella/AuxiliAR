import { useRef } from "react"
import { Outlet, ScrollRestoration } from "react-router"
import { useEmergencyAutoScroll } from "@/hooks/useEmergencyAutoScroll"
import { getScrollRestorationKey } from "@/router/scrollRestorationKey"
import { BottomNav } from "../BottomNav"
import { EmergencyBar } from "../EmergencyBar"
import { Footer } from "../Footer"
import { Header } from "../Header"
import { SkipLink } from "../SkipLink"
import { CONTENT_ID } from "./AppLayout.constants"

/**
 * Layout común a todas las páginas:
 *  header (sticky) → barra de emergencias → contenido → footer, + navegación inferior (fija).
 */
export const AppLayout = () => {
  const contentRef = useRef<HTMLElement>(null)
  // Corre después del <ScrollRestoration /> de abajo (los efectos de los hijos van primero)
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
        // Siempre al menos una pantalla de alto: garantiza que se pueda
        // desplazar lo suficiente para ocultar la barra de emergencias.
        className="min-h-[calc(100dvh-var(--header-h)-var(--bottom-nav-h))] outline-none"
      >
        <Outlet />
      </main>

      <Footer />
      <BottomNav />
      <ScrollRestoration getKey={getScrollRestorationKey} />
    </div>
  )
}
