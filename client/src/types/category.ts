import type { ComponentType } from "react"
import type { LucideIcon } from "lucide-react"

export type Category = {
  id: string
  title: string
  description: string
  /** One line under the title in the category banner */
  subtitle: string
  icon: LucideIcon
  to: string
  /** Decorative illustration (3:2) for the banner and the wallpaper */
  scene: ComponentType
  /** Sections listed in the category sidebar */
  sections: CategorySection[]
}

export type CategorySection = {
  id: string
  /** Name in the sidebar and heading of the section */
  title: string
  /** Body of the section (the heading is rendered by the category screen) */
  Content: ComponentType
}
