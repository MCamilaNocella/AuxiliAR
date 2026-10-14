import type { ComponentType } from "react"

/** A section's content that downloads on demand; `preload` downloads it ahead (once), so it can show with no loading message */
export type LazyContentComponent = ComponentType & { preload: () => Promise<unknown> }
