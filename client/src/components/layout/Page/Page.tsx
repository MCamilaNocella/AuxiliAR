import type { PageProps } from "./Page.types"

/** Standard container for every screen: same width and gutters as the layout. */
export const Page = ({ title, description, children }: PageProps) => (
  <div className="page-container pt-6 pb-10">
    <div className="mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
      <h1 className="m-0 text-2xl font-extrabold tracking-[-0.01em] sm:text-3xl">{title}</h1>
      {description && <p className="m-0 text-muted">{description}</p>}
    </div>
    {children}
  </div>
)
