import { Building2, Hospital, Siren, Stethoscope } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { ActionLink } from "@/components/health/ActionLink"
import { PlacesExplorer } from "@/components/places/PlacesExplorer"
import type { PlaceFilterId, PlacesScope } from "@/utils/places"
import { revealEmergencies } from "@/utils/revealEmergencies"

/** Only what belongs to physical health: a place shows up here with just its physical health services */
const SCOPE: PlacesScope = { category: "salud-fisica" }
const FILTERS: PlaceFilterId[] = ["medical", "vaccination", "dentistry", "emergency"]

const TRANSPARENCY = "Centros verificados por AuxiliAR. Estamos incorporando establecimientos progresivamente."

const CHOICES: { icon: LucideIcon, title: string, text: string }[] = [
  { icon: Stethoscope, title: "Centro de salud (CeSAC)", text: "Para controles, consultas habituales, prevención y atención primaria." },
  { icon: Hospital, title: "Hospital", text: "Para especialidades, estudios y atención de mayor complejidad." },
  { icon: Building2, title: "Guardia", text: "Para problemas que necesitan atención en el momento." },
]

/** Salud física · Centros de atención — how to choose where to go, and the verified places with their physical health services */
export default function Section1Content() {
  return (
    <div className="mt-2 flex flex-col gap-8">
      <section aria-labelledby="where-to-go" className="max-w-4xl">
        <h3 id="where-to-go" className="m-0 text-xl font-extrabold">
          ¿Dónde me conviene atenderme?
        </h3>
        <ul role="list" className="m-0 mt-3 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-3">
          {CHOICES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex flex-col gap-1 rounded-2xl border border-line-strong bg-card p-4">
              <span className="flex items-center gap-2 font-extrabold">
                <Icon aria-hidden="true" className="size-5 shrink-0 text-brand" />
                {title}
              </span>
              <span className="text-ink-soft">{text}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 rounded-2xl border border-alert-card-line bg-alert-soft p-4">
          <p className="m-0 flex items-center gap-2 font-extrabold text-alert-text">
            <Siren aria-hidden="true" className="size-5 shrink-0" />
            Emergencia
          </p>
          <p className="m-0 mt-1">Cuando la situación es crítica o hay riesgo inmediato, no busques un centro: llamá al número de emergencias de tu localidad.</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <ActionLink onClick={revealEmergencies}>Ver números de emergencia</ActionLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="find-center">
        <h3 id="find-center" className="m-0 text-xl font-extrabold">
          Encontrá un centro
        </h3>
        <PlacesExplorer province="AR-C" scope={SCOPE} filters={FILTERS} intro={TRANSPARENCY} map />
      </section>
    </div>
  )
}
