import { useState } from "react"
import { useHealthProfiles } from "@/hooks/useHealthProfiles"
import { healthProfilesStore } from "@/stores/healthProfilesStore"
import type { HealthProfile } from "@/types/myHealth"

/** The profiles (editable for now only in memory) and the one on view, picked with the chips under the greeting */
export const useActiveProfile = () => {
  const profiles = useHealthProfiles()
  const [activeId, setActiveId] = useState(profiles[0].id)
  const profile = profiles.find(({ id }) => id === activeId) ?? profiles[0]
  const updateProfile = (updated: HealthProfile) => healthProfilesStore.update(updated.id, () => updated)
  /** A new relative, with just the name and age, shown right away */
  const addRelative = ({ name, age }: { name: string; age: number }) => {
    const id = `relative-${Date.now()}`
    healthProfilesStore.add({ id, name, age, record: {}, ageTopics: [] })
    setActiveId(id)
  }
  /** Deletes a relative's profile and goes back to your own */
  const deleteProfile = (id: string) => {
    setActiveId(profiles.find(({ own }) => own)?.id ?? profiles[0].id)
    healthProfilesStore.remove(id)
  }
  return { profiles, profile, activeId, setActiveId, updateProfile, addRelative, deleteProfile }
}
