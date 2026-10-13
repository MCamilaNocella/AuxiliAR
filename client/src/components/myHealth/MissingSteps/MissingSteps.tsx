import { ArrowRight } from "lucide-react"
import { ScrollList } from "../ScrollList"
import { MOVE_MS, VISIBLE_STEPS } from "./MissingSteps.constants"
import type { MissingStepsProps } from "./MissingSteps.types"
import { useListMoves } from "./useListMoves"
import { useRecentlyDone } from "./useRecentlyDone"

const ITEM =
  "flex min-h-10 w-full items-center justify-between gap-3 rounded-lg bg-field px-3 py-1.5 text-left text-sm font-bold text-ink in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-control-line"

/**
 * One button per missing piece of data: it's filled one at a time, not the whole form again.
 * Once filled in, the item rises over the rest to the top of the list (the rest glide down to make room); there
 * the arrow turns into a green check that draws itself (from the tip of the short stroke), then it fades out and
 * the rest glide back up. Several at once take turns, one after the other.
 * Only the first few show, the rest scroll; their room is kept when fewer are missing, so the rows beside the
 * card don't change size as the profile fills in.
 * `data-card-field` tells the emergency card that tapping it while editing isn't leaving the card.
 */
export const MissingSteps = ({ missing, onSelect }: MissingStepsProps) => {
  const done = useRecentlyDone(missing)
  // The just-completed ones go to the top (in the order they take turns), so the check is always in view
  const items = [...done.map((item) => ({ ...item, done: true })), ...missing.map((item) => ({ ...item, delay: 0, done: false }))]
  const moveRef = useListMoves(done.map(({ key }) => key))

  return (
    <ScrollList visible={VISIBLE_STEPS} keepRoom>
      {items.map(({ key, addLabel, delay, done: isDone }) => (
        // Waiting for its turn (several completed at once), it stays as it was: its animations start after `delay`.
        // relative + rounded: it can rise over the rest, with its shadow following the item's corners
        <li
          key={key}
          ref={moveRef(key)}
          className={`relative rounded-lg ${isDone ? "animate-step-done motion-reduce:animate-none" : ""}`}
          style={isDone ? { animationDelay: `${delay}ms` } : undefined}
        >
          {isDone ? (
            <div className={ITEM}>
              {addLabel}
              <span className="sr-only">: listo</span>
              <span aria-hidden="true" className="flex size-6 flex-none items-center justify-center rounded-full bg-surface text-success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                  <path d="M4 12l5 5L20 6" pathLength={1} className="animate-check-draw motion-reduce:animate-none" style={{ animationDelay: `${delay + MOVE_MS}ms` }} />
                </svg>
              </span>
            </div>
          ) : (
            <button
              type="button"
              data-card-field={key}
              onClick={() => onSelect(key)}
              className={`${ITEM} cursor-pointer transition-colors hover:bg-brand-soft hover:text-brand`}
            >
              {addLabel}
              <span aria-hidden="true" className="flex size-6 flex-none items-center justify-center rounded-full text-brand">
                <ArrowRight className="size-3.5" />
              </span>
            </button>
          )}
        </li>
      ))}
    </ScrollList>
  )
}
