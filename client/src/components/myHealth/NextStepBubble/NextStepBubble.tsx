import type { NextStepBubbleProps } from "./NextStepBubble.types"

/** Auxi's invitation to complete the profile, with a button to start */
export const NextStepBubble = ({ onStart }: NextStepBubbleProps) => (
  <>
    <p className="m-0 text-sm/snug">Conocerte mejor me ayudará a <b>personalizar tu experiencia</b>.</p>
    {/* Small on purpose; on touch screens an invisible ::before grows the tap area to ~44px tall */}
    <button
      type="button"
      onClick={onStart}
      className="relative mt-2 cursor-pointer rounded-lg bg-brand px-2.5 py-1 text-sm font-bold text-on-brand hover:bg-brand-dark pointer-coarse:before:absolute pointer-coarse:before:-inset-x-1 pointer-coarse:before:-inset-y-2 pointer-coarse:before:content-['']"
    >
      Completar mi perfil
    </button>
  </>
)
