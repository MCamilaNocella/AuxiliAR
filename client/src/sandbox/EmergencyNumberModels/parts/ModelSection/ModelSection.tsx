import type { ModelSectionProps } from "./ModelSection.types"

/** One model: title, what changes, and the same preview at computer and phone width */
export const ModelSection = ({ id, title, note, frames, children }: ModelSectionProps) => (
  <section id={id} aria-labelledby={`${id}-title`} className="mt-10 scroll-mt-(--header-h)">
    <h2 id={`${id}-title`} className="m-0 text-xl font-extrabold">
      {title}
    </h2>
    <p className="m-0 mt-1 mb-4 max-w-3xl text-muted">{note}</p>
    <div className="flex flex-wrap items-start gap-6">
      {frames.map(({ label, width }) => (
        <figure key={label} className={`m-0 ${width}`}>
          <figcaption className="mb-1.5 text-xs font-bold text-muted">{label}</figcaption>
          <div className="rounded-xl border border-alert-line bg-alert-soft p-3">{children}</div>
        </figure>
      ))}
    </div>
  </section>
)
