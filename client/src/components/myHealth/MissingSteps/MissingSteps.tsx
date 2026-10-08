import { ArrowRight } from "lucide-react"
import { ScrollList } from "../ScrollList"
import { VISIBLE_STEPS } from "./MissingSteps.constants"
import type { MissingStepsProps } from "./MissingSteps.types"

/**
 * One button per missing piece of data: it's filled one at a time, not the whole form again.
 * Only the first few show, the rest scroll; their room is kept when fewer are missing, so the rows beside the
 * card don't change size as the profile fills in.
 * `data-card-field` (only on the card's data) tells the emergency card that tapping it while editing isn't leaving the card.
 */
export const MissingSteps = ({ missing, onSelect }: MissingStepsProps) => (
  <ScrollList visible={VISIBLE_STEPS} keepRoom>
    {missing.map(({ key, addLabel, onCard }) => (
      <li key={key}>
        <button
          type="button"
          data-card-field={onCard ? key : undefined}
          onClick={() => onSelect(key)}
          className="flex min-h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-lg bg-field px-3 py-1.5 text-left text-sm font-bold text-ink transition-colors hover:bg-brand-soft hover:text-brand in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-control-line"
        >
          {addLabel}
          <span aria-hidden="true" className="flex size-6 flex-none items-center justify-center rounded-full text-brand">
            <ArrowRight className="size-3.5" />
          </span>
        </button>
      </li>
    ))}
  </ScrollList>
)
