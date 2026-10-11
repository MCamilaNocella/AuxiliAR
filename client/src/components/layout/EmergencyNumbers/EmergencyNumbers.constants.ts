/*
 * Grid that adapts to the "Ver mejor" text size: each column needs a minimum
 * width in rem (it grows with the text); when it doesn't fit, it drops columns.
 * Up to 3 per row (stacked on mobile, inline from sm).
 */
export const NUMBERS_GRID =
  "grid-cols-[repeat(auto-fill,minmax(min(100%,max(6rem,calc((100%_-_1rem)/3))),1fr))] sm:grid-cols-[repeat(auto-fill,minmax(min(100%,max(9rem,calc((100%_-_1rem)/3))),1fr))]"
