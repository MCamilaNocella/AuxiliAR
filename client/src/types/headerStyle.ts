/** "brand": the same bordó in every theme. "theme": the theme's background (light, dark or high contrast), as before */
export type HeaderStyle = "brand" | "theme"

/** The header logo, tried on /logos. "top": the word's box centered, the cross sticking out over it (as it was). "center":
 *  letters and cross centered as one piece. "middle" (the default): halfway between both */
export type HeaderLogoAlignment = "top" | "middle" | "center"

export type HeaderStyleOption = {
  value: HeaderStyle
  label: string
  description: string
}
