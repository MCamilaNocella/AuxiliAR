import { useEffect, useId, useRef, useState, type MouseEvent } from "react"
import { SquarePen, X } from "lucide-react"
import { ChatConversation } from "../ChatConversation"
import type { HelpChatProps } from "./HelpChat.types"

/**
 * Chat with Auxi (sketch). Native modal <dialog>: traps focus, closes with Esc and returns focus to Auxi.
 * Full screen on phones; a floating window over Auxi from sm up.
 */
export const HelpChat = ({ open, onClose }: HelpChatProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const [conversation, setConversation] = useState(0)
  const [started, setStarted] = useState(false)
  // "Nuevo chat" asks first when there's a conversation to lose
  const [confirming, setConfirming] = useState(false)
  const keepRef = useRef<HTMLButtonElement>(null)

  const startOver = () => {
    setConfirming(false)
    setStarted(false)
    setConversation((current) => current + 1)
  }

  const handleNewChat = () => (started ? setConfirming(true) : startOver())

  // The question takes the focus, on the safe option
  useEffect(() => {
    if (confirming) keepRef.current?.focus()
  }, [confirming])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // A click outside the window (on the backdrop) targets the <dialog> itself
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none translate-y-4 overflow-hidden border-0 bg-card p-0 text-ink opacity-0 shadow-2xl transition-[opacity,translate,display,overlay] transition-discrete duration-200 ease-out backdrop:bg-black/30 open:translate-y-0 open:opacity-100 motion-reduce:transition-none sm:inset-auto sm:right-6 sm:bottom-[calc(var(--bottom-nav-h)+1rem)] sm:h-[min(40rem,calc(100dvh-var(--bottom-nav-h)-2rem))] sm:w-[min(24rem,calc(100vw-3rem))] sm:rounded-2xl sm:border sm:border-line-strong starting:open:translate-y-4 starting:open:opacity-0"
    >
      <div className="flex h-full flex-col">
        {/* With large text on narrow screens the buttons drop to a second row, on the right */}
        <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line px-4 py-2">
          <h2 id={titleId} className="m-0 text-lg font-extrabold">
            Chat con Auxi
          </h2>
          <div className="ml-auto flex flex-none items-center gap-1">
            <button
              type="button"
              onClick={handleNewChat}
              aria-expanded={confirming}
              className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-bold text-ink transition-colors hover:bg-field"
            >
              <SquarePen aria-hidden="true" className="size-4.5 flex-none" />
              Nuevo chat
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar chat"
              className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-field"
            >
              <X aria-hidden="true" className="size-6 stroke-3" />
            </button>
          </div>
        </header>

        {confirming && (
          <div role="alertdialog" aria-label="Empezar un chat nuevo" className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface-alt px-4 py-2">
            <p className="m-0 text-sm font-bold">¿Empezar un chat nuevo? Se borra esta conversación.</p>
            <div className="ml-auto flex gap-2">
              <button
                ref={keepRef}
                type="button"
                onClick={() => setConfirming(false)}
                className="min-h-11 cursor-pointer rounded-full border-2 border-brand bg-card px-4 text-sm font-bold text-brand transition-colors hover:bg-brand-soft"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={startOver}
                className="min-h-11 cursor-pointer rounded-full bg-brand px-4 text-sm font-bold text-on-brand transition-colors hover:bg-brand-dark"
              >
                Sí, empezar
              </button>
            </div>
          </div>
        )}

        {/* A new key = a brand new conversation (messages, history, emergency state) */}
        <ChatConversation key={conversation} onNavigate={onClose} onStartedChange={setStarted} />
      </div>
    </dialog>
  )
}
