import { useSoftButtons } from "../../useButtonLook"
import type { NextStepBubbleProps } from "./NextStepBubble.types"

/** Auxi's suggestion: the next missing piece of data, with a button to add it */
export const NextStepBubble = ({ next }: NextStepBubbleProps) => {
  const soft = useSoftButtons()
  return (
    <>
      <p className="m-0 text-sm/snug">
        {"Para tu ficha te falta: "}
        <b>{next.replace("Agregar ", "el ")}</b>
      </p>
      <button type="button" className={`mt-2 cursor-pointer ${soft ? "rounded-lg" : "rounded-full"} bg-brand px-3.5 py-1.5 text-sm font-bold text-on-brand hover:bg-brand-dark`}>
        Agregarlo ahora
      </button>
    </>
  )
}
