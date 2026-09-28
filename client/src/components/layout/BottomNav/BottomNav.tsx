import { useRef } from "react"
import { NavLink } from "react-router"
import { Siren } from "lucide-react"
import { useElementHeightVar } from "@/hooks/useElementHeightVar"
import { revealEmergencies } from "@/utils/revealEmergencies"
import { EMERGENCY_SECTION_ID } from "../EmergencyBar"
import { NAV_ITEMS } from "./BottomNav.constants"

const itemBase =
  "flex min-h-13 flex-col items-center justify-center gap-0.5 rounded-lg px-1 text-center text-xs/tight no-underline transition-colors sm:text-sm/tight"

const iconClass = "size-5 flex-none"

export const BottomNav = () => {
  const ref = useRef<HTMLElement>(null)
  useElementHeightVar(ref, "--bottom-nav-h")

  return (
    <nav
      ref={ref}
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line-strong bg-card pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,.12)]"
    >
      <div className="mx-auto grid max-w-3xl grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.25fr)] gap-1.5 px-2 py-1.5 sm:gap-2 sm:px-6">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${itemBase} ${isActive ? "bg-brand-soft font-extrabold text-brand hover:text-brand" : "font-semibold text-ink hover:bg-field hover:text-ink"}`
            }
          >
            <Icon aria-hidden="true" className={iconClass} />
            {label}
          </NavLink>
        ))}

        <button
          type="button"
          onClick={revealEmergencies}
          aria-controls={EMERGENCY_SECTION_ID}
          className={`${itemBase} cursor-pointer bg-alert font-extrabold text-on-alert hover:bg-alert-dark hover:text-on-alert`}
        >
          <Siren aria-hidden="true" className={iconClass} />
          Emergencia
        </button>
      </div>
    </nav>
  )
}
