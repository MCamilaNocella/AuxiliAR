import type { ReactNode } from "react"

/** A background a sketch is tried on: the header's bordó or one of the three themes */
export type Backdrop = {
  id: "header" | "light" | "dark" | "contrast"
  label: string
  background: string
  /** The theme's text color there */
  text: string
  /** The theme's brand color there (on the bordó header: its light text) */
  brand: string
  /** "Auxili" in the board sketches: navy where it reads (light), light on the dark backgrounds */
  logoInk: string
}

export type LogoSketch = {
  id: string
  name: string
  description: string
  /** The sketch drawn on one background */
  render: (backdrop: Backdrop) => ReactNode
}
