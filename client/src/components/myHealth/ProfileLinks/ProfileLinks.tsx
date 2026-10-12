import { Trash2 } from "lucide-react"
import type { ProfileLinksProps } from "./ProfileLinks.types"

/** Bottom of the screen: delete the profile (only relatives' ones) */
export const ProfileLinks = ({ onDelete }: ProfileLinksProps) =>
  onDelete && (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onDelete}
        aria-haspopup="dialog"
        className="flex cursor-pointer items-center gap-1.5 bg-transparent p-0 font-bold text-alert-text underline underline-offset-4"
      >
        <Trash2 aria-hidden="true" className="size-4 flex-none" />
        Borrar perfil
      </button>
    </div>
  )
