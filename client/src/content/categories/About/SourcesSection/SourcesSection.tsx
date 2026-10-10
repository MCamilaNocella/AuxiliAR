import { ExternalLink } from "lucide-react"
import { Disclosure } from "@/components/health/Disclosure"
import { REFERENCE_GROUPS } from "../About.sources"
import type { Reference, ReferenceBlock } from "../About.sources"

/** "2026-10-08" → "8 de octubre de 2026" (a calendar date: no time zone shifts) */
const formatDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number)
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)))
}

const checkedText = (days: string[]) => `Texto comparado con estas fuentes ${days.length === 1 ? `el ${formatDate(days[0])}` : `entre el ${formatDate(days[0])} y el ${formatDate(days[days.length - 1])}`}.`

const ReferenceItem = ({ label, url, detail }: Reference) => (
  <li>
    {url ? (
      <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1 font-bold">
        {label}
        <ExternalLink aria-hidden="true" className="mt-1 size-4 shrink-0" />
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
    ) : (
      <span className="font-bold">{label}</span>
    )}
    {detail && <span className="block text-sm text-ink-soft">{detail}</span>}
  </li>
)

const Block = ({ id, title, references, checkedAt, notes }: ReferenceBlock) => (
  <section aria-labelledby={`about-ref-${id}`} className="border-t border-line-strong pt-3 first:border-t-0 first:pt-0">
    <h4 id={`about-ref-${id}`} className="m-0 mb-1 text-base font-extrabold">
      {title}
    </h4>
    <ul role="list" className="m-0 flex list-none flex-col gap-1.5 p-0">
      {references.map((reference) => (
        <ReferenceItem key={`${reference.url ?? reference.label}-${reference.detail ?? ""}`} {...reference} />
      ))}
    </ul>
    {checkedAt && checkedAt.length > 0 && <p className="m-0 mt-2 text-ink-soft">{checkedText(checkedAt)}</p>}
    {notes?.map((note) => (
      <p key={note} className="m-0 mt-1 text-ink-soft">
        {note}
      </p>
    ))}
  </section>
)

/**
 * "Sobre AuxiliAR" · Fuentes y referencias: every source and documentary reference of AuxiliAR, by topic, each topic in a disclosure that
 * starts closed. The pages of the topics do not repeat them; they keep only the links to a service, a procedure, a resource or a video.
 */
export const SourcesSection = () => (
  <section aria-labelledby="about-sources" className="mt-4 flex flex-col gap-3 border-t border-line-strong pt-6">
    <h3 id="about-sources" className="m-0 text-xl font-extrabold">
      Fuentes y referencias
    </h3>
    <p className="m-0 text-ink-soft">
      Acá están todas las fuentes de AuxiliAR, por tema, con el día en que comparamos cada texto con ellas.
    </p>
    <div className="flex flex-col gap-2">
      {REFERENCE_GROUPS.map(({ id, title, blocks }) => (
        <Disclosure key={id} title={title} compact>
          <div className="flex flex-col gap-3">
            {blocks.map((block) => (
              <Block key={block.id} {...block} />
            ))}
          </div>
        </Disclosure>
      ))}
    </div>
  </section>
)
