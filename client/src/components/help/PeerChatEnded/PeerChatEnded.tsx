import { useId, useState } from "react"
import { Flag } from "lucide-react"
import type { PeerChatRating } from "@/api/peerChat"
import { Auxi } from "../Auxi"
import { MAIN_STEP_BUTTON } from "../PeerChat/PeerChat.constants"
import { MESSAGE_MAX_LENGTH, RATINGS, REPORT_MAX_LENGTH } from "./PeerChatEnded.constants"
import type { PeerChatEndedProps } from "./PeerChatEnded.types"

const FIELD =
  "min-h-11 w-full resize-y rounded-xl border border-control-line bg-field px-3 py-2 text-base font-normal text-ink outline-none transition-colors placeholder:text-muted hover:border-brand focus:border-brand focus:ring-2 focus:ring-brand disabled:opacity-60 disabled:hover:border-control-line"

/**
 * End of the chat: how it went, a message for the volunteer and a report, all optional. Once they say something the
 * button sends it ("Enviar") and then turns into "Volver con Auxi"; with nothing to send it's "Volver con Auxi" already.
 */
export const PeerChatEnded = ({ name, onSend, onBack }: PeerChatEndedProps) => {
  const id = useId()
  const [rating, setRating] = useState<PeerChatRating | null>(null)
  const [message, setMessage] = useState("")
  const [reporting, setReporting] = useState(false)
  const [report, setReport] = useState("")
  const [sent, setSent] = useState(false)
  const hasFeedback = rating !== null || message.trim() !== "" || report.trim() !== ""

  const handleClick = () => {
    if (sent || !hasFeedback) return onBack()
    onSend({ rating, message, report })
    setSent(true)
  }

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
        <fieldset disabled={sent} className="m-0 flex flex-col items-center gap-3 border-0 p-0 text-center">
          <Auxi className="w-24" />
          <legend className="m-0 p-0 text-lg font-extrabold">¿Cómo te fue con {name}?</legend>
          <div className="flex flex-wrap justify-center gap-3">
            {RATINGS.map(({ value, label, Icon }) => (
              <label
                key={value}
                className="flex w-24 cursor-pointer flex-col items-center gap-1 rounded-2xl bg-field p-2 text-sm font-bold text-ink-soft transition-colors hover:bg-brand-soft has-checked:bg-brand has-disabled:cursor-default has-checked:text-on-brand has-focus-visible:ring-2 has-focus-visible:ring-brand in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-control-line"
              >
                <input type="radio" name={`${id}-rating`} value={value} checked={rating === value} onChange={() => setRating(value)} className="sr-only" />
                <Icon aria-hidden="true" className="size-8" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex flex-col gap-1 font-bold">
          ¿Querés dejarle un mensaje? (opcional)
          <textarea value={message} disabled={sent} onChange={(event) => setMessage(event.target.value)} maxLength={MESSAGE_MAX_LENGTH} rows={2} className={FIELD} />
        </label>
        {/* After sending, only what they wrote stays (read-only) */}
        {reporting ? (
          <label className="flex flex-col gap-1 font-bold">
            ¿Qué pasó? Lo lee el equipo de AuxiliAR.
            <textarea value={report} disabled={sent} onChange={(event) => setReport(event.target.value)} maxLength={REPORT_MAX_LENGTH} rows={3} autoFocus className={FIELD} />
          </label>
        ) : (
          !sent && (
            <button
              type="button"
              onClick={() => setReporting(true)}
              className="flex min-h-11 cursor-pointer items-center justify-center gap-1.5 self-center rounded-full px-3 font-bold text-alert-text transition-colors hover:bg-alert-soft"
            >
              <Flag aria-hidden="true" className="size-4.5" />
              Reportar algo de este chat
            </button>
          )
        )}
      </div>
      <div className="flex flex-col gap-2 border-t border-line p-3">
        {sent && (
          <p role="status" className="m-0 text-center text-sm font-bold text-brand">
            ¡Gracias por contarnos!
          </p>
        )}
        <button type="button" onClick={handleClick} className={MAIN_STEP_BUTTON}>
          {hasFeedback && !sent ? "Enviar" : "Volver con Auxi"}
        </button>
      </div>
    </>
  )
}
