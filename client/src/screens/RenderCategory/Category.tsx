import { useRef } from "react"
import { useLocation, useSearchParams, type URLSearchParamsInit } from "react-router"
import { CategoryBanner } from "@/components/category/CategoryBanner"
import { CategoryIntro } from "@/components/category/CategoryIntro"
import { CategorySidebar } from "@/components/category/CategorySidebar"
import { Page } from "@/components/layout/Page"
import { ALL_CATEGORIES } from "@/content/categories"
import { SECTION_PARAM } from "@/router/paths"
import { scrollTopBelowHeader } from "@/utils/scroll"

/**
 * Category screen: sidebar with the category's sections + content.
 * Until a section is chosen it shows the category intro (banner on desktop, wallpaper on mobile).
 * The open section lives in the URL (?seccion=…), so links (e.g. from Auxi) can open it and Back returns to the previous one.
 */
export const Category = () => {
  // Matched by URL: serves both /temas/:slug and fixed routes like /centros or /sobre-auxiliar
  const { pathname } = useLocation()
  const path = pathname.replace(/\/+$/, "") || "/"
  const category = ALL_CATEGORIES.find(({ to }) => to === path)
  const [searchParams, setSearchParams] = useSearchParams()
  const rootRef = useRef<HTMLDivElement>(null)

  // Changing section keeps the page where it is (no jump to the top and auto-scroll again), but never further down than the
  // top of the category, its banner: otherwise the new section would open in its middle
  const showSection = (params: URLSearchParamsInit) => {
    setSearchParams(params, { preventScrollReset: true })
    const root = rootRef.current
    if (!root) return
    const top = scrollTopBelowHeader(root)
    if (window.scrollY > top) window.scrollTo({ top, behavior: "instant" })
  }

  if (!category) {
    return (
      <Page title="Categoría no encontrada">
        <p className="text-muted">No encontramos esta categoría.</p>
      </Page>
    )
  }

  const { sections } = category
  const activeSection = sections.find(({ id }) => id === searchParams.get(SECTION_PARAM))
  const activeSectionId = activeSection?.id ?? null

  return (
    <div ref={rootRef} data-category={category.id} className="flex min-h-(--content-min-h) flex-col lg:@container lg:flex-row">
      <CategorySidebar
        category={category}
        sections={sections}
        activeSectionId={activeSectionId}
        onSelectSection={(sectionId) => showSection({ [SECTION_PARAM]: sectionId })}
        onShowIntro={() => showSection({})}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        {activeSection ? (
          <>
            {/* The category banner stays on top of every section (desktop, like the intro) */}
            <div className="hidden lg:block">
              <CategoryBanner category={category} />
            </div>
            <div className="px-(--page-gutter) py-6 lg:pr-(--page-inset) lg:pl-8 xl:pl-10">
              <h2 className="m-0 text-2xl font-extrabold sm:text-3xl">{activeSection.title}</h2>
              <activeSection.Content />
            </div>
          </>
        ) : (
          <CategoryIntro category={category} />
        )}
      </div>
    </div>
  )
}
