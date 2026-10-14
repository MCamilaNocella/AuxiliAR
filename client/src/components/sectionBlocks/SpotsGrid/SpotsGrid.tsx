import { useRef } from "react"
import type { ReactNode } from "react"
import { MapPin, Phone } from "lucide-react"
import type { RowData } from "@/types/blocks"
import { useBalancedColumns } from "@/hooks/useBalancedColumns"
import { CONTRAST_OUTLINE } from "@/utils/contrastOutline"
import { telOf } from "@/utils/telOf"
import type { SpotsGridProps } from "./SpotsGrid.types"

type Spot = { key: string, title: string, sub?: string, many: boolean, tag?: string, lines: { name?: string, row: RowData }[] }

const CESAC = /^(.*?)(?: \d+)? \(CeSAC Nº \d+\)$/

/** The CeSACs grouped by barrio (in their number order), then the hospitals and organizations, one card each */
const group = (items: RowData[]) => {
  const barrios = new Map<string, RowData[]>()
  const others: Spot[] = []
  items.forEach((row) => {
    const match = row.title.match(CESAC)
    if (!match) {
      const [name, ...service] = row.title.split(", ")
      const hospital = /^Hospital/.test(row.title)
      others.push({ key: row.title, title: name, sub: service.join(", "), many: false, tag: hospital ? "Hospital" : "Organización", lines: [{ row }] })
      return
    }
    barrios.set(match[1], [...(barrios.get(match[1]) ?? []), row])
  })
  const cesacs: Spot[] = [...barrios].map(([barrio, list]) => ({
    key: barrio,
    title: barrio,
    many: list.length > 2,
    lines: list.sort((a, b) => a.title.localeCompare(b.title, "es", { numeric: true })).map((row) => ({ name: row.title.match(/\((CeSAC Nº \d+)\)/)?.[1], row })),
  }))
  return { cesacs, others: [...others.filter((s) => s.tag === "Hospital"), ...others.filter((s) => s.tag !== "Hospital")] }
}

const phones = (phone: string) => (phone.split(" / ").every((p) => telOf(p).length >= 8) ? phone.split(" / ") : [phone])

const Line = ({ name, row }: { name?: string, row: RowData }) => {
  const only = row.meta?.[1] && row.meta[1][1] !== "VIH y sífilis" ? row.meta[1][1] : null
  return (
    <li className="grid gap-1 text-sm [overflow-wrap:anywhere] text-ink-soft [&+&]:border-t [&+&]:border-dashed [&+&]:border-line [&+&]:pt-[0.6rem]">
      {name && <b className="text-[0.8rem] font-extrabold text-(--category-accent)">{name}</b>}
      <span className="flex items-start gap-[0.35rem]">
        <MapPin aria-hidden="true" className="mt-[0.2rem] size-[0.9rem] shrink-0" />
        <span>{row.meta?.[0]?.[1]}</span>
      </span>
      {only && <span className="justify-self-start rounded-full bg-surface px-2 py-[0.1rem] text-xs font-extrabold">{`Solo ${only}`}</span>}
      {row.phone && (
        <span className="flex items-start gap-[0.35rem]">
          <Phone aria-hidden="true" className="mt-[0.2rem] size-[0.9rem] shrink-0" />
          <span>
            {phones(row.phone).map((p) => (
              <a key={p} href={`tel:${telOf(p)}`} className="block font-extrabold text-brand no-underline hover:underline">
                {p}
              </a>
            ))}
          </span>
        </span>
      )}
    </li>
  )
}

const Grid = ({ title, spots }: { title: string, spots: Spot[] }) => {
  const listRef = useRef<HTMLUListElement>(null)
  useBalancedColumns(listRef)
  const cards: ReactNode[] = spots.map(({ key, title: name, sub, many, tag, lines }) => (
    <li
      key={key}
      className={`grid content-start gap-[0.35rem] rounded-2xl px-[0.9rem] py-[0.85rem] in-data-laid:mb-3 ${many ? "bg-[color-mix(in_srgb,var(--category-light)_9%,var(--color-card))]" : "bg-card"} ${CONTRAST_OUTLINE}`}
    >
      <h5 className={`m-0 leading-[1.2] font-black ${many ? "text-[1.3rem]" : "text-[1.05rem]"}`}>{name}</h5>
      {tag && <span className="text-[0.8rem] font-extrabold text-(--category-accent)">{tag}</span>}
      {sub && <span className="text-[0.8rem] font-extrabold text-muted">{sub}</span>}
      <ul role="list" className="m-0 grid list-none gap-[0.6rem] p-0">
        {lines.map(({ name: line, row }) => (
          <Line key={row.title} name={line} row={row} />
        ))}
      </ul>
    </li>
  ))
  return (
    <>
      <h5 className="m-0 mt-4 text-base font-black">{title}</h5>
      <ul
        ref={listRef}
        role="list"
        className="m-0 mt-2 grid list-none grid-cols-[repeat(auto-fill,minmax(max(8.5rem,calc((100%-2.25rem)/4)),1fr))] gap-3 p-0 data-laid:auto-rows-[1px] data-laid:gap-y-0"
      >
        {cards}
      </ul>
    </>
  )
}

/** The testing centers as cards, dealt into even columns: the CeSACs by barrio, then hospitals and organizations */
export const SpotsGrid = ({ items }: SpotsGridProps) => {
  const { cesacs, others } = group(items)
  return (
    <div>
      <Grid title="Centros de salud (CeSAC), por barrio" spots={cesacs} />
      <Grid title="Hospitales, organizaciones y otros centros" spots={others} />
    </div>
  )
}
