import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { SendHorizontal } from "lucide-react"
import type { ChatInputProps } from "./ChatInput.types"
import { useZoneSuggestions } from "./useZoneSuggestions"

/**
 * Text field at the bottom of the chat: writing is always possible.
 * With `suggestZones` it's a combobox: places show above it, ↑ ↓ + Enter or a tap sends one, Esc hides them.
 */
export const ChatInput = ({ placeholder, inputMode, busy = false, suggestZones = false, onSend }: ChatInputProps) => {
  const listboxId = useId()
  const listRef = useRef<HTMLUListElement>(null)
  const [draft, setDraft] = useState("")
  const [dismissed, setDismissed] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const zones = useZoneSuggestions(suggestZones ? draft : "")
  const suggestions = dismissed === draft ? [] : zones
  const open = suggestions.length > 0
  const activeZone = suggestions[activeIndex]

  // Keep the highlighted place visible when the list scrolls
  useEffect(() => {
    if (activeIndex >= 0) listRef.current?.children[activeIndex]?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  const send = (text: string) => {
    onSend(text)
    setDraft("")
    setActiveIndex(-1)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = (activeZone ?? draft).trim()
    if (text && !busy) send(text)
  }

  // Esc closes the list instead of the chat
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      const delta = event.key === "ArrowDown" ? 1 : -1
      setActiveIndex((current) => (current + delta + suggestions.length) % suggestions.length)
    } else if (event.key === "Escape") {
      event.preventDefault()
      setDismissed(draft)
      setActiveIndex(-1)
    }
  }

  return (
    <div className="border-t border-line">
      {open && (
        <ul ref={listRef} id={listboxId} role="listbox" aria-label="Zonas sugeridas" className="m-0 list-none p-1">
          {suggestions.map((zone, index) => (
            <li
              key={zone}
              id={`${listboxId}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onClick={() => !busy && send(zone)}
              className="flex min-h-11 cursor-pointer items-center rounded-lg px-3 text-base hover:bg-field aria-selected:bg-brand-soft"
            >
              {zone}
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3">
        <label className="flex h-11 min-w-0 flex-1 items-center rounded-full border border-control-line bg-field px-4 transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand hover:border-brand">
          <span className="sr-only">Escribí tu mensaje</span>
          <input
            type="text"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value)
              setActiveIndex(-1)
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            inputMode={inputMode}
            enterKeyHint="send"
            autoComplete="off"
            {...(suggestZones && {
              role: "combobox",
              "aria-autocomplete": "list" as const,
              "aria-expanded": open,
              "aria-controls": listboxId,
              "aria-activedescendant": activeZone ? `${listboxId}-${activeIndex}` : undefined,
            })}
            // At least 16px: prevents iOS from auto-zooming on focus
            className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted"
          />
        </label>
        <button
          type="submit"
          aria-label="Enviar"
          disabled={!draft.trim() || busy}
          className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-full bg-brand text-on-brand transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SendHorizontal aria-hidden="true" className="size-5" />
        </button>
      </form>
    </div>
  )
}
