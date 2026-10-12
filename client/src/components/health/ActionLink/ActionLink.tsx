import type { ReactNode } from "react"
import { Link } from "react-router"
import { ArrowRight } from "lucide-react"

type ActionLinkProps = {
  /** Internal route: renders a link. Without it, a button that runs `onClick` */
  to?: string
  onClick?: () => void
  variant?: "primary" | "secondary"
  children: ReactNode
}

const base = "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2 text-center font-extrabold no-underline"
const variants = {
  primary: "border-control-line bg-brand text-on-brand hover:bg-brand-dark hover:text-on-brand",
  secondary: "border-control-line bg-field text-ink hover:bg-line-strong hover:text-ink",
}

/** A next step inside AuxiliAR: a link to another screen or section, or a button for an action on this one */
export const ActionLink = ({ to, onClick, variant = "secondary", children }: ActionLinkProps) => {
  const className = `${base} ${variants[variant]}`
  const content = (
    <>
      <span>{children}</span>
      <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
    </>
  )
  return to ? (
    <Link to={to} className={className}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  )
}
