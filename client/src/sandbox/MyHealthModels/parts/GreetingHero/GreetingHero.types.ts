import type { ReactNode } from "react"
import type { HealthProfile } from "../../MyHealthModels.types"

export type GreetingHeroProps = {
  profile: HealthProfile
  activeId: string
  onSelect: (id: string) => void
  /** What Auxi says (inside its speech bubble) */
  bubble?: ReactNode
  /** Age range and area under the name */
  details?: boolean
  /** Pills with the state of the record and the profile */
  summary?: boolean
  /** Without its own gradient band (the screen already has the home background) */
  plain?: boolean
  /** Bottom of the band (e.g. tabs) */
  children?: ReactNode
  className?: string
}
