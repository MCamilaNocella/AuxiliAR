import "@fontsource/poppins/latin-300.css"
import "@fontsource/poppins/latin-700.css"
import { SUN } from "../ArgentineA/ArgentineA.constants"
import { EDGE, FLAG, RED, SKY, SUN_EDGE, SUN_LEFT, SUN_RAYS, SUN_TOP } from "./Wordmark.constants"
import type { WordmarkProps } from "./Wordmark.types"

/**
 * The logo: "Auxili" in Poppins Light and "AR" in Poppins Bold filled with the flag, with the Sol de Mayo (no face) in
 * the A and the red cross up on the right. Decorative: whoever uses it names it (aria-label).
 */
export const Wordmark = ({ ink = "var(--color-logo-ink)", className = "" }: WordmarkProps) => (
  <span
    aria-hidden="true"
    className={`relative inline-flex items-baseline pr-[0.38em] font-[Poppins] leading-none whitespace-nowrap ${className}`}
  >
    <span className="font-light" style={{ color: ink }}>
      Auxili
    </span>
    <span className="relative inline-block font-bold" style={{ translate: `0 -${EDGE / 2}em` }}>
      <span
        className="bg-clip-text text-transparent"
        style={{ backgroundImage: FLAG, WebkitTextStroke: `${EDGE}em ${SKY}` }}
      >
        AR
      </span>
      <svg
        viewBox={`${SUN.cx - 14.5} ${SUN.cy - 14.5} 29 29`}
        className="absolute size-[0.3em] -translate-1/2"
        style={{ left: SUN_LEFT, top: SUN_TOP }}
      >
        <g fill={SUN_RAYS} stroke={SUN_RAYS}>
          <path d={SUN.straightRays} strokeWidth={0} />
          <path d={SUN.wavyRays} fill="none" strokeWidth={0.8} strokeLinecap="round" />
        </g>
        <circle cx={SUN.cx} cy={SUN.cy} r={SUN.face} fill={SUN_RAYS} stroke={SUN_EDGE} strokeWidth={0.7} />
      </svg>
    </span>
    <svg viewBox="0 0 24 24" className="absolute -top-[0.16em] right-0 size-[0.42em]">
      <rect x="8" y="1" width="8" height="22" rx="2.2" fill={RED} />
      <rect x="1" y="8" width="22" height="8" rx="2.2" fill={RED} />
    </svg>
  </span>
)
