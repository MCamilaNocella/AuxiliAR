import { Link } from "react-router"
import { ChevronRight } from "lucide-react"
import type { CategoryCardProps } from "./CategoryCard.types"

export const CategoryCard = ({ category: { title, description, icon: Icon, to } }: CategoryCardProps) => (
  <Link
    to={to}
    // The brand-colored focus ring would disappear on the dark home background, so it uses on-home instead
    className="flex h-full min-h-20 items-center gap-4 rounded-2xl border border-line bg-card p-4 text-ink no-underline shadow-sm transition-[border-color,box-shadow] hover:border-brand hover:text-ink hover:shadow-lg focus-visible:outline-on-home"
  >
    <span
      aria-hidden="true"
      className="flex size-12 flex-none items-center justify-center rounded-xl bg-brand-soft text-brand"
    >
      <Icon className="size-6" />
    </span>
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="text-lg/tight font-extrabold wrap-break-word">{title}</span>
      <span className="mt-0.5 text-sm text-muted">{description}</span>
    </span>
    <ChevronRight aria-hidden="true" className="size-5 flex-none text-brand" />
  </Link>
)
