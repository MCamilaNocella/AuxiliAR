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
  return { profiles, profile, activeId, setActiveId, updateProfile }
}
