import { useId } from "react"
import { AUXI_BELLY as B, AUXI_COLORS, AUXI_PATHS } from "@/components/help/Auxi"

/*
 * Pieces drawn on top of Auxi, in the units of its viewBox.
 * Fixed colors on purpose, like the rest of the illustration.
 */

const OUTLINE = AUXI_COLORS.outline
const METAL = "#dfe4ea"
const METAL_DARK = "#9aa3b0"
const TUBE = "#4a5160"

type CrossProps = {
  color: string
  /** Total length of each arm, end to end */
  size?: number
  /** Thickness of the arms */
  thickness?: number
  radius?: number
  cx?: number
  cy?: number
}

/** Plus-shaped cross: two overlapping rounded bars */
export const Cross = ({ color, size = 12, thickness = 4, radius = 0.8, cx = B.x, cy = B.y }: CrossProps) => (
  <g fill={color}>
    <rect x={cx - size / 2} y={cy - thickness / 2} width={size} height={thickness} rx={radius} />
    <rect x={cx - thickness / 2} y={cy - size / 2} width={thickness} height={size} rx={radius} />
  </g>
)

/** Stethoscope hanging from the neck: chest piece on the left, ear tips on the right */
export const Stethoscope = () => {
  const tubes = "M58.2 81.6 C55.4 89 55 97 58.6 102.6 M88.4 82.6 C92.2 89 92.8 95 90.4 99.8"
  const earTips = "M90.4 99.8 L88.6 102.8 M90.4 99.8 L92.2 102.6"
  return (
    <g strokeLinecap="round" fill="none">
      <path d={tubes} stroke={OUTLINE} strokeWidth="2.7" />
      <path d={tubes} stroke={TUBE} strokeWidth="1.4" />
      <path d={earTips} stroke={OUTLINE} strokeWidth="2.1" />
      <path d={earTips} stroke={METAL_DARK} strokeWidth="0.9" />
      <circle cx="88.6" cy="102.9" r="0.9" fill={OUTLINE} />
      <circle cx="92.2" cy="102.7" r="0.9" fill={OUTLINE} />
      <circle cx="59.4" cy="105.4" r="3.5" fill={METAL} stroke={OUTLINE} strokeWidth="0.9" />
      <circle cx="59.4" cy="105.4" r="1.9" fill={METAL_DARK} />
      <circle cx="58.5" cy="104.5" r="0.6" fill="#ffffff" />
    </g>
  )
}

/** Doctor's head mirror on the forehead, strap clipped to the head */
export const HeadMirror = () => {
  const clipId = `${useId()}-head`
  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <path d={AUXI_PATHS.head} />
        </clipPath>
      </defs>
      <path
        d="M38 41 C58 36.6 96 36.6 114 41.4"
        fill="none"
        stroke={TUBE}
        strokeWidth="2.2"
        clipPath={`url(#${clipId})`}
      />
      <circle cx="77" cy="38.6" r="4.7" fill={METAL} stroke={OUTLINE} strokeWidth="0.9" />
      <circle cx="77" cy="38.6" r="2.9" fill="none" stroke={METAL_DARK} strokeWidth="0.7" />
      <circle cx="77" cy="38.6" r="1" fill={TUBE} />
      <path d="M74.4 36.8 A3.4 3.4 0 0 1 76 35.4" fill="none" stroke="#ffffff" strokeWidth="0.7" strokeLinecap="round" />
    </g>
  )
}
