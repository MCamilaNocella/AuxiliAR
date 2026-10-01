import { AUXI_COLORS } from "@/components/help/Auxi"
import { Cross } from "./AuxiModels.parts"

/*
 * Accessories for the category models, in the units of Auxi's viewBox.
 * Raised left hand ≈ (29, 61) at the top; lower right hand ≈ (107, 102).
 */

const OUTLINE = AUXI_COLORS.outline
const RED = "#e5484d"
const WOOD = "#c58b55"
const METAL = "#9aa3b0"

/** Scales a group around a point (to grow a piece without redrawing it) */
const grow = (x: number, y: number, k: number) => `translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`

const line = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const

/* ── Salud física ── */

/*
 * Big first-aid kit hugged in front of the body, traced from the reference
 * (reference → viewBox: x' = 39.4 + (x − 16.5) · 1.03, y' = 84.5 + (y − 76.5) · 1.03, then shrunk 8% under the head).
 */
export const HuggedKit = () => (
  // Slightly tilted (right side up) and nudged up-left, like the reference
  <g transform={`translate(-1.6 -2) rotate(-6 64 108) ${grow(64, 85, 0.92)}`}>
    {/* Depth: the box's top and right side, peeking behind the front */}
    <rect x="47" y="87.6" width="47" height="35.6" rx="4.6" fill="#a3123f" stroke={OUTLINE} strokeWidth="1.2" />
    <path d="M52.6 91.6 V87.4 C52.6 84.6 54.4 84.6 56 84.6 H69.4 C71 84.6 72.8 84.6 72.8 87.4 V91.6" {...line} stroke={OUTLINE} strokeWidth="4.6" />
    <path d="M52.6 91.6 V87.4 C52.6 84.6 54.4 84.6 56 84.6 H69.4 C71 84.6 72.8 84.6 72.8 87.4 V91.6" {...line} stroke="#b8154a" strokeWidth="2.6" />
    <rect x="42" y="92.2" width="44.4" height="35" rx="4.2" fill="#dc1d5c" stroke={OUTLINE} strokeWidth="1.2" />
    <path d="M45.4 96 C46.4 94.8 47.6 94.6 49 94.6" {...line} stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.2" />
    <Cross color="#ffffff" size={17} thickness={5.8} radius={1} cx={64.4} cy={110.2} />
    {/* Hands holding it by the sides */}
    <ellipse cx="38.4" cy="110" rx="5.6" ry="7.6" fill={AUXI_COLORS.white} stroke={OUTLINE} strokeWidth="1.25" />
    <ellipse cx="95.4" cy="105" rx="9.4" ry="7.8" transform="rotate(-12 94.6 105)" fill={AUXI_COLORS.white} stroke={OUTLINE} strokeWidth="1.25" />
  </g>
)

/* Stethoscope with the parts of a real one: silver ear tubes → black rubber tubes → Y → silver chest piece */
const SILVER = "#dfe4ea"
const RUBBER = "#1f1a1a"

/** Tube with a black outline and a soft shine along it */
const Tube = ({ d, color, width }: { d: string, color: string, width: number }) => (
  <>
    <path d={d} {...line} stroke={OUTLINE} strokeWidth={width + 1.4} />
    <path d={d} {...line} stroke={color} strokeWidth={width} />
  </>
)

/** Metal band where a silver ear tube meets the rubber */
const Band = ({ x, y, angle }: { x: number, y: number, angle: number }) => (
  <rect x={x - 2.4} y={y - 1.6} width="4.8" height="3.2" rx="0.6" transform={`rotate(${angle} ${x} ${y})`} fill={METAL} stroke={OUTLINE} strokeWidth="0.8" />
)

/**
 * Stethoscope hanging from the neck (not worn): the rubber tube comes out from under the head
 * and hangs down each side of the chest, away from the belly cross.
 * Left: chest piece. Right: Y → silver ear tubes with their tips. Goes in bodyExtras.
 */
