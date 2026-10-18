import type { SVGProps } from "react"

export type LogoLockupProps = Omit<SVGProps<SVGSVGElement>, "viewBox"> & {
  /** "uxili"'s color; the logo token (white, or brand red on the light header "según el tema") if not set */
  letters?: string
  /** "AR"'s color; the logo's light blue if not set */
  ar?: string
  /** Outline around the A; none if not set */
  outline?: string
}
