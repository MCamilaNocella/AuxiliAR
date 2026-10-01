import { Auxi } from "../Auxi"
import type { ChatMessageProps } from "./ChatMessage.types"

/** One chat message: Auxi's on the left with its avatar, the person's on the right in the brand color */
export const ChatMessage = ({ from, children }: ChatMessageProps) =>
  from === "auxi" ? (
    <li className="flex items-start gap-2">
      <span aria-hidden="true" className="flex size-9 flex-none items-center justify-center rounded-full bg-brand-soft">
        <Auxi className="size-8" />
      </span>
      {/* Squared corner next to the avatar, like the design's bubbles */}
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-line-strong bg-surface-alt px-3.5 py-2.5 text-base/snug wrap-break-word">
        <span className="sr-only">Auxi: </span>
        {children}
      </div>
    </li>
  ) : (
    <li className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-brand px-3.5 py-2.5 text-base/snug wrap-break-word text-on-brand">
        <span className="sr-only">Vos: </span>
        {children}
      </div>
    </li>
  )
