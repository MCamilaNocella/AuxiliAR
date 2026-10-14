import { useEffect, useRef } from "react"
import { useLocation, useSearchParams, type URLSearchParamsInit } from "react-router"
import { CategoryBanner } from "@/components/category/CategoryBanner"
import { CategoryIntro } from "@/components/category/CategoryIntro"
import { CategorySidebar } from "@/components/category/CategorySidebar"
import { SectionHeading } from "@/components/category/SectionHeading"
import { Page } from "@/components/layout/Page"
import { TransitionContent } from "@/components/layout/TransitionContent"
import { SectionNavContext } from "@/components/sectionBlocks/BlockLook"
import { ALL_CATEGORIES } from "@/content/categories"
import { SECTION_PARAM } from "@/router/paths"
import { changeContent } from "@/utils/contentTransition"
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
  const changeSection = (params: URLSearchParamsInit) => {
    setSearchParams(params, { preventScrollReset: true })
    const root = rootRef.current
    if (!root) return
    const top = scrollTopBelowHeader(root)
    if (window.scrollY > top) window.scrollTo({ top, behavior: "instant" })
  }

  // As the category models: only the section's content fades (out the old one, in the new one) while the bars stay still
  // (changeContent). Resolves once the new section is in, so the sections drawer can close after it
  const showSection = async (params: URLSearchParamsInit) => {
    // The section is downloaded before it shows, so it appears whole (it is usually ready: the category preloads them all)
    const next = category?.sections.find(({ id }) => id === new URLSearchParams(params as Record<string, string>).get(SECTION_PARAM))
    await next?.Content.preload?.().catch(() => {})
    await changeContent(() => changeSection(params))
  }

  // Every section of the category downloads as soon as it opens (after the first paint), so none shows a loading message
  useEffect(() => {
    if (!category) return
    const timer = window.setTimeout(() => category.sections.forEach(({ Content }) => Content.preload?.().catch(() => {})), 0)
    return () => window.clearTimeout(timer)
  }, [category])

  if (!category) {
    return (
      <Page title="Categoría no encontrada">
        <p className="text-muted">No encontramos esta categoría.</p>
      </Page>
    )
  }

  const { sections } = category
  // Without a sidebar there is nothing to choose: the first section is always open
  const activeSection = category.noSidebar ? sections[0] : sections.find(({ id }) => id === searchParams.get(SECTION_PARAM))
  const activeSectionId = activeSection?.id ?? null

  return (
    <div ref={rootRef} data-category={category.id} className="flex min-h-(--content-min-h) flex-col lg:@container lg:flex-row">
      {!category.noSidebar && (
        <CategorySidebar
          category={category}
          sections={sections}
          activeSectionId={activeSectionId}
          onSelectSection={(sectionId) => showSection({ [SECTION_PARAM]: sectionId })}
          onShowIntro={() => showSection({})}
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* The category banner stays on top of the intro and of every section (desktop), outside the transition: it never fades */}
        <div className="hidden lg:block">
          <CategoryBanner category={category} />
        </div>
        {activeSection ? (
          <TransitionContent className={`px-(--page-gutter) py-6 lg:pl-8 xl:pl-10 ${category.noSidebar ? "lg:pr-8 xl:pr-10" : "lg:pr-(--page-inset)"}`}>
            {activeSection.icon ? <SectionHeading section={activeSection} /> : <h2 className="m-0 text-2xl font-extrabold sm:text-3xl">{activeSection.title}</h2>}
            <SectionNavContext value={(sectionId) => showSection({ [SECTION_PARAM]: sectionId })}>
              <activeSection.Content />
            </SectionNavContext>
          </TransitionContent>
        ) : (
          <TransitionContent className="flex flex-1 flex-col">
            <CategoryIntro category={category} />
          </TransitionContent>
        )}
      </div>
    </div>
  )
}
