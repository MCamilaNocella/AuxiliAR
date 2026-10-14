import { Calendar, Check, Clock, ExternalLink, MapPin, Phone } from "lucide-react"
import { CONTRAST_OUTLINE } from "@/utils/contrastOutline"
import type { BlockPlaceCardProps } from "./BlockPlaceCard.types"

const BADGE = "inline-flex items-center gap-[0.3rem] rounded-full px-[0.6rem] py-[0.2rem] text-[0.8rem] font-extrabold"
const OK = `${BADGE} bg-[color-mix(in_srgb,var(--color-success)_16%,var(--color-card))] text-ink`
const PLAIN = `${BADGE} bg-field text-ink-soft`

/** First number of a phone as the models write it ("2821-3638 int. 12" → 28213638) */
const dial = (phone: string) => phone.split(/\s*(?:int\.|\/)/)[0].replace(/\D/g, "")

/** A place of a model's map: what it is, its address, badges, facts, phones to call and where the information comes from */
export const BlockPlaceCard = ({ place }: BlockPlaceCardProps) => (
  <article className={`grid gap-[0.65rem] rounded-[1.25rem] bg-card px-[1.1rem] py-4 ${CONTRAST_OUTLINE}`}>
    <span className="text-[0.8rem] font-extrabold tracking-[0.04em] text-brand uppercase">{place.kind}</span>
    <h3 className="m-0 text-[1.1rem] leading-[1.25] font-black">{place.name}</h3>
    <p className="m-0 flex gap-[0.4rem] text-muted">
      <MapPin aria-hidden="true" className="mt-[0.15rem] size-4 shrink-0" />
      <span>{place.zone ? `${place.address} · ${place.zone}` : place.address}</span>
    </p>
    <ul role="list" className="m-0 flex list-none flex-wrap gap-[0.35rem] p-0">
      {place.guard24 && (
        <li className={OK}>
          <Clock aria-hidden="true" className="size-[0.9rem]" />
          Guardia 24 h
        </li>
      )}
      {place.freeCond || place.free ? (
        <li className={OK}>
          <Check aria-hidden="true" className="size-[0.9rem]" />
          {place.freeCond ? "Gratis con condiciones" : "Gratuita"}
        </li>
      ) : (
        <li className={PLAIN}>{place.paid ? "Con arancel" : "Gratuidad no confirmada"}</li>
      )}
      {place.kids && <li className={PLAIN}>Niñas, niños y adolescentes</li>}
      {place.prog && (
        <li className={PLAIN}>
          <Calendar aria-hidden="true" className="size-[0.9rem]" />
          Atención programada
        </li>
      )}
    </ul>
    <ul className="m-0 grid gap-[0.2rem] pl-[1.1rem] text-[0.925rem] text-ink-soft">
      {place.facts.map((fact) => (
        <li key={fact}>{fact}</li>
      ))}
    </ul>
    {place.note && <p className="m-0 text-[0.925rem] text-ink-soft">{place.note}</p>}
    {place.phones.length ? (
      <div className="flex flex-wrap gap-[0.4rem]">
        {place.phones.map(([label, number], index) => (
          <a
            key={label + number}
            href={`tel:${dial(number)}`}
            className={`inline-flex min-h-11 items-center gap-[0.4rem] rounded-xl px-[0.85rem] py-[0.45rem] font-extrabold no-underline ${index ? "bg-field text-ink hover:text-ink" : "bg-brand text-on-brand hover:bg-brand-dark hover:text-on-brand"}`}
          >
            <Phone aria-hidden="true" className="size-[1.25em]" />
            {`${label} ${number}`}
          </a>
        ))}
      </div>
    ) : (
      <p className="m-0 text-[0.925rem] text-ink-soft">Todavía no tenemos un teléfono verificado de este lugar.</p>
    )}
    <details>
      <summary className="flex min-h-9 cursor-pointer items-center text-sm font-bold text-muted">De dónde sale esta información</summary>
      <ul role="list" className="m-0 mt-1 grid list-none gap-[0.35rem] p-0 text-sm">
        {place.source.map(({ label, url }) => (
          <li key={url}>
            <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-baseline gap-[0.35rem] [overflow-wrap:anywhere] text-ink-soft underline-offset-[3px] hover:text-brand">
              {label}
              <ExternalLink aria-hidden="true" className="relative top-[0.12em] size-[0.9rem] shrink-0" />
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </li>
        ))}
      </ul>
    </details>
  </article>
)
