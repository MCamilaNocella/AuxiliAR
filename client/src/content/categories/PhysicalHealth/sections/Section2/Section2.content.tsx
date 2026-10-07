import { useEffect, useRef } from "react"
import { useSearchParams } from "react-router"
import { ActionLink } from "@/components/health/ActionLink"
import { revealEmergencies } from "@/utils/revealEmergencies"
import { CONTROL_TOPICS } from "./Section2.constants"

/** Query param with the open topic: /temas/salud-fisica?seccion=section-2&tema=vacunacion */
const TOPIC_PARAM = "tema"

/**
 * Salud física · Controles de salud. A grid of topics and, below, one block at a time: what to know → orientation →
 * next step. The open topic is in the URL (?tema=), so a link can open it. General orientation, never a diagnosis.
 */
export default function Section2Content() {
  const [searchParams, setSearchParams] = useSearchParams()
  const topic = CONTROL_TOPICS.find(({ id }) => id === searchParams.get(TOPIC_PARAM)) ?? CONTROL_TOPICS[0]
  const headingRef = useRef<HTMLHeadingElement>(null)
  const isFirstRender = useRef(true)

  // Choosing a topic brings its block into view and reads it out (not when the section just opened)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    headingRef.current?.focus()
  }, [topic.id])

  const choose = (id: string) =>
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        next.set(TOPIC_PARAM, id)
        return next
      },
      { replace: true, preventScrollReset: true },
    )

  const [start, ...others] = CONTROL_TOPICS
  const buttonClass = (id: string) =>
    `flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-bold ${
      id === topic.id ? "border-brand bg-brand-soft text-ink" : "border-control-line bg-card text-ink hover:bg-field"
    }`

  return (
    <div className="mt-2 max-w-4xl">
      <p className="m-0 text-muted">Elegí un tema y vas a ver qué necesitás saber, una orientación y el próximo paso.</p>

      <div role="group" aria-label="Temas de controles de salud" className="mt-4 flex flex-col gap-3">
        <button type="button" aria-pressed={start.id === topic.id} onClick={() => choose(start.id)} className={buttonClass(start.id)}>
          <start.icon aria-hidden="true" className="size-6 shrink-0 text-brand" />
          {start.title}
        </button>
        <ul role="list" className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3">
          {others.map(({ id, title, icon: Icon }) => (
            <li key={id}>
              <button type="button" aria-pressed={id === topic.id} onClick={() => choose(id)} className={`${buttonClass(id)} h-full flex-col items-start sm:flex-row sm:items-center`}>
                <Icon aria-hidden="true" className="size-6 shrink-0 text-brand" />
                {title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <section aria-labelledby="control-topic-title" className="mt-6 rounded-2xl border border-line-strong bg-card p-4 sm:p-6">
        <h3 id="control-topic-title" ref={headingRef} tabIndex={-1} className="m-0 flex items-center gap-2 text-xl font-extrabold outline-none">
          <topic.icon aria-hidden="true" className="size-6 shrink-0 text-brand" />
          {topic.title}
        </h3>

        <h4 className="m-0 mt-4 text-base font-extrabold">Qué necesitás saber</h4>
        <p className="m-0 mt-1">{topic.know}</p>

        <h4 className="m-0 mt-4 text-base font-extrabold">Orientación</h4>
        <ul className="m-0 mt-1 list-disc pl-5">
          {topic.guidance.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>

        <h4 className="m-0 mt-4 text-base font-extrabold">Tu próximo paso</h4>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {topic.actions.map(({ label, to, emergency }, index) => (
            <ActionLink key={label} to={to} onClick={emergency ? revealEmergencies : undefined} variant={index === 0 ? "primary" : "secondary"}>
              {label}
            </ActionLink>
          ))}
        </div>
      </section>

      <p className="m-0 mt-4 text-sm text-muted">Esta información es orientativa y no reemplaza la consulta con un equipo de salud.</p>
    </div>
  )
}
