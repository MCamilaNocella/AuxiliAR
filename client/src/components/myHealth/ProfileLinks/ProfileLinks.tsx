import { Trash2 } from "lucide-react"

/** Bottom of the screen: edit all data, and delete the profile */
export const ProfileLinks = () => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <button type="button" className="cursor-pointer bg-transparent p-0 font-bold text-ink underline underline-offset-4 hover:text-brand">
      Ver y editar todos mis datos
    </button>
    <button type="button" className="flex cursor-pointer items-center gap-1.5 bg-transparent p-0 font-bold text-alert-text underline underline-offset-4">
      <Trash2 aria-hidden="true" className="size-4 flex-none" />
      Borrar este perfil
    </button>
  </div>
)
