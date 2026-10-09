import { useId } from "react"
import { Link } from "react-router"
import { Bandage, ChevronRight } from "lucide-react"
import { PATHS } from "@/router/paths"

/**
 * The highlighted way into Primeros auxilios, at the top of the home. More visible than a category card (a full-width band with
 * its own color and a button) and less than the emergencies (no red, no numbers, nothing to call from here). It is a link to the
 * guides: the emergency numbers stay in their own bar, untouched.
 */
export const FirstAidBand = () => {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className="mb-6 flex flex-col gap-4 rounded-2xl border-2 border-aid-line bg-aid p-4 text-on-aid shadow-lg sm:flex-row sm:items-center sm:gap-6 sm:p-5">
      <span aria-hidden="true" className="hidden size-14 flex-none items-center justify-center rounded-2xl border-2 border-aid-line sm:flex">
        <Bandage className="size-7" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h2 id={headingId} className="m-0 flex items-center gap-2 text-xl/tight font-extrabold sm:text-2xl/tight">
          <Bandage aria-hidden="true" className="size-6 flex-none sm:hidden" />
          Primeros auxilios
        </h2>
        <p className="m-0 text-base text-pretty">Guías paso a paso para saber qué hacer mientras llega la ayuda: RCP, atragantamiento, quemaduras y más.</p>
      </div>
      <Link
        to={PATHS.firstAid}
        className="inline-flex min-h-12 flex-none items-center justify-center gap-2 rounded-xl bg-on-aid px-5 py-2 text-base font-extrabold text-aid-ink no-underline hover:bg-on-aid hover:text-aid-ink focus-visible:outline-on-home"
      >
        Ver las guías
        <ChevronRight aria-hidden="true" className="size-5" />
      </Link>
    </section>
  )
}
