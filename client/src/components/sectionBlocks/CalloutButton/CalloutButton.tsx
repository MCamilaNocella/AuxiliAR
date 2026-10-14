import { ExternalLink } from "lucide-react"
import type { CalloutButtonProps } from "./CalloutButton.types"

const SOLID = "bg-brand text-on-brand hover:bg-brand-dark hover:text-on-brand"
const GHOST = "bg-field text-ink hover:bg-brand-soft hover:text-ink in-data-[theme=contrast]:shadow-[inset_0_0_0_1px_var(--color-control-line)]"

/** The action of a callout: calling a line (solid) or going to an official page (soft, it leaves AuxiliAR) */
export const CalloutButton = ({ href, icon: Icon, children }: CalloutButtonProps) => {
  const external = !href.startsWith("tel:")
  return (
    <div>
      <a
        href={href}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-bold no-underline ${external ? GHOST : SOLID}`}
      >
        {Icon && <Icon aria-hidden="true" className="size-4 shrink-0" />}
        {children}
        {external && <ExternalLink aria-hidden="true" className="size-4 shrink-0" />}
        {external && <span className="sr-only"> (se abre en una pestaña nueva)</span>}
      </a>
    </div>
  )
}
