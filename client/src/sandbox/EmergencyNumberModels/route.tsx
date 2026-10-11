import type { RouteObject } from "react-router"
import { EmergencyNumberModels } from "./EmergencyNumberModels"
import { LabelOnTopBigTitle } from "./models/LabelOnTop"

/** Picked up by the router's sandbox glob (src/router/index.tsx). The bar on top shows the N3b cards (EmergencyBar reads `handle.emergencyNumbers`; branches without that ignore it) */
export const sandboxRoute: RouteObject = {
  path: "/numeros-modelos",
  element: <EmergencyNumberModels />,
  handle: { emergencyNumbers: LabelOnTopBigTitle },
}
