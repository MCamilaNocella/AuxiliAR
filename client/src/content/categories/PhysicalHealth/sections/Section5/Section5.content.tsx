import { useEffect, useRef } from "react"
import { useSearchParams } from "react-router"
import { Info } from "lucide-react"
import { ActionLink } from "@/components/health/ActionLink"
import { SourceList } from "@/components/health/SourceList"
import type { Source } from "@/components/health/SourceList"
import { centersLink } from "@/router/centersLink"
import { CALENDAR_PDF, CALENDAR_SOURCE, CHECKED_AT, GENERAL_NOTE, TO_CONFIRM_INTRO, VACCINATION_STAGES } from "./Section5.constants"
import type { VaccineGroup } from "./Section5.constants"

/** Query param with the open stage: /temas/salud-general?seccion=section-5&etapa=hasta-un-ano */
const STAGE_PARAM = "etapa"

/** The calendar's own sources first, then the ones of the open stage, with no repeated address */
const uniqueSources = (sources: Source[]) => sources.filter((source, index) => sources.findIndex(({ url }) => url === source.url) === index)

const Group = ({ group }: { group: VaccineGroup }) => (
  <div className={group.aside ? "rounded-2xl border border-line-strong bg-field p-4" : undefined}>
    {group.heading ? <h4 className="m-0 text-base font-extrabold">{group.heading}</h4> : null}
    {group.paragraphs?.map((paragraph) => (
      <p key={paragraph} className="m-0 mt-1">
        {paragraph}
      </p>
    ))}
    {group.items?.length ? (
      <ul className="m-0 mt-1 list-disc pl-5">
        {group.items.map(({ vaccine, dose, details }) => (
          <li key={`${vaccine}-${dose}`} className="mt-1 first:mt-0">
            <strong>{vaccine}:</strong> {dose}
            {details?.length ? (
              <ul className="m-0 mt-1 list-[circle] pl-5 text-ink-soft">
                {details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    ) : null}
  </div>
)

/**
 * Salud general · Calendario de vacunación. The Calendario Nacional de Vacunación 2026 by stage of life, one stage at a
 * time (the open one is in the URL). An informative summary of the official calendar: it repeats what the Ministerio de
 * Salud documents explicitly and, where the official sources differ or a professional must decide, it says so in ONE short
 * note per stage and sends to the official source or the vacunatorio. It is not a clinical approval.
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
          El Calendario Nacional de Vacunación incluye vacunas para todas las etapas de la vida. Elegí una etapa para ver qué vacunas indica el Ministerio de Salud de la Nación y en qué condiciones.
        </p>
        <p className="m-0 mt-2 text-muted">Las vacunas del Calendario están disponibles en centros de salud y hospitales públicos de todo el país, son gratuitas y no requieren orden médica.</p>
        <p className="m-0 mt-3 flex items-start gap-2 rounded-2xl border border-line-strong bg-field p-3 text-ink-soft">
          <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand" />
          <span>{GENERAL_NOTE}</span>
        </p>
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
        {stage.intro ? <p className="m-0 mt-2">{stage.intro}</p> : null}

        <div className="mt-4 flex flex-col gap-4">
          {stage.groups.map((group) => (
            <Group key={group.heading ?? group.items?.[0]?.vaccine ?? "group"} group={group} />
          ))}
        </div>

        {stage.notes?.length ? (
          <ul className="m-0 mt-4 list-disc pl-5 text-ink-soft">
            {stage.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}

        {stage.toConfirm?.length ? (
          <div role="note" className="mt-4 rounded-2xl border-2 border-control-line bg-field p-4">
            <h4 className="m-0 text-base font-extrabold">Para confirmar en la fuente oficial o en el vacunatorio</h4>
            <p className="m-0 mt-1">{TO_CONFIRM_INTRO}</p>
            <ul className="m-0 mt-1 list-disc pl-5">
              {stage.toConfirm.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section aria-labelledby="vaccination-reminder" className="rounded-2xl border border-line-strong bg-field p-4">
        <h3 id="vaccination-reminder" className="m-0 text-base font-extrabold">
          Recordá
        </h3>
        <ul className="m-0 mt-1 list-disc pl-5">
          <li>Cuando vayas a un vacunatorio o centro de salud, llevá el carnet de vacunas para que puedan chequearlo.</li>
          <li>Es importante que todas las personas tengan las dosis de vacunas correspondientes a su edad.</li>
          <li>Si no sabés qué vacunas te faltan o no encontrás tu carnet, consultá en un vacunatorio o centro de salud: te orientan.</li>
          <li>En el PDF oficial del Calendario hay más notas por vacuna.</li>
        </ul>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <ActionLink to={centersLink({ filter: "vaccination" })} variant="primary">
            Encontrar vacunatorio
          </ActionLink>
        </div>
      </section>

      <SourceList
        sources={uniqueSources([CALENDAR_SOURCE, CALENDAR_PDF, ...stage.sources])}
        checkedAt={CHECKED_AT}
        note="Contenido del Ministerio de Salud de la Nación (licencia Creative Commons Atribución 4.0), resumido y reorganizado por AuxiliAR. Es un resumen informativo: no reemplaza la consulta con un equipo de salud."
      />
    </div>
  )
}
