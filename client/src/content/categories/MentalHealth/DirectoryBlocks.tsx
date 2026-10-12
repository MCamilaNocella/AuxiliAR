import { ExternalLink } from "lucide-react"
import { getHelpLine } from "@/data/resources/lines"
import type { CesacItem, DirectoryItem, Hospital } from "./MentalHealth.directory"

/**
 * The blocks of Salud mental that list places and lines (data in MentalHealth.directory.ts). They say only what the data says, with the page each
 * one comes from: no gratuity of their own, no promise of an appointment or of a place. Every external link opens in a new tab.
 */

const linkClass = "inline-flex min-h-11 items-center gap-1 font-bold"

const PageLink = ({ href, children = "Página oficial" }: { href: string, children?: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
    <span>{children}</span>
    <ExternalLink aria-hidden="true" className="size-4 shrink-0" />
    <span className="sr-only"> (se abre en una pestaña nueva)</span>
  </a>
)

const Facts = ({ parts }: { parts: (string | undefined)[] }) => {
  const shown = parts.filter(Boolean)
  return shown.length > 0 ? <p className="m-0 text-ink-soft">{shown.join(" · ")}</p> : null
}

/** Places or lines, one card each: what it offers, where, how to reach it, who it is for, how to get in, its limits, and its page */
export const DirectoryList = ({ items }: { items: DirectoryItem[] }) => (
  <ul role="list" className="m-0 flex list-none flex-col gap-3 p-0">
    {items.map((item) => (
      <li key={item.id} className="rounded-xl border border-line-strong bg-field p-3">
        <p className="m-0 font-extrabold">{item.title}</p>
        {item.what && <p className="m-0 mt-0.5">{item.what}</p>}
        <Facts parts={[item.address, item.phone && `Contacto: ${item.phone}`, item.hours]} />
        {item.who && <p className="m-0 mt-0.5 text-ink-soft">{`Para: ${item.who.replace(/\.$/, "")}.`}</p>}
        {item.how && <p className="m-0 mt-0.5 text-ink-soft">{item.how}</p>}
        {item.note && <p className="m-0 mt-0.5 text-ink-soft">{item.note}</p>}
        <PageLink href={item.url} />
      </li>
    ))}
  </ul>
)

/** The hospitals of a guardia: name, address, comuna. They all come from the one page of the Ciudad */
export const HospitalList = ({ items, url }: { items: Hospital[], url: string }) => (
  <>
    <ul role="list" className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-2 p-0 sm:grid-cols-2">
      {items.map((hospital) => (
        <li key={hospital.id}>
          <b>{hospital.title}</b>
          <span className="block text-ink-soft">{`${hospital.address} · ${hospital.comuna}`}</span>
        </li>
      ))}
    </ul>
    <PageLink href={url}>Ver la página oficial de las guardias</PageLink>
  </>
)

/** The CeSAC with mental health care, by comuna: one compact entry each, its title is the link to its own official page */
export const CesacList = ({ items }: { items: CesacItem[] }) => {
  const comunas = [...new Set(items.map(({ comuna }) => comuna))].sort((x, y) => Number(x.replace(/D/g, "")) - Number(y.replace(/D/g, "")))
  return (
    <div className="flex flex-col gap-4">
      {comunas.map((comuna) => (
        <section key={comuna} aria-label={comuna}>
          <h5 className="m-0 text-base font-extrabold">{comuna}</h5>
          <ul role="list" className="m-0 mt-1 flex list-none flex-col gap-2 p-0">
            {items
              .filter((cesac) => cesac.comuna === comuna)
              .map((cesac) => (
                <li key={cesac.n}>
                  <a href={cesac.url} target="_blank" rel="noopener noreferrer" className="font-bold">
                    {`${cesac.title} · ${cesac.barrio}`}
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                  <span className="block text-ink-soft">{`${cesac.what} · ${cesac.address} · Tel. ${cesac.phone}${cesac.onMap ? " · También está en el mapa" : ""}`}</span>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

/** A line of the national dataset (data/resources/lines): the numbers, who they are for and the hours come from there, never from here; its source stays with that dataset */
export const NationalLine = ({ id }: { id: string }) => {
  const line = getHelpLine(id)
  const contacts = (line.contacts ?? []).map((contact) => (contact.scope?.note && (line.contacts ?? []).length > 1 ? `${contact.display} (${contact.scope.note.charAt(0).toLowerCase()}${contact.scope.note.slice(1)})` : contact.display))
  return (
    <li className="rounded-xl border border-line-strong bg-field p-3">
      <p className="m-0 font-extrabold">{`${line.name}: ${contacts.join(" · ")}`}</p>
      {line.description && <p className="m-0 mt-0.5">{line.description}</p>}
      {line.whenToUse && <p className="m-0 mt-0.5 text-ink-soft">{`Para: ${line.whenToUse.charAt(0).toLowerCase()}${line.whenToUse.slice(1)}`}</p>}
      <Facts parts={[line.hours?.note]} />
    </li>
  )
}
