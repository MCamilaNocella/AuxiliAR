import { ExternalLink } from "lucide-react"

export type Source = {
  label: string
  url: string
}

type SourceListProps = {
  sources: Source[]
  /** Day the content was compared with the sources, "YYYY-MM-DD" */
  checkedAt: string
  /** What the page is not (one sentence), shown after the date */
  note?: string
}

const formatDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number)
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)))
}

/** The official sources of a section, with the day the text was compared with them. Same look as the first aid guides */
export const SourceList = ({ sources, checkedAt, note }: SourceListProps) => (
  <section aria-label="Fuentes" className="border-t border-line-strong pt-4 text-ink-soft">
    <h3 className="m-0 mb-2 text-base font-extrabold text-ink">Fuentes oficiales</h3>
    <ul role="list" className="m-0 flex list-none flex-col gap-1 p-0">
      {sources.map(({ label, url }) => (
        <li key={url}>
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1 font-bold">
            {label}
            <ExternalLink aria-hidden="true" className="mt-1 size-4 shrink-0" />
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </li>
      ))}
    </ul>
    <p className="m-0 mt-2">{`Texto comparado con estas fuentes el ${formatDate(checkedAt)}.${note ? ` ${note}` : ""}`}</p>
  </section>
)
