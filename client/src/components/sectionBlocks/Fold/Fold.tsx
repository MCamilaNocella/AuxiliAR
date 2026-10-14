import { useId } from "react"
import { ChevronDown } from "lucide-react"
import { useSlidePanel } from "@/hooks/useSlidePanel"
import type { FoldProps } from "./Fold.types"

/** A line that opens what is under it, sliding (and back): "Qué puede haber", "Próximas fechas" or a question of the FAQ */
export const Fold = ({ label, count, question = false, inCard = false, children }: FoldProps) => {
  const panelId = useId()
  const { open, visible, toggle, panelRef } = useSlidePanel()
  return (
    // As the models: a line on top and some room, except the first one of its block (no line) and the questions (one after the other)
    <div className={`border-t border-line ${inCard ? "mt-1 text-[0.95rem]" : `${question ? "mt-0" : "mt-4"} first:mt-1 first:border-t-0`}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        className={`flex min-h-11 w-full cursor-pointer items-center gap-[0.4rem] border-0 bg-transparent py-2 text-left font-extrabold text-ink ${question ? "text-[1.02rem]" : ""}`}
      >
        <ChevronDown
          aria-hidden="true"
          className={`size-[1.1rem] shrink-0 text-[var(--tone-ink,var(--color-ink))] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
        {label}
        {count && <small className="ml-auto text-[0.833rem] font-bold whitespace-nowrap text-muted">{count}</small>}
      </button>
      <div id={panelId} ref={panelRef} hidden={!visible} className="overflow-hidden">
        <div className={`grid gap-4 pt-1 pb-2 ${question ? "text-ink-soft [&>p+p]:mt-2" : ""}`}>{children}</div>
      </div>
    </div>
  )
}
