import { blockIcon } from "@/utils/blockIcons"
import { TONE_CYCLE } from "@/types/tone"
import type { AxesGridProps } from "./AxesGrid.types"

/** Numbered boxes in soft tones, each with its icon in a round tile and its big number in the corner */
export const AxesGrid = ({ items }: AxesGridProps) => (
  <ol className="m-0 mt-3 flex list-none flex-wrap gap-3 p-0">
    {items.map(([icon, axis], index) => {
      const Icon = blockIcon(icon)
      return (
        <li
          key={axis}
          className={`tone-${TONE_CYCLE[index % 5]} relative flex flex-[1_1_min(100%,15rem)] items-center gap-[0.9rem] rounded-[1.25rem] bg-(--tone) py-[1.1rem] pr-12 pl-[1.1rem] text-(--tone-ink) in-data-[theme=contrast]:outline in-data-[theme=contrast]:outline-ink`}
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-card">{Icon && <Icon aria-hidden="true" className="size-6" />}</span>
          <b className="min-w-0 text-[1.1rem] leading-[1.25] font-black [overflow-wrap:anywhere]">{axis}</b>
          <span aria-hidden="true" className="absolute top-[0.6rem] right-4 text-[1.6rem] font-black opacity-40">
            {index + 1}
          </span>
        </li>
      )
    })}
  </ol>
)
