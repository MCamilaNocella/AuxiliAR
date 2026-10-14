import { ExternalLink } from "lucide-react"
import { blockIcon } from "@/utils/blockIcons"
import { CONTRAST_OUTLINE } from "@/utils/contrastOutline"
import { TONE_CYCLE } from "@/types/tone"
import type { LinkCardsProps } from "./LinkCards.types"

/** Cards that take you to an official page: an icon tile, who it is from, the title, what you find and a "Ver materiales" button */
export const LinkCards = ({ items }: LinkCardsProps) => (
  <ul role="list" className="m-0 mt-3 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-3 p-0">
    {items.map(({ icon, who, title, text, url }, index) => {
      const Icon = blockIcon(icon)
      return (
        <li key={title + who} className={`tone-${TONE_CYCLE[index % 5]} flex flex-col gap-2 rounded-[1.25rem] bg-card px-[1.2rem] pt-[1.1rem] pb-[1.2rem] ${CONTRAST_OUTLINE}`}>
          {Icon && (
            <span className={`flex size-12 items-center justify-center rounded-2xl bg-(--tone) text-(--tone-ink) ${CONTRAST_OUTLINE}`}>
              <Icon aria-hidden="true" className="size-6" />
            </span>
          )}
          <span className="text-[0.8rem] font-extrabold text-(--category-accent)">{who}</span>
          <h4 className="m-0 text-[1.08rem] leading-[1.25] font-black">{title}</h4>
          <p className="m-0 text-[0.95rem] text-ink-soft">{text}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex min-h-10 items-center gap-1.5 self-start rounded-lg bg-field px-3.5 py-1.5 text-sm font-bold text-ink no-underline hover:bg-brand-soft hover:text-ink in-data-[theme=contrast]:shadow-[inset_0_0_0_1px_var(--color-control-line)]"
          >
            Ver materiales
            <ExternalLink aria-hidden="true" className="size-4 shrink-0" />
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </li>
      )
    })}
  </ul>
)
