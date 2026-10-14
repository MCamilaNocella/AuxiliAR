import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"
import { useCalmSwap } from "@/hooks/useCalmSwap"
import { StepDots } from "../StepDots"
import { TOOL_BUTTON, TOOL_BUTTON_GHOST, ToolCard } from "../ToolCard"
import type { GroundingStepsProps } from "./GroundingSteps.types"

/** A grounding exercise one step at a time: the bars light up, the step fades in, and some steps have circles to tap */
export const GroundingSteps = ({ steps }: GroundingStepsProps) => {
  const [index, setIndex] = useState(0)
  const [ticks, setTicks] = useState(0)
  const { swap, fade } = useCalmSwap()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const moved = useRef(false)

  useEffect(() => {
    if (moved.current) titleRef.current?.focus({ preventScroll: true })
  }, [index])

  const go = (to: number) => {
    moved.current = true
    swap(() => {
      setIndex(to)
      setTicks(0)
    })
  }

  const step = steps[index]
  const last = index === steps.length - 1
  return (
    <ToolCard>
      <StepDots total={steps.length} done={index + 1} />
      <div key={index} aria-live="polite" className={`grid min-h-36 content-start gap-2.5 ${fade}`}>
        <span className="text-[0.8rem] font-extrabold tracking-[0.05em] text-brand uppercase">{`Paso ${index + 1} de ${steps.length}`}</span>
        <h3 ref={titleRef} tabIndex={-1} className="m-0 text-[1.6rem] leading-[1.15] font-black outline-none">
          {step.title}
        </h3>
        <p className="m-0 text-[1.1rem] text-ink-soft">{step.text}</p>
        {step.count && (
          <>
            <p className="m-0 text-[0.925rem] text-ink-soft">Tocá un círculo por cada cosa que encontrás.</p>
            <ul className="m-0 flex list-none flex-wrap gap-[0.4rem] p-0">
              {Array.from({ length: step.count }, (_, k) => (
                <li key={k}>
                  <button
                    type="button"
                    aria-pressed={k < ticks}
                    aria-label={`Cosa ${k + 1}`}
                    onClick={() => setTicks(k + 1)}
                    className="size-11 cursor-pointer rounded-lg border-2 border-control-line bg-card font-black text-ink transition-colors duration-300 ease-out aria-pressed:border-brand aria-pressed:bg-brand aria-pressed:text-on-brand motion-reduce:transition-none"
                  >
                    {k + 1}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div key={`nav-${index}`} className={`flex flex-wrap gap-2 ${fade}`}>
        <button type="button" disabled={index === 0} onClick={() => go(index - 1)} className={TOOL_BUTTON_GHOST}>
          <ArrowLeft aria-hidden="true" />
          Anterior
        </button>
        {last ? (
          <button type="button" onClick={() => go(0)} className={TOOL_BUTTON}>
            <RotateCcw aria-hidden="true" />
            Empezar de nuevo
          </button>
        ) : (
          <button type="button" onClick={() => go(index + 1)} className={TOOL_BUTTON}>
            Siguiente
            <ArrowRight aria-hidden="true" />
          </button>
        )}
      </div>
    </ToolCard>
  )
}
