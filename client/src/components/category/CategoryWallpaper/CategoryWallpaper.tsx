import { CategoryIllustration } from "../CategoryIllustration"
import type { CategoryWallpaperProps } from "./CategoryWallpaper.types"

/**
 * Mobile "wallpaper" shown when no section is chosen yet: the category gradient filling the
 * screen with its illustration at the bottom, no text (the bar above already names it).
 * Needs a `data-category` ancestor (category colors).
 */
export const CategoryWallpaper = ({ scene, className }: CategoryWallpaperProps) => (
  <div aria-hidden="true" className={`relative flex flex-col justify-end overflow-hidden bg-category-wallpaper ${className ?? ""}`}>
    <div className="absolute -top-20 -left-24 size-72 rounded-full bg-on-category/6" />
    <div className="absolute top-1/4 -right-20 size-56 rounded-full bg-on-category/5" />
    <CategoryIllustration scene={scene} className="relative mx-auto w-full max-w-xl" />
  </div>
)
