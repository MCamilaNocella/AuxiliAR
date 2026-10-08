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
  /** The section that opens when none is chosen, instead of the banner (e.g. Centros de atención opens on its map) */
  defaultSectionId?: string
  /** Set while the sections have no real content: the screen shows CategoryPreparing and no section menu. Remove it when they do */
  preparing?: CategoryPreparing
}

/** What a category without published information shows instead of its sections (see CategoryPreparing) */
export type CategoryPreparing = {
  /** What the category will have, in a sentence */
  will: string
  /** What AuxiliAR already offers on the topic: only links to things that exist. Empty if there is nothing yet */
  meanwhile: { label: string; to: string }[]
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
  /** Body of the section (the heading is rendered by the category screen) */
  Content: ComponentType
}
