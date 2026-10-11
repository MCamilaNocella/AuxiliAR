import { Link } from "react-router"
import { ChevronRight, Sprout } from "lucide-react"
import { PATHS } from "@/router/paths"
import { completion, missingItems } from "@/utils/healthProfile"
import { MissingSteps } from "../MissingSteps"
import { ProgressRing } from "../ProgressRing"
import { ScrollList } from "../ScrollList"
import { VISIBLE_TOPICS } from "./ProfileRows.constants"
import type { ProfileRowsProps } from "./ProfileRows.types"

const rowClass = "flex flex-col gap-3 py-5 first:pt-0 last:pb-0"

/**
 * The two rows next to the record card, split by a rule, kept small so the card stays the main thing:
 *  1. How complete the profile is, and what's missing.
 *  2. Recommendations for the age (the first two; the rest scroll).
 */
export const ProfileRows = ({ profile, empty, onAddField }: ProfileRowsProps) => {
  const missing = missingItems(profile)
  const percent = completion(profile)
  const { age, ageTopics } = profile

  return (
    <div className="divide-y divide-line-strong">
      <section aria-label="Completar perfil" className={rowClass}>
        <div className="flex items-center gap-3">
          <ProgressRing value={percent} className="size-12 [&_span]:text-sm" />
          <div className="min-w-0">
            <h2 className="m-0 text-base/tight font-extrabold">Tu perfil está al {percent}%</h2>
            <p className="m-0 text-sm text-muted">
              {missing.length === 0 ? "¡Está completo!" : missing.length === 1 ? "Te falta un solo dato." : `Te faltan ${missing.length} datos. Se completan de a uno.`}
            </p>
          </div>
        </div>
        <MissingSteps missing={missing} onSelect={onAddField} />
      </section>

      <section aria-label="Para tu edad" data-category="recursos" className={rowClass}>
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-12 flex-none items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--category-dark),var(--category-mid))] text-on-category in-data-[theme=contrast]:bg-none in-data-[theme=contrast]:bg-(--category-dark)"
          >
            <Sprout className="size-5.5" />
          </span>
          <div className="min-w-0">
            <h2 className="m-0 text-base/tight font-extrabold">Para tu edad</h2>
            {/* No profile, no age to talk about: hidden until one is added */}
            {!empty && <p className="m-0 text-sm text-muted">{age ? `Recomendado para tus ${age} años.` : "Completá tu edad para ver recomendaciones."}</p>}
          </div>
        </div>
        <ScrollList visible={VISIBLE_TOPICS}>
          {ageTopics.map((topic) => (
            <li key={topic}>
              <Link
                to={PATHS.home}
                className="flex min-h-10 items-center justify-between gap-3 rounded-lg bg-field px-3 py-1.5 text-sm font-bold text-ink no-underline transition-colors hover:bg-brand-soft hover:text-brand in-data-[theme=contrast]:ring-1 in-data-[theme=contrast]:ring-control-line"
              >
                {topic}
                <ChevronRight aria-hidden="true" className="size-4 flex-none text-brand" />
              </Link>
            </li>
          ))}
        </ScrollList>
        <Link to={PATHS.home} className="self-start text-sm font-bold underline underline-offset-4">
          Ver más temas
        </Link>
      </section>
    </div>
  )
}
