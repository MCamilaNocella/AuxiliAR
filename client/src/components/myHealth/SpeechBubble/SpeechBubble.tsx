import type { SpeechBubbleProps } from "./SpeechBubble.types"

/** Auxi's speech bubble: light, with a tail pointing right (where Auxi is) */
export const SpeechBubble = ({ children, className = "" }: SpeechBubbleProps) => (
  <div className={`relative rounded-2xl border border-control-line bg-card px-4 py-3 text-ink shadow-[0_6px_20px_rgba(0,0,0,.18)] ${className}`}>
    {children}
    <span
      aria-hidden="true"
      className="absolute top-1/2 -right-[0.47rem] size-3.5 -translate-y-1/2 rotate-45 border-t border-r border-control-line bg-card"
    />
  </div>
)
