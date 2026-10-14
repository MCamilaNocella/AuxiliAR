import { useId, useRef, useState } from "react"
import type { KeyboardEvent } from "react"
import { CONTRAST_OUTLINE } from "@/utils/contrastOutline"
import type { BlockTabsProps } from "./BlockTabs.types"

const KEYS: Record<string, (index: number, count: number) => number> = {
  ArrowRight: (i, n) => (i + 1) % n,
  ArrowLeft: (i, n) => (i - 1 + n) % n,
  Home: () => 0,
  End: (_, n) => n - 1,
}

/** Accessible tabs as the category models: a soft bar of options (arrow keys move between them) and the chosen one's panel */
export const BlockTabs = ({ tabs, label, scroll = false, plain = false, wrapLabels = false }: BlockTabsProps) => {
  const id = useId()
  const [selected, setSelected] = useState(0)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const onKeyDown = (event: KeyboardEvent) => {
    const move = KEYS[event.key]
    if (!move) return
    event.preventDefault()
    const next = move(selected, tabs.length)
    setSelected(next)
    buttons.current[next]?.focus()
    buttons.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest" })
  }
  return (
    <div className="mt-3">
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className={`flex gap-[0.35rem] rounded-xl bg-field p-[0.35rem] ${scroll ? "overflow-x-auto" : "flex-wrap"}`}>
        {tabs.map(({ label: name, icon: Icon }, index) => (
          <button
            key={name}
            ref={(element) => {
              buttons.current[index] = element
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-controls={`${id}-panel-${index}`}
            aria-selected={index === selected}
            tabIndex={index === selected ? 0 : -1}
            onClick={() => setSelected(index)}
            className={`inline-flex min-h-11 flex-[1_1_auto] cursor-pointer items-center justify-center gap-[0.45rem] rounded-lg border-0 bg-transparent px-[0.85rem] py-[0.45rem] font-extrabold text-ink-soft ${wrapLabels ? "text-center whitespace-normal" : "whitespace-nowrap"} hover:bg-brand-soft hover:text-brand aria-selected:bg-card aria-selected:text-[var(--tab-ink,var(--color-brand))] aria-selected:shadow-[0_1px_3px_rgb(0_0_0/0.12)] in-data-[theme=contrast]:aria-selected:outline-2 in-data-[theme=contrast]:aria-selected:outline-brand`}
          >
            {Icon && <Icon aria-hidden="true" className="size-[1.25em]" />}
            {name}
          </button>
        ))}
      </div>
      {tabs.map(({ content }, index) => (
        <div
          key={index}
          role="tabpanel"
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          tabIndex={0}
          hidden={index !== selected}
          className={plain ? "animate-tab-in [&>ol]:pt-[0.9rem] motion-reduce:animate-none" : `mt-0 grid animate-tab-in gap-4 rounded-xl bg-card p-5 motion-reduce:animate-none sm:p-6 ${CONTRAST_OUTLINE}`}
        >
          {content}
        </div>
      ))}
    </div>
  )
}
