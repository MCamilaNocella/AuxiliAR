import { useEffect, useId, useRef } from "react"
import { ConfirmBody } from "@/components/myHealth/ConfirmBody"
import type { ChatConfirmProps } from "./ChatConfirm.types"

/**
 * A yes/no question over a chat, at the top of it, drawn like Mi Salud's confirmations. It covers only the chat
 * (its parent has to be `relative`), not the whole page: the safe option is highlighted and gets the focus,
 * Esc or a tap outside the box is the safe option too.
 */
export const ChatConfirm = ({ title, message, backLabel, confirmLabel, onBack, onConfirm }: ChatConfirmProps) => {
  const id = useId()
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    boxRef.current?.querySelector("button")?.focus()
  }, [])

  return (
    <div className="absolute inset-0 z-10 flex justify-center bg-ink/35 p-3 backdrop-blur-[2px]" onClick={(event) => event.target === event.currentTarget && onBack()}>
      <div
        ref={boxRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-message`}
        onKeyDown={(event) => {
          if (event.key !== "Escape") return
          // Only the question closes, not the chat around it
          event.preventDefault()
          event.stopPropagation()
          onBack()
        }}
        className="h-fit w-full max-w-sm rounded-2xl bg-card text-ink shadow-[0_12px_32px_rgba(0,0,0,.25)] motion-safe:animate-message-in in-data-[theme=contrast]:ring-2 in-data-[theme=contrast]:ring-control-line"
      >
        <ConfirmBody
          titleId={`${id}-title`}
          messageId={`${id}-message`}
          title={title}
          message={message}
          backLabel={backLabel}
          confirmLabel={confirmLabel}
          onBack={onBack}
          onConfirm={onConfirm}
          safeFirst
        />
      </div>
    </div>
  )
}
