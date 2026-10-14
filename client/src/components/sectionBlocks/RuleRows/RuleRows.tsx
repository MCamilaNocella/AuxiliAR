import type { RuleRowsProps } from "./RuleRows.types"

/** Rows split by lines: on the left who or what (muted), on the right the rule (bold); one column on phones */
export const RuleRows = ({ rows }: RuleRowsProps) => {
  const single = rows.every((row) => row.key === undefined)
  return (
    <dl className="m-0">
      {rows.map(({ key, value }, index) => (
        <div key={index} className={`grid gap-x-6 gap-y-[0.2rem] border-b border-line-strong py-[0.85rem] ${single ? "" : "sm:grid-cols-[14rem_1fr]"}`}>
          {key !== undefined && <dt className="font-bold text-muted">{key}</dt>}
          <dd className="m-0 font-extrabold">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
