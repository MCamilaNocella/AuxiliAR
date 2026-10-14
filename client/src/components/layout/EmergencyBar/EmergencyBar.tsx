import { Link } from "react-router"
import { ArrowRight, Bandage, ChevronRight, Phone } from "lucide-react"
import { EmergencyNumbers } from "@/components/layout/EmergencyNumbers"
import { EMERGENCY_NUMBERS, FEATURED_FIRST_AID } from "@/data/emergency"
import { PATHS } from "@/router/paths"
import { EMERGENCY_HEADING_ID, EMERGENCY_SECTION_ID, GUIDES_GRID } from "./EmergencyBar.constants"

const headingClass = "m-0 flex items-center gap-2 text-base font-extrabold"

export const EmergencyBar = () => (
  <section
    id={EMERGENCY_SECTION_ID}
    aria-labelledby={EMERGENCY_HEADING_ID}
    className="border-b border-alert-line bg-alert-soft"
  >
    <div className="page-container grid grid-cols-[repeat(auto-fit,minmax(min(100%,25rem),1fr))] gap-x-8 gap-y-4 py-4">
      <div className="flex flex-col gap-2.5">
        <h2 id={EMERGENCY_HEADING_ID} tabIndex={-1} className={`${headingClass} text-alert-text`}>
          <Phone aria-hidden="true" className="size-4.5 flex-none" />
          ¿Es una emergencia? Llamá gratis
        </h2>
        <EmergencyNumbers numbers={EMERGENCY_NUMBERS} />
      </div>

      <div className="flex flex-col gap-2.5">
        <h2 className={`${headingClass} text-alert-text`}>
          <Bandage aria-hidden="true" className="size-4.5 flex-none" />
          Primeros auxilios: qué hacer ya
        </h2>
        {/* 1px lower: the light cards' border made them look higher than the solid number cards */}
        <ul role="list" className={`m-0 mt-[0.0625rem] grid list-none gap-2 p-0 ${GUIDES_GRID}`}>
          {FEATURED_FIRST_AID.map(({ slug, title }) => (
            <li key={slug}>
              <Link
                to={PATHS.firstAidGuide(slug)}
                className="flex h-full min-h-11 items-center justify-between gap-2 rounded-lg border border-l-4 border-alert-card-line border-l-alert bg-card px-3 py-1.5 text-sm font-bold text-ink no-underline transition-colors hover:border-alert-text hover:text-ink"
              >
                <span className="min-w-0 wrap-break-word">{title}</span>
                <ChevronRight aria-hidden="true" className="size-4 flex-none text-alert-text" />
              </Link>
            </li>
          ))}
          <li>
            <Link
              to={PATHS.firstAid}
              className="flex h-full min-h-11 items-center gap-1.5 px-1 py-1.5 text-sm font-extrabold text-alert-text underline underline-offset-4 hover:text-alert-dark"
            >
              Ver todas las guías
              <ArrowRight aria-hidden="true" className="size-4 flex-none" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </section>
)
