import type { HealthProfile, ProfileFieldKey } from "@/types/myHealth"

export type ProfileRowsProps = {
  profile: HealthProfile
  /** There's no profile (a blank one is shown): the age line hides */
  empty: boolean
  /** A button of the missing list: complete that piece of data (on the card, or with Auxi) */
  onAddField: (key: ProfileFieldKey) => void
}
