import { useState } from "react"
import { HEALTH_PROFILES } from "@/data/myHealth"

/** The profile on view (you or a relative), picked with the chips under the greeting */
export const useActiveProfile = () => {
  const [activeId, setActiveId] = useState(HEALTH_PROFILES[0].id)
  const profile = HEALTH_PROFILES.find(({ id }) => id === activeId) ?? HEALTH_PROFILES[0]
  return { profile, activeId, setActiveId }
}
