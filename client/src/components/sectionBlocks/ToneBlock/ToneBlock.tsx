import { use } from "react"
import { CONTRAST_OUTLINE } from "@/utils/contrastOutline"
import { BlockLookContext } from "../BlockLook"
import type { ToneBlockProps } from "./ToneBlock.types"

/** One part of a section: its title over a line (with an optional icon tile) and its content */
export const ToneBlock = ({ id, title, icon: Icon, tone, lead = [], value, valueLabel, bare = false, children }: ToneBlockProps) => {
  const accent = use(BlockLookContext) === "accent"
  const anchor = id ? `part-${id}` : undefined
  if (bare || !title) {
    return (
      <section id={anchor} tabIndex={anchor ? -1 : undefined} className={`tone-${tone} grid grid-cols-[minmax(0,1fr)] focus:outline-none`}>
        {children}
      </section>
    )
  }
  return (
    <section id={anchor} tabIndex={anchor ? -1 : undefined} aria-labelledby={anchor && `${anchor}-title`} className={`tone-${tone} grid grid-cols-[minmax(0,1fr)] gap-1 focus:outline-none ${accent ? "[--marker:var(--tone-ink)] [--step-bg:var(--tone)] [--step-ink:var(--tone-ink)] [--note-ink:var(--tone-ink)] [--sub-ink:var(--tone-ink)] [--card-title:var(--tone-ink)]" : ""}`}>
      <div className={`flex flex-wrap items-center gap-3 border-b-2 pb-3 ${accent ? "border-(--tone-ink)" : "border-ink in-data-[theme=dark]:border-line-strong"}`}>
        {Icon && (
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-(--tone) text-(--tone-ink) ${CONTRAST_OUTLINE}`}>
            <Icon aria-hidden="true" className="size-5" />
          </span>
        )}
        <h3 id={anchor && `${anchor}-title`} className={`m-0 min-w-0 text-[1.2rem] leading-[1.2] font-black [overflow-wrap:anywhere] ${accent ? "text-(--tone-ink)" : ""}`}>
          {title}
        </h3>
        {value && (
          <span className="ml-auto min-w-0 text-right leading-[1.15]">
            <b className="block text-[1.35rem] font-black text-brand">{value}</b>
            {valueLabel && <span className="text-[0.85rem] font-bold text-muted">{valueLabel}</span>}
          </span>
        )}
      </div>
      {lead.map((paragraph, index) => (
        <p key={index} className={`m-0 ${index ? "pt-1" : "pt-2"}`}>
          {paragraph}
        </p>
      ))}
      {children}
    </section>
  )
}
