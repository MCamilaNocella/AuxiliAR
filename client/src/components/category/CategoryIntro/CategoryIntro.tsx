import { ArrowLeft } from "lucide-react"
import { CategoryWallpaper } from "../CategoryWallpaper"
import type { CategoryIntroProps } from "./CategoryIntro.types"

/** What a category shows before a section is chosen: a hint to pick one on desktop (under the banner, which the category screen keeps still), the wallpaper on mobile */
export const CategoryIntro = ({ category }: CategoryIntroProps) => (
  <>
    <div className="hidden lg:block">
      <div className="px-8 py-6 xl:px-10">
        <p className="m-0 flex max-w-xl items-center gap-3 rounded-2xl border border-line bg-card p-4 text-ink">
          <ArrowLeft aria-hidden="true" className="size-6 flex-none text-brand" />
          Elegí una sección del menú de la izquierda para empezar.
        </p>
      </div>
    </div>
    <CategoryWallpaper category={category} className="min-h-80 flex-1 lg:hidden" />
  </>
)
