import type { CategorySectionListProps } from "./CategorySectionList.types"

const itemBase =
  "flex min-h-11 w-full cursor-pointer items-center rounded-xl border px-3 py-2 text-left text-base transition-colors"

/** Buttons for a category's sections; used by the desktop sidebar and the mobile drawer. */
export const CategorySectionList = ({ sections, activeSectionId, onSelectSection }: CategorySectionListProps) => (
  <ul role="list" className="m-0 flex list-none flex-col gap-1 p-0">
    {sections.map(({ id, title }) => {
      const isActive = id === activeSectionId
      return (
        <li key={id}>
          <button
            type="button"
            onClick={() => onSelectSection(id)}
            aria-current={isActive ? "true" : undefined}
            className={`${itemBase} ${isActive ? "border-control-line bg-card font-extrabold text-brand" : "border-transparent font-semibold text-ink hover:bg-field"}`}
          >
            {title}
          </button>
        </li>
      )
    })}
  </ul>
)
