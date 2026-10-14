import type { Category, CategorySection } from "@/types/category"

export type CategorySidebarProps = {
  category: Category
  sections: CategorySection[]
  /** null: no section chosen, the category intro (banner / wallpaper) is showing */
  activeSectionId: string | null
  /** May return a promise that resolves once the section is in (the drawer closes after it) */
  onSelectSection: (id: string) => void | Promise<void>
  /** Back to the category intro (tapping the category name) */
  onShowIntro: () => void | Promise<void>
}
