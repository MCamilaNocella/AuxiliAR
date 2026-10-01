import type { CategoryIllustrationProps } from "./CategoryIllustration.types"

/** Decorative scene of a category (3:2) */
export const CategoryIllustration = ({ scene: Scene, className }: CategoryIllustrationProps) => (
  <div aria-hidden="true" className={`aspect-3/2 ${className ?? ""}`}>
    <Scene />
  </div>
)
