import { useId } from "react"
import { ChevronDown, ExternalLink } from "lucide-react"
import { useSlidePanel } from "@/hooks/useSlidePanel"
import type { SectionSourcesProps } from "./SectionSources.types"

/** "Fuentes oficiales" at the end of a section: closed, it slides open to the official pages the section comes from */
export const SectionSources = ({ sources }: SectionSourcesProps) => {
  const panelId = useId()
  const { open, visible, toggle, panelRef } = useSlidePanel()
  return (
    <div className="mt-2 border-t border-line-strong pt-4">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        className="flex min-h-11 cursor-pointer items-center gap-[0.35rem] border-0 bg-transparent p-0 font-extrabold text-ink-soft"
      >
        Fuentes oficiales
        <ChevronDown
          aria-hidden="true"
          className={`size-[1.1rem] shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div id={panelId} ref={panelRef} hidden={!visible} className="overflow-hidden">
        <ul role="list" className="m-0 mt-1 grid list-none gap-[0.35rem] p-0 text-sm">
          {sources.map(({ label, url }) => (
            <li key={url}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-baseline gap-[0.35rem] font-normal [overflow-wrap:anywhere] text-ink-soft underline-offset-[3px] hover:text-brand"
              >
                {label}
                <ExternalLink aria-hidden="true" className="relative top-[0.12em] size-[0.9rem] shrink-0" />
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
