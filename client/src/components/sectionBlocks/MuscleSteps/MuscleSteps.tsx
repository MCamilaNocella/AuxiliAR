import { useEffect, useRef, useState } from "react"
import { ArrowRight, Dumbbell, Pause, Play, Wind } from "lucide-react"
import { useCalmSwap } from "@/hooks/useCalmSwap"
import { TOOL_BUTTON, TOOL_BUTTON_GHOST, ToolCard } from "../ToolCard"
import type { MuscleStepsProps } from "./MuscleSteps.types"

type Phase = "tense" | "relax"

/** Progressive muscle relaxation with a timer: tense a part, let it go, and on to the next one, with the whole list below */
export const MuscleSteps = ({ steps, tense, relax, before }: MuscleStepsProps) => {
  // -1: before starting; steps.length: done
  const [index, setIndex] = useState(-1)
  const [phase, setPhase] = useState<Phase>("tense")
  const [left, setLeft] = useState(0)
  const [running, setRunning] = useState(false)
  const { swap, fade } = useCalmSwap()
  const state = useRef({ index, phase, left })
  state.current = { index, phase, left }

  const secondsOf = (k: number, p: Phase) => (p === "tense" ? (steps[k]?.[2] ?? tense) : relax)

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      const { index: k, phase: p, left: l } = state.current
      if (l > 1) {
        setLeft(l - 1)
        return
      }
      if (p === "tense") {
        setPhase("relax")
        setLeft(relax)
        return
      }
      if (k + 1 >= steps.length) {
        setRunning(false)
        setIndex(steps.length)
        return
      }
      setIndex(k + 1)
      setPhase("tense")
      setLeft(secondsOf(k + 1, "tense"))
    }, 1000)
    return () => window.clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const start = () =>
    swap(() => {
      setIndex(0)
      setPhase("tense")
      setLeft(secondsOf(0, "tense"))
      setRunning(true)
    })
  const skip = () => {
    if (index + 1 >= steps.length) {
      setRunning(false)
      setIndex(steps.length)
      return
    }
    setIndex(index + 1)
    setPhase("tense")
    setLeft(secondsOf(index + 1, "tense"))
  }

  const active = index >= 0 && index < steps.length
  const seconds = active ? secondsOf(index, phase) : 1
  const step = steps[index]
  return (
    <ToolCard>
      <div key={active ? "run" : index} aria-live="polite" className={`grid justify-items-start gap-2 ${fade}`}>
        {index < 0 && (
          <>
            <h3 className="m-0 text-[1.4rem] font-black">Antes de empezar</h3>
            <ul className="m-0 grid max-w-[34rem] list-disc gap-[0.35rem] pl-[1.2rem] text-ink-soft">
              {before.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        )}
        {index >= steps.length && (
          <>
            <h3 className="m-0 text-[1.4rem] font-black">¡Listo!</h3>
            <p className="m-0">Quedate unos segundos así, respirando tranquilo, y notá cómo se siente el cuerpo.</p>
          </>
        )}
        {active && (
          <>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-[0.8rem] py-[0.3rem] font-black transition-colors duration-500 ease-out motion-reduce:transition-none [&_svg]:size-[1.1em] ${phase === "tense" ? "bg-alert-soft text-alert-text" : "bg-[color-mix(in_srgb,var(--color-success)_16%,var(--color-card))] text-ink"}`}
            >
              <span key={phase} className="inline-flex animate-calm-in items-center gap-2 motion-reduce:animate-none">
                {phase === "tense" ? <Dumbbell aria-hidden="true" /> : <Wind aria-hidden="true" />}
                {phase === "tense" ? "Tensá" : "Soltá y notá la diferencia"}
              </span>
              {" · "}
              <span key={`${index}-${phase}-${left}`} className="animate-calm-in tabular-nums motion-reduce:animate-none">
                {left}
              </span>
              {" s"}
            </span>
            <h3 key={`t-${index}`} className="m-0 animate-calm-in text-[1.6rem] font-black motion-reduce:animate-none">
              {step[0]}
            </h3>
            <p key={`p-${index}-${phase}`} className="m-0 animate-calm-in text-[1.1rem] motion-reduce:animate-none">
              {phase === "tense" ? step[1] : "Aflojá de golpe y dejá que el músculo se suelte."}
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-field">
              <span
                key={`${index}-${phase}`}
                className="block h-full bg-brand transition-[width] duration-1000 ease-linear motion-reduce:transition-none"
                style={{ width: `${Math.round(((seconds - left) / seconds) * 100)}%` }}
              />
            </div>
          </>
        )}
      </div>
      <div key={active ? `nav-${running}` : `nav-${index}`} className={`flex flex-wrap gap-2 ${fade}`}>
        {active ? (
          <>
            <button type="button" onClick={() => swap(() => setRunning(!running))} className={TOOL_BUTTON}>
              {running ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
              {running ? "Pausar" : "Seguir"}
            </button>
            <button type="button" onClick={skip} className={TOOL_BUTTON_GHOST}>
              Saltear
              <ArrowRight aria-hidden="true" />
            </button>
          </>
        ) : (
          <button type="button" onClick={start} className={TOOL_BUTTON}>
            <Play aria-hidden="true" />
            {index < 0 ? "Empezar" : "Hacerlo de nuevo"}
          </button>
        )}
      </div>
      <ol className="m-0 grid list-none gap-1 p-0">
        {steps.map(([part, what], k) => (
          <li
            key={part}
            className={`-mx-2 grid grid-cols-[1.5rem_1fr] gap-1 rounded-xl px-2 py-[0.45rem] transition-colors duration-500 ease-out motion-reduce:transition-none ${k === index ? "bg-brand-soft text-ink" : "text-ink-soft"} ${k < index || index >= steps.length ? "opacity-55" : ""}`}
          >
            <span aria-hidden="true" className={`font-black ${k === index ? "text-brand" : "text-muted"}`}>
              {k + 1}
            </span>
            <span>
              <b className="font-black">{`${part}.`}</b> {what}
            </span>
          </li>
        ))}
      </ol>
    </ToolCard>
  )
}
