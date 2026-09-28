import type { Location } from "react-router"

const DOCUMENT_ID = `${Date.now()}-${Math.random().toString(36).slice(2)}`

/**
 * `getKey` for <ScrollRestoration />. The first entry of every load without
 * history.state (typed URL, external link) always has key "default", so it would
 * inherit the position saved by a previous load in the same tab and undo the
 * auto-scroll. We give it a key that is unique per document.
 */
export const getScrollRestorationKey = (location: Location) =>
  location.key === "default" ? `default-${DOCUMENT_ID}` : location.key
