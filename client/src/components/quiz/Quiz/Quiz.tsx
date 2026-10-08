import { useEffect, useId, useRef, useState } from "react"
import { CheckCircle2, CircleHelp, RotateCcw } from "lucide-react"
import { ActionLink } from "@/components/health/ActionLink"
import { advance, correctCount, currentQuestion, missedQuestions, pickOption, progressPercent, startQuiz } from "@/utils/quiz/quiz"
import type { QuizAction, QuizQuestion } from "@/utils/quiz/quiz"
import { revealEmergencies } from "@/utils/revealEmergencies"

type QuizProps = {
  questions: QuizQuestion[]
  /** Where to go when it ends: back to the section's category, and a real next step */
  exits: { label: string, to: string }[]
}

const Action = ({ action }: { action: QuizAction }) => (
  <ActionLink to={action.to} onClick={action.emergency ? revealEmergencies : undefined} variant="secondary">
    {action.label}
  </ActionLink>
)

const solidButton =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-control-line bg-brand px-4 py-2 font-extrabold text-on-brand hover:bg-brand-dark"

/**
 * Educational quiz: one situation per screen, big options, immediate feedback that explains why (also when the answer
 * isn't the expected one), and a final review of what was learned, with a way to go over what was missed.
 * Focus goes to the question when it changes and to the feedback once answered, so screen reader and keyboard users
 * follow it; the feedback is also a polite live region.
 */
export const Quiz = ({ questions, exits }: QuizProps) => {
  const [state, setState] = useState(() => startQuiz(questions))
  const headingId = useId()
  const questionRef = useRef<HTMLHeadingElement>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLHeadingElement>(null)
  const question = currentQuestion(state)
  const answered = state.picked !== null

  // New question or end of the round: focus goes there (not on the first render, so opening the section keeps focus where it was)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    ;(state.finished ? resultRef.current : questionRef.current)?.focus()
  }, [state.index, state.finished, state.round])

  useEffect(() => {
    if (answered) feedbackRef.current?.focus()
  }, [answered])

  const percent = progressPercent(state)
  const progress = (
    <div className="mb-5">
      <p className="m-0 mb-1 font-bold">{state.finished ? "Terminaste" : `Situación ${state.index + 1} de ${state.round.length}`}</p>
      <div
        role="progressbar"
        aria-label="Progreso del quiz"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="h-3 overflow-hidden rounded-full border border-control-line bg-field"
      >
        <div className="h-full bg-brand transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )

  if (state.finished) {
    const missed = missedQuestions(state)
    const total = state.round.length
    const correct = correctCount(state)
    return (
      <div className="mt-4 max-w-2xl">
        {progress}
        <h3 ref={resultRef} tabIndex={-1} className="m-0 text-xl font-extrabold outline-none">
          Esto es lo que te llevás
        </h3>
        <p className="m-0 mt-1 text-muted">
          {missed.length === 0
            ? `Respondiste bien las ${total} situaciones. ¡Muy bien!`
            : `Respondiste bien ${correct} de ${total}. Lo importante es lo que aprendiste, no el puntaje.`}
        </p>
        <ul role="list" className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
          {state.round.map((item) => {
            const wasMissed = missed.some(({ id }) => id === item.id)
            return (
              <li key={item.id} className="rounded-xl border border-line-strong bg-card p-4">
                <p className="m-0 text-sm font-extrabold text-muted">
                  {item.topic}
                  {wasMissed && " · para repasar"}
                </p>
                <p className="m-0 mt-1">{item.learning}</p>
              </li>
            )
          })}
        </ul>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {missed.length > 0 && (
            <button type="button" onClick={() => setState(startQuiz(missed))} className={solidButton}>
              <RotateCcw aria-hidden="true" className="size-4" />
              Repasar lo que me costó
            </button>
          )}
          <button
            type="button"
            onClick={() => setState(startQuiz(questions))}
            className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-control-line bg-field px-4 py-2 font-extrabold"
          >
            Empezar de nuevo
          </button>
          {exits.map(({ label, to }) => (
            <ActionLink key={to} to={to}>
              {label}
            </ActionLink>
          ))}
        </div>
      </div>
    )
  }

  const picked = question.options.find(({ id }) => id === state.picked)

  return (
    <div className="mt-4 max-w-2xl">
      {progress}
      <p className="m-0 mb-1 flex items-center gap-1.5 text-sm font-extrabold text-brand">
        <CircleHelp aria-hidden="true" className="size-4" />
        {question.format}
      </p>
      <h3 ref={questionRef} id={headingId} tabIndex={-1} className="m-0 text-xl font-extrabold outline-none">
        {question.prompt}
      </h3>

      <ul role="list" aria-labelledby={headingId} className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
        {question.options.map((option) => {
          const isPicked = option.id === state.picked
          const showCorrect = answered && option.correct
          const style = showCorrect
            ? "border-brand bg-brand-soft text-ink"
            : isPicked
              ? "border-control-line bg-surface-alt text-ink"
              : "border-control-line bg-card text-ink hover:bg-field"
          return (
            <li key={option.id}>
              <button
                type="button"
                disabled={answered}
                aria-pressed={isPicked}
                onClick={() => setState((previous) => pickOption(previous, option.id))}
                className={`flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-base font-semibold disabled:cursor-default ${style}`}
              >
                <span className="flex-1">{option.text}</span>
                {showCorrect && (
                  <span className="inline-flex shrink-0 items-center gap-1 font-extrabold text-brand">
                    <CheckCircle2 aria-hidden="true" className="size-5" />
                    Respuesta correcta
                  </span>
                )}
                {isPicked && !option.correct && <span className="shrink-0 font-extrabold text-muted">Tu respuesta</span>}
              </button>
            </li>
          )
        })}
      </ul>

      <div ref={feedbackRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
        {answered && picked && (
          <div className="mt-5 rounded-2xl border border-line-strong bg-card p-4">
            <p className="m-0 text-lg font-extrabold">{picked.correct ? "¡Eso es!" : "Casi. Mirá por qué:"}</p>
            <p className="m-0 mt-1">{picked.feedback}</p>
            {/* The right answer's feedback already says why; for any other one, the reason is added */}
            {!picked.correct && <p className="m-0 mt-2">{question.why}</p>}
            {question.action && (
              <div className="mt-3">
                <Action action={question.action} />
              </div>
            )}
            <div className="mt-4">
              <button type="button" onClick={() => setState((previous) => advance(previous))} className={solidButton}>
                {state.index === state.round.length - 1 ? "Ver lo que aprendí" : "Siguiente situación"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
