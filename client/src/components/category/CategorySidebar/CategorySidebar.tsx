import { useCallback, useId, useLayoutEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { onEntryScrollSettled } from "@/utils/entryScrollSettled"
import { categoryIconTransition, categoryTitleTransition } from "@/utils/viewTransition"
import { CategorySectionList } from "../CategorySectionList"
import { CategorySectionsDrawer } from "../CategorySectionsDrawer"
import { DESKTOP_QUERY, type DrawerState } from "./CategorySidebar.constants"
import type { CategorySidebarProps } from "./CategorySidebar.types"

// Once per page load (resets on reload): the first category visited opens the drawer by itself,
// so people discover the sections. Kept in memory on purpose, not in storage.
let sectionsHintShown = false

/**
 * Category menu.
 *  - Large screens: column pinned to the left with icon + name and the sections below.
 *  - Small screens: bar stuck under the header, menu button on one end and icon + name
 *    on the other; the button opens the sections in a drawer below the bar. The first
 *    time in the visit it also opens by itself, once the entry scroll has settled.
 */
export const CategorySidebar = ({ category, sections, activeSectionId, onSelectSection, onShowIntro }: CategorySidebarProps) => {
  const { id, title, icon: Icon } = category
  const barRef = useRef<HTMLDivElement>(null)
  const headingId = useId()
  const drawerId = useId()
  const [drawerState, setDrawerState] = useState<DrawerState>("closed")
  // If the screen grows to desktop size with the drawer open, it closes (the column takes over)
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const showDrawer = drawerState !== "closed" && !isDesktop
  const closeDrawer = useCallback(() => setDrawerState("closed"), [])

  // Layout effect: it must subscribe before the entry scroll (a parent layout effect) settles,
  // which with reduced motion or a restored position happens right away
  useLayoutEffect(() => {
    if (sectionsHintShown) return
    return onEntryScrollSettled(() => {
      if (sectionsHintShown || window.matchMedia(DESKTOP_QUERY).matches) return
      sectionsHintShown = true
      setDrawerState("auto")
    })
  }, [])

  return (
    // Small screens: the whole block is the sticky bar.
    // Large: the column stretches to the full content height; the menu inside stays in view while scrolling.
    <div
      ref={barRef}
      className="sticky top-(--header-h) z-20 border-b border-line bg-surface-alt lg:static lg:box-content lg:w-64 lg:flex-none lg:border-r lg:border-b-0 lg:pl-[calc(var(--page-inset)-1.25rem)]"
    >
      <nav
        aria-labelledby={headingId}
        className="@container px-(--page-gutter) py-2 lg:sticky lg:top-(--header-h) lg:max-h-(--content-min-h) lg:overflow-y-auto lg:px-3 lg:py-4"
      >
        <div className="flex items-center gap-3 lg:mb-2 lg:border-b lg:border-line-strong lg:px-2 lg:pb-3">
          <button
            type="button"
            onClick={() => setDrawerState((state) => (state === "closed" ? "user" : "closed"))}
            aria-label="Secciones"
            aria-expanded={showDrawer}
            aria-controls={drawerId}
            className="-ml-2 flex size-11 flex-none cursor-pointer items-center justify-center rounded-xl text-ink transition-colors hover:bg-field lg:hidden"
          >
            {showDrawer ? <X aria-hidden="true" className="size-6" /> : <Menu aria-hidden="true" className="size-6" />}
          </button>

          {/* Small screens: pushed to the other end of the bar. Tapping the name goes back to the category intro */}
          <h1 id={headingId} className="m-0 ml-auto min-w-0 lg:ml-0 lg:flex-1">
            <button
              type="button"
              onClick={onShowIntro}
              aria-current={activeSectionId === null ? "true" : undefined}
              className="-m-1 flex cursor-pointer items-center gap-3 rounded-xl p-1 text-ink transition-colors hover:bg-field"
            >
              {/* Very narrow bar (small phone + largest text): the icon gives its space to the name */}
              <span
                aria-hidden="true"
                style={{ viewTransitionName: categoryIconTransition(id) }}
                className="flex size-10 flex-none items-center justify-center rounded-xl bg-brand-soft text-brand max-lg:@max-[15rem]:hidden"
              >
                <Icon className="size-5" />
              </span>
              <span
                style={{ viewTransitionName: categoryTitleTransition(id) }}
                className="min-w-0 text-right text-lg/tight font-extrabold wrap-break-word lg:text-left lg:text-xl/tight"
              >
                {title}
              </span>
            </button>
          </h1>
        </div>

        <div className="hidden lg:block">
          <CategorySectionList sections={sections} activeSectionId={activeSectionId} onSelectSection={onSelectSection} />
        </div>
      </nav>

      <CategorySectionsDrawer
        id={drawerId}
        label={`Secciones de ${title}`}
        open={showDrawer}
        focusOnOpen={drawerState === "user"}
        onClose={closeDrawer}
        anchorRef={barRef}
        sections={sections}
        activeSectionId={activeSectionId}
        onSelectSection={onSelectSection}
      />
    </div>
  )
}
