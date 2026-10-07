import { useLocation, useSearchParams } from "react-router"
import { CategoryIntro } from "@/components/category/CategoryIntro"
import { CategorySidebar } from "@/components/category/CategorySidebar"
import { Page } from "@/components/layout/Page"
import { ALL_CATEGORIES } from "@/content/categories"
import { SECTION_PARAM } from "@/router/paths"

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
  const activeSection = category?.sections.find(({ id }) => id === searchParams.get(SECTION_PARAM))
  const activeSectionId = activeSection?.id ?? null

  if (!category) {
    return (
      <Page title="Categoría no encontrada">
        <p className="text-muted">No encontramos esta categoría.</p>
      </Page>
    )
  }

  return (
    <div data-category={category.id} className="flex min-h-(--content-min-h) flex-col lg:@container lg:flex-row">
      <CategorySidebar
        category={category}
        sections={category.sections}
        activeSectionId={activeSectionId}
        onSelectSection={(sectionId) => setSearchParams({ [SECTION_PARAM]: sectionId })}
        onShowIntro={() => setSearchParams({})}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        {activeSection ? (
          <div className="px-(--page-gutter) py-6 lg:pr-(--page-inset) lg:pl-8">
            <h2 className="m-0 text-2xl font-extrabold sm:text-3xl">{activeSection.title}</h2>
            <activeSection.Content />
          </div>
        ) : (
          <CategoryIntro category={category} />
        )}
      </div>
    </div>
  )
}
