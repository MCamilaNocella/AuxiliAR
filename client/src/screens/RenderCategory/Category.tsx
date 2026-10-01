import { useState } from "react"
import { useLocation } from "react-router"
import { CategoryIntro } from "@/components/category/CategoryIntro"
import { CategorySidebar } from "@/components/category/CategorySidebar"
import { Page } from "@/components/layout/Page"
import { ALL_CATEGORIES } from "@/content/categories"

/**
 * Category screen: sidebar with the category's sections + content.
 * Until a section is chosen it shows the category intro (banner on desktop, wallpaper on mobile).
 */
export const Category = () => {
  // Matched by URL: serves both /temas/:slug and fixed routes like /centros or /sobre-auxiliar
  const { pathname } = useLocation()
  const path = pathname.replace(/\/+$/, "") || "/"
  const category = ALL_CATEGORIES.find(({ to }) => to === path)
  // Remembers which category the choice belongs to, so switching categories starts again at the intro
  const [selection, setSelection] = useState<{ path: string; sectionId: string | null }>({ path, sectionId: null })
  const activeSectionId = selection.path === path ? selection.sectionId : null
  const activeSection = category?.sections.find(({ id }) => id === activeSectionId)

  if (!category) {
    return (
      <Page title="Categoría no encontrada">
        <p className="text-muted">No encontramos esta categoría.</p>
      </Page>
    )
  }

  return (
    <div data-category={category.id} className="flex min-h-(--content-min-h) flex-col lg:flex-row">
      <CategorySidebar
        category={category}
        sections={category.sections}
        activeSectionId={activeSectionId}
        onSelectSection={(sectionId) => setSelection({ path, sectionId })}
        onShowIntro={() => setSelection({ path, sectionId: null })}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        {activeSection ? (
          <div className="px-4 py-6 sm:px-6 lg:px-8">
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
