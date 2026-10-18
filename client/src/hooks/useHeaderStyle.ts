import { useSyncExternalStore } from "react"
import { headerStyleStore } from "@/stores/headerStyleStore"

/** Header color (bordó or the theme's) and how to change it. */
export const useHeaderStyle = () => {
  const headerStyle = useSyncExternalStore(headerStyleStore.subscribe, headerStyleStore.getSnapshot)
  return { headerStyle, setHeaderStyle: headerStyleStore.set }
}
