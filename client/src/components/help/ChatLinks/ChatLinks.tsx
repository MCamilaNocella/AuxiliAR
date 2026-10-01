import { Link } from "react-router"
import { ArrowRight } from "lucide-react"
import type { ChatLinksProps } from "./ChatLinks.types"

/** AuxiliAR pages suggested under one of Auxi's answers, lined up with its bubble */
export const ChatLinks = ({ links, onNavigate }: ChatLinksProps) => (
  <li className="pl-11">
    <ul aria-label="Páginas de AuxiliAR relacionadas" className="m-0 flex list-none flex-wrap gap-2 p-0">
      {links.map(({ title, path }) => (
        <li key={path}>
          <Link
            to={path}
            onClick={onNavigate}
            className="flex min-h-11 items-center gap-2 rounded-xl border-2 border-brand bg-card px-3 py-1.5 font-bold text-brand no-underline transition-colors hover:bg-brand-soft"
          >
            <span className="sr-only">Ir a </span>
            {title}
            <ArrowRight aria-hidden="true" className="size-4 flex-none" />
          </Link>
        </li>
      ))}
    </ul>
  </li>
)
