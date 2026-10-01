import { ARM_W, HAND_R, HEAD_R, LEG_W, NECK_W, TORSO_ROUND } from "./Figure.constants"
import type { FigureProps, Point } from "./Figure.types"

const pt = ([x, y]: Point) => `${x} ${y}`
const mid = ([ax, ay]: Point, [bx, by]: Point): Point => [(ax + bx) / 2, (ay + by) / 2]
const lerp = ([ax, ay]: Point, [bx, by]: Point, t: number): Point => [ax + (bx - ax) * t, ay + (by - ay) * t]
const limb = (from: Point, ...rest: Point[]) => `M${pt(from)}${rest.map((p) => ` L${pt(p)}`).join("")}`
const polar = ([x, y]: Point, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180
  return `${x + r * Math.cos(a)} ${y + r * Math.sin(a)}`
}

/** Hair drawn for a person facing right; the caller mirrors it for facing left */
const HairBack = ({ style, head, color }: { style: FigureProps["hair"]; head: Point; color: string }) => {
  const [x, y] = head
  const r = HEAD_R
  if (style === "long")
    return <path d={`M${x - r - 3} ${y - 2} Q${x - r - 6} ${y + r * 2.2} ${x - r * 0.2} ${y + r * 2.1} L${x + r * 0.6} ${y + r * 0.6} L${x + r} ${y - 2} Z`} fill={color} />
  if (style === "curly") return <circle cx={x - r * 0.25} cy={y - r * 0.15} r={r * 1.32} fill={color} />
  if (style === "bun") return <circle cx={x - r * 0.75} cy={y - r * 0.8} r={r * 0.5} fill={color} />
  return null
}

const HairFront = ({ style, head, color }: { style: FigureProps["hair"]; head: Point; color: string }) => {
  if (style === "none" || style === "curly") return null
  const [x, y] = head
  const R = HEAD_R + 1.2
  // Cap over the top of the head, lower on the back of the neck, hairline towards the face
  return (
    <path
      d={`M${polar(head, R, 150)} A${R} ${R} 0 0 1 ${polar(head, R, 345)} Q${x + HEAD_R * 0.15} ${y - HEAD_R * 0.45} ${x - HEAD_R * 0.35} ${y - HEAD_R * 0.05} Q${x - HEAD_R * 0.6} ${y + HEAD_R * 0.35} ${polar(head, R, 150)} Z`}
      fill={color}
    />
  )
}

/** Faceless flat-style person (decorative), built from joint positions */
export const Figure = ({
  head,
  shoulders,
  hips,
  armBack,
  armFront,
  legBack,
  legFront,
  facing,
  hair,
  colors,
  sleeves = "long",
}: FigureProps) => {
  const { skin, top, bottom, shoes, coat } = colors
  const hairFlip = facing === 1 ? undefined : `translate(${head[0] * 2} 0) scale(-1 1)`

  // `shade`: the far limbs get a light dark veil, which gives depth and separates them from the body
  const arm = (shoulder: Point, [elbow, hand]: FigureProps["armBack"], shade: number) => {
    const sleeveColor = coat ?? top
    const sleeveEnd = sleeves === "long" ? lerp(elbow, hand, 0.8) : lerp(shoulder, elbow, 0.75)
    const sleeve = sleeves === "long" ? limb(shoulder, elbow, sleeveEnd) : limb(shoulder, sleeveEnd)
    return (
      <g strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={limb(shoulder, elbow, hand)} stroke={skin} strokeWidth={ARM_W - 1} />
        <circle cx={hand[0]} cy={hand[1]} r={HAND_R} fill={skin} />
        <path d={limb(shoulder, elbow, hand)} stroke="#000" strokeOpacity={shade} strokeWidth={ARM_W - 1} />
        <circle cx={hand[0]} cy={hand[1]} r={HAND_R} fill="#000" fillOpacity={shade} />
        <path d={sleeve} stroke={sleeveColor} strokeWidth={ARM_W} />
        <path d={sleeve} stroke="#000" strokeOpacity={shade + 0.04} strokeWidth={ARM_W} />
      </g>
    )
  }

  const leg = (hip: Point, [knee, foot]: FigureProps["legBack"], shade: number) => (
    <g>
      <path d={limb(hip, knee, foot)} stroke={bottom} strokeWidth={LEG_W} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={limb(hip, knee, foot)} stroke="#000" strokeOpacity={shade} strokeWidth={LEG_W} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <ellipse cx={foot[0] + facing * 6} cy={foot[1] + 2} rx={11} ry={5.5} fill={shoes} />
    </g>
  )

  const [shoulderBack, shoulderFront] = shoulders
  const [hipBack, hipFront] = hips
  const torso = `M${pt(shoulderBack)} L${pt(shoulderFront)} L${pt(hipFront)} L${pt(hipBack)} Z`
  // The coat hangs from the shoulders to about mid-thigh
  const coatBottomBack = lerp(hipBack, legBack[0], 0.55)
  const coatBottomFront = lerp(hipFront, legFront[0], 0.55)
  const coatPath = `M${pt(shoulderBack)} L${pt(shoulderFront)} L${pt(coatBottomFront)} L${pt(coatBottomBack)} Z`

  return (
    <g>
      <g transform={hairFlip}>
        <HairBack style={hair} head={head} color={colors.hair} />
      </g>
      {arm(shoulderBack, armBack, 0.14)}
      {leg(hipBack, legBack, 0.14)}
      {leg(hipFront, legFront, 0)}
      <path d={limb(mid(shoulderBack, shoulderFront), head)} stroke={skin} strokeWidth={NECK_W} strokeLinecap="round" />
      <path d={torso} fill={top} stroke={top} strokeWidth={TORSO_ROUND} strokeLinejoin="round" />
      {coat && (
        <>
          <path d={coatPath} fill={coat} stroke={coat} strokeWidth={TORSO_ROUND} strokeLinejoin="round" />
          {/* Opening of the coat, showing the clothes underneath */}
          <path
            d={limb(lerp(shoulderBack, shoulderFront, 0.5 + facing * 0.12), lerp(coatBottomBack, coatBottomFront, 0.5 + facing * 0.12))}
            stroke={top}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </>
      )}
      <circle cx={head[0]} cy={head[1]} r={HEAD_R} fill={skin} />
      <g transform={hairFlip}>
        <HairFront style={hair} head={head} color={colors.hair} />
      </g>
      {arm(shoulderFront, armFront, 0)}
    </g>
  )
}
