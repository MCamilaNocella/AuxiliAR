import { use } from "react"
import type { ReactNode } from "react"
import { DESKTOP_QUERY } from "@/components/category/CategorySidebar/CategorySidebar.constants"
import { CONTRAST_OUTLINE } from "@/utils/contrastOutline"
import { prefersReducedMotion } from "@/utils/scroll"
import { BlockLookContext, SectionNavContext } from "../BlockLook"
import type { SectionKeyProps } from "./SectionKey.types"

/** Scrolls to a block right below the header (and, on small screens, below the category bar), then focuses it */
const goToPart = (target: string) => {
  const part = document.getElementById(`part-${target}`)
  if (!part) return
  const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0
  const bar = part.closest("[data-category]")?.firstElementChild
  const barHeight = !window.matchMedia(DESKTOP_QUERY).matches && bar instanceof HTMLElement ? bar.offsetHeight : 0
  window.scrollTo({ top: part.getBoundingClientRect().top + window.scrollY - header - barHeight - 16, behavior: prefersReducedMotion() ? "instant" : "smooth" })
  part.focus({ preventScroll: true })
}

/** A cell that opens something is a button; a cell with only a fact is plain text */
const Cell = ({ onClick, className, children }: { onClick?: () => void, className: string, children: ReactNode }) =>
  onClick ? (
    <button type="button" onClick={onClick} className={`cursor-pointer ${className}`}>
      {children}
    </button>
  ) : (
    <div className={className}>{children}</div>
  )

const SHADOW = "shadow-[0_1px_2px_rgb(60_30_30/0.06),0_0.5rem_1.5rem_-0.75rem_rgb(60_30_30/0.18)] in-data-[theme=contrast]:shadow-none in-data-[theme=dark]:shadow-[0_1px_2px_rgb(0_0_0/0.3),0_0.5rem_1.5rem_-0.75rem_rgb(0_0_0/0.6)]"
const CELL = "grid content-start border-0 text-left text-ink shadow-[-1px_0_0_var(--color-line-strong),0_-1px_0_var(--color-line-strong)] focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-brand"

/** The summary at the top of a section: one cell per block, with its key fact; each one takes you to its block (or opens another section) */
export const SectionKey = ({ cells, tinted = false }: SectionKeyProps) => {
  const accent = use(BlockLookContext) === "accent" || tinted
  const openSection = use(SectionNavContext)
  const columns = accent
    ? `@[30rem]:grid-cols-2 ${cells.length >= 4 ? "@[52rem]:grid-cols-4" : cells.length === 3 ? "@[30rem]:grid-cols-1 @[40rem]:grid-cols-3" : ""}`
    : `grid-cols-[repeat(auto-fit,minmax(min(100%,11rem),1fr))] ${cells.length === 4 ? "@min-[22rem]:@max-[43.99rem]:grid-cols-2 @[44rem]:grid-cols-4" : ""} @min-[22rem]:max-sm:grid-cols-2`
  return (
    <div className={`grid overflow-hidden rounded-3xl bg-card ${SHADOW} ${columns} ${CONTRAST_OUTLINE}`}>
      {cells.map(({ icon: Icon, title, value, label, target, section, onOpen, tone }) => (
        <Cell
          key={title + value}
          onClick={
            section || target
              ? () => {
                  onOpen?.()
                  if (section) openSection(section)
                  else if (target) goToPart(target)
                }
              : undefined
          }
          className={`tone-${tone} ${CELL} ${tinted ? "gap-[0.3rem] bg-(--tone) px-[1.1rem] py-[0.9rem] hover:bg-[color-mix(in_srgb,var(--tone-ink)_16%,var(--tone))]" : accent ? "gap-[0.3rem] bg-transparent px-[1.1rem] py-[0.9rem] hover:bg-surface" : "gap-[0.45rem] bg-transparent px-5 py-[1.1rem] max-sm:p-[1.1rem]"}`}
        >
          {Icon && !accent && (
            <span className={`flex size-10 items-center justify-center rounded-[0.8rem] bg-(--tone) text-(--tone-ink) ${CONTRAST_OUTLINE}`}>
              <Icon aria-hidden="true" className="size-5" />
            </span>
          )}
          <span className="text-[0.95rem] font-extrabold">{title}</span>
          <b className={`leading-[1.1] font-black [overflow-wrap:anywhere] ${accent ? "text-[1.2rem] text-(--tone-ink)" : "text-[1.4rem] max-sm:text-[1.2rem]"}`}>{value}</b>
          <span className="text-[0.85rem] font-bold text-muted">{label}</span>
        </Cell>
      ))}
    </div>
  )
}
