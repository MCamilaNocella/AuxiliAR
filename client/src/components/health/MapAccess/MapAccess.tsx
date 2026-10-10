import { ActionLink } from "@/components/health/ActionLink"
import { todayInArgentina } from "@/data/resources"
import type { ServiceType } from "@/data/resources"
import { centersLink } from "@/router/centersLink"
import type { CentersFilter } from "@/router/centersLink"
import { mayHaveServices } from "./mayHaveServices"

type MapAccessProps = {
  /** The quick filter of the map this page opens */
  filter: Extract<CentersFilter, "nutrition-food" | "physical-activity">
  /** The service types of that filter: whether the map has any is read from the coverage index */
  serviceTypes: readonly ServiceType[]
  /** What the filter shows, for the button: "Ver el mapa de {topic}" */
  topic: string
}

/**
 * The way from an information page to the map. If the map may have places for the filter, the button opens it with that filter.
 * If not, it says so and opens the general map: a filter with nothing to show is never switched on, and a missing place is not
 * presented as a missing service.
 */
export const MapAccess = ({ filter, serviceTypes, topic }: MapAccessProps) => (
  <section aria-labelledby={`map-access-${filter}`} className="flex flex-col gap-3 rounded-2xl border border-line-strong bg-card p-4 sm:p-6">
    <h3 id={`map-access-${filter}`} className="m-0 text-xl font-extrabold">
      En el mapa
    </h3>
    {mayHaveServices(serviceTypes, todayInArgentina()) ? (
      <>
        <p className="m-0">El mapa puede tener lugares verificados para este tema.</p>
        <div className="flex flex-col sm:flex-row">
          <ActionLink to={centersLink({ filter })} variant="primary">
            {`Ver el mapa de ${topic}`}
          </ActionLink>
        </div>
      </>
    ) : (
      <>
        <p className="m-0">Todavía no hay lugares verificados en el mapa para este tema. Eso no significa que no existan: solo mostramos lo que una fuente oficial confirma.</p>
        <div className="flex flex-col sm:flex-row">
          <ActionLink to={centersLink()} variant="secondary">
            Ver el mapa general
          </ActionLink>
        </div>
      </>
    )}
  </section>
)
