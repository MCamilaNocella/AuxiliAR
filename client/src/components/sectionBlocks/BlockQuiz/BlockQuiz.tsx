import { useEffect, useRef, useState } from "react"
import { ArrowRight, Check, Lightbulb, RotateCcw, X } from "lucide-react"
import { Auxi } from "@/components/help/Auxi"
import { CONTRAST_OUTLINE } from "@/utils/contrastOutline"
import type { BlockQuizProps } from "./BlockQuiz.types"

const SHADOW = "shadow-[0_1px_2px_rgb(60_30_30/0.06),0_0.5rem_1.5rem_-0.75rem_rgb(60_30_30/0.18)] in-data-[theme=contrast]:shadow-none in-data-[theme=dark]:shadow-[0_1px_2px_rgb(0_0_0/0.3),0_0.5rem_1.5rem_-0.75rem_rgb(0_0_0/0.6)]"
const BUTTON = "inline-flex min-h-11 cursor-pointer items-center gap-2 justify-self-start rounded-[0.9rem] border-0 bg-brand px-4 py-2 font-extrabold text-on-brand hover:bg-brand-dark"
const LETTERS = "ABCDEFGH"

/** A quiz as the category models: one situation at a time, the options, why the answer is right and what to remember, and a score at the end */
export const BlockQuiz = ({ questions, cheer = "¡Vamos! Elegí la opción que te parezca.", endText = "Ya sabés mejor dónde ir y cómo cuidarte. Podés repetirlo cuando quieras." }: BlockQuizProps) => {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState<number | null>(null)
  const focusRef = useRef<HTMLElement | null>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (!started.current) return
    if (answered !== null) nextRef.current?.focus()
    else focusRef.current?.focus()
  }, [index, answered])

  const answer = (option: number) => {
    started.current = true
    setAnswered(option)
    if (questions[index].options[option].correct) setScore((s) => s + 1)
  }
  const next = () => {
    setAnswered(null)
    setIndex((i) => i + 1)
  }
  const restart = () => {
    setScore(0)
    setAnswered(null)
    setIndex(0)
  }

  const done = index >= questions.length
  const question = questions[index]
  return (
    <div className={`grid grid-cols-[minmax(0,1fr)] gap-5 rounded-3xl bg-card p-5 sm:p-6 min-[56rem]:grid-cols-[minmax(0,1fr)_13rem] min-[56rem]:items-start ${SHADOW} ${CONTRAST_OUTLINE}`}>
      <div>
        {done ? (
          <div
            ref={(element) => {
              focusRef.current = element
            }}
            tabIndex={-1}
            className="grid justify-items-start gap-2 outline-none"
          >
            <p className="m-0">
              <b className="text-5xl font-black text-brand">{score}</b> de {questions.length}
            </p>
            <h3 className="m-0 text-2xl font-black">{score === questions.length ? "¡Perfecto!" : score >= questions.length / 2 ? "¡Muy bien!" : "¡Buen comienzo!"}</h3>
            <p className="m-0">{endText}</p>
            <button type="button" onClick={restart} className={BUTTON}>
              <RotateCcw aria-hidden="true" className="size-[1.25em]" />
              Empezar de nuevo
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-between gap-x-2 text-[0.85rem] font-extrabold tracking-[0.05em] text-muted uppercase">
              <span>{`Pregunta ${index + 1} de ${questions.length}`}</span>
              <span className="text-brand">{question.topic}</span>
            </div>
            <div role="progressbar" aria-label="Avance del quiz" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={index} className="mt-2 mb-4 h-2 overflow-hidden rounded-full bg-field">
              <span className="block h-full rounded-full bg-brand transition-[width] duration-400 motion-reduce:transition-none" style={{ width: `${(index / questions.length) * 100}%` }} />
            </div>
            <h3
              ref={(element) => {
                focusRef.current = element
              }}
              tabIndex={-1}
              className="m-0 text-xl leading-[1.3] font-black outline-none"
            >
              {question.prompt}
            </h3>
            <ul className="m-0 mt-4 grid list-none gap-2 p-0">
              {question.options.map((option, k) => {
                const state = answered === null ? "" : option.correct ? "correct" : answered === k ? "wrong" : "dim"
                return (
                  <li key={option.text}>
                    <button
                      type="button"
                      disabled={answered !== null}
                      onClick={() => answer(k)}
                      className={`flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-2xl border bg-surface px-[0.9rem] py-[0.6rem] text-left font-bold text-ink enabled:hover:border-brand enabled:hover:bg-brand-soft disabled:cursor-default ${state === "correct" ? "border-success" : state === "wrong" ? "border-alert-text" : "border-line-strong"} ${state === "dim" ? "opacity-60" : ""}`}
                    >
                      <span className={`flex size-8 shrink-0 items-center justify-center rounded-[0.7rem] font-black ${state === "correct" ? "bg-success text-surface" : state === "wrong" ? "bg-alert text-on-alert" : "bg-field"}`}>
                        {state === "correct" ? <Check aria-hidden="true" className="size-[1.25em]" /> : state === "wrong" ? <X aria-hidden="true" className="size-[1.25em]" /> : LETTERS[k]}
                      </span>
                      <span className="min-w-0 [overflow-wrap:anywhere]">{option.text}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
            {answered !== null && (
              <div role="status" className="mt-4 grid gap-2 rounded-[1.1rem] bg-field px-[1.1rem] py-4">
                <p className={`m-0 text-[1.1rem] font-black ${question.options[answered].correct ? "text-success" : ""}`}>{question.options[answered].correct ? "¡Bien!" : "Casi"}</p>
                <p className="m-0">{question.options[answered].feedback}</p>
                <p className="m-0 flex gap-2 border-t border-line-strong pt-2 font-bold">
                  <Lightbulb aria-hidden="true" className="mt-[0.15rem] size-[1.25em] shrink-0 text-brand" />
                  <span>{question.learning}</span>
                </p>
                <button ref={nextRef} type="button" onClick={next} className={BUTTON}>
                  {index + 1 < questions.length ? "Siguiente" : "Ver resultado"}
                  <ArrowRight aria-hidden="true" className="size-[1.25em]" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <aside className="hidden flex-col items-center gap-3 text-center min-[56rem]:flex">
        <Auxi className="w-32" />
        <p className={`relative m-0 max-w-[32rem] rounded-[1.25rem_1.25rem_1.25rem_0.35rem] border border-line-strong bg-card px-4 py-3 text-[0.95rem] ${SHADOW}`}>{cheer}</p>
      </aside>
    </div>
  )
}
