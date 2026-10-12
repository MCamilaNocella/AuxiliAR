import { useEffect, useId, useRef, type KeyboardEvent } from "react"
import { ConfirmBody } from "../ConfirmBody"
import type { CardConfirmProps } from "./CardConfirm.types"

/**
 * Small confirmation drawn over a card (the card must be `relative`): a dimmed backdrop and a box with two buttons.
 * Focus starts on the main button and stays inside; Esc goes back.
 */
export const CardConfirm = ({ title, message, confirmLabel, onConfirm, onBack }: CardConfirmProps) => {
  const titleId = useId()
  const box = useRef<HTMLDivElement>(null)
  const confirmButton = useRef<HTMLButtonElement>(null)

  useEffect(() => confirmButton.current?.focus(), [])

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation()
      onBack()
    }
    // Keep Tab cycling between the two buttons
    if (event.key === "Tab") {
      const buttons = [...(box.current?.querySelectorAll("button") ?? [])]
      const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
      const next = buttons[(index + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length]
      event.preventDefault()
      next?.focus()
    }
  }

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink/35 p-4 backdrop-blur-[2px]">
      <div
        ref={box}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        className="w-full max-w-xs rounded-2xl bg-card text-ink shadow-[0_12px_32px_rgba(0,0,0,.25)] in-data-[theme=contrast]:ring-2 in-data-[theme=contrast]:ring-control-line"
      >
        <ConfirmBody
          titleId={titleId}
          title={title}
          message={message}
          backLabel="Seguir editando"
          confirmLabel={confirmLabel}
          onBack={onBack}
          onConfirm={onConfirm}
          confirmRef={confirmButton}
        />
      </div>
    </div>
  )
}
