import { HeartPulse, House, MapPin } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { NavItem } from "./BottomNav.types"

/**
 * Navigation sections; the "Emergencia" button is separate because it doesn't navigate.
 * Primeros auxilios is not here: it has its own highlighted access on the home (its section and its address are unchanged).
 * Mi salud is a module under construction: its page says so.
 */
export const NAV_ITEMS: NavItem[] = [
  { to: PATHS.home, label: "Inicio", icon: House, end: true },
  { to: PATHS.centers, label: "Encontrar atención", icon: MapPin },
  { to: PATHS.myHealth, label: "Mi salud", icon: HeartPulse },
]
