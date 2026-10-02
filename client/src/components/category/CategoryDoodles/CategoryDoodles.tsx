import { CATEGORY_DOODLES, WALLPAPER_GRID } from "./CategoryDoodles.constants"
import type { CategoryDoodlesProps, Doodle } from "./CategoryDoodles.types"

/** Wallpaper slot → its doodle, centered on a staggered grid cell with a small fixed offset so it doesn't look like a table */
const wallpaperDoodles = (doodles: Doodle[]): Doodle[] => {
  const { columns, rows } = WALLPAPER_GRID
  return Array.from({ length: columns * rows }, (_, slot) => {
    const row = Math.floor(slot / columns)
    const column = slot % columns
    const doodle = doodles[slot % doodles.length]
    const stagger = row % 2 ? 0.5 : 0.25
    return {
      ...doodle,
      left: ((column + stagger) / columns) * 100 + ((slot * 37) % 9) - 4,
      top: ((row + 0.5) / rows) * 100 + ((slot * 53) % 7) - 3,
      size: doodle.size * 1.15,
    }
  })
}

/**
 * The category's translucent line drawings (no color: they take the text color at low opacity).
 * Decorative only. Goes inside a `relative overflow-hidden` box with the category background.
 */
export const CategoryDoodles = ({ categoryId, layout }: CategoryDoodlesProps) => {
  const doodles = CATEGORY_DOODLES[categoryId]
  if (!doodles) return null
  const placed = layout === "wallpaper" ? wallpaperDoodles(doodles) : doodles

  return placed.map(({ Icon, left, top, size, rotate }, index) => (
    <Icon
      key={index}
      aria-hidden="true"
      className={`absolute text-on-category/15 ${layout === "wallpaper" ? "-translate-1/2" : ""}`}
      style={{ left: `${left}%`, top: `${top}%`, width: `${size}rem`, height: `${size}rem`, rotate: `${rotate}deg` }}
    />
  ))
}
