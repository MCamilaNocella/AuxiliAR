import { House, MapPin, User } from "lucide-react"
import { PATHS } from "@/router/paths"
import type { NavItem } from "./BottomNav.types"

/** Secciones de la navegación; el botón "Emergencia" va aparte porque no navega */
export const NAV_ITEMS: NavItem[] = [
  { to: PATHS.home, label: "Inicio", icon: House, end: true },
  { to: PATHS.centers, label: "Centros cerca", icon: MapPin },
  { to: PATHS.myHealth, label: "Mi Salud", icon: User },
]
