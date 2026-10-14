import { useId, useState, type FormEvent } from "react"
import type { GenderPreference } from "@/api/peerChat"
import { MAIN_STEP_BUTTON } from "../PeerChat/PeerChat.constants"
import { NICKNAME_MAX_LENGTH, PREFERENCES, REMINDERS } from "./PeerBeforeConnecting.constants"
import type { PeerBeforeConnectingProps } from "./PeerBeforeConnecting.types"

/** Before connecting: what to expect, how they want to be called, who they'd rather talk with and whether to share what they told Auxi */
export const PeerBeforeConnecting = ({ busy, onStart }: PeerBeforeConnectingProps) => {
  const formId = useId()
  const [nickname, setNickname] = useState("")
  const [share, setShare] = useState(true)
  const [preference, setPreference] = useState<GenderPreference>("any")
  const ready = nickname.trim().length > 0

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (ready && !busy) onStart(nickname.trim(), share, preference)
  }

  return (
    <>
      <form id={formId} onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
        <section aria-labelledby={`${formId}-remember`}>
          <h3 id={`${formId}-remember`} className="m-0 text-lg font-extrabold">
            Recordá que:
          </h3>
          <ul className="m-0 mt-2 flex list-none flex-col gap-2.5 p-0">
            {REMINDERS.map(({ Icon, text }) => (
              <li key={text} className="flex gap-2">
                <Icon aria-hidden="true" className="mt-0.5 size-5 flex-none text-brand" />
                {text}
              </li>
            ))}
          </ul>
        </section>
        <label className="flex flex-col gap-1 font-bold">
          ¿Cómo querés que te llamen?
          <input
            type="text"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            maxLength={NICKNAME_MAX_LENGTH}
            required
            autoComplete="off"
            placeholder="Por ejemplo, Luna"
            className="min-h-11 rounded-xl border border-control-line bg-field px-3 text-base font-normal text-ink outline-none transition-colors placeholder:text-muted hover:border-brand focus:border-brand focus:ring-2 focus:ring-brand"
          />
        </label>
        <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
          <legend className="m-0 mb-2 p-0 font-bold">¿Con quién preferís hablar?</legend>
          <div className="flex flex-wrap gap-2">
            {PREFERENCES.map(({ value, label }) => (
              <label
                key={value}
                className="flex min-h-11 cursor-pointer items-center rounded-full bg-field px-4 font-bold text-ink-soft transition-colors hover:bg-brand-soft has-checked:bg-brand has-checked:text-on-brand has-focus-visible:ring-2 has-focus-visible:ring-brand in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-control-line"
              >
                <input type="radio" name={`${formId}-preference`} value={value} checked={preference === value} onChange={() => setPreference(value)} className="sr-only" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex cursor-pointer items-start gap-2">
          <input type="checkbox" checked={share} onChange={(event) => setShare(event.target.checked)} className="mt-0.5 size-5 flex-none cursor-pointer accent-brand" />
          Compartir con la persona voluntaria lo que ya le conté a Auxi
        </label>
      </form>
      <div className="border-t border-line p-3">
        <button type="submit" form={formId} disabled={!ready || busy} className={MAIN_STEP_BUTTON}>
          {busy ? "Buscando…" : "Buscar a alguien"}
        </button>
      </div>
    </>
  )
}
