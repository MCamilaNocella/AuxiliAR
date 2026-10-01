import type { CategorySection } from "@/types/category"

export type CategorySectionListProps = {
  sections: CategorySection[]
  /** null: none chosen yet (the category intro is showing) */
  activeSectionId: string | null
  onSelectSection: (id: string) => void
}
