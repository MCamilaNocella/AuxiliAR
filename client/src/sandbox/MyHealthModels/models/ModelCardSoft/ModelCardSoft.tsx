import { ButtonLookContext } from "../../ButtonLookContext"
import { useActiveProfile } from "../../useActiveProfile"
import { GreetingHero } from "../../parts/GreetingHero"
import { NextStepBubble } from "../../parts/NextStepBubble"
import { EmergencyPass } from "../../parts/EmergencyPass"
import { ProfileLinks } from "../../parts/ProfileLinks"
import { ProfileRows } from "../../parts/ProfileRows"

/**
 * M3: same as M1, with every button in style 3 (soft fill, no border, slightly rounded).
 * Greeting band on the home gradient (no age/area under the name), then the reference's structure:
 * the record card where the photo was, and two small rows beside it split by a rule.
 */
export const ModelCardSoft = () => {
  const { profile, activeId, setActiveId } = useActiveProfile()
  const [next] = profile.missing

  return (
    <ButtonLookContext value="soft">
      <div className="flex flex-col gap-8">
        <GreetingHero profile={profile} activeId={activeId} onSelect={setActiveId} details={false} bubble={next && <NextStepBubble next={next} />} />
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-8">
          <div className="lg:self-start">
            <EmergencyPass record={profile.record} identity={{ name: profile.name, age: profile.age }} />
          </div>
          <ProfileRows profile={profile} />
        </div>
        <ProfileLinks />
      </div>
    </ButtonLookContext>
  )
}
