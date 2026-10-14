/** The soft tones of index.css (tone-1 … tone-5) that tell the blocks of a section apart */
export type Tone = 1 | 2 | 3 | 4 | 5

/** "t3" (as the models name them) → 3 */
export const toneOf = (name: string | undefined, fallback: Tone = 2): Tone => {
  const n = Number(name?.slice(1))
  return n >= 1 && n <= 5 ? (n as Tone) : fallback
}

/** The tones in the order the models deal them to a row of tiles */
export const TONE_CYCLE: Tone[] = [1, 2, 3, 4, 5]
