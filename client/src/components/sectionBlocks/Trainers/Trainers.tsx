import { Fragment } from "react"
import { RichText } from "../RichText"
import { TRAINER_LOGOS } from "./Trainers.constants"
import type { TrainersProps } from "./Trainers.types"

/** "antoadiestramiento.ar" may break after its dots and underscores (narrow cards) */
const breakable = (text: string) =>
  text.split(/(?<=[._])/).map((part, index) => (
    <Fragment key={index}>
      {index > 0 && <wbr />}
      {part}
    </Fragment>
  ))

/** Recommended trainers: cards side by side, each a link with its logo on one soft plate and where to find it */
export const Trainers = ({ items, listTitle, after }: TrainersProps) => (
  <>
    {listTitle && <h4 className="m-0 mt-4 flex items-center gap-2 text-[1.05rem] font-black">{listTitle}</h4>}
    <ul role="list" className="m-0 mt-3 flex list-none flex-wrap gap-3 p-0">
      {items.map(({ logo, name, where, url }) => (
        <li key={url} className="flex flex-[1_1_8.5rem]">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="grid flex-1 content-start justify-items-center gap-2 rounded-[1.25rem] bg-ink/6 px-3 py-[1.1rem] text-center text-ink no-underline hover:bg-ink/10 hover:text-ink"
          >
            <span className="grid h-[4.5rem] w-full place-items-center p-1">
              <img src={TRAINER_LOGOS[logo]} alt={name} className="block h-auto max-h-14 w-auto max-w-full object-contain" />
            </span>
            <span className="text-[0.8rem] font-bold text-muted">{breakable(where)}</span>
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </li>
      ))}
    </ul>
    {after && (
      <p className="m-0 mt-3 text-ink-soft">
        <RichText text={after} />
      </p>
    )}
  </>
)
