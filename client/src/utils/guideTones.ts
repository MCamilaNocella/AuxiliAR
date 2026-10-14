import type { Block } from "@/types/blocks"
import type { Tone } from "@/types/tone"

/** The tones the first aid guides take in turn (blue, green, violet, rose), as the model */
const GUIDE_TONES: Tone[] = [2, 4, 5, 1]

/** The tone of every guide and kit of a section, by id: the summary cells take the tone of the block they open */
export const guideTones = (blocks: Block[]): Record<string, Tone> => {
  const tones: Record<string, Tone> = {}
  blocks.filter((block) => block.type === "guide" || block.type === "kit").forEach((block, index) => {
    if (block.id) tones[block.id] = GUIDE_TONES[index % GUIDE_TONES.length]
  })
  return tones
}
