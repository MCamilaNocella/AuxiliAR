import { CONTRAST_OUTLINE } from "@/utils/contrastOutline"
import { TONE_CYCLE } from "@/types/tone"
import type { OptionTilesProps } from "./OptionTiles.types"

/** Short options side by side, each one with its icon tile (the tones start on the second) */
export const OptionTiles = ({ items }: OptionTilesProps) => (
  <ul role="list" className="m-0 mt-3 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,12rem),1fr))] gap-[0.9rem] p-0">
    {items.map(({ icon: Icon, text }, index) => (
      <li key={text} className={`tone-${TONE_CYCLE[(index + 1) % 5]} flex items-center gap-[0.85rem] rounded-[1.25rem] bg-card px-4 py-[0.9rem] font-extrabold ${CONTRAST_OUTLINE}`}>
        {Icon && (
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-[0.8rem] bg-(--tone) text-(--tone-ink) ${CONTRAST_OUTLINE}`}>
            <Icon aria-hidden="true" className="size-5" />
          </span>
        )}
        {text}
      </li>
    ))}
  </ul>
)
