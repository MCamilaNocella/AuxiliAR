import type { BlockPlace, SectionView } from "@/types/blocks"

export type ModelSectionProps = {
  view: SectionView
  /** The ids of the category's sections in the model ("ive") → in the app ("section-5"), for the buttons and cells that open another one */
  sectionIds: Record<string, string>
  places?: BlockPlace[]
  provinces?: [string, string][]
}
