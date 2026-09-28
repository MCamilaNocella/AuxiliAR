export const EMERGENCY_SECTION_ID = "emergencies"
export const EMERGENCY_HEADING_ID = "emergencies-heading"

/*
 * Grids that adapt to the "Ver mejor" text size: each column needs a minimum
 * width in rem (it grows with the text); when it doesn't fit, they drop columns.
 * Numbers: up to 3 per row (stacked on mobile, inline from sm).
 * Guides: up to 2 per row ("Atragantamiento" is ~10rem wide).
 */
export const NUMBERS_GRID =
  "grid-cols-[repeat(auto-fill,minmax(min(100%,max(6rem,calc((100%_-_1rem)/3))),1fr))] sm:grid-cols-[repeat(auto-fill,minmax(min(100%,max(9rem,calc((100%_-_1rem)/3))),1fr))]"
export const GUIDES_GRID = "grid-cols-[repeat(auto-fill,minmax(min(100%,max(10rem,calc((100%_-_0.5rem)/2))),1fr))]"
