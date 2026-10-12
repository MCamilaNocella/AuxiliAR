import { MapPin } from "lucide-react"
import { isVerifiedFree, serviceHighlights, serviceName, shortAddress } from "@/utils/places"
import type { PlaceEntry } from "@/utils/places"
import { HighlightBadges } from "../HighlightBadges"

/** Services listed on a card; the rest are counted */
const MAX_SERVICES = 4

type PlaceCardProps = {
  entry: PlaceEntry
  onOpen: (placeId: string) => void
}

/** Summary of a place: where it is, its main services and what its verified data highlights. Details open in the panel. */
export const PlaceCard = ({ entry: { place, services }, onOpen }: PlaceCardProps) => {
  const address = shortAddress(place.address)
  // Gratuity is judged service by service, never for the whole place. Confirmed ones go first, each with its own badge
  // (free, or free with conditions); the ones not confirmed are grouped under a single "Gratuidad no confirmada" so the
  // warning is not repeated on every row.
  const ordered = [...services].sort((a, b) => Number(isVerifiedFree(place, b)) - Number(isVerifiedFree(place, a)))
  const shown = ordered.slice(0, MAX_SERVICES)
  const rest = ordered.slice(MAX_SERVICES)
  const confirmed = shown.filter((service) => isVerifiedFree(place, service))
  const pending = shown.filter((service) => !isVerifiedFree(place, service))
  const restAllPending = rest.every((service) => !isVerifiedFree(place, service))
  const more = rest.length === 0 ? undefined : `+${rest.length} ${rest.length === 1 ? "servicio más" : "servicios más"}${restAllPending ? " con gratuidad no confirmada" : ""}`

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-line-strong bg-card p-4">
      <div>
        <h3 className="m-0 text-lg font-extrabold">{place.name}</h3>
        {address && (
          <p className="m-0 mt-1 flex items-start gap-1.5 text-muted">
            <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>{address}</span>
          </p>
        )}
      </div>

      {confirmed.length > 0 && (
        <ul role="list" aria-label="Prestaciones con gratuidad confirmada" className="m-0 flex list-none flex-col gap-2 p-0">
          {confirmed.map((service) => (
            <li key={service.id} className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-semibold text-ink">{serviceName(service)}</span>
              <HighlightBadges items={serviceHighlights(service, place)} />
              {/* A confirmed service with a condition says it on the card too: "con condiciones" alone would not tell what they are */}
              {service.costNote && (
                <span className="basis-full font-normal text-ink-soft">
                  <span className="font-semibold">Condiciones de esta prestación:</span> {service.costNote}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      {pending.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="m-0 w-fit rounded-full border border-line-strong px-2.5 py-0.5 text-sm font-bold text-ink-soft">Gratuidad no confirmada</p>
          <ul role="list" aria-label="Prestaciones con gratuidad no confirmada" className="m-0 flex list-none flex-col gap-1 p-0">
            {pending.map((service) => (
              <li key={service.id} className="font-semibold text-ink">
                {serviceName(service)}
              </li>
            ))}
          </ul>
        </div>
      )}
      {more && <p className="m-0 text-muted">{more}</p>}

      <button
        type="button"
        data-place-trigger={place.id}
        onClick={() => onOpen(place.id)}
        className="mt-1 inline-flex min-h-11 cursor-pointer items-center justify-center self-start rounded-xl border border-control-line bg-brand px-4 py-2 font-extrabold text-on-brand hover:bg-brand-dark"
      >
        Ver información<span className="sr-only">{` de ${place.name}`}</span>
      </button>
    </article>
  )
}
