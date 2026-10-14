import type { SVGProps } from "react"

export type ArgentineAProps = Omit<SVGProps<SVGSVGElement>, "viewBox"> & {
  /** Outline around the A and the cross; none if not set */
  outline?: string
  /** Visible outline thickness, in the A's own units */
  outlineWidth?: number
  /** The cross's outline thickness; the A's if not set */
  crossOutlineWidth?: number
}
