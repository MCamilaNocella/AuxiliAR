import { Link } from "react-router"
import { Phone } from "lucide-react"
import { ActionLink } from "@/components/health/ActionLink"
import { SourceList } from "@/components/health/SourceList"
import { centersLink } from "@/router/centersLink"
import { PATHS, SECTION_PARAM } from "@/router/paths"
import { revealEmergencies } from "@/utils/revealEmergencies"
import { CHECKED_AT, DIRECCION_NACIONAL, LEY_26657, LEY_SIMPLE, ORIENTACION } from "../../MentalHealth.sources"

/**
 * Salud mental · Dónde buscar ayuda. What it says and where it comes from:
 *  - "cualquier persona puede atravesar problemas de salud mental…": Dirección Nacional de Abordaje Integral de Salud Mental
 *  - "si no tenés cobertura podés acercarte a un hospital o centro de salud cercano a tu domicilio": argentina.gob.ar, Derechos Humanos
 *  - "ser atendida en el hospital general": Ley simple (Derecho Fácil)
 *  - "equipo interdisciplinario integrado por profesionales, técnicos…": Ley 26.657, art. 8
 * It shows no phone line: the help numbers are the work of the Emergencias team, so this page opens them through the
 * existing button (revealEmergencies) instead of copying any number.
 */
export default function Section1Content() {
  return (
    <div className="mt-2 flex max-w-3xl flex-col gap-6">
      <p className="m-0 text-lg text-ink">Cualquier persona puede atravesar problemas de salud mental en algún momento de su vida. Pedir ayuda es una forma de cuidarte.</p>

      <div className="rounded-2xl border-2 border-alert-card-line bg-alert-soft p-4">
        <p className="m-0 text-lg font-extrabold text-alert-text">Si hay riesgo inmediato, o necesitás hablar con alguien ahora</p>
        <p className="m-0 mt-1 text-ink">Pedí ayuda primero: mirá los números de emergencia.</p>
        <button
          type="button"
          onClick={revealEmergencies}
          className="mt-3 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-alert px-4 py-2 font-extrabold text-on-alert hover:bg-alert-dark"
        >
          <Phone aria-hidden="true" className="size-5 shrink-0" />
          Ver números de emergencia
        </button>
      </div>

      <section aria-labelledby="mh-near">
        <h3 id="mh-near" className="m-0 text-xl font-extrabold">
          Un hospital o centro de salud cerca de tu casa
        </h3>
        <p className="m-0 mt-1">
          Si no tenés cobertura de salud, podés acercarte a un hospital o centro de salud cercano a tu domicilio. La ley establece que las personas con padecimiento mental tienen derecho a ser atendidas en el
          hospital general.
        </p>
        <div className="mt-3">
          <ActionLink to={centersLink({ filter: "mental-health" })} variant="primary">
            Buscar en el mapa centros verificados con salud mental
          </ActionLink>
        </div>
        <p className="m-0 mt-2 text-ink-soft">
          Mostramos solo centros verificados y todavía no cubrimos todo el país.{" "}
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
            Qué derechos tenés cuando pedís atención
          </Link>
        </p>
      </section>

      <SourceList sources={[DIRECCION_NACIONAL, ORIENTACION, LEY_SIMPLE, LEY_26657]} checkedAt={CHECKED_AT} />
    </div>
  )
}
