import { lazy, Suspense } from "react"
import type { ComponentType } from "react"
import type { LazyContentComponent } from "./LazyContent.types"

/**
 * A section's content that is downloaded apart from the first load of the app. The category screen preloads every section as soon
 * as the category opens and waits for it before showing it, so no "Cargando…" is ever shown (there is no fallback).
 * Usage: `export const Section1 = lazyContent(() => import("./Section1.content"))`
 */
export const lazyContent = (load: () => Promise<{ default: ComponentType }>): LazyContentComponent => {
  let download: Promise<{ default: ComponentType }> | undefined
  const preload = () => (download ??= load())
  const Content = lazy(preload)
  function LazyContent() {
    return (
      <Suspense fallback={null}>
        <Content />
      </Suspense>
    )
  }
  return Object.assign(LazyContent, { preload })
}
