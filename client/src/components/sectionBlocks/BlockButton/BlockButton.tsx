import { use } from "react"
import { ArrowRight, ExternalLink, Phone } from "lucide-react"
import { revealEmergencies } from "@/utils/revealEmergencies"
import { SectionNavContext } from "../BlockLook"
import type { BlockButtonProps } from "./BlockButton.types"

const BASE = "inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg border-0 px-3.5 py-1.5 text-sm font-bold no-underline"
const SOLID = "bg-brand text-on-brand hover:bg-brand-dark hover:text-on-brand"
const GHOST = "bg-field text-ink hover:bg-brand-soft hover:text-ink in-data-[theme=contrast]:shadow-[inset_0_0_0_1px_var(--color-control-line)]"
const ALERT = "bg-alert text-on-alert hover:bg-alert-dark hover:text-on-alert"

/** The action of a block, as the models: another section, the emergency numbers, a phone line or an official page */
export const BlockButton = ({ button, alert = false }: BlockButtonProps) => {
  const openSection = use(SectionNavContext)
  const icon = "size-4 shrink-0"
  if ("go" in button) {
    return (
      <div>
        <button type="button" onClick={() => openSection(button.go)} className={`${BASE} ${SOLID}`}>
          {button.label}
          <ArrowRight aria-hidden="true" className={icon} />
        </button>
      </div>
    )
  }
  if ("emergency" in button) {
    return (
      <div>
        <button type="button" onClick={revealEmergencies} className={`${BASE} ${alert ? ALERT : SOLID}`}>
          <Phone aria-hidden="true" className={icon} />
          {button.label}
        </button>
      </div>
    )
  }
  if ("tel" in button) {
    return (
      <div>
        <a href={`tel:${button.tel}`} className={`${BASE} ${SOLID}`}>
          <Phone aria-hidden="true" className={icon} />
          {button.label}
        </a>
      </div>
    )
  }
  return (
    <div>
      <a href={button.url} target="_blank" rel="noopener noreferrer" className={`${BASE} ${GHOST}`}>
        {button.label}
        <ExternalLink aria-hidden="true" className={icon} />
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
    </div>
  )
}
