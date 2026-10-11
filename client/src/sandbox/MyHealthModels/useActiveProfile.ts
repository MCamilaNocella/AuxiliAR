import { useState } from "react"
import { PROFILES } from "./MyHealthModels.constants"

/** Each model keeps its own selected profile, so they can be compared side by side */
export const useActiveProfile = () => {
  const [activeId, setActiveId] = useState(PROFILES[0].id)
  const profile = PROFILES.find(({ id }) => id === activeId) ?? PROFILES[0]
  return { profile, activeId, setActiveId }
}
