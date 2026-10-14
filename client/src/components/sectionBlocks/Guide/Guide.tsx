import { Phone } from "lucide-react"
import { blockIcon } from "@/utils/blockIcons"
import { CONTRAST_OUTLINE } from "@/utils/contrastOutline"
import { BlockButton } from "../BlockButton"
import { BlockNote } from "../BlockNote"
import { BlockTabs } from "../BlockTabs"
import { BulletList } from "../BulletList"
import { Fold } from "../Fold"
import { RichText } from "../RichText"
import { StepList } from "../StepList"
import type { GuideProps } from "./Guide.types"

const rich = (texts: string[]) => texts.map((text, index) => <RichText key={index} text={text} />)
const LIST = "m-0 grid list-disc gap-[0.35rem] pt-[0.45rem] pl-[1.15rem]"

/**
 * A first aid guide, always in the same order: how to tell, what to do (tabs when there are different cases), what not to do next to
 * when to ask for help, and how to prevent it folded at the end. Its title, signs, numbers and markers take the guide's tone
 */
export const Guide = ({ guide, tone }: GuideProps) => {
  const { id, title, call, lead, signs, signs2, sets, tip, dont, help, note, button, prevent } = guide
  const allSigns = [signs, signs2].filter((s): s is { title: string, items: string[] } => !!s)
  const TipIcon = tip ? blockIcon(tip.icon) : undefined
  return (
    <section
      id={`part-${id}`}
      tabIndex={-1}
      aria-labelledby={`part-${id}-title`}
      className={`tone-${tone} grid min-w-0 grid-cols-[minmax(0,1fr)] [--marker:var(--tone-ink)] [--note-ink:var(--tone-ink)] [--tab-ink:var(--tone-ink)] [--step-bg:var(--tone)] [--step-ink:var(--tone-ink)] focus:outline-none`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b-2 border-(--tone-ink) pb-3">
        <h3 id={`part-${id}-title`} className="m-0 mr-auto min-w-0 text-[1.3rem] leading-[1.2] font-black [overflow-wrap:anywhere] text-(--tone-ink)">
          {title}
        </h3>
        {call && (
          <span className={`inline-flex items-center gap-[0.35rem] rounded-full bg-alert-soft px-3 py-1 text-[0.85rem] font-extrabold whitespace-nowrap text-alert-text ${CONTRAST_OUTLINE}`}>
            <Phone aria-hidden="true" className="size-[0.95rem]" />
            Llamá a emergencias
          </span>
        )}
      </div>
      {lead && (
        <p className="m-0 pt-3 text-ink-soft">
          <RichText text={lead} />
        </p>
      )}
      {allSigns.length > 0 && (
        <div className={`mt-4 grid gap-4 rounded-[1.25rem] bg-(--tone) px-5 py-4 ${allSigns.length > 1 ? "@[44rem]:grid-cols-[3fr_2fr]" : ""} ${CONTRAST_OUTLINE}`}>
          {allSigns.map(({ title: heading, items }) => (
            <div key={heading}>
              <h4 className="m-0 text-[1.02rem] leading-[1.25] font-black text-(--tone-ink)">{heading}</h4>
              <ul className={`${LIST} marker:text-(--tone-ink)`}>
                {items.map((item, index) => (
                  <li key={index}>
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <h4 className="m-0 mt-5 text-[1.02rem] leading-[1.25] font-black text-(--tone-ink)">Qué hacer</h4>
      {sets.length > 1 ? (
        <BlockTabs label="Elegí el caso" plain wrapLabels tabs={sets.map(({ label, steps }) => ({ label: label ?? "", content: <StepList steps={rich(steps)} /> }))} />
      ) : (
        <StepList steps={rich(sets[0]?.steps ?? [])} />
      )}
      {tip && (
        <div className="pt-1">
          <BlockNote icon={TipIcon}>
            <RichText text={tip.text} />
          </BlockNote>
        </div>
      )}
      {(dont || help) && (
        <div className={`mt-5 grid gap-3 ${dont && help ? "@[40rem]:grid-cols-2" : ""}`}>
          {dont && (
            <div className={`rounded-[1.25rem] bg-alert-soft px-5 py-4 ${CONTRAST_OUTLINE}`}>
              <h4 className="m-0 text-[1.02rem] leading-[1.25] font-black text-alert-text">No hagas esto</h4>
              <ul className={`${LIST} marker:text-alert-text`}>
                {dont.map((item, index) => (
                  <li key={index}>
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {help && (
            <div className={`rounded-[1.25rem] bg-field px-5 py-4 ${CONTRAST_OUTLINE}`}>
              <h4 className="m-0 text-[1.02rem] leading-[1.25] font-black">{help.title}</h4>
              <ul className={LIST}>
                {help.items.map((item, index) => (
                  <li key={index}>
                    <RichText text={item} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {note && (
        <p className="m-0 mt-4 text-[0.95rem] text-muted">
          <RichText text={note} />
        </p>
      )}
      {button && (
        <div className="mt-4">
          <BlockButton button={button} />
        </div>
      )}
      {prevent && (
        <div className="mt-5 [&>div]:mt-0! [&>div]:border-t!">
          <Fold label="Para que no pase" count={`${prevent.length} consejos`}>
            <BulletList items={rich(prevent)} />
          </Fold>
        </div>
      )}
    </section>
  )
}
