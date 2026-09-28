import { Outlet } from "react-router"
import { AccessibilityControls } from "@/components/accessibility/AccessibilityControls"

/** Root of every route (with or without AppLayout): whatever must be present on all screens. */
export const RootLayout = () => (
  <>
    <Outlet />
    <AccessibilityControls />
  </>
)
