import { Link } from "react-router"
import { ChevronRight } from "lucide-react"
import { revealEmergencies } from "@/utils/revealEmergencies"
import type { CategoryPreparingProps } from "./CategoryPreparing.types"

/**
 * What a category shows while its information is not published yet: what it will have, why it is not there (every piece
 * of information needs a verified official source) and what AuxiliAR already offers on the topic. It makes no promises
 * about gratuity or availability, and it never shows a section menu with empty sections.
 */
export const CategoryPreparing = ({ preparing }: CategoryPreparingProps) => (
  <div className="mt-2 flex max-w-3xl flex-col gap-4">
    <p className="m-0 text-lg text-ink">{preparing.will}</p>
    <p className="m-0 text-ink-soft">Todavía no la publicamos: cada dato necesita una fuente oficial verificada, y preferimos mostrar menos antes que mostrar algo sin comprobar.</p>

    {preparing.meanwhile.length > 0 && (
      <section aria-labelledby="preparing-meanwhile">
        <h3 id="preparing-meanwhile" className="m-0 text-xl font-extrabold">
          Mientras tanto, ya podés
        </h3>
        <ul role="list" className="m-0 mt-3 flex list-none flex-col gap-3 p-0">
          {preparing.meanwhile.map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 border-line-strong bg-card px-4 py-3 font-extrabold text-ink no-underline hover:border-control-line hover:text-ink"
              >
                <span className="flex-1">{label}</span>
                <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-brand" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    )}

    <p className="m-0 text-ink-soft">
      Si hay riesgo inmediato:{" "}
      <button type="button" onClick={revealEmergencies} className="-my-2.5 inline-block cursor-pointer border-0 bg-transparent py-2.5 font-bold text-brand underline underline-offset-4">
        mirá los números de emergencia
      </button>
      .
    </p>
  </div>
)
