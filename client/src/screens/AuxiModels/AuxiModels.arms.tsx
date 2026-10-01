import { AUXI_COLORS as C, AUXI_MOTION_LINES, AUXI_PATHS as P } from "@/components/help/Auxi"

/*
 * Arm poses (passed as Auxi's `arms`), built from the traced hands of the original illustration.
 * Auxi's own right side is mirrored around the center of the body to get the opposite pose.
 */

const outline = { stroke: C.outline, strokeWidth: 1.25, strokeLinejoin: "round" } as const
const MIRROR = "translate(145.4 0) scale(-1 1)"

/** Raised hand on the left (the waving one, without the wave lines) */
export const LeftUp = () => (
  <>
    <path d={P.handLeft} fill={C.white} {...outline} />
    <path d={P.sleeveLeft} fill={C.maroon} {...outline} />
  </>
)

/** Only the waving hand on the left, with its wave lines (the other hand is drawn by the model) */
export const WavingLeft = () => (
  <>
    <g fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round">
      {AUXI_MOTION_LINES.map((d) => <path key={d} d={d} />)}
    </g>
    <LeftUp />
  </>
)

/** Relaxed hand on the right */
export const RightDown = () => (
  <>
    <path d={P.handRight} fill={C.white} {...outline} />
    <path d={P.sleeveRight} fill={C.maroon} {...outline} />
  </>
)

/** Relaxed hand on the left (mirror of the right one) */
export const LeftDown = () => <g transform={MIRROR}><RightDown /></g>

/** Raised hand on the right (mirror of the waving one) */
export const RightUp = () => <g transform={MIRROR}><LeftUp /></g>

/** Only the right sleeve, for a right arm drawn by the model */
export const RightSleeve = () => <path d={P.sleeveRight} fill={C.maroon} {...outline} />

/** Both side sleeves, for poses where both hands come to the front */
export const SideSleeves = () => (
  <>
    <path d={P.sleeveRight} fill={C.maroon} {...outline} />
    <g transform={MIRROR}><path d={P.sleeveRight} fill={C.maroon} {...outline} /></g>
  </>
)

/** Lower end of each side sleeve, where an arm brought to the front starts */
const SLEEVE_END = { left: { x: 45.4, y: 100.6 }, right: { x: 100, y: 100.6 } } as const

/** Arm from a side sleeve towards a fist at (x, y), drawn in front of the body. Pair it with SideSleeves. */
export const ArmTo = ({ side, x, y }: { side: "left" | "right", x: number, y: number }) => {
  const from = SLEEVE_END[side]
  const d = `M${from.x} ${from.y} L${x} ${y}`
  return (
    <>
      <path d={d} fill="none" stroke={C.outline} strokeWidth="8.6" strokeLinecap="round" />
      <path d={d} fill="none" stroke={C.white} strokeWidth="6.2" strokeLinecap="round" />
    </>
  )
}
