import type { Location } from "react-router"

const DOCUMENT_ID = `${Date.now()}-${Math.random().toString(36).slice(2)}`

/**
 * `getKey` para <ScrollRestoration />. La primera entrada de cada carga sin
 * history.state (URL tipeada, link externo) siempre tiene key "default", así
 * que heredaría la posición guardada de una carga anterior en la misma pestaña
 * y deshacería el auto-scroll. Le damos una key única por documento.
 */
export const getScrollRestorationKey = (location: Location) =>
  location.key === "default" ? `default-${DOCUMENT_ID}` : location.key
