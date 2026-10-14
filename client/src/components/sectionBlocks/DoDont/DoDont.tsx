import type { DoDontProps } from "./DoDont.types"

const COLUMN = "rounded-[1.25rem] px-[1.2rem] pt-[1.1rem] pb-[1.2rem] in-data-[theme=contrast]:bg-surface in-data-[theme=contrast]:outline in-data-[theme=contrast]:outline-ink"

/** What to do and what not, side by side: a green column with ✓ and a red one with ✕ */
export const DoDont = ({ yes, no }: DoDontProps) => (
  <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-3">
    {(
      [
        ["Sí", yes, "tone-4", "✓"],
        ["No", no, "tone-3", "✕"],
      ] as const
    ).map(([title, items, tone, mark]) => (
      <div key={title} className={`${tone} bg-(--tone) ${COLUMN}`}>
        <h4 className="m-0 text-[1.1rem] font-black text-(--tone-ink)">{title}</h4>
        <ul className="m-0 mt-[0.6rem] grid list-none gap-[0.55rem] p-0">
          {items.map((item, index) => (
            <li key={index} className="relative pl-6">
              <span aria-hidden="true" className="absolute top-0 left-0 font-black text-(--tone-ink)">
                {mark}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)
