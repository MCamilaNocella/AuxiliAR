import type { HealthProfile, ProfileFieldKey } from "@/types/myHealth"

export type ProfileRowsProps = {
  profile: HealthProfile
  /** A button of the missing list: complete that piece of data (on the card, or with Auxi) */
  onAddField: (key: ProfileFieldKey) => void
}
