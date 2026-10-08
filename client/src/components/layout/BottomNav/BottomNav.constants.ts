import { Bandage, House, MapPin } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { NavItem } from "./BottomNav.types"

/**
 * Navigation sections; the "Emergencia" button is separate because it doesn't navigate.
 * Only what leads to real content: Mi Salud (still empty) is not here, and its address redirects to the home.
 */
export const NAV_ITEMS: NavItem[] = [
  { to: PATHS.home, label: "Inicio", icon: House, end: true },
  { to: PATHS.centers, label: "Encontrar atención", icon: MapPin },
  { to: PATHS.firstAid, label: "Primeros auxilios", icon: Bandage },
]
