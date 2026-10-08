import { useEffect, useId, useRef, type KeyboardEvent } from "react"
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
        className="w-full max-w-xs rounded-2xl bg-card p-5 text-ink shadow-[0_12px_32px_rgba(0,0,0,.25)] in-data-[theme=contrast]:ring-2 in-data-[theme=contrast]:ring-control-line"
      >
        <h3 id={titleId} className="m-0 text-lg/tight font-extrabold">
          {title}
        </h3>
        <p className="m-0 mt-1 text-sm text-muted">{message}</p>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onBack}
            className="min-h-10 cursor-pointer rounded-lg bg-field px-3.5 py-1.5 text-sm font-bold text-ink transition-colors hover:bg-brand-soft in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-control-line"
          >
            Seguir editando
          </button>
          <button
            ref={confirmButton}
            type="button"
            onClick={onConfirm}
            className="min-h-10 cursor-pointer rounded-lg bg-brand px-3.5 py-1.5 text-sm font-bold text-on-brand transition-colors hover:bg-brand-dark"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
