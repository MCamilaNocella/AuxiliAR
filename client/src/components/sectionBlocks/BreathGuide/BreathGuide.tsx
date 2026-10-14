import { useEffect, useRef, useState } from "react"
import { Pause, Play, RotateCcw } from "lucide-react"
import { Auxi } from "@/components/help/Auxi"
import { useCalmSwap } from "@/hooks/useCalmSwap"
import { StepDots } from "../StepDots"
import { TOOL_BUTTON, TOOL_BUTTON_GHOST, TOOL_TOGGLE, ToolCard } from "../ToolCard"
import { BALL, FLOATER, HAPPY_FACE_PATHS, HAPPY_SMILE, MINUTES, MINUTES_MODE } from "./BreathGuide.constants"
import type { BreathGuideProps } from "./BreathGuide.types"

type State = "idle" | "run" | "pause" | "end"
type Look = "burbuja" | "auxi"

const BubbleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M8 9a4 4 0 0 1 3-3" strokeLinecap="round" />
  </svg>
)
const BalloonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <ellipse cx="12" cy="8" rx="5" ry="6" />
    <path d="M12 14c-2 3 2 5 0 8" />
  </svg>
)
const LOOKS: [Look, string, () => React.JSX.Element][] = [
  ["burbuja", "Burbuja", BubbleIcon],
  ["auxi", "Auxi", BalloonIcon],
]

