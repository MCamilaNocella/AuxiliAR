import { Phone } from "lucide-react"
import { blockIcon } from "@/utils/blockIcons"
import { telOf } from "@/utils/telOf"
import { RichText } from "../RichText"
import type { RowsListProps } from "./RowsList.types"

/** Rows split by thin lines: a title, a text, small facts with icons (a phone to call) and the official page */
export const RowsList = ({ items, phoneFirst = false }: RowsListProps) => (
  <ul role="list" className="m-0 mt-2 grid list-none p-0">
    {items.map(({ title, text, meta = [], phone, note, url }) => (
      <li key={title} className="grid gap-[0.2rem] border-b border-line py-3 last:border-b-0">
        <b className="font-extrabold">
          <RichText text={title} />
        </b>
        {text && (
          <span>
            <RichText text={text} />
          </span>
        )}
        {(meta.some(([, value]) => value) || phone) && (
          <span className="flex flex-wrap gap-x-[0.9rem] gap-y-1 text-[0.925rem] text-ink-soft">
            {meta
              .filter(([, value]) => value)
              .map(([icon, value]) => {
                const Icon = blockIcon(icon)
                return (
                  <span key={value} className="inline-flex items-center gap-[0.3rem]">
                    {Icon && <Icon aria-hidden="true" className="size-[0.95rem] shrink-0" />}
                    <RichText text={value} />
                  </span>
                )
              })}
            {phone && (
              <span className={`inline-flex items-center gap-[0.3rem] ${phoneFirst ? "order-first" : ""}`}>
                <Phone aria-hidden="true" className="size-[0.95rem] shrink-0" />
                {/\d{3}/.test(phone) ? (
                  <a href={`tel:${telOf(phone)}`} className="font-extrabold text-brand no-underline hover:underline">
                    {phone}
                  </a>
                ) : (
                  phone
                )}
              </span>
            )}
          </span>
        )}
        {note && (
          <span className="text-[0.925rem] text-ink-soft">
            <RichText text={note} />
          </span>
        )}
        {url && (
          <span className="text-[0.85rem]">
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-muted underline">
              Fuente oficial
            </a>
          </span>
        )}
      </li>
    ))}
  </ul>
)
