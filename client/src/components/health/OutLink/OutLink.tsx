import type { ReactNode } from "react"
import { ExternalLink } from "lucide-react"

type OutLinkProps = {
  href: string
  children: ReactNode
}

/** A link to a page outside AuxiliAR: opens in a new tab and says so to screen readers. Same look as the links of SourceList */
export const OutLink = ({ href, children }: OutLinkProps) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 font-bold">
    <span>{children}</span>
    <ExternalLink aria-hidden="true" className="size-4 shrink-0" />
    <span className="sr-only"> (se abre en una pestaña nueva)</span>
  </a>
)
