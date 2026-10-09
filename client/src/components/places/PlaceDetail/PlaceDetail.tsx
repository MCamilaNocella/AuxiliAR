import { useEffect, useId, useRef } from "react"
import { ExternalLink, MapPin, MessageCircle, Phone, X } from "lucide-react"
import { contactHref } from "@/data/resources"
import type { Contact } from "@/data/resources"
import { buildPlaceView, formatDate, streetLine } from "@/utils/places"
import type { DetailItem, PlaceEntry, ServiceView } from "@/utils/places"
import { HighlightBadges } from "../HighlightBadges"

const FOCUSABLE = "a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])"

type PlaceDetailProps = {
  entry: PlaceEntry
  /** The services that answer what was searched (see matchingServices): they come first. None: every service is shown together */
  matchingIds?: readonly string[]
  onClose: () => void
}

const NO_IDS: readonly string[] = []

const ContactLink = ({ contact, prominent = false }: { contact: Contact, prominent?: boolean }) => {
  const isWhatsApp = contact.type === "whatsapp"
  const Icon = isWhatsApp ? MessageCircle : Phone
  const action = isWhatsApp ? "Escribir por WhatsApp a" : "Llamar a"
  return (
    <a
      href={contactHref(contact)}
      aria-label={`${action} ${contact.label ? `${contact.label}: ` : ""}${contact.display}`}
      {...(isWhatsApp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 font-bold no-underline ${prominent ? "min-h-12 border-brand bg-brand text-lg text-on-brand" : "min-h-11 border-control-line bg-field"}`}
    >
      <Icon aria-hidden="true" className="size-5 shrink-0" />
      <span>{contact.label ? `${contact.label}: ${contact.display}` : contact.display}</span>
    </a>
  )
}

const ExternalLinkText = ({ url, children }: { url: string, children: React.ReactNode }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold">
    {children}
    <ExternalLink aria-hidden="true" className="size-4 shrink-0" />
    <span className="sr-only"> (se abre en una pestaña nueva)</span>
  </a>
)

/** One piece of useful information; the heading of its label is part of the line, so it stays compact */
const Detail = ({ item }: { item: DetailItem }) => {
  if (item.kind === "text") {
    return (
      <p className="m-0">
        {item.label && <span className="font-bold">{item.label}: </span>}
        {item.text}
      </p>
    )
  }
  if (item.kind === "link") {
    return (
      <p className="m-0">
        <span className="font-bold">{item.label}: </span>
        <ExternalLinkText url={item.url}>{item.text}</ExternalLinkText>
      </p>
    )
  }
  if (item.kind === "list") {
    return (
      <div>
        <p className="m-0 font-bold">{item.label}:</p>
        <ul className="m-0 list-disc pl-5">
          {item.items.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      </div>
    )
  }
  return (
    <div>
      <p className="m-0 font-bold">{item.label}:</p>
      <ul role="list" className="m-0 flex list-none flex-col gap-0.5 p-0">
        {item.lines.map(({ days, times }) => (
          <li key={days}>
            <span className="font-semibold">{days}:</span> {times}
          </li>
        ))}
      </ul>
      {item.note && <p className="m-0 mt-1 text-muted">{item.note}</p>}
    </div>
  )
}

const ServiceList = ({ services }: { services: ServiceView[] }) => (
  <ul role="list" className="m-0 flex list-none flex-col gap-3 p-0">
    {services.map((service) => (
      <li key={service.id}>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-bold">{service.name}</span>
          <HighlightBadges items={service.chips} />
        </div>
        {service.details.length > 0 && (
          <div className="mt-1 flex flex-col gap-1 border-l-2 border-line-strong pl-3 text-ink-soft">
            {service.details.map((item, index) => (
              <Detail key={index} item={item} />
            ))}
          </div>
        )}
      </li>
    ))}
  </ul>
)

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <section className="mt-6">
    <h3 className="m-0 mb-2 text-lg font-extrabold">{title}</h3>
    {children}
  </section>
)

/**
 * Side panel with what the verified data says about a place, for the services in the explorer's scope only.
 * It leads with what helps (highlights, services, how to be attended, contact) and leaves out what isn't known:
 * a missing hour or cost is simply not there. Not a route: the explorer keeps the open place in the URL (?lugar=).
 * Not a native <dialog> on purpose, so the help bot stays above it (same as the sections drawer). Focus moves to
 * the title when it opens and is trapped inside; Esc, the button or a tap outside close it (the explorer puts
 * focus back on the card).
 */
export const PlaceDetail = ({ entry, matchingIds = NO_IDS, onClose }: PlaceDetailProps) => {
  const { place } = entry
  const view = buildPlaceView(entry)
  // What answers the search leads, the rest of the verified services follow apart. Nothing answering: no split, nothing made up
  const matching = view.services.filter((service) => matchingIds.includes(service.id))
  const others = view.services.filter((service) => !matchingIds.includes(service.id))
  const titleId = useId()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true })
    // The page behind doesn't scroll while the panel is open
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = "hidden"
    return () => {
      root.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  // Tab stays inside the panel
  const trapFocus = (event: React.KeyboardEvent) => {
    if (event.key !== "Tab" || !panelRef.current) return
    const focusable = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement
    if (event.shiftKey && (active === first || active === titleRef.current)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  // The phone to call first when there is nothing verified about when to go: the first one that is a phone (a WhatsApp is not a call)
  const callFirst = view.contacts.find((contact) => contact.type !== "whatsapp")
  const address = place.address
  const addressLine = address ? [streetLine(address), address.neighborhood, address.locality].filter(Boolean).join(", ") : ""

  return (
    <div className="fixed inset-x-0 top-(--header-h) bottom-(--bottom-nav-h) z-40 flex justify-end">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-scrim" />
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={trapFocus}
        className="relative flex h-full w-full flex-col border-l border-line-strong bg-card sm:max-w-xl"
      >
        <div className="flex justify-end border-b border-line px-4 py-2 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-control-line bg-field px-4 py-2 font-extrabold"
          >
            <X aria-hidden="true" className="size-5" />
            Cerrar
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8 sm:px-6">
          <h2 id={titleId} ref={titleRef} tabIndex={-1} className="m-0 text-2xl font-extrabold outline-none">
            {place.name}
          </h2>
          {view.facilityType && <p className="m-0 mt-1 font-semibold text-muted">{view.facilityType}</p>}
          {addressLine && (
            <p className="m-0 mt-2 flex items-start gap-2">
              <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
              <span>
                {addressLine}
                {address?.reference && <span className="block text-muted">{address.reference}</span>}
              </span>
            </p>
          )}
          {view.highlights.length > 0 && (
            <div className="mt-3">
              <HighlightBadges items={view.highlights} />
            </div>
          )}
          {view.availabilityNotice && (
            <div role="note" className="mt-4 flex flex-col items-start gap-3 rounded-xl border-2 border-line-strong bg-surface-alt p-4">
              <p className="m-0 font-bold">{view.availabilityNotice}</p>
              {callFirst ? (
                <>
                  <ContactLink contact={callFirst} prominent />
                  {view.contacts.length > 1 && <p className="m-0 text-ink-soft">Hay más contactos más abajo.</p>}
                </>
              ) : (
                <p className="m-0 text-ink-soft">Por ahora no tenemos un teléfono verificado de este lugar.</p>
              )}
            </div>
          )}

          {matching.length === 0 ? (
            <Section title="Atención disponible">
              {view.costNotice && <p className="m-0 mb-3 text-ink-soft">{view.costNotice}</p>}
              <ServiceList services={view.services} />
            </Section>
          ) : (
            <>
              <Section title="Coincide con tu búsqueda">
                {view.costNotice && <p className="m-0 mb-3 text-ink-soft">{view.costNotice}</p>}
                <div className="rounded-xl border-2 border-brand bg-brand-soft p-3">
                  <ServiceList services={matching} />
                </div>
              </Section>
              {others.length > 0 && (
                <Section title="Otros servicios verificados">
                  <ServiceList services={others} />
                </Section>
              )}
            </>
          )}

          {view.howTo.length > 0 && (
            <Section title="Cómo atenderte">
              <div className="flex flex-col gap-2">
                {view.howTo.map((item, index) => (
                  <Detail key={index} item={item} />
                ))}
              </div>
            </Section>
          )}

          {view.beforeGoing.length > 0 && (
            <Section title="Antes de ir">
              <ul className="m-0 list-disc pl-5">
                {view.beforeGoing.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </Section>
          )}

          {view.contacts.length > 0 && (
            <Section title="Contacto">
              <ul role="list" className="m-0 flex list-none flex-wrap gap-2 p-0">
                {view.contacts.map((contact) => (
                  <li key={contact.dial}>
                    <ContactLink contact={contact} />
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {view.sources.length > 0 && (
            <Section title="Fuentes oficiales">
              <ul role="list" className="m-0 flex list-none flex-col gap-3 p-0">
                {view.sources.map((source) => (
                  <li key={source.url}>
                    <ExternalLinkText url={source.url}>{source.organization}</ExternalLinkText>
                    <ul role="list" className="m-0 mt-1 flex list-none flex-col gap-0.5 p-0 text-ink-soft">
                      {source.backs.map((text) => (
                        <li key={text}>{text}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <section className="mt-8 rounded-xl border border-line-strong bg-surface-alt p-4">
            <h3 className="m-0 mb-1 text-lg font-extrabold">Información verificada por AuxiliAR</h3>
            {place.verification.verifiedAt && <p className="m-0">{`Verificada el ${formatDate(place.verification.verifiedAt)}.`}</p>}
            {place.verification.nextReviewDue && <p className="m-0">{`Se vuelve a revisar antes del ${formatDate(place.verification.nextReviewDue)}.`}</p>}
            {place.source && !view.sources.some(({ url }) => url === place.source?.url) && (
              <p className="m-0 mt-1">
                Fuente oficial:{" "}
                {place.source.url ? <ExternalLinkText url={place.source.url}>{place.source.organization}</ExternalLinkText> : <span className="font-bold">{place.source.organization}</span>}
              </p>
            )}
          </section>
        </div>
      </section>
    </div>
  )
}
