import { LayoutGrid, MapPin, User } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { NavItem } from "./BottomNav.types"

/** Navigation sections; the "Emergencia" button is separate because it doesn't navigate */
export const NAV_ITEMS: NavItem[] = [
  { to: PATHS.home, label: "Categorias", icon: LayoutGrid, end: true },
  { to: PATHS.centers, label: "Centros cerca", icon: MapPin },
  { to: PATHS.myHealth, label: "Mi Salud", icon: User },
]

