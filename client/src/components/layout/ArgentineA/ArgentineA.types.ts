import type { SVGProps } from "react"

export type ArgentineAProps = Omit<SVGProps<SVGSVGElement>, "viewBox"> & {
  /** Outline around the A; none if not set */
  outline?: string
  /** Outline around the cross; none if not set */
  crossOutline?: string
  /** Visible outline thickness, in the A's own units */
  outlineWidth?: number
  /** The cross's outline thickness; the A's if not set */
  crossOutlineWidth?: number
}
