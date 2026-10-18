import { ArgentineA } from "../ArgentineA"
import {
  A_BOX,
  A_RIGHT,
  A_SCALE,
  BASELINE,
  CROSS_OUTLINE_WIDTH,
  LETTERS,
  LOCKUP_HEIGHT,
  LOCKUP_WIDTH,
} from "./LogoLockup.constants"
import type { LogoLockupProps } from "./LogoLockup.types"

/* A white outline only around the cross (and around the whole A, if asked) */
const WHITE = "#ffffff"

/* The bigger A grows from the baseline, upwards and to the right, and pushes "uxiliAR" by its extra width */
const SHIFT = A_RIGHT * (A_SCALE - 1)
const TOP = BASELINE - (BASELINE - A_BOX.y) * A_SCALE
const A_POSITION = { x: A_BOX.x * A_SCALE, y: TOP, width: A_BOX.width * A_SCALE, height: A_BOX.height * A_SCALE }
/** The A's own units per wordmark pixel, at its size */
const A_UNITS = 140 / (A_BOX.width * A_SCALE)
/** Room for the outlines */
const PAD = CROSS_OUTLINE_WIDTH
const VIEWBOX = `${-PAD} ${TOP - PAD} ${LOCKUP_WIDTH + SHIFT + PAD * 2} ${LOCKUP_HEIGHT - TOP + PAD * 2}`

/** "AR": the last two letters */
const isAr = (index: number) => index >= LETTERS.length - 2

/** The logo drawing: the Argentine A + "uxiliAR". Colors from the logo tokens unless given (the /logos sketches) */
export const LogoLockup = ({
  letters = "var(--color-logo-letters)",
  ar = "var(--color-logo-ar)",
  outline,
  ...svg
}: LogoLockupProps) => (
  <svg viewBox={VIEWBOX} aria-hidden="true" {...svg}>
    <ArgentineA
      {...A_POSITION}
      outline={outline}
      outlineWidth={CROSS_OUTLINE_WIDTH * A_UNITS}
      crossOutline={WHITE}
      crossOutlineWidth={CROSS_OUTLINE_WIDTH * A_UNITS}
    />
    {LETTERS.map(({ x, d }, i) => (
      <path key={i} d={d} transform={`translate(${x + SHIFT} 0)`} fill={isAr(i) ? ar : letters} />
    ))}
  </svg>
)
