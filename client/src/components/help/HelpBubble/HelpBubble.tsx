import { X } from "lucide-react"
import type { HelpBubbleProps } from "./HelpBubble.types"

/** Speech bubble over Auxi's head, like a chat icon. Pops out with an animation (static when reduced motion is on). */
export const HelpBubble = ({ message, onOpen, onClose }: HelpBubbleProps) => (
  <div className="relative w-max max-w-[calc(100vw-5rem)] origin-bottom-right animate-bubble-in rounded-2xl border border-line-strong bg-card px-3.5 py-2 text-ink shadow-lg motion-reduce:animate-none">
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
      className="absolute -top-2 -left-2 flex size-6 cursor-pointer items-center justify-center rounded-md border border-line-strong bg-card text-ink shadow-sm transition-colors hover:bg-field"
    >
      <X aria-hidden="true" className="stroke-3 size-3.5" />
    </button>
    {/* Tail pointing down at Auxi's head */}
    <span
      aria-hidden="true"
      className="absolute right-4 -bottom-1.5 size-3 rotate-45 border-r border-b border-line-strong bg-card"
    />
  </div>
)
