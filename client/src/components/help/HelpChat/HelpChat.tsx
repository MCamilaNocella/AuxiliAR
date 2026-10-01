import { useEffect, useId, useRef, type MouseEvent } from "react"
import { X } from "lucide-react"
import { Auxi } from "../Auxi"
import { ChatInput } from "../ChatInput"
import { ChatMessage } from "../ChatMessage"
import { INPUT_PLACEHOLDER } from "./HelpChat.constants"
import type { HelpChatProps } from "./HelpChat.types"
import { useHelpChat } from "./useHelpChat"

/**
 * Chat with Auxi (sketch). Native modal <dialog>: traps focus, closes with Esc and returns focus to Auxi.
 * Full screen on phones; a floating window over Auxi from sm up.
 */
export const HelpChat = ({ open, onClose }: HelpChatProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const logRef = useRef<HTMLOListElement>(null)
  const titleId = useId()
  const { messages, typing, write } = useHelpChat()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Keep the latest message in view
  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [messages, typing, open])

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
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-2">
          <h2 id={titleId} className="m-0 text-lg font-extrabold">
            Chat con Auxi
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar chat"
            className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-field"
          >
            <X aria-hidden="true" className="size-6 stroke-3" />
          </button>
        </header>

        <ol
          ref={logRef}
          role="log"
          aria-label="Conversación con Auxi"
          className="m-0 flex min-h-0 flex-1 list-none flex-col gap-3 overflow-y-auto overscroll-contain p-4"
        >
          {/* Auxi waving on top; the greeting itself is the first message */}
          <li className="flex flex-col items-center gap-2 pb-2 text-center">
            {/* Nudged left: the waving hand fills the left side of the drawing, this centers Auxi's body */}
            <Auxi className="size-24 -translate-x-[10%]" />
            <span className="text-sm text-muted">No reemplazo una consulta médica. En una emergencia, llamá al 107.</span>
          </li>
          {messages.map((message) => (
            <ChatMessage key={message.id} from={message.from}>
              {message.text}
            </ChatMessage>
          ))}
          {typing && (
            <ChatMessage from="auxi">
              <span aria-label="Auxi está escribiendo">…</span>
            </ChatMessage>
          )}
        </ol>

        <ChatInput placeholder={INPUT_PLACEHOLDER} onSend={write} />
      </div>
    </dialog>
  )
}
