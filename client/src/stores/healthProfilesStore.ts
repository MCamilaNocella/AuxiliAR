import type { HealthProfile } from "@/types/myHealth"

// Starts with no profiles: Mi Salud shows its empty state until one is added
let profiles: HealthProfile[] = []

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
  /**
   * Changes one profile from its latest version (two quick answers don't overwrite each other). A profile that
   * doesn't exist yet (Mi Salud with none, filled in from the card or Auxi) is created blank first: the first one is your own
   */
  update: (id: string, change: (profile: HealthProfile) => HealthProfile) => {
    profiles = profiles.some((profile) => profile.id === id)
      ? profiles.map((profile) => (profile.id === id ? change(profile) : profile))
      : [...profiles, change({ id, name: "", own: profiles.length === 0 || undefined, record: {}, ageTopics: [] })]
    listeners.forEach((listener) => listener())
  },
}
