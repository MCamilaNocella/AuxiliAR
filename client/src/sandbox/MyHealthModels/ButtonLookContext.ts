import { createContext } from "react"

/** Button look for the parts of a model: "pill" (rounded, with border) or "soft" (style 3: soft fill, no border) */
export type ButtonLook = "pill" | "soft"

export const ButtonLookContext = createContext<ButtonLook>("pill")
