import { useEffect, useRef } from "react"
import { useSearchParams } from "react-router"
import { ChevronLeft, ChevronRight, Construction, Info } from "lucide-react"
import { ActionLink } from "@/components/health/ActionLink"
import { OutLink } from "@/components/health/OutLink"
import { centersLink } from "@/router/centersLink"
import { CALENDAR_PDF, DEVELOPMENT_NOTICE, GENERAL_NOTE, STAGE_PAGE_ORDER, TO_CONFIRM_INTRO, VACCINATION_STAGES } from "./Section5.constants"
import type { VaccinationStage, VaccineGroup } from "./Section5.constants"

/** Query param with the open page (the id of its stage): /temas/salud-general?seccion=section-5&etapa=hasta-un-ano */
const STAGE_PARAM = "etapa"

const PAGES: VaccinationStage[] = STAGE_PAGE_ORDER.map((id) => VACCINATION_STAGES.find((stage) => stage.id === id)).filter((stage): stage is VaccinationStage => stage !== undefined)

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

/** The bands of colour of each age, one after the other (like a table by age): the colour only separates them, the text says everything */
const TONES = ["bg-brand-soft", "bg-field", "bg-surface-alt"]

const Details = ({ details }: { details?: string[] }) =>
  details?.length ? (
    <ul className="m-0 mt-1 list-[circle] pl-5 text-ink-soft">
      {details.map((detail) => (
        <li key={detail}>{detail}</li>
      ))}
    </ul>
  ) : null

/**
 * One age of the page: on the left the age, on the right each vaccine with when it is applied and how often (a refuerzo, every 10 years, in each
 * campaign…), as the official calendar says it. A group that is only text (how the triple viral works in 2026, hepatitis B) is a note.
 */
const AgeBand = ({ group, age, tone }: { group: VaccineGroup, age: string, tone: string }) => {
  if (!group.items?.length) {
    return (
      <div className="rounded-2xl border border-line-strong bg-card p-4">
        {group.heading ? <h4 className="m-0 text-base font-extrabold">{group.heading}</h4> : null}
        {group.paragraphs?.map((paragraph) => (
          <p key={paragraph} className="m-0 mt-1 first:mt-0">
            {paragraph}
          </p>
        ))}
      </div>
    )
  }
  return (
    <section className={`${tone} rounded-2xl p-4 sm:grid sm:grid-cols-[9rem_1fr] sm:gap-4`}>
      <h4 className="m-0 text-base font-extrabold sm:text-lg">{age}</h4>
      <div className="mt-2 sm:mt-0">
        {group.paragraphs?.map((paragraph) => (
          <p key={paragraph} className="m-0 mb-2 text-ink-soft">
            {paragraph}
          </p>
        ))}
        <ul role="list" className="m-0 flex list-none flex-col gap-3 p-0">
          {group.items.map(({ vaccine, dose, details }) => (
            <li key={`${vaccine}-${dose}`}>
              <p className="m-0 font-extrabold">{vaccine}</p>
              <p className="m-0">{capitalize(dose)}</p>
              <Details details={details} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Turn the page: previous and next arrows with the number of the page and its title (nothing to choose, no filter by age) */
const Pager = ({ index, onGo }: { index: number, onGo: (index: number) => void }) => {
  const previous = PAGES[index - 1]
  const next = PAGES[index + 1]
  const arrow = "inline-flex min-h-11 cursor-pointer items-center justify-center gap-1 rounded-xl bg-brand px-4 py-2 font-extrabold text-on-brand hover:bg-brand-dark disabled:cursor-default disabled:opacity-40"
  return (
    <nav aria-label="Páginas del calendario de vacunación" className="flex items-center justify-between gap-3">
      <button type="button" onClick={() => onGo(index - 1)} disabled={!previous} aria-label={previous ? `Página anterior: ${previous.title}` : "Página anterior"} className={arrow}>
        <ChevronLeft aria-hidden="true" className="size-5" />
        <span className="max-sm:sr-only">Anterior</span>
      </button>
      <p className="m-0 min-w-0 text-center text-sm text-ink-soft" aria-live="polite">
        {`Página ${index + 1} de ${PAGES.length}`}
      </p>
      <button type="button" onClick={() => onGo(index + 1)} disabled={!next} aria-label={next ? `Página siguiente: ${next.title}` : "Página siguiente"} className={arrow}>
        <span className="max-sm:sr-only">Siguiente</span>
        <ChevronRight aria-hidden="true" className="size-5" />
      </button>
    </nav>
  )
}

/**
 * Salud general · Calendario de vacunación. The Calendario Nacional de Vacunación 2026 as pages by age, from the baby to the older adult: the
 * person turns the page with the arrows (the open page is in the URL, ?etapa=, so a link can open it). Each page lists the ages of its stage and,
 * for each one, the vaccines with when they are applied and how often, in the official words. An informative summary of the official calendar: where the
 * official sources differ or a professional must decide, it says so in ONE short note per page and sends to the official source or the vacunatorio.
 * Doses in ml and routes of administration are not here: they are clinical indications for the vaccinating team. It is not a clinical approval.
 */
export default function Section5Content() {
  const [searchParams, setSearchParams] = useSearchParams()
  const found = PAGES.findIndex(({ id }) => id === searchParams.get(STAGE_PARAM))
  const index = found >= 0 ? found : 0
  const stage = PAGES[index]
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

  const go = (target: number) =>
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        next.set(STAGE_PARAM, PAGES[Math.min(Math.max(target, 0), PAGES.length - 1)].id)
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
          El Calendario Nacional de Vacunación incluye vacunas para todas las etapas de la vida. Pasá las páginas con las flechas, de bebés a personas mayores: en cada una ves las vacunas de esa edad, cuándo se aplican y cada cuánto, según el Ministerio de Salud de la Nación.
        </p>
        <p className="m-0 mt-2 text-muted">Las vacunas del Calendario están disponibles en centros de salud y hospitales públicos de todo el país, son gratuitas y no requieren orden médica.</p>
        <p className="m-0 mt-3 flex items-start gap-2 rounded-2xl border border-line-strong bg-field p-3 text-ink-soft">
          <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand" />
          <span>{GENERAL_NOTE}</span>
        </p>
      </div>

      <Pager index={index} onGo={go} />

      <section aria-labelledby="vaccination-stage-title" className="flex flex-col gap-4">
        <div>
          <p className="m-0 text-sm font-bold text-ink-soft">{`Página ${index + 1} de ${PAGES.length}`}</p>
          <h3 id="vaccination-stage-title" ref={headingRef} tabIndex={-1} className="m-0 text-2xl font-extrabold outline-none">
            {stage.title}
          </h3>
          {stage.intro ? <p className="m-0 mt-2">{stage.intro}</p> : null}
        </div>

        {stage.groups.map((group, position) => (
          <AgeBand key={`${stage.id}-${group.heading ?? group.items?.[0]?.vaccine ?? position}`} group={group} age={group.heading ?? stage.title} tone={TONES[position % TONES.length]} />
        ))}

        {stage.notes?.length ? (
          <ul className="m-0 list-disc pl-5 text-ink-soft">
            {stage.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}

        {stage.toConfirm?.length ? (
          <div role="note" className="rounded-2xl border-2 border-control-line bg-field p-4">
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

      <Pager index={index} onGo={go} />

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
