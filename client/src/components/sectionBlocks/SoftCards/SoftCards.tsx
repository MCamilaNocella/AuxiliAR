import { CONTRAST_OUTLINE } from "@/utils/contrastOutline"
import { TONE_CYCLE } from "@/types/tone"
import { BulletList } from "../BulletList"
import { Fold } from "../Fold"
import type { SoftCardsProps } from "./SoftCards.types"

/** Columns for even rows: 2 → 2, 3 → 3, 4 → 2 + 2, 5 → 3 + 2, 6 → 3 + 3 (the container is the section's content) */
const columns = (count: number) => {
  if (count === 1) return ""
  if (count === 5) return "@[34rem]:grid-cols-2 @[34rem]:[&>:first-child]:col-span-full @[50rem]:grid-cols-6 @[50rem]:[&>*]:col-span-2 @[50rem]:[&>:first-child]:col-span-2 @[50rem]:[&>:nth-child(n+4)]:col-span-3"
  if (count % 3 === 0) return `@[34rem]:grid-cols-2 @[50rem]:grid-cols-3 ${count === 3 ? "@[34rem]:[&>:last-child]:col-span-full @[50rem]:[&>:last-child]:col-span-1" : ""}`
  return "@[34rem]:grid-cols-2"
}

/** Cards on the soft background of the page, no border; an optional icon tile in a soft tone */
export const SoftCards = ({ items }: SoftCardsProps) => (
  <ul role="list" className={`m-0 mt-3 grid list-none gap-4 p-0 ${columns(items.length)}`}>
    {items.map(({ icon: Icon, tone, title, text, list, more, moreLabel, note, law, action }, index) => (
      <li key={title} className={`tone-${tone ?? TONE_CYCLE[index % 5]} grid min-w-0 content-start gap-2 rounded-[1.25rem] bg-card px-[1.2rem] [overflow-wrap:anywhere] pt-[1.2rem] pb-[1.3rem] ${CONTRAST_OUTLINE}`}>
        {Icon && (
          <span className={`flex size-12 items-center justify-center rounded-2xl bg-(--tone) text-(--tone-ink) ${CONTRAST_OUTLINE}`}>
            <Icon aria-hidden="true" className="size-6" />
          </span>
        )}
        <h4 className="m-0 text-[1.08rem] leading-[1.25] font-black text-[var(--card-title,var(--color-ink))]">{title}</h4>
        {(Array.isArray(text) ? text : text ? [text] : []).map((paragraph, k) => (
          <p key={k} className="m-0 text-ink-soft">
            {paragraph}
            {law && k === 0 && <small className="mt-[0.35rem] block text-[0.8rem] font-extrabold tracking-[0.02em] text-[var(--card-title,var(--tone-ink))]">{law}</small>}
          </p>
        ))}
        {list && (
          <ul className="m-0 grid list-disc gap-[0.3rem] pl-[1.15rem] text-ink-soft">
            {list.map((item, k) => (
              <li key={k}>{item}</li>
            ))}
          </ul>
        )}
        {more?.length ? (
          <Fold label={moreLabel ?? "Ver más"} inCard>
            <BulletList items={more} />
            {note && <p className="m-0 text-sm font-bold text-muted">{note}</p>}
          </Fold>
        ) : (
          note && <p className="m-0 text-sm font-bold text-muted">{note}</p>
        )}
        {action}
      </li>
    ))}
  </ul>
)
