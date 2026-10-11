import type { ModelSectionProps } from "./ModelSection.types"

/** One model on the page: title, what it's about, and the model below */
export const ModelSection = ({ id, title, note, children }: ModelSectionProps) => (
  <section id={id} aria-labelledby={`${id}-title`} className="mt-12 scroll-mt-(--header-h)">
    <h2 id={`${id}-title`} className="m-0 text-xl font-extrabold">
      {title}
    </h2>
    <p className="m-0 mt-1 mb-5 max-w-3xl text-muted">{note}</p>
    {children}
  </section>
)
