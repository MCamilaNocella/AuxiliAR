export const EMERGENCY_SECTION_ID = "emergencies"
export const EMERGENCY_HEADING_ID = "emergencies-heading"

/*
 * Guides grid that adapts to the "Ver mejor" text size: each column needs a minimum
 * width in rem (it grows with the text); when it doesn't fit, it drops columns.
 * Up to 2 per row (a word like "Atragantamiento" is ~10rem wide).
 */
export const GUIDES_GRID = "grid-cols-[repeat(auto-fill,minmax(min(100%,max(10rem,calc((100%_-_0.5rem)/2))),1fr))]"
