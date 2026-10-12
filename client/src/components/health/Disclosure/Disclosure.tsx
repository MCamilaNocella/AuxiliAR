import type { ReactNode } from "react"
import { ChevronDown } from "lucide-react"

type DisclosureProps = {
  title: string
  /** Opens expanded (the person can still close it). Without it, it starts closed */
  defaultOpen?: boolean
  /** A smaller title, for a disclosure that lives inside a card (the content is the same) */
  compact?: boolean
  children: ReactNode
}

/**
 * One question or topic that opens to its answer. A native details element, so it works with the keyboard and screen readers
 * with no script; the chevron shows that it opens and turns when it does. All its content is in the page even when closed.
 */
export const Disclosure = ({ title, defaultOpen = false, compact = false, children }: DisclosureProps) => (
  <details open={defaultOpen || undefined} className="group rounded-2xl border border-line-strong bg-card">
    <summary
      className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-extrabold [&::-webkit-details-marker]:hidden ${compact ? "text-base" : "text-lg"}`}
    >
      {title}
      <ChevronDown aria-hidden="true" className="size-5 shrink-0 text-brand transition-transform group-open:rotate-180" />
    </summary>
    <div className="flex flex-col gap-2 px-4 pb-4">{children}</div>
  </details>
)
