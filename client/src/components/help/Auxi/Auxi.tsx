import { useId } from "react"
import { AUXI_COLORS as C, AUXI_MOTION_LINES, AUXI_PATHS as P, AUXI_VIEWBOX } from "./Auxi.constants"
import type { AuxiProps } from "./Auxi.types"

/**
 * Auxi, the help bot illustration. Decorative (aria-hidden): the control that contains it provides the label.
 * Thin black outline + soft shadow on every background; the wave lines use currentColor
 * (text-auxi-motion: black on light themes, white on dark ones).
 */
export const Auxi = ({ onDark = false, className }: AuxiProps) => {
  const id = useId()
  const shadowId = `${id}-shadow`
  const headClipId = `${id}-head`
  const outline = { stroke: C.outline, strokeWidth: 1.25, strokeLinejoin: "round" } as const

  return (
    <svg
      viewBox={AUXI_VIEWBOX}
      aria-hidden="true"
      focusable="false"
      className={`${onDark ? "text-on-home" : "text-auxi-motion"} ${className ?? ""}`}
    >
      <defs>
        <filter id={shadowId} x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1.1" floodColor="#000" floodOpacity="0.35" />
        </filter>
        <clipPath id={headClipId}>
          <path d={P.head} />
        </clipPath>
      </defs>

      <g filter={`url(#${shadowId})`}>
        <g fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round">
          {AUXI_MOTION_LINES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>

        <path d={P.handLeft} fill={C.white} {...outline} />
        <path d={P.sleeveLeft} fill={C.maroon} {...outline} />
        <path d={P.handRight} fill={C.white} {...outline} />
        <path d={P.sleeveRight} fill={C.maroon} {...outline} />
        <path d={P.body} fill={C.maroon} {...outline} />
        <circle cx="72.7" cy="100.4" r="5.3" fill={C.button} />

        <rect x="77.1" y="19" width="1.9" height="13" fill={C.stem} {...outline} />
        <circle cx="78.45" cy="16.9" r="3.55" fill={C.antenna} {...outline} />

        {/* Head: shade color underneath, white copy shifted up → soft shadow along the bottom edge */}
        <path d={P.head} fill={C.headShade} />
        <g clipPath={`url(#${headClipId})`}>
          <path d={P.head} transform="translate(0 -1.6)" fill={C.white} />
        </g>
        {/* Outline on top, otherwise the white copy hides its inner half along the top edge */}
        <path d={P.head} fill="none" {...outline} />
        <path d={P.shine} fill="#ffffff" />

        <path d={P.brows} fill={C.face} stroke={C.face} strokeWidth="0.5" strokeLinejoin="round" />
        <path d={P.mouth} fill={C.face} />
        <ellipse cx="63.1" cy="58.8" rx="5.3" ry="5.5" fill={C.face} />
        <ellipse cx="90.5" cy="61" rx="5.4" ry="5.7" fill={C.face} />
        <ellipse cx="62.6" cy="57.05" rx="1.8" ry="1.95" fill="#ffffff" />
        <ellipse cx="89.4" cy="59.3" rx="1.8" ry="1.85" fill="#ffffff" />
      </g>
    </svg>
  )
}
