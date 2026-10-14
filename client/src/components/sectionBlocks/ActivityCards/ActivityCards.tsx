import { CONTRAST_OUTLINE } from "@/utils/contrastOutline"
import type { ActivityCardsProps } from "./ActivityCards.types"

/** Grid columns by how many cards there are, so the rows come out even (5 go 3 + 2, 3 go in one row) */
const COLUMNS: Record<number, string> = {
  3: "@[34rem]:[&>:last-child]:col-span-full @[50rem]:grid-cols-3 @[50rem]:[&>:last-child]:col-auto",
  5: "@[34rem]:[&>:first-child]:col-span-full @[50rem]:grid-cols-6 @[50rem]:[&>*]:col-span-2 @[50rem]:[&>:first-child]:col-span-2 @[50rem]:[&>:nth-child(n+4)]:col-span-3",
}

/** Cards of activities or groups: a title, facts with icons, a small remark and a link */
export const ActivityCards = ({ items }: ActivityCardsProps) => (
  <ul role="list" className={`m-0 mt-[0.6rem] grid list-none gap-4 p-0 @[34rem]:grid-cols-2 ${COLUMNS[items.length] ?? ""}`}>
    {items.map(({ title, rows, note, link }) => (
      <li key={title} className={`grid content-start gap-[0.45rem] rounded-[1.25rem] bg-card px-[1.15rem] py-[1.1rem] ${CONTRAST_OUTLINE}`}>
        <h4 className="m-0 text-[1.05rem] font-black">{title}</h4>
        {rows.map(({ icon: Icon, text }) => (
          <p key={text} className="m-0 flex items-start gap-[0.45rem] text-[0.925rem] text-ink-soft">
            <Icon aria-hidden="true" className="mt-[0.2rem] size-4 shrink-0 text-(--category-accent) in-data-[theme=contrast]:text-brand" />
            <span>{text}</span>
          </p>
        ))}
        {note && <p className="m-0 text-[0.85rem] font-bold text-muted">{note}</p>}
        {link && (
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="justify-self-start text-[0.85rem]">
            {link.label}
          </a>
        )}
      </li>
    ))}
  </ul>
)
