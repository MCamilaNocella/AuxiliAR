import type { ReactNode } from "react"
import type { HealthProfile } from "@/types/myHealth"

export type GreetingHeroProps = {
  profile: HealthProfile
  activeId: string
  onSelect: (id: string) => void
  /** What Auxi says (inside its speech bubble) */
  bubble?: ReactNode
}
