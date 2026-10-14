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
  OUTLINE_WIDTH,
} from "./Logo.constants"

/* Fixed logo colors (same in every theme): "uxili" in the A's white, "AR" in its light blue, white outline */
const WHITE = "#ffffff"
const BLUE = "#59a5de"

/* The bigger A grows from the baseline, upwards and to the right, and pushes "uxiliAR" by its extra width */
const SHIFT = A_RIGHT * (A_SCALE - 1)
const TOP = BASELINE - (BASELINE - A_BOX.y) * A_SCALE
const A_POSITION = { x: A_BOX.x * A_SCALE, y: TOP, width: A_BOX.width * A_SCALE, height: A_BOX.height * A_SCALE }
/** The A's own units per wordmark pixel, at its size */
const A_UNITS = 140 / (A_BOX.width * A_SCALE)
/** Room for the outline on every side */
const PAD = Math.max(OUTLINE_WIDTH, CROSS_OUTLINE_WIDTH)
const VIEWBOX = `${-PAD} ${TOP - PAD} ${LOCKUP_WIDTH + SHIFT + PAD * 2} ${LOCKUP_HEIGHT - TOP + PAD * 2}`

/** "AR": the last two letters, light blue with a white outline ("uxili" is white already) */
const isAr = (index: number) => index >= LETTERS.length - 2

export const Logo = () => (
  <Link to={PATHS.home} className="flex flex-none items-center no-underline" aria-label="AuxiliAR, ir al inicio">
    <svg viewBox={VIEWBOX} aria-hidden="true" className="h-7 w-auto sm:h-8">
      {/* Layers: the outlines, then the A (its own outline under it), then the letters, so no outline covers a neighbor */}
      {LETTERS.map(
        ({ x, d }, i) =>
          isAr(i) && (
            <path
              key={i}
              d={d}
              transform={`translate(${x + SHIFT} 0)`}
              fill="none"
              stroke={WHITE}
              strokeWidth={OUTLINE_WIDTH * 2}
              strokeLinejoin="round"
            />
          ),
      )}
      <ArgentineA
        {...A_POSITION}
        outline={WHITE}
        outlineWidth={OUTLINE_WIDTH * A_UNITS}
        crossOutlineWidth={CROSS_OUTLINE_WIDTH * A_UNITS}
      />
      {LETTERS.map(({ x, d }, i) => (
        <path key={i} d={d} transform={`translate(${x + SHIFT} 0)`} fill={isAr(i) ? BLUE : WHITE} />
      ))}
    </svg>
  </Link>
)
