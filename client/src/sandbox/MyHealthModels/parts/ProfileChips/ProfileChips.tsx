import { UserPlus } from "lucide-react"
import { PROFILES } from "../../MyHealthModels.constants"
import { useSoftButtons } from "../../useButtonLook"
import type { ProfileChipsProps } from "./ProfileChips.types"

/** Profile chips + "Agregar familiar". `onDark`: for the home gradient */
export const ProfileChips = ({ activeId, onSelect, onDark = false }: ProfileChipsProps) => {
  const soft = useSoftButtons()
  const shape = soft ? "rounded-lg border-transparent" : "rounded-full"
  const idle = soft
    ? onDark
      ? "bg-on-home/15 text-on-home hover:bg-on-home/25 in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-on-home"
      : `bg-field text-ink hover:bg-brand-soft in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-control-line`
    : onDark
    ? "border-on-home/70 bg-transparent text-on-home hover:bg-on-home/10"
    : "border-control-line bg-card text-ink hover:bg-field"
  const active = soft
    ? onDark
      ? "bg-card text-brand in-data-[theme=contrast]:ring-2 in-data-[theme=contrast]:ring-brand"
      : "bg-brand-soft text-brand ring-2 ring-brand"
    : onDark
      ? "border-card bg-card text-brand in-data-[theme=contrast]:ring-2 in-data-[theme=contrast]:ring-brand"
      : "border-brand bg-brand text-on-brand"

  return (
    <div role="group" aria-label="Perfiles" className="flex flex-wrap items-center gap-2">
      {PROFILES.map(({ id, name }) => (
        <button
          key={id}
          type="button"
          aria-pressed={id === activeId}
          onClick={() => onSelect(id)}
          className={`min-h-10 cursor-pointer border px-4 py-1.5 font-bold transition-colors ${shape} ${id === activeId ? active : idle}`}
        >
          {name}
        </button>
      ))}
      <button
        type="button"
        className={`flex min-h-10 cursor-pointer items-center gap-1.5 border px-4 py-1.5 font-bold transition-colors ${soft ? "" : "border-dashed"} ${shape} ${idle}`}
      >
        <UserPlus aria-hidden="true" className="size-4.5 flex-none" />
        Agregar familiar
      </button>
    </div>
  )
}
