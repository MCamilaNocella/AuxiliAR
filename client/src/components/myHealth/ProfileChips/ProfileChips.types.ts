import type { HealthProfile } from "@/types/myHealth"

export type ProfileChipsProps = {
  profiles: HealthProfile[]
  activeId: string
  onSelect: (id: string) => void
}
