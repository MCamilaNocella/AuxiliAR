/** "POINT (x y)" → [x, y]; null when it is not a plain point */
export const parsePoint = (wkt) => {
  const match = /^\s*POINT\s*\(\s*(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)\s+(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)\s*\)\s*$/i.exec(String(wkt ?? ""))
  return match ? [Number(match[1]), Number(match[2])] : null
}
