import type { Ref } from "react"
import type { CardFieldKey, HealthProfile } from "@/types/myHealth"

/** What the screen can ask the card to do */
export type EmergencyPassHandle = {
  /** Edit mode with the focus on that field */
  edit: (field: CardFieldKey) => void
}

export type EmergencyPassProps = {
  profile: HealthProfile
  /** "Guardar" in edit mode: the profile with the new data */
  onSave: (profile: HealthProfile) => void
  ref?: Ref<EmergencyPassHandle>
  /** There's no profile: "Editar" reads "Agregar perfil", highlighted (it works the same) */
  noProfile?: boolean
}
