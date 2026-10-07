import { Link } from "react-router"
import { ChevronRight } from "lucide-react"
import { GUIDE_GROUPS, getGuidesOfGroup } from "@/content/firstAid"
import type { GuideGroupId } from "@/content/firstAid"
import { PATHS } from "@/router/paths"
import { GuideIcon } from "../guideIcons"

type GuideCardsProps = {
  /** Which groups to show, in order. All of them by default */
  groups?: GuideGroupId[]
  /** Level of the group headings, to fit the page that hosts the cards */
  headingLevel?: "h2" | "h3"
}

/**
 * The first aid guides as cards, grouped. Every card opens a real guide (/primeros-auxilios/:slug). Used by the
 * door in Salud general and meant for the Primeros auxilios category too: both read the same guides.
 */
export const GuideCards = ({ groups = GUIDE_GROUPS.map(({ id }) => id), headingLevel = "h3" }: GuideCardsProps) => {
  const Heading = headingLevel
  return (
    <div className="flex flex-col gap-8">
      {GUIDE_GROUPS.filter(({ id }) => groups.includes(id)).map(({ id, title }) => (
        <section key={id} aria-labelledby={`guides-${id}`}>
          <Heading id={`guides-${id}`} className="m-0 text-xl font-extrabold">
            {title}
          </Heading>
          <ul role="list" className="m-0 mt-3 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {getGuidesOfGroup(id).map(({ slug, title: guideTitle }) => {
              const urgent = id === "now"
              return (
                <li key={slug}>
                  <Link
                    to={PATHS.firstAidGuide(slug)}
                    className={`flex min-h-20 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 font-extrabold no-underline hover:text-ink ${
                      urgent ? "border-alert-card-line bg-alert-soft text-ink hover:border-alert-text" : "border-line-strong bg-card text-ink hover:border-control-line"
                    }`}
                  >
                    <GuideIcon slug={slug} className={`size-7 shrink-0 ${urgent ? "text-alert-text" : "text-brand"}`} />
                    <span className="flex-1">{guideTitle}</span>
                    <ChevronRight aria-hidden="true" className={`size-5 shrink-0 ${urgent ? "text-alert-text" : "text-brand"}`} />
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
