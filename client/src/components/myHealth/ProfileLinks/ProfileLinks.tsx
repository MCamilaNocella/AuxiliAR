import { Trash2 } from "lucide-react"
import type { ProfileLinksProps } from "./ProfileLinks.types"

/** Bottom of the screen: edit all data, and delete the profile (only relatives' ones) */
export const ProfileLinks = ({ onDelete }: ProfileLinksProps) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <button type="button" className="cursor-pointer bg-transparent p-0 font-bold text-ink underline underline-offset-4 hover:text-brand">
      Ver y editar todos mis datos
    </button>
    {onDelete && (
      <button
        type="button"
        onClick={onDelete}
        aria-haspopup="dialog"
        className="flex cursor-pointer items-center gap-1.5 bg-transparent p-0 font-bold text-alert-text underline underline-offset-4"
      >
        <Trash2 aria-hidden="true" className="size-4 flex-none" />
        Borrar este perfil
      </button>
    )}
  </div>
)
