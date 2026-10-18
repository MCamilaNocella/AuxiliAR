import { useSyncExternalStore } from "react"
import { headerLogoAlignmentStore } from "@/stores/headerLogoAlignmentStore"

/** How the header logo sits (tried on /logos) and how to change it. */
export const useHeaderLogoAlignment = () => {
  const headerLogoAlignment = useSyncExternalStore(headerLogoAlignmentStore.subscribe, headerLogoAlignmentStore.getSnapshot)
  return { headerLogoAlignment, setHeaderLogoAlignment: headerLogoAlignmentStore.set }
}
