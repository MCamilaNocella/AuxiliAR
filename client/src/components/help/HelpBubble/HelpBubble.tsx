import { X } from "lucide-react"
import type { HelpBubbleProps } from "./HelpBubble.types"

/** Speech bubble next to Auxi. Pops out with an animation (static when reduced motion is on). */
export const HelpBubble = ({ message, onOpen, onClose }: HelpBubbleProps) => (
  <div className="relative max-w-[calc(100vw-6.25rem)] min-w-0 origin-right animate-bubble-in rounded-2xl border border-line-strong bg-card px-4 py-2.5 text-ink shadow-lg motion-reduce:animate-none">
    {/* Tapping the text also opens the chat; keyboard users reach the same action through Auxi's button */}
    <button
      type="button"
      onClick={onOpen}
      tabIndex={-1}
      aria-hidden="true"
      className="cursor-pointer text-left text-base/snug font-bold wrap-break-word"
    >
      {message}
    </button>
    {/* Close button as a corner badge, so the message gets the full bubble width */}
    <button
      type="button"
      onClick={onClose}
      aria-label="Cerrar mensaje"
      className="absolute -top-2.5 -left-2.5 flex size-7 cursor-pointer items-center justify-center rounded-full border border-line-strong bg-card text-ink shadow-sm transition-colors hover:bg-field"
    >
      <X aria-hidden="true" className="size-4" />
    </button>
    {/* Tail pointing at Auxi */}
    <span
      aria-hidden="true"
      className="absolute top-1/2 -right-1.5 size-3 -translate-y-1/2 rotate-45 border-t border-r border-line-strong bg-card"
    />
  </div>
)
