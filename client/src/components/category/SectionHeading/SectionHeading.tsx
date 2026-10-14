import type { SectionHeadingProps } from "./SectionHeading.types"

/** Heading of a section with an icon (design of the category models): the icon tile, the title and the lead under it */
export const SectionHeading = ({ section: { icon: Icon, title, lead } }: SectionHeadingProps) => (
  <header className="flex max-w-[62rem] items-start gap-4">
    {Icon && (
      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
        <Icon aria-hidden="true" className="size-6" />
      </span>
    )}
    <div className="min-w-0">
      <h2 className="m-0 text-[clamp(1.5rem,1.2rem+1vw,1.875rem)] leading-[1.15] font-black [overflow-wrap:anywhere] hyphens-auto">{title}</h2>
      {lead && <p className="m-0 mt-[0.6rem] max-w-[46rem] text-[1.05rem] [overflow-wrap:anywhere] text-ink-soft">{lead}</p>}
    </div>
  </header>
)
