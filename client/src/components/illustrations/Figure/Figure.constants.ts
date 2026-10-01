/** Shared proportions, so every person in every scene looks like part of the same set */
export const HEAD_R = 16
export const ARM_W = 12
export const LEG_W = 16
export const HAND_R = 6
export const NECK_W = 11
/** Stroke drawn around the torso in its own color: rounds its corners */
export const TORSO_ROUND = 10

/** Skin tones used across the illustrations (varied on purpose) */
export const SKIN = {
  light: "#f1c7a5",
  medium: "#e0ac69",
  tan: "#c68642",
  brown: "#8d5524",
  deep: "#5c3a21",
} as const

export const HAIR = {
  black: "#1d1412",
  brown: "#5a3522",
  auburn: "#8a4b2a",
  blond: "#d9a066",
  gray: "#d6d0cb",
} as const
