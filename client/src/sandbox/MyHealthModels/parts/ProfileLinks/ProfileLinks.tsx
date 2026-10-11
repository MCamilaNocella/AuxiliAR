import { Trash2 } from "lucide-react"
import type { ProfileLinksProps } from "./ProfileLinks.types"

/** Bottom of the screen: edit all data, and delete the profile (it used to live in accessibility) */
export const ProfileLinks = ({ onDark = false }: ProfileLinksProps) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <button
      type="button"
      className={`cursor-pointer bg-transparent p-0 font-bold underline underline-offset-4 ${onDark ? "text-on-home hover:text-on-home-muted" : "text-ink hover:text-brand"}`}
    >
      Ver y editar todos mis datos
    </button>
    <button
      type="button"
      className={`flex cursor-pointer items-center gap-1.5 bg-transparent p-0 font-bold underline underline-offset-4 ${onDark ? "text-on-home-muted hover:text-on-home" : "text-alert-text"}`}
    >
      <Trash2 aria-hidden="true" className="size-4 flex-none" />
      Borrar este perfil
    </button>
  </div>
)
