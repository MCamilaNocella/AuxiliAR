import { useId } from "react"
import { A_COUNTER, A_CROSS, A_CROSS_GAP, A_OUTER, A_VIEWBOX, SUN } from "./ArgentineA.constants"
import type { ArgentineAProps } from "./ArgentineA.types"

/*
 * Fixed brand colors (it's the logo: it looks the same in every theme).
 * Light blue measured from the reference; the cross in the "Emergencia" button's red; sun colors from the Sol de Mayo.
 */
const BLUE = "#59a5de"
const FLAG_WHITE = "#ffffff"
const CROSS = "#b3261e"
const SUN_RAYS = "#f6a11e"
const SUN_EDGE = "#d97c0a"
const SUN_FEATURES = "#a35a00"

/** The logo's "A": light blue, with the Sol de Mayo in its white counter and a red cross on the right shoulder */
export const ArgentineA = ({
  outline,
  crossOutline,
  outlineWidth = 4,
  crossOutlineWidth = outlineWidth,
  ...svg
}: ArgentineAProps) => {
  const maskId = useId()

  return (
    // overflow visible: the outline goes past the A's box
    <svg viewBox={A_VIEWBOX} overflow="visible" aria-hidden="true" {...svg}>
      {/* Outline behind everything: the A's edge and the cross's, stroked (their inner half hides under them) */}
      {outline && <path d={A_OUTER} fill="none" stroke={outline} strokeWidth={outlineWidth * 2} strokeLinejoin="round" />}
      {crossOutline && (
        <path d={A_CROSS} fill="none" stroke={crossOutline} strokeWidth={crossOutlineWidth * 2} strokeLinejoin="round" />
      )}
      {/* The cross cuts the A with a gap around it (transparent: the background shows through) */}
      <mask id={maskId} maskUnits="userSpaceOnUse">
        <path d={A_OUTER} fill="#fff" />
        <path d={A_CROSS} stroke="#000" strokeWidth={A_CROSS_GAP} strokeLinejoin="round" />
      </mask>
      <path d={A_OUTER} fill={BLUE} mask={`url(#${maskId})`} />
      <path d={A_COUNTER} fill={FLAG_WHITE} mask={`url(#${maskId})`} />
      <g fill={SUN_RAYS} stroke={SUN_RAYS}>
        <path d={SUN.straightRays} strokeWidth={0} />
        <path d={SUN.wavyRays} fill="none" strokeWidth={0.8} strokeLinecap="round" />
      </g>
      <circle cx={SUN.cx} cy={SUN.cy} r={SUN.face} fill={SUN_RAYS} stroke={SUN_EDGE} strokeWidth={0.7} />
      {SUN.eyes.map(([cx, cy]) => (
        <circle key={cx} cx={cx} cy={cy} r={0.75} fill={SUN_FEATURES} />
      ))}
      <path d={SUN.mouth} fill="none" stroke={SUN_FEATURES} strokeWidth={0.7} strokeLinecap="round" />
      <path d={A_CROSS} fill={CROSS} />
    </svg>
  )
}
