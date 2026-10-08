import { Link } from "react-router"
import { ArrowRight, Bandage, ChevronRight, Phone } from "lucide-react"
import { EMERGENCY_NUMBERS, FEATURED_FIRST_AID, GENERAL_EMERGENCY_NUMBER } from "@/data/emergency"
import { callButton, callButtonLabel } from "@/utils/helpLines"
import { PATHS } from "@/router/paths"
import { EMERGENCY_HEADING_ID, EMERGENCY_SECTION_ID, GUIDES_GRID, NUMBERS_GRID } from "./EmergencyBar.constants"

const headingClass = "m-0 flex items-center gap-2 text-base font-extrabold"

/** The numbers as buttons that say where each one works and when it answers, and which ones have not been checked again since their review date */
const buttons = () => EMERGENCY_NUMBERS.map(({ number, label }) => callButton(number, label))

export const EmergencyBar = () => {
  const calls = buttons()
  const unchecked = calls.filter((button) => button.stale)
  return (
  <section
    id={EMERGENCY_SECTION_ID}
    aria-labelledby={EMERGENCY_HEADING_ID}
    className="border-b border-alert-line bg-alert-soft"
  >
    <div className="mx-auto grid max-w-360 grid-cols-[repeat(auto-fit,minmax(min(100%,25rem),1fr))] gap-x-8 gap-y-4 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2.5">
        <h2 id={EMERGENCY_HEADING_ID} tabIndex={-1} className={`${headingClass} text-alert-text`}>
          <Phone aria-hidden="true" className="size-4.5 flex-none" />
          ¿Es una emergencia? Llamá gratis
        </h2>
        <ul role="list" className={`m-0 grid list-none gap-2 p-0 ${NUMBERS_GRID}`}>
          {calls.map((button) => (
            <li key={button.number}>
              <a
                href={`tel:${button.dial}`}
                aria-label={callButtonLabel(button)}
                className="flex h-full min-h-11 flex-col justify-center rounded-lg bg-alert px-3 py-1.5 text-on-alert no-underline transition-colors hover:bg-alert-dark hover:text-on-alert sm:flex-row sm:flex-wrap sm:items-center sm:justify-start sm:gap-x-2"
              >
                <b className="text-lg/tight font-extrabold">{button.number}</b>
                <span className="text-xs font-semibold sm:text-sm">{button.label}</span>
                {(button.scope || button.hours) && (
                  <span className="text-xs/tight font-semibold opacity-95 sm:basis-full">{[button.scope, button.hours ? `de ${button.hours}` : undefined].filter(Boolean).join(" · ")}</span>
                )}
                {button.stale && <span className="text-xs/tight font-bold underline decoration-dotted sm:basis-full">sin nueva comprobación</span>}
              </a>
            </li>
          ))}
        </ul>
        {unchecked.length > 0 && (
          <p className="m-0 text-sm text-alert-text">
            {unchecked.length === 1 ? "Un número no se volvió a comprobar" : "Algunos números no se volvieron a comprobar"} desde su fecha de revisión. Si no responde, llamá al {GENERAL_EMERGENCY_NUMBER}.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        <h2 className={headingClass}>
          <Bandage aria-hidden="true" className="size-4.5 flex-none text-alert-text" />
          Primeros auxilios: qué hacer ya
        </h2>
        <ul role="list" className={`m-0 grid list-none gap-2 p-0 ${GUIDES_GRID}`}>
          {FEATURED_FIRST_AID.map(({ slug, title }) => (
            <li key={slug}>
              <Link
                to={PATHS.firstAidGuide(slug)}
                className="flex h-full min-h-11 items-center justify-between gap-2 rounded-lg border border-alert-card-line bg-card px-3 py-1.5 text-sm font-bold text-ink no-underline transition-colors hover:border-alert-text hover:text-ink"
              >
                <span className="min-w-0 wrap-break-word">{title}</span>
                <ChevronRight aria-hidden="true" className="size-4 flex-none text-alert-text" />
              </Link>
            </li>
          ))}
          <li>
            <Link
              to={PATHS.firstAid}
              className="flex min-h-11 items-center gap-1.5 px-1 py-1.5 text-sm font-extrabold text-brand underline underline-offset-4"
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
}
