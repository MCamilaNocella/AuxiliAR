import { Link } from "react-router"
import { ActionLink } from "@/components/health/ActionLink"
import { SourceList } from "@/components/health/SourceList"
import { centersLink } from "@/router/centersLink"
import { PATHS, SECTION_PARAM } from "@/router/paths"
import { CHECKED_AT, LEY_26657, LEY_SIMPLE, ORIENTACION } from "../../MentalHealth.sources"

/**
 * Salud mental · Dónde buscar ayuda. This section is information and orientation: it offers no appointments and
 * recommends no service as free care (no service of the map has its gratuity verified for mental health yet). What it
 * says and where it comes from:
 *  - "si no tenés cobertura podés acercarte a un hospital o centro de salud cercano a tu domicilio": argentina.gob.ar, Derechos Humanos
 *  - "ser atendida en el hospital general": Ley simple (Derecho Fácil)
 *  - "equipo interdisciplinario integrado por profesionales, técnicos…": Ley 26.657, art. 8
 * The map button only explores: the map itself marks gratuity only when it is verified for that very service and says
 * when the source does not inform the cost. It shows no phone line and no emergency notice of its own: the help numbers are the work of
 * the Emergencias team and are always one tap away in the emergency bar and in the bottom navigation.
 */
export default function Section1Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <p className="m-0 text-lg text-ink">
        Estamos para ayudarte a encontrar orientación y recursos de salud mental. Acá vas a conocer tus derechos y descubrir dónde buscar atención. AuxiliAR no otorga turnos ni realiza consultas médicas
        directamente.
      </p>

      <section aria-labelledby="mh-near">
        <h3 id="mh-near" className="m-0 text-xl font-extrabold">
          Un hospital o centro de salud cerca de tu casa
        </h3>
        <p className="m-0 mt-1">
          Si no tenés cobertura de salud, podés acercarte a un hospital o centro de salud cercano a tu domicilio. La ley establece que las personas con padecimiento mental tienen derecho a ser atendidas en el
          hospital general.
        </p>
        <p className="m-0 mt-2 text-ink-soft">La forma de acceder a la atención puede variar según el centro. Algunos servicios requieren admisión, turno o derivación.</p>
        <div className="mt-3">
          <ActionLink to={centersLink({ filter: "mental-health" })} variant="primary">
            Ver el mapa
          </ActionLink>
        </div>
        <p className="m-0 mt-2 text-ink-soft">
          Consultá cada ficha para saber qué servicios gratuitos están confirmados. Todavía no cubrimos todo el país.{" "}
          <Link to={`${PATHS.centers}?${SECTION_PARAM}=section-2`} className="font-bold">
            Cómo verificamos los datos y qué cobertura hay
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="mh-team">
        <h3 id="mh-team" className="m-0 text-xl font-extrabold">
          Quién te atiende
        </h3>
        <p className="m-0 mt-1">La ley establece que la atención en salud mental esté a cargo de un equipo interdisciplinario, integrado por profesionales y técnicos.</p>
        <p className="m-0 mt-2">
          <Link to={`${PATHS.topic("salud-mental")}?${SECTION_PARAM}=section-2`} className="font-bold">
            Conocé tus derechos
          </Link>
        </p>
      </section>

      <SourceList sources={[ORIENTACION, LEY_SIMPLE, LEY_26657]} checkedAt={CHECKED_AT} />
    </div>
  )
}
