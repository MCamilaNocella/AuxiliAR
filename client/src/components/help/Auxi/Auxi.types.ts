import type { ReactNode } from "react"

export type AuxiProps = {
  /**
   * The background behind Auxi is dark, whatever the theme (e.g. bg-home).
   * Only the wave lines change: they follow the theme by default and turn white when true.
   */
  onDark?: boolean
  className?: string
  /** Replaces the face (brows, eyes and mouth), e.g. a happy one with closed eyes */
  face?: ReactNode
  /** Without the little wave lines next to its hand */
  still?: boolean
  /** Where it goes when drawn inside another SVG (its x, y, width and height there) */
  frame?: { x: number, y: number, width: number, height: number }
}
