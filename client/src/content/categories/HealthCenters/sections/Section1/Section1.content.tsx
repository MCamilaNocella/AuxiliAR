import { Link } from "react-router"
import { PlacesExplorer } from "@/components/places/PlacesExplorer"
import { PATHS, SECTION_PARAM } from "@/router/paths"
import type { PlaceFilterId } from "@/utils/places"
import { revealEmergencies } from "@/utils/revealEmergencies"

/** The quick filters of the map: every kind of care there is data for */
const FILTERS: PlaceFilterId[] = ["medical", "mental-health", "sexual-health", "vaccination", "dentistry", "emergency", "animal-health", "nutrition-food", "physical-activity"]

/**
 * Centros de atención · Mapa AuxiliAR: the one map and list of places. No scope: every category of care shows up, but only
 * the prestaciones with documented gratuity (the explorer shows nothing else). The emergency notice is a single line that points to the
 * numbers of the emergency bar.
 */
export default function Section1Content() {
  return (
    <div className="mt-2 flex flex-col gap-3">
      <p className="m-0 max-w-prose text-ink-soft">
        Si hay riesgo inmediato, no busques un centro:{" "}
        <button type="button" onClick={revealEmergencies} className="-my-2.5 inline-block cursor-pointer border-0 bg-transparent py-2.5 font-bold text-brand underline underline-offset-4">
          mirá los números de emergencia
        </button>
        .
      </p>
      {/* No intro line under the heading: the map says what it shows by itself. How it is verified is one secondary link, at the end */}
      <PlacesExplorer filters={FILTERS} intro={null} map />
      <p className="m-0 mt-2 text-ink-soft">
        <Link to={`${PATHS.centers}?${SECTION_PARAM}=section-2`} className="inline-flex min-h-11 items-center font-bold">
          Cómo verificamos los datos
        </Link>
      </p>
    </div>
  )
}
