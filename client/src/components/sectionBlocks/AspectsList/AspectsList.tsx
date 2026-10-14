import { blockIcon } from "@/utils/blockIcons"
import { TONE_CYCLE } from "@/types/tone"
import type { AspectsListProps } from "./AspectsList.types"

/** A row of words with their icon, each one in the ink of a tone (they wrap on narrow screens) */
export const AspectsList = ({ items }: AspectsListProps) => (
  <ul role="list" className="m-0 mt-3 flex list-none flex-wrap gap-[0.6rem] p-0">
    {items.map(([icon, word], index) => {
      const Icon = blockIcon(icon)
      return (
        <li key={word} className={`tone-${TONE_CYCLE[index % 5]} grid flex-[1_1_6.5rem] justify-items-center gap-[0.4rem] rounded-[1.1rem] px-2 py-4 text-center font-black text-(--tone-ink) in-data-[theme=contrast]:outline in-data-[theme=contrast]:outline-ink`}>
          {Icon && <Icon aria-hidden="true" className="size-7" />}
          {word}
        </li>
      )
    })}
  </ul>
)
