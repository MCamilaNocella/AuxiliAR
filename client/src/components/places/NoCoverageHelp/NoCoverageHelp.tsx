import { Link } from "react-router"
import type { ProvinceCode } from "@/data/resources"
import { HEALTH_GENERAL_SLUG, PATHS, SECTION_PARAM } from "@/router/paths"
import { provinceLabel } from "@/utils/places"
import { revealEmergencies } from "@/utils/revealEmergencies"

type NoCoverageHelpProps = {
  /** The provinces that have verified places today */
  coverage: readonly ProvinceCode[]
  /** Opens the covered places: one province when there is one, else all of them. The person's other filters stay */
  onExploreCovered: () => void
}

const buttonClass = "inline-flex min-h-11 cursor-pointer items-center rounded-xl border border-control-line bg-field px-4 py-2 font-extrabold"

/** "CABA" for the Ciudad Autónoma, which is how people say it; the name of the province otherwise */
const shortName = (code: ProvinceCode) => (code === "AR-C" ? "CABA" : provinceLabel(code))

/**
 * What a person can do when there is nothing verified to show for where they are. It is general advice only: it names no
 * center, no number and no availability that AuxiliAR has not verified. The emergency numbers are the ones of the emergency bar.
 */
export const NoCoverageHelp = ({ coverage, onExploreCovered }: NoCoverageHelpProps) => (
  <section aria-labelledby="no-coverage-help" className="flex max-w-prose flex-col gap-3 rounded-2xl border border-line-strong bg-card p-4">
    <h3 id="no-coverage-help" className="m-0 text-lg font-extrabold">
      Qué podés hacer mientras tanto
    </h3>
    <ul className="m-0 flex list-disc flex-col gap-1 pl-5">
      <li>Acercate al hospital o al centro de salud público más cercano a tu casa: es la puerta de entrada a la atención.</li>
      <li>
        Si no sabés a dónde ir según lo que te pasa, mirá{" "}
        <Link to={`${PATHS.topic(HEALTH_GENERAL_SLUG)}?${SECTION_PARAM}=section-1`} className="font-bold">
          Dónde atenderme
        </Link>
        .
      </li>
      <li>Antes de ir, llamá por teléfono si podés: los horarios y los turnos cambian.</li>
    </ul>
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={revealEmergencies} className={`${buttonClass} border-brand text-brand`}>
        Mirá los números de emergencia
      </button>
      {coverage.length > 0 && (
        <button type="button" onClick={onExploreCovered} className={buttonClass}>
          {coverage.length === 1 ? `Explorar los centros verificados en ${shortName(coverage[0])}` : "Explorar las zonas con centros verificados"}
        </button>
      )}
    </div>
  </section>
)
