import { useLocation, useSearchParams } from "react-router"
import { CategoryIntro } from "@/components/category/CategoryIntro"
import { CategoryPreparing } from "@/components/category/CategoryPreparing"
import { CategorySidebar } from "@/components/category/CategorySidebar"
import { Page } from "@/components/layout/Page"
import { ALL_CATEGORIES } from "@/content/categories"
import { SECTION_PARAM } from "@/router/paths"
import type { CategorySection } from "@/types/category"

/** Stands in for the sections of a category that has `preparing` set: a single page, so no section menu is shown */
const PREPARING_SECTION: CategorySection = { id: "preparando", title: "Estamos preparando esta sección", Content: () => null }

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

  if (!category) {
    return (
      <Page title="Categoría no encontrada">
        <p className="text-muted">No encontramos esta categoría.</p>
      </Page>
    )
  }

  const sections = category.preparing ? [PREPARING_SECTION] : category.sections
  const defaultSectionId = category.preparing ? PREPARING_SECTION.id : category.defaultSectionId
  const activeSection = sections.find(({ id }) => id === searchParams.get(SECTION_PARAM)) ?? sections.find(({ id }) => id === defaultSectionId)
  const activeSectionId = activeSection?.id ?? null

  return (
    <div data-category={category.id} className="flex min-h-(--content-min-h) flex-col lg:flex-row">
      <CategorySidebar
        category={category}
        sections={sections}
        activeSectionId={activeSectionId}
        onSelectSection={(sectionId) => setSearchParams({ [SECTION_PARAM]: sectionId })}
        onShowIntro={() => setSearchParams({})}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        {activeSection ? (
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <h2 className="m-0 text-2xl font-extrabold sm:text-3xl">{activeSection.title}</h2>
            {activeSection.id === PREPARING_SECTION.id && category.preparing ? <CategoryPreparing preparing={category.preparing} /> : <activeSection.Content />}
          </div>
        ) : (
          <CategoryIntro category={category} />
        )}
      </div>
    </div>
  )
}
