import { useState, type FormEvent } from "react"
import { SendHorizontal } from "lucide-react"
import type { ChatInputProps } from "./ChatInput.types"

/** Text field at the bottom of the chat */
export const ChatInput = ({ placeholder, onSend }: ChatInputProps) => {
  const [draft, setDraft] = useState("")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    onSend(text)
    setDraft("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-line p-3">
      <label className="flex h-11 min-w-0 flex-1 items-center rounded-full border border-control-line bg-field px-4 transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand hover:border-brand">
        <span className="sr-only">Escribí tu mensaje</span>
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
          enterKeyHint="send"
          autoComplete="off"
          // At least 16px: prevents iOS from auto-zooming on focus
          className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted"
        />
      </label>
      <button
        type="submit"
        aria-label="Enviar"
        disabled={!draft.trim()}
        className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-full bg-brand text-on-brand transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SendHorizontal aria-hidden="true" className="size-5" />
      </button>
    </form>
  )
}
