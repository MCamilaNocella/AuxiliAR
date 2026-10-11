import { useSyncExternalStore } from "react"
import { healthProfilesStore } from "@/stores/healthProfilesStore"

/** Mi Salud's profiles, kept up to date when the chat fills them in */
export const useHealthProfiles = () => useSyncExternalStore(healthProfilesStore.subscribe, healthProfilesStore.getSnapshot)
