import { useId } from "react"
import { CategoryDoodles } from "../CategoryDoodles"
import type { CategoryWallpaperProps } from "./CategoryWallpaper.types"

/**
 * Mobile "wallpaper" shown when no section is chosen yet: the category gradient filling the
 * screen, the category's translucent drawings behind, and its icon, title and description centered
 * on top (same texts as the desktop banner).
 * Needs a `data-category` ancestor (category colors).
 */
export const CategoryWallpaper = ({ category: { id, title, subtitle, icon: Icon }, className }: CategoryWallpaperProps) => {
  const titleId = useId()

  return (
    <section
      aria-labelledby={titleId}
      className={`relative flex items-center justify-center overflow-hidden bg-category-wallpaper px-4 py-8 text-on-category sm:px-6 ${className ?? ""}`}
    >
      <div aria-hidden="true" className="absolute -top-20 -left-24 size-72 rounded-full bg-on-category/6" />
      <div aria-hidden="true" className="absolute top-1/4 -right-20 size-56 rounded-full bg-on-category/5" />
      <CategoryDoodles categoryId={id} layout="wallpaper" />

      {/* Soft shadow under the white text: helps it over the lighter middle of the gradient */}
      <div className="relative flex w-full max-w-sm flex-col items-center gap-3 text-center text-shadow-[0_1px_3px_rgba(0,0,0,.35)]">
        <span aria-hidden="true" className="flex size-14 items-center justify-center rounded-full bg-on-category/15 ring-1 ring-on-category/25">
          <Icon className="size-7" />
        </span>
        <h2 id={titleId} className="m-0 text-3xl/tight font-extrabold tracking-[-0.01em] text-balance wrap-break-word">
          {title}
        </h2>
        <span aria-hidden="true" className="h-1 w-10 rounded-full bg-on-category/60" />
        <p className="m-0 text-base text-pretty">{subtitle}</p>
      </div>
    </section>
  )
}
