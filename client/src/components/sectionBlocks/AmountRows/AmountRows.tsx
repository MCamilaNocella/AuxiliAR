import type { AmountRowsProps } from "./AmountRows.types"

/** How much, for whom: the big amount on the left (with its unit under it), who it is for and the detail on the right */
export const AmountRows = ({ rows }: AmountRowsProps) => (
  <div>
    {rows.map(({ id, value, unit, who, text }) => (
      <div key={who} id={id ? `part-${id}` : undefined} tabIndex={id ? -1 : undefined} className="grid gap-x-6 gap-y-1 border-b border-line-strong py-4 focus:outline-none sm:grid-cols-[14rem_1fr] sm:items-baseline">
        <p className="m-0 text-[1.75rem] leading-[1.1] font-black text-brand">
          {value}
          {unit && <small className="block text-[0.9rem] font-extrabold text-muted">{unit}</small>}
        </p>
        <div>
          <b className="font-black">{who}</b>
          <p className="m-0 text-ink-soft">{text}</p>
        </div>
      </div>
    ))}
  </div>
)
