import { useState } from "react"
import { useHealthProfiles } from "@/hooks/useHealthProfiles"
import { healthProfilesStore } from "@/stores/healthProfilesStore"
import type { HealthProfile } from "@/types/myHealth"

/**
 * Shown when there are no profiles: the screen stays the same, empty, at 0%. Filling something in (on the card or
 * with Auxi) creates it under this id, as your own profile, and it stays on view
 */
const EMPTY_PROFILE: HealthProfile = { id: "new-profile", name: "", own: true, record: {}, ageTopics: [] }

/**
 * The profiles (editable for now only in memory) and the one on view, picked with the chips under the greeting.
 * `empty`: there are no profiles left, and `profile` is a blank one.
 */
export const useActiveProfile = () => {
  const profiles = useHealthProfiles()
  const [activeId, setActiveId] = useState(profiles[0]?.id ?? EMPTY_PROFILE.id)
  const profile = profiles.find(({ id }) => id === activeId) ?? profiles[0] ?? EMPTY_PROFILE
  const empty = profiles.length === 0
  const updateProfile = (updated: HealthProfile) => healthProfilesStore.update(updated.id, () => updated)
  /** A new profile, with just the name and age, shown right away. The first one after deleting them all is your own */
  const addProfile = ({ name, age }: { name: string; age: number }) => {
    const id = `profile-${Date.now()}`
    healthProfilesStore.add({ id, name, age, own: empty || undefined, record: {}, ageTopics: [] })
    setActiveId(id)
  }
  /** Deletes a profile; if it was the one on view, the next one shows (or the previous, if it was the last) */
  const deleteProfile = (id: string) => {
    const index = profiles.findIndex((candidate) => candidate.id === id)
    const rest = profiles.filter((candidate) => candidate.id !== id)
    if (id === profile.id) setActiveId(rest[Math.min(index, rest.length - 1)]?.id ?? EMPTY_PROFILE.id)
    healthProfilesStore.remove(id)
  }
  return { profiles, profile, empty, activeId, setActiveId, updateProfile, addProfile, deleteProfile }
}
