import { Building2, Hospital, Stethoscope } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { ActionLink } from "@/components/health/ActionLink"
import { PATHS } from "@/router/paths"

const CHOICES: { icon: LucideIcon, title: string, text: string }[] = [
  { icon: Stethoscope, title: "Centro de salud (CeSAC)", text: "Para controles, consultas habituales, prevención y atención primaria." },
  { icon: Hospital, title: "Hospital", text: "Para especialidades, estudios y atención de mayor complejidad." },
  { icon: Building2, title: "Guardia", text: "Para problemas que necesitan atención en el momento." },
]

/**
 * Salud general · Dónde atenderme — a short explanation of where to go. The places themselves, with their map and
 * filters, live in the Centros de atención category: from here it only opens that door.
 */
export default function Section1Content() {
  return (
    <div className="mt-2 flex max-w-4xl flex-col gap-8">
      <section aria-labelledby="where-to-go">
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
      </section>

      <section aria-labelledby="find-center">
        <h3 id="find-center" className="m-0 text-xl font-extrabold">
          Buscá un centro cerca tuyo
        </h3>
        <p className="m-0 mt-1">Centros de salud, hospitales y guardias están en Centros de atención.</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <ActionLink to={PATHS.centers} variant="primary">
            Ir a Centros de atención
          </ActionLink>
        </div>
      </section>
    </div>
  )
}