export const DrapedStethoscope = () => (
  <>
    {/* Left side: rubber down to the chest piece */}
    <Tube d="M56.4 81.4 C53.8 89.6 54 96.8 56.2 101.6" color={RUBBER} width={2.8} />
    <Tube d="M56.2 101.6 L56.9 103.4" color={METAL} width={1.8} />
    <circle cx="57.6" cy="108.2" r="5.6" fill={SILVER} stroke={OUTLINE} strokeWidth="1.1" />
    <circle cx="57.6" cy="108.2" r="3.9" fill="none" stroke={METAL} strokeWidth="0.8" />
    <circle cx="57.6" cy="108.2" r="2.1" fill={METAL} />
    <circle cx="57.6" cy="108.2" r="0.9" fill="#7d8592" />
    <path d="M54.4 106.6 A3.8 3.8 0 0 1 56.2 104.8" {...line} stroke="#ffffff" strokeWidth="0.9" />
    {/* Right side, higher than the chest piece: rubber to the Y, then the silver ear tubes hanging */}
    <Tube d="M89.4 82.6 C92 86.4 92.6 89.6 91.6 92.2 M91.6 92.2 L89.8 94.8 M91.6 92.2 L93.6 94.8" color={RUBBER} width={2.6} />
    <g transform="translate(0.2 3.6)">
      <Tube d="M89.6 91.2 C88.6 93.6 88 96 87.9 98.4 M93.4 91.2 C94.6 93.6 95.4 96 95.6 98.2" color={SILVER} width={1.7} />
      <Band x={89.6} y={91.2} angle={-65} />
      <Band x={93.4} y={91.2} angle={65} />
      <ellipse cx="87.8" cy="99.8" rx="1.9" ry="2.5" fill={SILVER} stroke={OUTLINE} strokeWidth="0.9" />
      <ellipse cx="95.7" cy="99.6" rx="1.9" ry="2.5" fill={SILVER} stroke={OUTLINE} strokeWidth="0.9" />
    </g>
  </>
)

/** Two little dashes on the left (follow the theme, like the wave lines) */
export const LeftDashes = () => (
  <path d="M30.3 83 L35.5 84.9 M29.8 94.6 L35.5 90.7" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
)

/* ── Salud mental ── */

const HEART = "M0 5.8 C-2.2 3.9 -7.2 0.7 -7.2 -2.7 C-7.2 -5.3 -5.2 -7 -3.1 -7 C-1.7 -7 -0.5 -6.2 0 -4.9 C0.5 -6.2 1.7 -7 3.1 -7 C5.2 -7 7.2 -5.3 7.2 -2.7 C7.2 0.7 2.2 3.9 0 5.8Z"

/** Speech bubble over the head with a heart: talking helps. Goes in headExtras. */
export const HeartBubble = () => (
  <>
    <rect x="89" y="8.6" width="27.4" height="18.4" rx="6" fill="#ffffff" stroke={OUTLINE} strokeWidth="1.1" />
    {/* Tail: its fill hides the bubble's bottom edge where they meet */}
    <path d="M95.2 26.4 L91.6 33 L101.8 26.4" fill="#ffffff" stroke={OUTLINE} strokeWidth="1.1" strokeLinejoin="round" />
    <path d={HEART} transform="translate(102.7 18.4) scale(0.9)" fill={RED} />
  </>
)

/* ── Animales ── */

/** Black dog paw print, a bit big, on the right cheek */
export const CheekPaw = () => (
  <g transform="translate(99.6 73.4) rotate(-14) scale(1.9)" fill="#1f1a1a">
    <ellipse cx="0" cy="1.6" rx="2.5" ry="2.05" />
    <circle cx="-3" cy="-1.3" r="1.05" />
    <circle cx="-1.1" cy="-3" r="1.05" />
    <circle cx="1.1" cy="-3" r="1.05" />
    <circle cx="3" cy="-1.3" r="1.05" />
  </g>
)

/* ── Centros de atención ── */

/** Big map pin held up by the waving hand */
export const MapPin = () => (
  <g transform={grow(29, 59.6, 1.35)}>
    <path
      d="M0 0 C-1.6 -3.8 -8 -8.6 -8 -14.5 A8 8 0 1 1 8 -14.5 C8 -8.6 1.6 -3.8 0 0Z"
      transform="translate(29 59.6)"
      fill={RED}
      stroke={OUTLINE}
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
    <Cross color="#ffffff" size={8} thickness={2.8} radius={0.5} cx={29} cy={45.2} />
  </g>
)

/* ── Más recursos ── */

export const Clipboard = () => (
  <g transform={grow(108, 98, 1.25)}>
    <rect x="99.6" y="85.6" width="16.6" height="20.6" rx="2" fill={WOOD} stroke={OUTLINE} strokeWidth="1.1" />
    <rect x="101.8" y="88.8" width="12.2" height="15.4" rx="0.6" fill="#ffffff" />
    <rect x="104.9" y="84.2" width="6" height="3.6" rx="1" fill={METAL} stroke={OUTLINE} strokeWidth="0.8" />
    {[92.4, 96.4, 100.4].map((y) => (
      <g key={y}>
        <path d={`M103 ${y} L104.2 ${y + 1.2} L106.2 ${y - 1.2}`} {...line} stroke="#22a06b" strokeWidth="1" />
        <path d={`M107.6 ${y} H112.4`} {...line} stroke={METAL} strokeWidth="1" />
      </g>
    ))}
  </g>
)
