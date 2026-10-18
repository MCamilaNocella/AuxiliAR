import { useId, type CSSProperties } from "react"
import { SUN } from "@/components/layout/ArgentineA/ArgentineA.constants"
import { QUICKSAND_AR, WAVE, WAVE_CROSS, WAVE_CROSS_BIG } from "./LogoSketches.paths"

/*
 * Pieces of the logo board sketches. Colors measured from the reference: the flag's light blue, the red cross and,
 * on the light background, the navy of "Auxili" (on dark backgrounds "Auxili" goes light, see the backdrops).
 */
export const SKY = "#6cb6eb"
export const RED = "#eb4c4e"
export const NAVY = "#273b55"
const WHITE = "#ffffff"
const SUN_RAYS = "#f6a11e"
const SUN_EDGE = "#d97c0a"
const SUN_FEATURES = "#a35a00"

/** Rounded red cross, as in the reference */
export const RedCross = ({ className = "", style }: { className?: string; style?: CSSProperties }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
    <rect x="8" y="1" width="8" height="22" rx="2.2" fill={RED} />
    <rect x="1" y="8" width="22" height="8" rx="2.2" fill={RED} />
  </svg>
)

/** The Sol de Mayo of the Argentine A, alone (its own drawing, centered). `plain`: without the face */
export const SolDeMayo = ({ className = "", style, plain = false }: { className?: string; style?: CSSProperties; plain?: boolean }) => (
  <svg viewBox={`${SUN.cx - 14.5} ${SUN.cy - 14.5} 29 29`} aria-hidden="true" className={className} style={style}>
    <SunDrawing plain={plain} />
  </svg>
)

/** The sun's shapes, in the A's units (to draw it inside another svg) */
const SunDrawing = ({ plain }: { plain: boolean }) => (
  <>
    <g fill={SUN_RAYS} stroke={SUN_RAYS}>
      <path d={SUN.straightRays} strokeWidth={0} />
      <path d={SUN.wavyRays} fill="none" strokeWidth={0.8} strokeLinecap="round" />
    </g>
    <circle cx={SUN.cx} cy={SUN.cy} r={SUN.face} fill={SUN_RAYS} stroke={SUN_EDGE} strokeWidth={0.7} />
    {!plain && (
      <>
        {SUN.eyes.map(([cx, cy]) => (
          <circle key={cx} cx={cx} cy={cy} r={0.75} fill={SUN_FEATURES} />
        ))}
        <path d={SUN.mouth} fill="none" stroke={SUN_FEATURES} strokeWidth={0.7} strokeLinecap="round" />
      </>
    )}
  </>
)

/* With line-height 1 the capitals of Nunito go from ~12% to ~83% of the box: the white band crosses their middle */
const flagGradient = ([from, to]: readonly [number, number]) =>
  `linear-gradient(180deg, ${SKY} 0 ${from}%, ${WHITE} ${from}% ${to}%, ${SKY} ${to}% 100%)`

const FLAG_FILL: CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${SKY} 0 37%, ${WHITE} 42% 55%, ${SKY} 60% 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
}

type FlagARProps = {
  className?: string
  style?: CSSProperties
  /** Where the sun's center goes, from the top left of "AR" */
  sunLeft?: string
  sunTop?: string
  /** The letters' edge: keeps their shape where the band is white (on the light background). A thin light blue if not set */
  edge?: string
  /** The white band, from–to in % of the box (sharp edges, like the flag); a soft band at the middle if not set */
  band?: readonly [number, number]
}

/** "AR" filled with the flag (light blue, white, light blue) and the sun in the middle of the A */
export const FlagAR = ({ className = "", style, sunLeft = "0.36em", sunTop = "0.475em", edge, band }: FlagARProps) => (
  <span className={`relative inline-block leading-none ${className}`} style={style}>
    <span style={{ ...FLAG_FILL, ...(band && { backgroundImage: flagGradient(band) }), WebkitTextStroke: edge ? `0.03em ${edge}` : `0.012em ${SKY}` }}>AR</span>
    <SolDeMayo className="absolute size-[0.3em] -translate-1/2" style={{ left: sunLeft, top: sunTop }} />
  </span>
)

type QuicksandFlagARProps = {
  /** The white band, from–to in % of the box (sharp edges) */
  band: readonly [number, number]
  /** Where the sun's center goes, from the top left of "AR" */
  sunLeft: string
  sunTop: string
}

/**
 * The font sketches' "AR" in Quicksand (same letters, weight and light blue edge), drawn from the font's outline: the
 * pieces of each letter are merged, so the edge goes only around the letters and the white stays clean inside. It goes
 * at the top of the row (an svg has no baseline): with line-height 1, like "Auxili", the baselines match.
 */
export const QuicksandFlagAR = ({ band: [from, to], sunLeft, sunTop }: QuicksandFlagARProps) => {
  const gradientId = useId()
  return (
    <span className="relative inline-block flex-none self-start leading-none">
      <svg viewBox="0 0 1326 1000" overflow="visible" aria-hidden="true" className="block h-[1em] w-[1.326em]">
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1000">
          <stop offset={from / 100} stopColor={SKY} />
          <stop offset={from / 100} stopColor={WHITE} />
          <stop offset={to / 100} stopColor={WHITE} />
          <stop offset={to / 100} stopColor={SKY} />
        </linearGradient>
        <path d={QUICKSAND_AR} fill={`url(#${gradientId})`} stroke={SKY} strokeWidth={30} />
      </svg>
      <SolDeMayo className="absolute size-[0.3em] -translate-1/2" style={{ left: sunLeft, top: sunTop }} plain />
    </span>
  )
}

/** The wave under the italic logo, ending in the red cross (`big`: a larger cross) */
export const WaveCross = ({ className = "", big = false }: { className?: string; big?: boolean }) => {
  const cross = big ? WAVE_CROSS_BIG : WAVE_CROSS
  return (
  <svg viewBox={big ? "10 -36 384 88" : "10 -24 372 76"} aria-hidden="true" className={className}>
    <path d={WAVE} fill={SKY} />
    <svg x={cross.x} y={cross.y} width={cross.size} height={cross.size} viewBox="0 0 24 24">
      <rect x="8" y="1" width="8" height="22" rx="2.2" fill={RED} />
      <rect x="1" y="8" width="22" height="8" rx="2.2" fill={RED} />
    </svg>
  </svg>
  )
}
