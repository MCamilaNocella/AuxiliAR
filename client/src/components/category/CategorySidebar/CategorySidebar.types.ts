import type { Category, CategorySection } from "@/types/category"

export type CategorySidebarProps = {
  category: Category
  sections: CategorySection[]
  /** null: no section chosen, the category intro (banner / wallpaper) is showing */
  activeSectionId: string | null
  onSelectSection: (id: string) => void
  /** Back to the category intro (tapping the category name) */
  onShowIntro: () => void
}
