import type { ComponentType } from "react"
import type { LucideIcon } from "lucide-react"

export type Category = {
  id: string
  title: string
  /** One line: under the title on the home card and in the category banner */
  description: string
  icon: LucideIcon
  to: string
  /** Decorative illustration (3:2) for the banner and the wallpaper */
  scene: ComponentType
  /** Sections listed in the category sidebar */
  sections: CategorySection[]
  /** Without the sidebar: the first section opens right away across the whole width (Centros, whose only section is the map) */
  noSidebar?: boolean
}

export type CategorySection = {
  id: string
  /** Name in the sidebar and heading of the section */
  title: string
  /**
   * What information the section has, in a sentence. Write it once the section has real content:
   * only then can Auxi's chat send people here (without it, Auxi answers on its own)
   */
  summary?: string
  /** Icon next to the heading. With it, the heading shows the icon tile and the `lead` under the title (design of the category models) */
  icon?: LucideIcon
  /** One or two sentences under the heading, shown with `icon` */
  lead?: string
  /** Body of the section (the heading is rendered by the category screen). With `preload` (lazyContent), the screen downloads it ahead */
  Content: ComponentType & { preload?: () => Promise<unknown> }
}
