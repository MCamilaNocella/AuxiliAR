import { useEffect, useRef } from "react"
import { useSearchParams } from "react-router"
import { Construction, Info } from "lucide-react"
import { ActionLink } from "@/components/health/ActionLink"
import { Disclosure } from "@/components/health/Disclosure"
import { OutLink } from "@/components/health/OutLink"
import { centersLink } from "@/router/centersLink"
import { CALENDAR_PDF, DEVELOPMENT_NOTICE, GENERAL_NOTE, TO_CONFIRM_INTRO, VACCINATION_STAGES } from "./Section5.constants"
import type { VaccineGroup, VaccineItem } from "./Section5.constants"

/** Query param with the open stage: /temas/salud-general?seccion=section-5&etapa=hasta-un-ano */
const STAGE_PARAM = "etapa"

/** The calendar's own sources first, then the ones of the open stage, with no repeated address */
const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

const Details = ({ details }: { details?: string[] }) =>
  details?.length ? (
    <ul className="m-0 mt-1 list-[circle] pl-5 text-ink-soft">
      {details.map((detail) => (
        <li key={detail}>{detail}</li>
      ))}
    </ul>
  ) : null

const Paragraphs = ({ paragraphs }: { paragraphs?: string[] }) =>
  paragraphs?.map((paragraph) => (
    <p key={paragraph} className="m-0 mt-1 first:mt-0">
      {paragraph}
    </p>
  )) ?? null

const Items = ({ items }: { items?: VaccineItem[] }) =>
  items?.length ? (
    <ul className="m-0 mt-1 list-disc pl-5">
      {items.map(({ vaccine, dose, details }) => (
        <li key={`${vaccine}-${dose}`} className="mt-1 first:mt-0">
          <strong>{vaccine}:</strong> {dose}
          <Details details={details} />
        </li>
      ))}
    </ul>
  ) : null

/**
 * One group of a stage. A long stage is read in blocks on a phone: a group can be a disclosure (open or closed) or have one
 * disclosure per vaccine. The text is the same in every mode and all of it is in the page, closed or not.
 */
const Group = ({ group }: { group: VaccineGroup }) => {
  const { heading, display, paragraphs, items } = group
  if ((display === "open" || display === "collapsible") && heading) {
    return (
      <Disclosure title={heading} defaultOpen={display === "open"} compact>
        <Paragraphs paragraphs={paragraphs} />
        <Items items={items} />
      </Disclosure>
    )
  }
  if (display === "split" && items?.length) {
    return (
      <div>
        {heading ? <h4 className="m-0 text-base font-extrabold">{heading}</h4> : null}
        <Paragraphs paragraphs={paragraphs} />
        <div className="mt-2 flex flex-col gap-2">
          {items.map(({ vaccine, dose, details }) => (
            <Disclosure key={`${vaccine}-${dose}`} title={vaccine} compact>
              <p className="m-0">{capitalize(dose)}</p>
              <Details details={details} />
            </Disclosure>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div>
      {heading ? <h4 className="m-0 text-base font-extrabold">{heading}</h4> : null}
      <Paragraphs paragraphs={paragraphs} />
      <Items items={items} />
    </div>
  )
}

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
      <div className="flex items-start gap-3 rounded-2xl border-2 border-brand bg-brand-soft p-4">
        <Construction aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-brand" />
        <div>
          <p className="m-0 font-extrabold">{DEVELOPMENT_NOTICE.title}</p>
          <p className="m-0 mt-1">{DEVELOPMENT_NOTICE.text}</p>
        </div>
      </div>
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
            <Group key={`${stage.id}-${group.heading ?? group.items?.[0]?.vaccine ?? "group"}`} group={group} />
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
            <ul className="m-0 mt-2 list-disc pl-5">
              {stage.toConfirm.map(({ topic, what }) => (
                <li key={topic} className="mt-1 first:mt-0">
                  <strong>{topic}:</strong> {what}
                </li>
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
          <OutLink href={CALENDAR_PDF.url}>Ver el Calendario oficial (PDF)</OutLink>
        </div>
      </section>

    </div>
  )
}
