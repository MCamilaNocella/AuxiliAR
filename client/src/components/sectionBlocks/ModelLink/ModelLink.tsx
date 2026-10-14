import { Link } from "react-router"
import type { ModelLinkProps } from "./ModelLink.types"

const VARIANTS = {
  big: "rounded-[0.9rem] px-[1.1rem] py-[0.6rem] bg-brand text-on-brand hover:bg-brand-dark hover:text-on-brand",
  solid: "rounded-lg px-4 py-[0.55rem] bg-brand text-on-brand hover:bg-brand-dark hover:text-on-brand",
  soft: "rounded-lg px-4 py-[0.55rem] bg-brand-soft text-brand hover:bg-brand hover:text-on-brand",
}

/** A link styled as the buttons of the models (to another screen or to an official page) */
export const ModelLink = ({ to, icon: Icon, variant = "big", children }: ModelLinkProps) => {
  const className = `inline-flex min-h-11 items-center gap-2 font-extrabold no-underline ${VARIANTS[variant]}`
  const content = (
    <>
      {Icon && <Icon aria-hidden="true" className="size-[1.25em] shrink-0" />}
      {children}
    </>
  )
  return /^https?:/.test(to) ? (
    <a href={to} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
    </a>
  ) : (
    <Link to={to} className={className}>
      {content}
    </Link>
  )
}
