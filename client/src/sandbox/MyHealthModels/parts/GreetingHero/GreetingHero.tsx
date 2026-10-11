import { ShieldAlert, ShieldCheck, UserRoundCheck } from "lucide-react"
import { Auxi } from "@/components/help/Auxi"
import { Avatar } from "../Avatar"
import { ProfileChips } from "../ProfileChips"
import { SpeechBubble } from "../SpeechBubble"
import type { GreetingHeroProps } from "./GreetingHero.types"

const pillClass = "flex items-center gap-1.5 rounded-full bg-on-home/12 px-3 py-1 text-sm font-bold"

/**
 * The "fake header" of Mi Salud: greeting on the home gradient, profiles, and Auxi talking from a bubble.
 * `summary`: two pills with the state of the record and the profile, readable at a glance.
 * `children`: rendered at the bottom of the band (e.g. tabs).
 * `plain`: no band of its own, for screens already on the home gradient.
 */
export const GreetingHero = ({ profile, activeId, onSelect, bubble, summary = false, plain = false, details = true, children, className = "" }: GreetingHeroProps) => {
  const recordReady = Boolean(profile.record.contact)

  return (
    <section
      aria-label="Tu perfil"
      className={`relative text-on-home ${plain ? "" : "overflow-hidden rounded-3xl bg-home p-5 shadow-sm sm:p-7"} ${className}`}
    >
      {!plain && (
        <>
          <div aria-hidden="true" className="absolute -top-16 -left-10 size-48 rounded-full bg-on-home/6" />
          <div aria-hidden="true" className="absolute -right-14 -bottom-20 size-56 rounded-full bg-on-home/5" />
        </>
      )}

      <div className="relative grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="flex flex-col gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar name={profile.name} onDark className="size-14 text-2xl sm:size-16 sm:text-3xl" />
            <div className="min-w-0">
              <p className="m-0 text-2xl/tight font-extrabold wrap-break-word sm:text-3xl/tight">Hola, {profile.name}</p>
              {details && (
                <p className="m-0 mt-0.5 text-on-home-muted">
                  {profile.ageRange} · {profile.area}
                </p>
              )}
            </div>
          </div>
          {summary && (
            <ul role="list" className="m-0 flex list-none flex-wrap gap-2 p-0">
              <li className={pillClass}>
                {recordReady ? <ShieldCheck aria-hidden="true" className="size-4 flex-none" /> : <ShieldAlert aria-hidden="true" className="size-4 flex-none" />}
                {recordReady ? "Ficha de emergencia lista" : "A tu ficha le falta el contacto"}
              </li>
              <li className={pillClass}>
                <UserRoundCheck aria-hidden="true" className="size-4 flex-none" />
                Perfil al {profile.completion}%
              </li>
            </ul>
          )}
          <ProfileChips activeId={activeId} onSelect={onSelect} onDark />
        </div>

        {/* Narrow screens with big text: the bubble takes its own line instead of getting squeezed */}
        <div className="flex flex-wrap items-center justify-end gap-2">
          {bubble && (
            <SpeechBubble tail="right" className="max-w-64 min-w-[min(100%,11rem)] flex-1 md:flex-none">
              {bubble}
            </SpeechBubble>
          )}
          <Auxi onDark className="w-24 flex-none sm:w-28" />
        </div>
      </div>

      {children && <div className="relative mt-5">{children}</div>}
    </section>
  )
}
