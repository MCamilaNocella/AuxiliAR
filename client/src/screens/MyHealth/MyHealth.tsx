import { Link } from "react-router"
import { ChevronRight, HardHat } from "lucide-react"
import { Page } from "@/components/layout/Page"
import { PATHS } from "@/router/paths"

/**
 * /mi-salud: a module that does not exist yet. It says so and promises nothing: no accounts, no clinical records, no saved
 * data. It only points to what AuxiliAR already has.
 */
export const MyHealth = () => (
  <Page title="Mi salud">
    <div className="flex max-w-3xl flex-col gap-4">
      <p className="m-0 inline-flex w-fit items-center gap-2 rounded-full border-2 border-line-strong bg-field px-3 py-1 text-base font-extrabold text-ink">
        <HardHat aria-hidden="true" className="size-5" />
        En construcción
      </p>
      <p className="m-0 text-lg text-ink">Este módulo todavía no está disponible. Estamos trabajando en él y por ahora no hay nada para usar acá.</p>
      <p className="m-0 text-ink-soft">Mientras tanto, podés seguir explorando AuxiliAR:</p>
      <ul role="list" className="m-0 flex list-none flex-col gap-3 p-0">
        {[
          { label: "Volver al inicio", to: PATHS.home },
          { label: "Cuidar mi salud: controles y vacunas", to: PATHS.topic("salud-general") },
          { label: "Encontrar atención", to: PATHS.centers },
        ].map(({ label, to }) => (
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
    </div>
  </Page>
)
