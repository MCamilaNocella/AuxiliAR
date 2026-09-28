import type { LucideIcon } from "lucide-react"

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  /** Activo solo con coincidencia exacta de la ruta (necesario para "/") */
  end?: boolean
}