/** Auxi holding a balloon that grows while you breathe in, with the count inside the balloon */
const AuxiBalloon = ({ count, idle, open, seconds }: { count: string, idle: boolean, open: boolean, seconds: number }) => (
  <svg viewBox="0 0 200 200" className="absolute inset-0 size-full overflow-visible">
    <defs>
      <linearGradient id="breath-balloon" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" className="[stop-color:var(--category-light)] in-data-[theme=dark]:[stop-color:#a9b6ff]" />
        <stop offset="1" className="[stop-color:var(--category-mid)] in-data-[theme=dark]:[stop-color:#6d7ff0]" />
      </linearGradient>
    </defs>
    <path d="M62 104c-4 10 14 14 10 22s18 8 26 13" fill="none" strokeWidth="1.4" strokeLinecap="round" className="stroke-muted" />
    <g className="origin-bottom transition-transform ease-in-out [transform-box:fill-box] motion-reduce:transition-none" style={{ transform: `scale(${open ? 1 : 0.6})`, transitionDuration: `${seconds}s` }}>
      <path
        d="M62 8C38 8 22 26 22 48c0 24 22 44 36 50l-3 6h14l-3-6c14-6 36-26 36-50C102 26 86 8 62 8z"
        fill="url(#breath-balloon)"
        fillOpacity="0.72"
        strokeWidth="1.2"
        className="stroke-white/70 in-data-[theme=dark]:stroke-white/35 in-data-[theme=contrast]:fill-black in-data-[theme=contrast]:stroke-[#ff0] in-data-[theme=contrast]:[fill-opacity:1] in-data-[theme=contrast]:[stroke-width:3]"
      />
      <ellipse cx="42" cy="28" rx="3.5" ry="6.5" transform="rotate(-25 42 28)" fill="#fff" opacity="0.75" />
      <text x="62" y="56" textAnchor="middle" dominantBaseline="middle" className={`fill-[#f5f5f5] font-black tabular-nums in-data-[theme=contrast]:fill-[#ff0] ${idle ? "text-[15px]" : "text-[34px]"}`}>
        {count}
      </text>
    </g>
    <Auxi
      still
      frame={{ x: 78, y: 86, width: 112, height: 112 }}
      className="text-ink-soft"
      face={
        <g transform="translate(63.1 57.8) rotate(9.67) scale(0.869) translate(-23 -43.4)" fill="none" stroke="#a8022a" strokeWidth="2.7" strokeLinecap="round">
          {HAPPY_FACE_PATHS.map((d) => (
            <path key={d} d={d} />
          ))}
          <path d={HAPPY_SMILE} strokeWidth="3" />
        </g>
      }
    />
  </svg>
)

/** Guided breathing: before starting it says what to do; while running, the cycle, the step and the count in the bubble (or Auxi's balloon) */
export const BreathGuide = ({ exercises, pick }: BreathGuideProps) => {
  const ids = Object.keys(exercises)
  const [mode, setMode] = useState(ids[0])
  const [look, setLook] = useState<Look>("burbuja")
  const [state, setState] = useState<State>("idle")
  const [cycle, setCycle] = useState(0)
  const [phase, setPhase] = useState(0)
  const [left, setLeft] = useState(0)
  const card = useCalmSwap()
  const viz = useCalmSwap()
  const now = useRef({ mode, cycle, phase, left })
  now.current = { mode, cycle, phase, left }

  const exercise = exercises[mode]
  const minutes = mode === MINUTES_MODE
  const total = minutes ? MINUTES : exercise.cycles
  const done = minutes ? Math.floor((cycle * 10) / 60) : cycle

  useEffect(() => {
    if (state !== "run") return
    const timer = window.setInterval(() => {
      const { mode: m, cycle: c, phase: p, left: l } = now.current
      if (l > 1) {
        setLeft(l - 1)
        return
      }
      const phases = exercises[m].phases
      const nextPhase = (p + 1) % phases.length
      const nextCycle = nextPhase === 0 ? c + 1 : c
      if (nextCycle >= exercises[m].cycles) {
        setState("end")
        setCycle(0)
        setPhase(0)
        return
      }
      setCycle(nextCycle)
      setPhase(nextPhase)
      setLeft(phases[nextPhase][1])
    }, 1000)
    return () => window.clearInterval(timer)
  }, [state, exercises])

  const chooseMode = (id: string) => {
    if (id === mode) return
    card.swap(() => {
      setMode(id)
      setState("idle")
    })
  }

  // A summary cell (e.g. "Respiración lenta") opens its exercise here
  const lastPick = useRef(pick?.at)
  useEffect(() => {
    if (!pick || pick.at === lastPick.current) return
    lastPick.current = pick.at
    chooseMode(pick.mode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pick])

  const play = () =>
    card.swap(() => {
      if (state === "idle" || state === "end") {
        setCycle(0)
        setPhase(0)
        setLeft(exercise.phases[0][1])
      }
      setState("run")
    })

  const current = exercise.phases[phase]
  const active = state === "run" || state === "pause"
  const open = active && current[2] !== "out"
  const label = state === "idle" ? "Antes de empezar" : state === "end" ? "Listo" : minutes ? `Minuto ${done + 1} de ${MINUTES}` : `Ciclo ${cycle + 1} de ${exercise.cycles}`
  const count = state === "idle" ? exercise.phases.map(([, seconds]) => seconds).join("·") : state === "end" ? "✓" : String(left)

  return (
    <>
      <p className="m-0 pt-2">{exercise.lead}</p>
      <ToolCard className="[--b:var(--category-light)] in-data-[theme=dark]:[--b:#8ea0ff] sm:grid-cols-[auto_1fr] sm:items-center sm:gap-x-8">
        <div className="flex flex-wrap justify-between gap-2 sm:col-span-full">
          <div role="group" aria-label="Ejercicio" className="flex flex-wrap gap-[0.4rem]">
            {ids.map((id) => (
              <button key={id} type="button" aria-pressed={id === mode} onClick={() => chooseMode(id)} className={TOOL_TOGGLE}>
                <span className="max-sm:hidden">{exercises[id].name}</span>
                <span className="sm:hidden">{exercises[id].short}</span>
              </button>
            ))}
          </div>
          <div role="group" aria-label="Cómo verlo" className="flex flex-wrap gap-[0.4rem]">
            {LOOKS.map(([id, name, Icon]) => (
              <button key={id} type="button" aria-pressed={id === look} onClick={() => id !== look && viz.swap(() => setLook(id))} className={TOOL_TOGGLE}>
                <Icon />
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-full">
          <StepDots total={total} done={state === "idle" ? 0 : state === "end" ? total : done + 1} />
        </div>
        <div key={look} aria-hidden="true" className={`relative grid aspect-square w-36 place-items-center justify-self-center sm:w-42 ${viz.fade}`}>
          {look === "auxi" ? (
            <AuxiBalloon count={count} idle={state === "idle"} open={open} seconds={current[1]} />
          ) : (
            <>
              <span className={FLOATER} style={{ width: "18%", height: "18%", right: "-4%", top: "4%" }} />
              <span className={FLOATER} style={{ width: "11%", height: "11%", left: 0, bottom: "6%", animationDelay: "-2.5s" }} />
              <span className={BALL} style={{ transform: `scale(${open ? 1 : 0.5})`, transitionDuration: `${current[1]}s` }} />
              <span
                key={count}
                className={`relative animate-calm-in font-black text-(--category-mid) tabular-nums motion-reduce:animate-none in-data-[theme=contrast]:text-[#ff0] in-data-[theme=dark]:text-[#f5f5f5] ${state === "idle" ? "text-[0.95rem]" : "text-2xl sm:text-[2rem]"}`}
              >
                {count}
              </span>
            </>
          )}
        </div>
        <div key={`${mode}-${state}`} aria-live="polite" className={`grid content-start gap-2.5 ${card.fade}`}>
          <span key={label} className="animate-calm-in text-[0.8rem] font-extrabold tracking-[0.05em] text-brand uppercase motion-reduce:animate-none">
            {label}
          </span>
          {state === "idle" && (
            <>
              <h3 className="m-0 text-[1.6rem] leading-[1.15] font-black">{exercise.name}</h3>
              <ul className="m-0 grid list-disc gap-[0.3rem] pl-[1.2rem] text-ink-soft">
                {exercise.before.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
          {state === "end" && (
            <>
              <h3 className="m-0 text-[1.6rem] leading-[1.15] font-black">¡Muy bien!</h3>
              <p className="m-0 text-[1.1rem] text-ink-soft">Terminaste. ¿Cómo te sentís? Podés repetirlo cuando quieras.</p>
            </>
          )}
          {active && (
            <>
              <h3 key={`h-${phase}`} className="m-0 animate-calm-in text-[1.6rem] leading-[1.15] font-black motion-reduce:animate-none">
                {current[0]}
              </h3>
              <p key={`p-${phase}`} className="m-0 animate-calm-in text-[1.1rem] text-ink-soft motion-reduce:animate-none">{`Contá despacio hasta ${current[1]}.`}</p>
            </>
          )}
        </div>
        <div key={`nav-${mode}-${state}`} className={`flex flex-wrap gap-2 sm:col-span-full ${card.fade}`}>
          {state === "run" ? (
            <button type="button" onClick={() => card.swap(() => setState("pause"))} className={TOOL_BUTTON}>
              <Pause aria-hidden="true" />
              Pausar
            </button>
          ) : (
            <button type="button" onClick={play} className={TOOL_BUTTON}>
              <Play aria-hidden="true" />
              {state === "pause" ? "Seguir" : state === "end" ? "Hacerlo de nuevo" : "Empezar"}
            </button>
          )}
          {active && (
            <button type="button" onClick={() => card.swap(() => setState("idle"))} className={TOOL_BUTTON_GHOST}>
              <RotateCcw aria-hidden="true" />
              Reiniciar
            </button>
          )}
        </div>
        <p className="m-0 text-[0.925rem] text-ink-soft sm:col-span-full">{exercise.note}</p>
      </ToolCard>
    </>
  )
}
