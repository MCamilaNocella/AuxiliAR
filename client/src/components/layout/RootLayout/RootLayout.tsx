import { Outlet } from "react-router"
import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls"

/** Raíz de todas las rutas (con y sin AppLayout): lo que tiene que estar en todas las pantallas. */
export const RootLayout = () => (
  <>
    <Outlet />
    <AccessibilityControls />
  </>
)
