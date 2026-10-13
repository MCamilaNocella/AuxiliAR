import { useId } from "react"
import { CategoryCard } from "../CategoryCard"
import { CATEGORIES_GRID, HOME_CARDS } from "./Categories.constants"

/** Home section listing the categories. Placed on bg-home, so the heading uses text-on-home. */
export const Categories = () => {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId}>
      <h1 id={headingId} className="mb-4 text-2xl font-bold tracking-[-0.01em] text-on-home sm:text-3xl">
        ¿Qué necesitás hoy?
      </h1>
      {/* auto-rows-fr: every row takes the height of the tallest card, so all cards match */}
      <ul role="list" className={`m-0 grid list-none auto-rows-fr gap-4 p-0 ${CATEGORIES_GRID}`}>
        {HOME_CARDS.map((category) => (
          <li key={category.id}>
            <CategoryCard category={category} />
          </li>
        ))}
      </ul>
    </section>
  )
}
