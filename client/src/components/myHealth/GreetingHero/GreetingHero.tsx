import { Auxi } from "@/components/help/Auxi"
import { Avatar } from "../Avatar"
import { ProfileChips } from "../ProfileChips"
import { SpeechBubble } from "../SpeechBubble"
import type { GreetingHeroProps } from "./GreetingHero.types"

/** Top of Mi Salud: greeting on the home gradient, profiles, and Auxi talking from a bubble */
export const GreetingHero = ({ profiles, profile, activeId, onSelect, onAddRelative, bubble }: GreetingHeroProps) => (
  <section aria-labelledby="greeting-title" className="relative overflow-hidden rounded-3xl bg-home p-5 text-on-home shadow-sm sm:p-7">
    <div aria-hidden="true" className="absolute -top-16 -left-10 size-48 rounded-full bg-on-home/6" />
    <div aria-hidden="true" className="absolute -right-14 -bottom-20 size-56 rounded-full bg-on-home/5" />

    <div className="relative grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div className="flex flex-col gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar name={profile.name} className="size-14 text-2xl sm:size-16 sm:text-3xl" />
          <h1 id="greeting-title" className="m-0 min-w-0 text-2xl/tight font-extrabold wrap-break-word sm:text-3xl/tight">
            {profile.name ? (
              `Hola, ${profile.name}`
            ) : (
              <>
                {/* The @ would be read as "arroba": screen readers get an inclusive phrasing instead */}
                <span aria-hidden="true">¡Bienvenid@ a Mi Salud!</span>
                <span className="sr-only">¡Te damos la bienvenida a Mi Salud!</span>
              </>
            )}
          </h1>
        </div>
        <ProfileChips profiles={profiles} activeId={activeId} onSelect={onSelect} onAddRelative={onAddRelative} />
      </div>

      {/* Narrow screens with big text: the bubble takes its own line instead of getting squeezed */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        {bubble && <SpeechBubble className="max-w-64 min-w-[min(100%,11rem)] flex-1 md:flex-none">{bubble}</SpeechBubble>}
        <Auxi onDark className="w-24 flex-none sm:w-28" />
      </div>
    </div>
  </section>
)
