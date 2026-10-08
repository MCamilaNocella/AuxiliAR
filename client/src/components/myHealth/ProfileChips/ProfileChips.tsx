import { UserPlus } from "lucide-react"
import { HEALTH_PROFILES } from "@/data/myHealth"
import type { ProfileChipsProps } from "./ProfileChips.types"

const chipClass = "min-h-10 cursor-pointer rounded-lg px-4 py-1.5 font-bold transition-colors"
const idleClass = "bg-on-home/15 text-on-home hover:bg-on-home/25 in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-on-home"
const activeClass = "bg-card text-brand in-data-[theme=contrast]:ring-2 in-data-[theme=contrast]:ring-brand"

/** Profile chips + "Agregar familiar", on the home gradient */
export const ProfileChips = ({ activeId, onSelect }: ProfileChipsProps) => (
  <div role="group" aria-label="Perfiles" className="flex flex-wrap items-center gap-2">
    {HEALTH_PROFILES.map(({ id, name }) => (
      <button
        key={id}
        type="button"
        aria-pressed={id === activeId}
        onClick={() => onSelect(id)}
        className={`${chipClass} ${id === activeId ? activeClass : idleClass}`}
      >
        {name}
      </button>
    ))}
    <button type="button" className={`flex items-center gap-1.5 ${chipClass} ${idleClass}`}>
      <UserPlus aria-hidden="true" className="size-4.5 flex-none" />
      Agregar familiar
    </button>
  </div>
)
