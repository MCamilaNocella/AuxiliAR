import { Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { BUTTON_LABELS, COMPLETE_PHRASES, PHRASE_INTERVAL_MS } from "./NextStepBubble.constants"
import type { NextStepBubbleProps } from "./NextStepBubble.types"

/** The complete-profile phrases, one at a time; all share one grid cell so the bubble keeps its size */
const RotatingPhrases = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setIndex((current) => (current + 1) % COMPLETE_PHRASES.length), PHRASE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  return (
    <p className="m-0 grid text-sm/snug">
      {COMPLETE_PHRASES.map(({ lead, bold, heart }, i) => (
        <span key={bold} aria-hidden={i !== index} className={`col-start-1 row-start-1 ${i === index ? "animate-message-in" : "invisible"}`}>
          {lead} <b>{bold}</b>
          {heart && <Heart aria-hidden className="ml-1 inline size-[1em] fill-current align-[-0.125em] text-brand" />}
        </span>
      ))}
    </p>
  )
}

/** Auxi's invitation to add or complete the profile (or, once complete, to keep it up to date), with a button to start */
export const NextStepBubble = ({ step, onStart }: NextStepBubbleProps) => (
  <>
    {step === "update" ? (
      <RotatingPhrases />
    ) : (
      <p className="m-0 text-sm/snug">Conocerte mejor me ayudará a <b>personalizar tu experiencia</b>.</p>
    )}
    {/* Small on purpose; on touch screens an invisible ::before grows the tap area to ~44px tall */}
    <button
      type="button"
      onClick={onStart}
      className="relative mt-2 cursor-pointer rounded-lg bg-brand px-2.5 py-1 text-sm font-bold text-on-brand hover:bg-brand-dark pointer-coarse:before:absolute pointer-coarse:before:-inset-x-1 pointer-coarse:before:-inset-y-2 pointer-coarse:before:content-['']"
    >
      {BUTTON_LABELS[step]}
    </button>
  </>
)
