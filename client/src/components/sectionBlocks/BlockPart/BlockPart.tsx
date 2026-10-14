import type { BlockPartProps } from "./BlockPart.types"

/** A part inside a block (e.g. "1. Empadronate"): a small title (its icon in the category color) and its content */
export const BlockPart = ({ id, title, icon: Icon, lead = [], children }: BlockPartProps) => (
  <div id={id ? `part-${id}` : undefined} tabIndex={id ? -1 : undefined} className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-1 focus:outline-none">
    {title && (
      <h4 className="m-0 mt-2 flex items-center gap-2 text-[1.05rem] font-black text-[var(--sub-ink,var(--color-ink))]">
        {Icon && <Icon aria-hidden="true" className="size-[1.15rem] shrink-0 text-(--category-accent)" />}
        {title}
      </h4>
    )}
    {lead.map((paragraph, index) => (
      <p key={index} className={`m-0 ${index ? "pt-1" : "pt-2"}`}>
        {paragraph}
      </p>
    ))}
    {children}
  </div>
)
