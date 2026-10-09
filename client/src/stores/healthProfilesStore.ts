import { HEALTH_PROFILES } from "@/data/myHealth"
import type { HealthProfile } from "@/types/myHealth"

let profiles = HEALTH_PROFILES

const listeners = new Set<() => void>()

/**
 * Mi Salud's profiles, shared by the screen and Auxi's chat (which fills them in). Only in memory for now:
 * they'll be saved in the database later. Compatible with useSyncExternalStore.
 */
export const healthProfilesStore = {
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  getSnapshot: () => profiles,
  add: (profile: HealthProfile) => {
    profiles = [...profiles, profile]
    listeners.forEach((listener) => listener())
  },
  remove: (id: string) => {
    profiles = profiles.filter((profile) => profile.id !== id)
    listeners.forEach((listener) => listener())
  },
  /** Changes one profile from its latest version (two quick answers don't overwrite each other) */
  update: (id: string, change: (profile: HealthProfile) => HealthProfile) => {
    profiles = profiles.map((profile) => (profile.id === id ? change(profile) : profile))
    listeners.forEach((listener) => listener())
  },
}
