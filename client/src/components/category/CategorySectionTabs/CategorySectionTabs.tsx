import type { CategorySectionListProps } from "../CategorySectionList"

/**
 * The sections of a category with few of them (two or three), always in sight on small screens: one tap to change section,
 * no drawer to open first. On large screens the sidebar list does this job, so it is hidden there.
 */
export const CategorySectionTabs = ({ sections, activeSectionId, onSelectSection }: CategorySectionListProps) => (
  <ul role="list" className="m-0 mt-2 mb-1 flex list-none gap-1.5 p-0 lg:hidden">
    {sections.map(({ id, title }) => {
      const isActive = id === activeSectionId
      return (
        <li key={id} className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => onSelectSection(id)}
            aria-current={isActive ? "true" : undefined}
            className={`flex h-full min-h-11 w-full cursor-pointer items-center justify-center rounded-xl border px-2 py-1.5 text-center text-sm/tight transition-colors ${
              isActive ? "border-control-line bg-card font-extrabold text-brand" : "border-transparent bg-field font-semibold text-ink hover:bg-line-strong"
            }`}
          >
            {title}
          </button>
        </li>
      )
    })}
  </ul>
)
