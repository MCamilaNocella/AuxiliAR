import type { RefObject } from "react"
import type { CategorySectionListProps } from "../CategorySectionList"

export type CategorySectionsDrawerProps = CategorySectionListProps & {
  id: string
  label: string
  open: boolean
  /** false when it opened by itself: focus stays where it was */
  focusOnOpen: boolean
  onClose: () => void
  /** Bar the drawer hangs from: it opens right below it */
  anchorRef: RefObject<HTMLElement | null>
}
