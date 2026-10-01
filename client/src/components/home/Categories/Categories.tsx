import { useId } from "react"
import { CATEGORIES } from "@/content/categories"
import { CategoryCard } from "../CategoryCard"
import { CATEGORIES_GRID } from "./Categories.constants"

/** Home section listing the categories. Placed on bg-home, so the heading uses text-on-home. */
export const Categories = () => {
  const headingId = useId()
  const descriptionId = useId()

  return (
    <section aria-labelledby={headingId} aria-describedby={descriptionId}>
      {/* flex-wrap: on narrow screens (or with large text) the description drops below the title */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <h1 id={headingId} className="text-2xl font-bold tracking-[-0.01em] text-on-home sm:text-3xl">
          Categorías
        </h1>
        <p id={descriptionId} className="m-0 text-base text-pretty text-on-home-muted">
          Elegí un tema para encontrar información, recursos y ayuda.
        </p>
      </div>
      {/* auto-rows-fr: every row takes the height of the tallest card, so all cards match */}
      <ul role="list" className={`m-0 grid list-none auto-rows-fr gap-4 p-0 ${CATEGORIES_GRID}`}>
        {CATEGORIES.map((category) => (
          <li key={category.id}>
            <CategoryCard category={category} />
          </li>
        ))}
      </ul>
    </section>
  )
}
