import type { BulletListProps } from "./BulletList.types"

/** A plain list; markers in the category color (or, in an accent block, in the block's tone) */
export const BulletList = ({ items }: BulletListProps) => (
  <ul className="m-0 grid list-disc gap-[0.45rem] pt-2 pl-5 marker:text-[var(--marker,var(--category-accent))]">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
)
