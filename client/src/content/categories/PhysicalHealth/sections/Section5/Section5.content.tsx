import { useEffect, useRef } from "react"
import { useSearchParams } from "react-router"
import { ActionLink } from "@/components/health/ActionLink"
import { SourceList } from "@/components/health/SourceList"
import { centersLink } from "@/router/centersLink"
import { CALENDAR_SOURCE, CHECKED_AT, VACCINATION_STAGES } from "./Section5.constants"

/** Query param with the open stage: /temas/salud-general?seccion=section-5&etapa=hasta-un-ano */
const STAGE_PARAM = "etapa"

/**
 * Salud general · Calendario de vacunación. The Calendario Nacional de Vacunación 2026 explained by stage of life,
 * one stage at a time (the open one is in the URL). It repeats what the Ministerio de Salud publishes, with no
 * personalized advice: which vaccines a person needs is for their health team (or the vacunatorio) to say.
 */
export default function Section5Content() {
  const [searchParams, setSearchParams] = useSearchParams()
  const stage = VACCINATION_STAGES.find(({ id }) => id === searchParams.get(STAGE_PARAM)) ?? VACCINATION_STAGES[0]
  const headingRef = useRef<HTMLHeadingElement>(null)
  const isFirstRender = useRef(true)

  // Choosing a stage brings its block into view and reads it out (not when the section just opened)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    headingRef.current?.focus()
  }, [stage.id])

  const choose = (id: string) =>
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        next.set(STAGE_PARAM, id)
        return next
      },
      { replace: true, preventScrollReset: true },
    )

  return (
    <div className="mt-2 flex max-w-4xl flex-col gap-6">
      <div>
        <p className="m-0">
          El Calendario Nacional de Vacunación incluye vacunas para todas las etapas de la vida. Elegí una etapa para ver qué vacunas y qué dosis indica el Ministerio de Salud de la Nación.
        </p>
        <p className="m-0 mt-2 text-muted">Las vacunas del Calendario Nacional se aplican de forma gratuita en centros de salud y hospitales públicos.</p>
      </div>

      <ul role="list" aria-label="Etapas de la vida" className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4">
        {VACCINATION_STAGES.map(({ id, title }) => (
          <li key={id}>
            <button
              type="button"
              aria-pressed={id === stage.id}
              onClick={() => choose(id)}
              className={`flex min-h-14 w-full cursor-pointer items-center justify-center rounded-2xl border-2 px-3 py-3 text-center font-bold text-ink ${
                id === stage.id ? "border-brand bg-brand-soft" : "border-control-line bg-card hover:bg-field"
              }`}
            >
              {title}
            </button>
          </li>
        ))}
      </ul>

      <section aria-labelledby="vaccination-stage-title" className="rounded-2xl border border-line-strong bg-card p-4 sm:p-6">
        <h3 id="vaccination-stage-title" ref={headingRef} tabIndex={-1} className="m-0 text-xl font-extrabold outline-none">
          {stage.title}
        </h3>
        <p className="m-0 mt-2">{stage.intro}</p>

        <div className="mt-4 flex flex-col gap-4">
          {stage.groups.map(({ when, items }) => (
            <div key={when ?? "all"}>
              {when ? <h4 className="m-0 text-base font-extrabold">{when}</h4> : null}
              <ul className="m-0 mt-1 list-disc pl-5">
                {items.map(({ vaccine, dose }) => (
                  <li key={`${vaccine}-${dose}`}>
                    <strong>{vaccine}:</strong> {dose}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {stage.notes?.length ? (
          <ul className="m-0 mt-4 list-disc pl-5 text-ink-soft">
            {stage.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section aria-labelledby="vaccination-reminder" className="rounded-2xl border border-line-strong bg-field p-4">
        <h3 id="vaccination-reminder" className="m-0 text-base font-extrabold">
          Recordá
        </h3>
        <ul className="m-0 mt-1 list-disc pl-5">
          <li>Cuando vayas a un vacunatorio o centro de salud, llevá el carnet de vacunas para que puedan chequearlo.</li>
          <li>Es importante que todas las personas tengan las dosis de vacunas correspondientes a su edad.</li>
          <li>Durante la infancia conviene un control de salud al menos una vez por año, aunque la persona no esté enferma. Debe incluir una visita a oftalmología y odontología.</li>
          <li>Si no sabés qué vacunas te faltan o no encontrás tu carnet, consultá en un vacunatorio o centro de salud: te orientan.</li>
        </ul>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <ActionLink to={centersLink({ filter: "vaccination" })} variant="primary">
            Encontrar vacunatorio
          </ActionLink>
        </div>
      </section>

      <SourceList
        sources={[CALENDAR_SOURCE, stage.source]}
        checkedAt={CHECKED_AT}
        note="Contenido del Ministerio de Salud de la Nación (licencia Creative Commons Atribución 4.0), resumido y reorganizado por AuxiliAR. Esta información es orientativa y no reemplaza la consulta con un equipo de salud. Si el Ministerio actualiza el calendario, prevalece su versión."
      />
    </div>
  )
}
