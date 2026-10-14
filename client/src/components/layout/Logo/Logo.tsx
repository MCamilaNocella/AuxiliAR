import { Link } from "react-router"
import { PATHS } from "@/router/paths"
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
} from "./Logo.constants"

/* Fixed logo colors (same in every theme): "uxili" in the A's white, "AR" in its light blue, a white outline only around the cross */
const WHITE = "#ffffff"
const BLUE = "#59a5de"

/* The bigger A grows from the baseline, upwards and to the right, and pushes "uxiliAR" by its extra width */
const SHIFT = A_RIGHT * (A_SCALE - 1)
const TOP = BASELINE - (BASELINE - A_BOX.y) * A_SCALE
const A_POSITION = { x: A_BOX.x * A_SCALE, y: TOP, width: A_BOX.width * A_SCALE, height: A_BOX.height * A_SCALE }
/** The A's own units per wordmark pixel, at its size */
const A_UNITS = 140 / (A_BOX.width * A_SCALE)
/** Room for the cross's outline */
const PAD = CROSS_OUTLINE_WIDTH
const VIEWBOX = `${-PAD} ${TOP - PAD} ${LOCKUP_WIDTH + SHIFT + PAD * 2} ${LOCKUP_HEIGHT - TOP + PAD * 2}`

/** "AR": the last two letters, in light blue */
const isAr = (index: number) => index >= LETTERS.length - 2

export const Logo = () => (
  <Link to={PATHS.home} className="flex flex-none items-center no-underline" aria-label="AuxiliAR, ir al inicio">
    <svg viewBox={VIEWBOX} aria-hidden="true" className="h-7 w-auto sm:h-8">
      <ArgentineA {...A_POSITION} crossOutline={WHITE} crossOutlineWidth={CROSS_OUTLINE_WIDTH * A_UNITS} />
      {LETTERS.map(({ x, d }, i) => (
        <path key={i} d={d} transform={`translate(${x + SHIFT} 0)`} fill={isAr(i) ? BLUE : WHITE} />
      ))}
    </svg>
  </Link>
)
