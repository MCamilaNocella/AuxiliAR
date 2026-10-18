/*
 * The logo's own colors, the same in every theme (only "Auxili" follows the header, with --color-logo-ink):
 * the flag's light blue and white, the red cross and the Sol de Mayo
 */
export const SKY = "#6cb6eb"
export const WHITE = "#ffffff"
export const RED = "#eb4c4e"
export const SUN_RAYS = "#f6a11e"
export const SUN_EDGE = "#d97c0a"

/** "AR"'s flag: light blue, a white band in the middle of the letters and light blue (soft edges) */
export const FLAG = `linear-gradient(180deg, ${SKY} 0 37%, ${WHITE} 42% 55%, ${SKY} 60% 100%)`

/** "AR"'s light blue edge, in em. Half of it falls under the letters, so "AR" goes up that much to sit like "Auxili" */
export const EDGE = 0.03

/** The sun's center in Poppins Bold's "A", from the top left of "AR" */
export const SUN_LEFT = "0.36em"
export const SUN_TOP = "0.52em"
