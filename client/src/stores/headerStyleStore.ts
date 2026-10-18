import { DEFAULT_HEADER_STYLE, HEADER_STYLES, HEADER_STYLE_STORAGE_KEY } from "@/data/headerStyle"
import { createLocalStore } from "@/utils/createLocalStore"

/** Header color (bordó or the theme's). On <html>: index.css paints the header (and what sits on it) from data-header */
export const headerStyleStore = createLocalStore(
  HEADER_STYLE_STORAGE_KEY,
  (stored) => HEADER_STYLES.find(({ value }) => value === stored)?.value ?? DEFAULT_HEADER_STYLE,
  (style) => {
    document.documentElement.dataset.header = style
  },
)
