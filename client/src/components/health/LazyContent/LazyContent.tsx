import { lazy, Suspense } from "react"
import type { ComponentType } from "react"

/**
 * A section's content that is downloaded when the section is opened, not with the first load of the app.
 * Usage: `export const Section1 = lazyContent(() => import("./Section1.content"))`
 */
export const lazyContent = (load: () => Promise<{ default: ComponentType }>): ComponentType => {
  const Content = lazy(load)
  return function LazyContent() {
    return (
      <Suspense fallback={<p role="status" className="text-muted">Cargando…</p>}>
        <Content />
      </Suspense>
    )
  }
}
