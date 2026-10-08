import { EmergencyPass } from "@/components/myHealth/EmergencyPass"
import { GreetingHero } from "@/components/myHealth/GreetingHero"
import { NextStepBubble } from "@/components/myHealth/NextStepBubble"
import { ProfileLinks } from "@/components/myHealth/ProfileLinks"
import { ProfileRows } from "@/components/myHealth/ProfileRows"
import { useActiveProfile } from "./useActiveProfile"

/**
 * Mi Salud: greeting band on the home gradient with the profiles and Auxi inviting to complete the profile,
 * then the emergency record card and, beside it, how complete the profile is and what's recommended for the age.
 */
export const MyHealth = () => {
  const { profile, activeId, setActiveId } = useActiveProfile()
  const incomplete = profile.missing.length > 0

  return (
    <div className="page-container flex flex-col gap-8 pt-6 pb-10">
      <GreetingHero profile={profile} activeId={activeId} onSelect={setActiveId} bubble={incomplete && <NextStepBubble />} />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-8">
        <div className="lg:self-start">
          <EmergencyPass name={profile.name} age={profile.age} record={profile.record} />
        </div>
        <ProfileRows profile={profile} />
      </div>
      <ProfileLinks />
    </div>
  )
}
