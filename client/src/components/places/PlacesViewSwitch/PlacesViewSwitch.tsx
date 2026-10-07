import { List, Map } from "lucide-react"

import type { PlacesView } from "@/utils/places"

export type { PlacesView }

type PlacesViewSwitchProps = {
  view: PlacesView
  onChange: (view: PlacesView) => void
}

const OPTIONS: { id: PlacesView, label: string, icon: typeof List }[] = [
  { id: "list", label: "Lista", icon: List },
  { id: "map", label: "Mapa", icon: Map },
]

/** Lista | Mapa: the same places, two ways to see them. The list has every action and works with any device, so nothing depends on the map */
export const PlacesViewSwitch = ({ view, onChange }: PlacesViewSwitchProps) => (
  <div role="group" aria-label="Ver los lugares como" className="inline-flex rounded-2xl border-2 border-control-line bg-card p-1">
    {OPTIONS.map(({ id, label, icon: Icon }) => {
      const isActive = id === view
      return (
        <button
          key={id}
          type="button"
          aria-pressed={isActive}
          onClick={() => onChange(id)}
          className={`inline-flex min-h-11 min-w-28 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2 font-extrabold ${
            isActive ? "bg-brand text-on-brand" : "bg-transparent text-ink hover:bg-field"
          }`}
        >
          <Icon aria-hidden="true" className="size-5 shrink-0" />
          {label}
        </button>
      )
    })}
  </div>
)
