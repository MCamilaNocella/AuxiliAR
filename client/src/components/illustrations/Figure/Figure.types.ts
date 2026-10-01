export type Point = readonly [x: number, y: number]

export type HairStyle = "short" | "long" | "bun" | "curly" | "none"

export type FigureColors = {
  skin: string
  hair: string
  top: string
  bottom: string
  shoes: string
  /** Long white coat (doctors) or any overcoat: covers the torso down to mid-thigh */
  coat?: string
}

/**
 * A person drawn from its joints, in the scene's own coordinates.
 * "Back" is the limb farther from the viewer (drawn first), "front" the closer one.
 */
export type FigureProps = {
  head: Point
  shoulders: readonly [back: Point, front: Point]
  hips: readonly [back: Point, front: Point]
  armBack: readonly [elbow: Point, hand: Point]
  armFront: readonly [elbow: Point, hand: Point]
  legBack: readonly [knee: Point, foot: Point]
  legFront: readonly [knee: Point, foot: Point]
  /** Direction the person faces: 1 = right, -1 = left */
  facing: 1 | -1
  hair: HairStyle
  colors: FigureColors
  sleeves?: "long" | "short"
}
