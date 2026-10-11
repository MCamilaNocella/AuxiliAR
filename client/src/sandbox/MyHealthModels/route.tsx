import type { RouteObject } from "react-router"
import { MyHealthModels } from "./MyHealthModels"

/** Picked up by the router's sandbox glob (src/router/index.tsx) */
export const sandboxRoute: RouteObject = { path: "/mi-salud-modelos", element: <MyHealthModels /> }
