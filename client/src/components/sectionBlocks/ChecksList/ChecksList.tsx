import { Check } from "lucide-react"
import { CONTRAST_OUTLINE } from "@/utils/contrastOutline"
import { TONE_CYCLE } from "@/types/tone"
import type { ChecksListProps } from "./ChecksList.types"

/** A list where each line starts with a check in a soft circle, the tones in turn */
export const ChecksList = ({ items }: ChecksListProps) => (
  <ul role="list" className="m-0 mt-3 grid list-none gap-[0.6rem] p-0">
    {items.map((item, index) => (
      <li key={index} className="flex items-start gap-[0.7rem]">
        <span className={`tone-${TONE_CYCLE[index % 5]} grid size-[1.6rem] shrink-0 place-items-center rounded-full bg-(--tone) text-(--tone-ink) ${CONTRAST_OUTLINE}`}>
          <Check aria-hidden="true" className="size-4" />
        </span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
)
