import { useEffect, useRef } from "react"
import { Auxi } from "../Auxi"
import type { ChatLogProps } from "./ChatLog.types"

/** The scrolling list of a conversation (with Auxi waving on top in Auxi's); it follows the latest message */
export const ChatLog = ({ label = "Conversación con Auxi", withAuxi = true, children }: ChatLogProps) => {
  const logRef = useRef<HTMLOListElement>(null)

  // Keep the latest message in view whenever one comes in (or the typing dots show)
  useEffect(() => {
    const log = logRef.current
    if (!log) return
    const toBottom = () => {
      log.scrollTop = log.scrollHeight
    }
    toBottom()
    const observer = new MutationObserver(toBottom)
    observer.observe(log, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return (
    <ol
      ref={logRef}
      role="log"
      aria-label={label}
      className="m-0 flex min-h-0 flex-1 list-none flex-col gap-3 overflow-y-auto overscroll-contain p-4"
    >
      {/* Auxi waving on top; the greeting itself is the first message */}
      {withAuxi && (
        <li className="flex flex-col items-center gap-2 pb-2 text-center">
          {/* Nudged left: the waving hand fills the left side of the drawing, this centers Auxi's body */}
          <Auxi className="size-24 -translate-x-[10%]" />
          <span className="text-sm text-muted">No reemplazo una consulta médica. <span className="whitespace-nowrap">En una emergencia, llamá al 911.</span></span>
        </li>
      )}
      {children}
    </ol>
  )
}
