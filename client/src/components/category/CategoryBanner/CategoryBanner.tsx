import { useId } from "react"
import { Link } from "react-router"
import { ChevronRight } from "lucide-react"
import { PATHS } from "@/router/paths"
import { CategoryIllustration } from "../CategoryIllustration"
import type { CategoryBannerProps } from "./CategoryBanner.types"

/**
 * Desktop banner shown when no section is chosen yet: breadcrumb, title and subtitle on the
 * dark side of the category gradient, illustration on the light side.
 * Needs a `data-category` ancestor (category colors).
 */
export const CategoryBanner = ({ category: { title, subtitle, scene } }: CategoryBannerProps) => {
  const titleId = useId()

  return (
    <section
      aria-labelledby={titleId}
      className="relative overflow-hidden border-b-2 border-category-edge bg-category-banner text-on-category"
    >
      {/* Soft disc in the corner, like the reference banners */}
      <div aria-hidden="true" className="absolute -top-24 -right-16 size-80 rounded-full bg-on-category/6" />

      <div className="relative flex min-h-60 items-center gap-6 px-8 py-6 xl:px-10">
        <div className="flex max-w-[55%] min-w-0 flex-1 flex-col gap-2">
          <nav aria-label="Estás en">
            <ol role="list" className="m-0 flex list-none flex-wrap items-center gap-1 p-0 text-sm">
              <li className="flex items-center gap-1">
                <Link
                  to={PATHS.home}
                  className="font-semibold text-on-category underline-offset-4 hover:text-on-category hover:underline focus-visible:outline-on-category"
                >
                  Inicio
                </Link>
                <ChevronRight aria-hidden="true" className="size-4" />
              </li>
              <li aria-current="page">{title}</li>
            </ol>
          </nav>
          <h2 id={titleId} className="m-0 text-4xl/tight font-extrabold tracking-[-0.01em] text-balance wrap-break-word">
            {title}
          </h2>
          <p className="m-0 text-lg text-pretty">{subtitle}</p>
        </div>

        <CategoryIllustration scene={scene} className="ml-auto w-[min(26rem,45%)] flex-none self-end" />
      </div>
    </section>
  )
}
