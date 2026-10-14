import { createContext } from "react"

/**
 * The two looks of the category models' blocks. `classic` (ESI, Animales, Primeros auxilios…): titles in ink over an ink line, the icon
 * tiles in soft tones, markers and step numbers in the category color. `accent` (Más recursos): the title, its line and the markers take
 * the block's tone.
 */
export type BlockLook = "classic" | "accent"

export const BlockLookContext = createContext<BlockLook>("classic")

/** Goes to another section of the same category (a button "Ver IVE e ILE", a summary cell of another section). Set by the category screen */
export const SectionNavContext = createContext<(sectionId: string) => void>(() => {})
