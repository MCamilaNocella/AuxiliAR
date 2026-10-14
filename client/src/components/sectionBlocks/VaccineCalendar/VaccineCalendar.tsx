import { Bookmark, Calendar, Info, MapPin } from "lucide-react"
import { CONTRAST_OUTLINE } from "@/utils/contrastOutline"
import { BlockTabs } from "../BlockTabs"
import { ModelLink } from "../ModelLink"
import type { VaccineCalendarProps, VaccineStage } from "./VaccineCalendar.types"

const CELL = "border-t border-line-strong py-[0.7rem] pr-3 align-top max-sm:border-0 max-sm:py-[0.1rem] max-sm:pr-0"

/** One stage of life: its vaccines by moment (when, vaccine, how), its paragraphs, notes and what to ask at the vaccination center */
const Stage = ({ stage }: { stage: VaccineStage }) => (
  <>
    <div>
      <h3 className="m-0 text-[1.3rem] font-black">{stage.title}</h3>
      {stage.intro && <p className="m-0 mt-1 text-muted">{stage.intro}</p>}
    </div>
    {stage.groups.some((group) => group.items.length) && (
      <table className="w-full border-collapse">
        <thead className="max-sm:hidden">
          <tr>
            {["Cuándo", "Vacuna", "Cómo"].map((heading) => (
              <th key={heading} className="pr-3 pb-2 text-left text-[0.8rem] font-extrabold tracking-[0.05em] text-muted uppercase">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stage.groups
            .filter((group) => group.items.length)
            .flatMap((group) =>
              group.items.map((item, k) => (
                <tr key={`${group.heading ?? stage.short}-${item.vaccine}`} className="max-sm:grid max-sm:border-t max-sm:border-line-strong max-sm:py-[0.6rem]">
                  <td className={`${CELL} font-black text-brand sm:whitespace-nowrap`}>{k === 0 ? (group.heading ?? stage.short) : <span className="sr-only">{group.heading ?? stage.short}</span>}</td>
                  <td className={`${CELL} font-black`}>{item.vaccine}</td>
                  <td className={CELL}>
                    {item.dose}
                    {item.details.length > 0 && (
                      <ul className="m-0 mt-[0.3rem] list-disc pl-[1.1rem] text-sm text-muted">
                        {item.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              )),
            )}
        </tbody>
      </table>
    )}
    {stage.groups
      .filter((group) => !group.items.length || (group.paragraphs.length && group.items.length))
      .map((group, index) => (
        <div key={index} className="rounded-[0.6rem] bg-field px-[0.9rem] py-3">
          {group.heading && <h4 className="m-0 font-black">{group.heading}</h4>}
          {group.paragraphs.map((paragraph) => (
            <p key={paragraph} className="m-0">
              {paragraph}
            </p>
          ))}
        </div>
      ))}
    {stage.notes.map((note) => (
      <p key={note} className="m-0 flex gap-2 text-[0.925rem] text-ink-soft">
        <Info aria-hidden="true" className="mt-[0.15rem] size-[1.25em] shrink-0 text-brand" />
        <span>{note}</span>
      </p>
    ))}
    {stage.confirm.length > 0 && (
      <div>
        <p className="m-0 mb-[0.4rem] text-[0.95rem] font-black">Para consultar en el vacunatorio</p>
        <ul className="m-0 grid list-disc gap-[0.3rem] pl-[1.2rem]">
          {stage.confirm.map(({ topic, what }) => (
            <li key={topic}>
              <b>{`${topic}:`}</b> {what}
            </li>
          ))}
        </ul>
      </div>
    )}
  </>
)

/** The national vaccination calendar: one tab per stage of life, and what to remember with a way to find a vaccination center */
export const VaccineCalendar = ({ stages, remember, pdf, centersTo }: VaccineCalendarProps) => (
  <>
    <div id="part-cal" tabIndex={-1} className="focus:outline-none">
      <BlockTabs label="Etapas de la vida" scroll tabs={stages.map((stage) => ({ label: stage.short, content: <Stage stage={stage} /> }))} />
    </div>
    <div className={`grid gap-2 rounded-xl bg-card px-5 py-[1.1rem] ${CONTRAST_OUTLINE}`}>
      <h3 className="m-0 flex items-center gap-2 text-[1.05rem] font-black">
        <Bookmark aria-hidden="true" className="size-[1.25em]" />
        Recordá
      </h3>
      <ul className="m-0 grid list-disc gap-[0.3rem] pl-[1.2rem]">
        {remember.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="mt-1 flex flex-wrap gap-2">
        <ModelLink to={centersTo} icon={MapPin} variant="solid">
          Encontrar vacunatorio
        </ModelLink>
        <ModelLink to={pdf} icon={Calendar} variant="soft">
          Calendario oficial (PDF)
        </ModelLink>
      </div>
    </div>
  </>
)
