import type { SpeechBubbleProps } from "./SpeechBubble.types"

/** Auxi's speech bubble (light, with a tail pointing to Auxi on the given side) */
export const SpeechBubble = ({ children, tail = "right", className = "" }: SpeechBubbleProps) => (
  <div className={`relative rounded-2xl border border-control-line bg-card px-4 py-3 text-ink shadow-[0_6px_20px_rgba(0,0,0,.18)] ${className}`}>
    {children}
    <span
      aria-hidden="true"
      className={`absolute size-3.5 rotate-45 border-control-line bg-card ${
        tail === "right"
          ? "top-1/2 -right-[0.47rem] -translate-y-1/2 border-t border-r"
          : tail === "left"
            ? "top-1/2 -left-[0.47rem] -translate-y-1/2 border-b border-l"
            : "-bottom-[0.47rem] right-8 border-r border-b"
      }`}
    />
  </div>
)
