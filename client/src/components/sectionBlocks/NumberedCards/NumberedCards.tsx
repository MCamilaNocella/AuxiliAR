import { CONTRAST_OUTLINE } from "@/utils/contrastOutline"
import { TONE_CYCLE } from "@/types/tone"
import type { NumberedCardsProps } from "./NumberedCards.types"

const BALANCED: Record<number, string> = {
  5: "@[34rem]:[&>:first-child]:col-span-full @[50rem]:grid-cols-6 @[50rem]:[&>*]:col-span-2 @[50rem]:[&>:first-child]:col-span-2 @[50rem]:[&>:nth-child(n+4)]:col-span-3",
  6: "@[50rem]:grid-cols-3",
}

/** Numbered cards (e.g. the 10 messages of the dietary guidelines): an icon tile, a short title and its text, the number faded in the corner */
export const NumberedCards = ({ items, balanced = false }: NumberedCardsProps) => (
  <ol className={`m-0 mt-3 grid list-none gap-[0.9rem] p-0 ${balanced ? `grid-cols-1 @[34rem]:grid-cols-2 ${BALANCED[items.length] ?? ""}` : "grid-cols-[repeat(auto-fill,minmax(min(100%,14rem),1fr))]"}`}>
    {items.map(({ id, icon: Icon, title, text }, index) => (
      <li
        key={title}
        id={id ? `part-${id}` : undefined}
        tabIndex={id ? -1 : undefined}
        className={`tone-${TONE_CYCLE[index % 5]} relative flex flex-col gap-2 rounded-[1.25rem] bg-card px-[1.1rem] pt-[1.1rem] pb-[1.2rem] transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none motion-reduce:transition-none ${CONTRAST_OUTLINE}`}
      >
        <span aria-hidden="true" className="absolute top-[0.85rem] right-4 text-[1.9rem] font-black text-brand opacity-25 in-data-[theme=contrast]:opacity-100">
          {index + 1}
        </span>
        {Icon && (
          <span className={`flex size-10 items-center justify-center rounded-[0.8rem] bg-(--tone) text-(--tone-ink) ${CONTRAST_OUTLINE}`}>
            <Icon aria-hidden="true" className="size-5" />
          </span>
        )}
        <b className="text-[1.05rem] font-black">{title}</b>
        <p className="m-0 text-[0.9rem] text-ink-soft">{text}</p>
      </li>
    ))}
  </ol>
)
