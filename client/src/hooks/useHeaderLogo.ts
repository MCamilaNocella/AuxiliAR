import { useSyncExternalStore } from "react"
import { headerLogoStore } from "@/stores/headerLogoStore"

/** The logo sketch tried on the header (null: the real logo) and how to change it. */
export const useHeaderLogo = () => {
  const headerLogo = useSyncExternalStore(headerLogoStore.subscribe, headerLogoStore.getSnapshot)
  return { headerLogo, setHeaderLogo: headerLogoStore.set }
}
