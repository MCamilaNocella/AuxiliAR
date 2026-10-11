import { ArrowRight } from "lucide-react"
import { useSoftButtons } from "../../useButtonLook"
import type { MissingStepsProps } from "./MissingSteps.types"

/** One button per missing piece of data: it's filled one at a time, not the whole form again */
export const MissingSteps = ({ missing, compact = false }: MissingStepsProps) => {
  const soft = useSoftButtons()
  return (
    <ul role="list" className={`m-0 flex list-none flex-col p-0 ${compact ? "gap-1.5" : "gap-2"}`}>
      {missing.map((label) => (
        <li key={label}>
          <button
            type="button"
            className={`flex w-full cursor-pointer items-center justify-between gap-3 text-left font-bold text-ink transition-colors hover:text-brand ${compact ? "min-h-10 px-3 py-1.5 text-sm" : "min-h-11 px-4 py-2"} ${
              soft ? "rounded-lg bg-field hover:bg-brand-soft in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-control-line" : `border border-control-line bg-card hover:border-brand ${compact ? "rounded-xl" : "rounded-2xl"}`
            }`}
          >
            {label}
            <span aria-hidden="true" className={`flex flex-none items-center justify-center rounded-full text-brand ${soft ? "" : "bg-brand-soft"} ${compact ? "size-6" : "size-7"}`}>
              <ArrowRight className={compact ? "size-3.5" : "size-4"} />
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
