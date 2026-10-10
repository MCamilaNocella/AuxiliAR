import { ActionLink } from "@/components/health/ActionLink"
import { todayInArgentina } from "@/data/resources"
import type { ProvinceCoverage } from "@/data/resources"
import { centersLink } from "@/router/centersLink"
import type { CentersFilter } from "@/router/centersLink"
import { quickFilterAvailability } from "./quickFilterAvailability"

type MapAccessProps = {
  /** The quick filter of the map this page opens */
  filter: Extract<CentersFilter, "nutrition-food" | "physical-activity">
  /** What the filter shows, for the button: "Ver el mapa de {topic}" */
  topic: string
  /** For tests: the index and the day to read it on (by default the real ones) */
  coverage?: Partial<Record<string, ProvinceCoverage>>
  day?: string
}

/**
 * The way from an information page to the map, in three states that come from the coverage index (the explorer's own rules):
 *  - there are verified places with a point on the map: the button opens the map with the filter
 *  - there are verified places but none has a verified point yet: it says so and opens the list with the filter (the list shows them)
 *  - nothing the map can show: it says so and opens the general map; a filter with nothing to show is never switched on
 * A missing place is never presented as a missing service.
 */
export const MapAccess = ({ filter, topic, coverage, day = todayInArgentina() }: MapAccessProps) => {
  const availability = quickFilterAvailability(filter, day, coverage)

  return (
    <section aria-labelledby={`map-access-${filter}`} className="flex flex-col gap-3 rounded-2xl border border-line-strong bg-card p-4 sm:p-6">
      <h3 id={`map-access-${filter}`} className="m-0 text-xl font-extrabold">
        En el mapa
      </h3>
      {availability === "pins" ? (
        <>
          <p className="m-0">Hay lugares verificados en el mapa para este tema.</p>
          <div className="flex flex-col sm:flex-row">
            <ActionLink to={centersLink({ filter })} variant="primary">
              {`Ver el mapa de ${topic}`}
            </ActionLink>
          </div>
        </>
      ) : availability === "list" ? (
        <>
          <p className="m-0">Hay lugares verificados para este tema, pero todavía sin ubicación en el mapa. Los podés ver en la lista.</p>
          <div className="flex flex-col sm:flex-row">
            <ActionLink to={centersLink({ filter, list: true })} variant="primary">
              {`Ver la lista de ${topic}`}
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
}
