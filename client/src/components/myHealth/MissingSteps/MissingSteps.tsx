import { ArrowRight } from "lucide-react"
import type { MissingStepsProps } from "./MissingSteps.types"

/** One button per missing piece of data: it's filled one at a time, not the whole form again */
export const MissingSteps = ({ missing }: MissingStepsProps) => (
  <ul role="list" className="m-0 flex list-none flex-col gap-1.5 p-0">
    {missing.map((label) => (
      <li key={label}>
        <button
          type="button"
          className="flex min-h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-lg bg-field px-3 py-1.5 text-left text-sm font-bold text-ink transition-colors hover:bg-brand-soft hover:text-brand in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-control-line"
        >
          {label}
          <span aria-hidden="true" className="flex size-6 flex-none items-center justify-center rounded-full text-brand">
            <ArrowRight className="size-3.5" />
          </span>
        </button>
      </li>
    ))}
  </ul>
)
