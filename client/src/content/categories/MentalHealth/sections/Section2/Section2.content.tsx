import { ActionLink } from "@/components/health/ActionLink"
import { SourceList } from "@/components/health/SourceList"
import { centersLink } from "@/router/centersLink"
import { CHECKED_AT, LEY_26657, LEY_SIMPLE } from "../../MentalHealth.sources"

/**
 * Each right is in the Ley Nacional de Salud Mental 26.657 (texto original) and, in plain words, in "Ley simple: Salud mental":
 *  - tratamiento más conveniente, que menos restrinja derechos y libertades: art. 7
 *  - acompañamiento por familiares, afectos o a quien se designe: art. 7
 *  - acceso a la historia clínica (la persona, su abogado, un familiar o allegado que designe): art. 7
 *  - no ser identificado ni discriminado por un padecimiento mental actual o pasado: art. 7
 *  - atención en el hospital general, preferentemente fuera del ámbito de internación: Ley simple, art. 9
 *  - la medicación responde a necesidades fundamentales y nunca es un castigo: art. 12
 *  - rechazar la atención por un padecimiento mental es discriminación: Ley simple
 * Left out on purpose until a health professional and the team review them: involuntary hospitalization and its judicial
 * control, and any procedure to file a complaint.
 */
const RIGHTS = [
  "Recibir el tratamiento más conveniente, el que menos limite tus derechos y libertades.",
  "Que te acompañen tus familiares, tus afectos o la persona que designes, antes, durante y después del tratamiento.",
  "Acceder a tu historia clínica. También pueden hacerlo tu abogado, un familiar o la persona que designes.",
  "No ser discriminada ni discriminado por tener, o haber tenido, un padecimiento mental.",
  "Ser atendida o atendido en un hospital general. La atención debe hacerse, preferentemente, fuera de la internación.",
  "Que la medicación responda a tus necesidades de salud y nunca se use como castigo.",
]

export default function Section2Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <section aria-labelledby="mh-rights">
        <h3 id="mh-rights" className="m-0 text-xl font-extrabold">
          Lo que reconoce la ley
        </h3>
        <p className="m-0 mt-1">La Ley Nacional de Salud Mental (26.657) reconoce estos derechos a las personas con padecimiento mental:</p>
        <ul className="m-0 mt-3 flex list-disc flex-col gap-2 pl-5">
          {RIGHTS.map((right) => (
            <li key={right}>{right}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="mh-refused">
        <h3 id="mh-refused" className="m-0 text-xl font-extrabold">
          Si te rechazan la atención
        </h3>
        <p className="m-0 mt-1">Rechazar la atención de una persona por tener un padecimiento mental es una forma de discriminación.</p>
        <p className="m-0 mt-2 text-ink-soft">La forma de acceder a la atención puede variar según el centro. Algunos servicios requieren admisión, turno o derivación.</p>
        <div className="mt-3">
          <ActionLink to={centersLink({ filter: "mental-health" })}>Explorar centros de salud cercanos</ActionLink>
        </div>
      </section>

      <SourceList
        sources={[LEY_26657, LEY_SIMPLE]}
        checkedAt={CHECKED_AT}
        note="Es una explicación simple de la ley: no reemplaza el asesoramiento de un equipo de salud ni el de un abogado."
      />
    </div>
  )
}
