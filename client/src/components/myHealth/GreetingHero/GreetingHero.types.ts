import type { ReactNode } from "react"
import type { HealthProfile } from "@/types/myHealth"

export type GreetingHeroProps = {
  profiles: HealthProfile[]
  profile: HealthProfile
  activeId: string
  onSelect: (id: string) => void
  /** "Agregar familiar" */
  onAddRelative: () => void
  /** What Auxi says (inside its speech bubble) */
  bubble?: ReactNode
}
