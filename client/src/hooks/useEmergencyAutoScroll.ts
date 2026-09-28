import { useLayoutEffect, type RefObject } from "react"
import { useLocation } from "react-router"
import { PATHS } from "@/router/paths"
import { animateWindowScroll, prefersReducedMotion, scrollTopBelowHeader } from "@/utils/scroll"

/** Tiempo que la barra de emergencias queda a la vista antes de deslizarse. */
const REVEAL_DELAY_MS = 600
const SCROLL_DURATION_MS = 700

// Cualquiera de estos gestos significa que el usuario tomó el control del scroll
const USER_SCROLL_EVENTS = ["wheel", "touchstart", "pointerdown", "keydown"] as const

/**
 * Al entrar a una sección interna, la barra de emergencias se muestra un
 * instante y después la página se desliza hasta el contenido, que queda justo
 * debajo del header sticky. La animación deja claro que la barra existe y que
 * se puede volver a ella scrolleando hacia arriba (o con el botón "Emergencia").
 *
 * Debe ejecutarse después de <ScrollRestoration />, que en cada navegación
 * restaura la posición guardada (atrás/adelante) o vuelve arriba de todo.
 * Por eso solo actuamos si la página quedó en el tope: así se respetan la
 * restauración, los links con #ancla y `preventScrollReset`.
 */
export const useEmergencyAutoScroll = (contentRef: RefObject<HTMLElement | null>) => {
  const location = useLocation()

  useLayoutEffect(() => {
    if (location.pathname === PATHS.home || location.hash) return
    if (window.scrollY > 0) return

    const content = contentRef.current
    if (!content) return

    // El foco va al contenido de entrada: teclado y lectores de pantalla arrancan ahí
    content.focus({ preventScroll: true })

    if (prefersReducedMotion()) {
      window.scrollTo({ top: scrollTopBelowHeader(content), behavior: "instant" })
      return
    }

    let cancelAnimation: (() => void) | undefined
    const timer = window.setTimeout(() => {
      // Si mientras tanto el usuario ya scrolleó, no lo movemos
      if (window.scrollY > 0) return stop()
      cancelAnimation = animateWindowScroll(() => scrollTopBelowHeader(content), SCROLL_DURATION_MS, stop)
    }, REVEAL_DELAY_MS)

    const stop = () => {
      window.clearTimeout(timer)
      cancelAnimation?.()
      USER_SCROLL_EVENTS.forEach((type) => window.removeEventListener(type, stop))
    }
    USER_SCROLL_EVENTS.forEach((type) => window.addEventListener(type, stop, { passive: true }))

    return stop
  }, [location, contentRef])
}
